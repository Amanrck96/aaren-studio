import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVerifiedWorkspaceClient } from "@/lib/workspaceAuth";
import {
  updateWorkspaceInvoiceStatusStore,
  getWorkspaceProjectsByClientIdStore,
  getWorkspaceProjectByIdStore,
  saveWorkspaceProjectStore,
} from "@/lib/store";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia" as any,
    })
  : null;

export async function GET(req: NextRequest) {
  try {
    const clientUser = await getVerifiedWorkspaceClient(req);
    if (!clientUser) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    // QUERY-LAYER ISOLATION:
    const clientFilter = clientUser.role === "admin" && clientUser.clientId === "admin-scope"
      ? {}
      : { clientId: clientUser.clientId };

    let invoices: any[] = [];
    try {
      invoices = await prisma.invoice.findMany({
        where: {
          ...clientFilter,
          ...(projectId ? { projectId } : {}),
        },
        include: {
          project: {
            select: { id: true, title: true, projectCode: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.warn("Prisma invoices lookup failed (falling back to store):", e);
    }

    if (!invoices || invoices.length === 0) {
      const storeProjects = await getWorkspaceProjectsByClientIdStore(clientUser.clientId);
      const storeInvoices: any[] = [];
      storeProjects.forEach((proj: any) => {
        if (Array.isArray(proj.invoices)) {
          proj.invoices.forEach((inv: any) => {
            if (!projectId || proj.id === projectId) {
              storeInvoices.push({
                ...inv,
                project: {
                  id: proj.id,
                  title: proj.title,
                  projectCode: proj.projectCode,
                },
              });
            }
          });
        }
      });
      invoices = storeInvoices;
    }

    return NextResponse.json({ success: true, data: invoices });
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientUser = await getVerifiedWorkspaceClient(req);
    if (!clientUser) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { action, invoiceId, projectId, title, amount, currency, dueDate } = body;

    // 1. GENERATE STRIPE CHECKOUT SESSION
    if (action === "pay_stripe") {
      if (!invoiceId) {
        return NextResponse.json({ success: false, error: "Invoice ID is required" }, { status: 400 });
      }

      let invoice = null;
      try {
        invoice = await prisma.invoice.findFirst({
          where: {
            id: invoiceId,
            ...(clientUser.role === "admin" ? {} : { clientId: clientUser.clientId }),
          },
          include: { project: true },
        });
      } catch (e) {
        console.warn("Prisma invoice operation failed (non-fatal):", e);
      }

      const host = req.headers.get("origin") || req.headers.get("host") || "http://localhost:3000";
      const origin = host.startsWith("http") ? host : `http://${host}`;

      if (!invoice) {
        // Fallback demo mock pay URL
        const mockPayUrl = `${origin}/workspace?mock_pay=true&invoiceId=${invoiceId}`;
        return NextResponse.json({ success: true, url: mockPayUrl, isMock: true });
      }

      if (invoice.status === "PAID") {
        return NextResponse.json({ success: false, error: "Invoice is already paid" }, { status: 400 });
      }

      if (stripe) {
        try {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: (invoice.currency || "INR").toLowerCase(),
                  product_data: {
                    name: `${invoice.title} (${invoice.invoiceNumber})`,
                    description: `Project: ${invoice.project.title}`,
                  },
                  unit_amount: Math.round(invoice.amount * 100),
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: `${origin}/workspace?payment=success&invoiceId=${invoice.id}`,
            cancel_url: `${origin}/workspace?payment=cancelled`,
            metadata: {
              invoiceId: invoice.id,
              projectId: invoice.projectId,
              clientId: invoice.clientId,
            },
          });

          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { stripeSessionId: session.id, stripePaymentLink: session.url },
          });

          return NextResponse.json({ success: true, url: session.url });
        } catch (stripeErr: any) {
          // Fallback mock payment link for test/demo mode
          const mockPayUrl = `${origin}/workspace?mock_pay=true&invoiceId=${invoice.id}`;
          return NextResponse.json({ success: true, url: mockPayUrl, isMock: true });
        }
      } else {
        // Mock Stripe link if STRIPE_SECRET_KEY is not yet populated in .env
        const mockPayUrl = `${origin}/workspace?mock_pay=true&invoiceId=${invoice.id}`;
        return NextResponse.json({ success: true, url: mockPayUrl, isMock: true });
      }
    }

    // 2. MARK AS PAID (e.g. for mock or webhook simulation)
    if (action === "mark_paid") {
      if (!invoiceId) {
        return NextResponse.json({ success: false, error: "Invoice ID required" }, { status: 400 });
      }

      let updated: any = null;
      try {
        updated = await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });
      } catch (e) {
        console.warn("Prisma invoice operation failed (non-fatal):", e);
      }

      const synced = await updateWorkspaceInvoiceStatusStore(invoiceId, "PAID");
      return NextResponse.json({ success: true, data: updated || synced });
    }

    // 3. CREATE INVOICE (Admin or Project Initiation)
    if (action === "create_invoice") {
      if (!projectId || !title || !amount) {
        return NextResponse.json({ success: false, error: "Project ID, title, and amount are required" }, { status: 400 });
      }

      const invNumber = `INV-${Date.now().toString().slice(-6)}`;
      let newInvoice: any = null;
      try {
        newInvoice = await prisma.invoice.create({
          data: {
            invoiceNumber: invNumber,
            projectId,
            clientId: clientUser.clientId,
            title,
            amount: parseFloat(amount),
            currency: currency || "INR",
            status: "UNPAID",
            dueDate: dueDate ? new Date(dueDate) : null,
          },
        });
      } catch (e) {
        console.warn("Prisma invoice create failed (falling back to store):", e);
      }

      if (!newInvoice) {
        newInvoice = {
          id: `inv-${Date.now()}`,
          invoiceNumber: invNumber,
          projectId,
          clientId: clientUser.clientId,
          title,
          amount: parseFloat(amount),
          currency: currency || "INR",
          status: "UNPAID",
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          createdAt: new Date().toISOString(),
        };
        const proj = await getWorkspaceProjectByIdStore(projectId, clientUser.clientId);
        if (proj) {
          if (!Array.isArray(proj.invoices)) proj.invoices = [];
          proj.invoices.unshift(newInvoice);
          await saveWorkspaceProjectStore(proj);
        }
      }

      return NextResponse.json({ success: true, data: newInvoice });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in invoice POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
