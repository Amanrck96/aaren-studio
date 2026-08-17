"use client";

import React, { useState } from "react";
import { InvoiceData } from "../types/workspace";
import { CreditCard, CheckCircle2, Clock, DollarSign, ExternalLink, AlertCircle } from "lucide-react";

interface InvoiceFinancialListProps {
  invoices: InvoiceData[];
  onPayInvoice: (invoiceId: string) => Promise<string | null>;
  onMarkPaid?: (invoiceId: string) => Promise<void>;
}

export default function InvoiceFinancialList({
  invoices,
  onPayInvoice,
  onMarkPaid,
}: InvoiceFinancialListProps) {
  const [payingId, setPayingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstanding = invoices.filter((i) => i.status === "UNPAID").reduce((sum, inv) => sum + inv.amount, 0);

  const handlePay = async (invoice: InvoiceData) => {
    setPayingId(invoice.id);
    setMessage(null);
    try {
      const url = await onPayInvoice(invoice.id);
      if (url) {
        if (url.includes("mock_pay=true")) {
          // Demo/Mock Stripe Checkout simulation
          if (onMarkPaid) {
            await onMarkPaid(invoice.id);
            setMessage(`Payment of ₹${invoice.amount.toLocaleString("en-IN")} successfully processed (Stripe Demo Mode).`);
          }
        } else {
          window.location.href = url;
        }
      }
    } catch (err: any) {
      setMessage("Failed to initiate Stripe Checkout. Please try again.");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}>
      {/* Financial Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.6rem",
        }}
      >
        <div
          style={{
            background: "#FAF9F6",
            border: "1px solid rgba(129, 102, 63, 0.2)",
            borderRadius: "1.2rem",
            padding: "2rem",
          }}
        >
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#5E5852", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Total Contract Billed
          </div>
          <div style={{ fontSize: "2.6rem", fontWeight: 800, color: "#1C1917", marginTop: "0.4rem" }}>
            ₹{totalBilled.toLocaleString("en-IN")}
          </div>
        </div>

        <div
          style={{
            background: "#FAF9F6",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "1.2rem",
            padding: "2rem",
          }}
        >
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Paid Milestone Amount
          </div>
          <div style={{ fontSize: "2.6rem", fontWeight: 800, color: "#059669", marginTop: "0.4rem" }}>
            ₹{totalPaid.toLocaleString("en-IN")}
          </div>
        </div>

        <div
          style={{
            background: "#FAF9F6",
            border: "1px solid rgba(129, 102, 63, 0.3)",
            borderRadius: "1.2rem",
            padding: "2rem",
          }}
        >
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Outstanding Balance
          </div>
          <div style={{ fontSize: "2.6rem", fontWeight: 800, color: "#81663F", marginTop: "0.4rem" }}>
            ₹{totalOutstanding.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {message && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid #10B981",
            color: "#065F46",
            padding: "1.2rem 1.6rem",
            borderRadius: "0.8rem",
            fontSize: "1.3rem",
            fontWeight: 700,
          }}
        >
          {message}
        </div>
      )}

      {/* Invoices List Table */}
      <div
        style={{
          background: "#FAF9F6",
          border: "1px solid rgba(129, 102, 63, 0.25)",
          borderRadius: "1.4rem",
          padding: "2.4rem",
          overflowX: "auto",
        }}
      >
        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.6rem" }}>
          Milestone Invoices & Stripe Receipts ({invoices.length})
        </div>

        {invoices.length === 0 ? (
          <p style={{ fontSize: "1.35rem", color: "#5E5852", margin: "1rem 0" }}>
            No invoices generated for this project yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {invoices.map((inv) => {
              const isPaid = inv.status === "PAID";
              const isProcessing = payingId === inv.id;

              return (
                <div
                  key={inv.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(129, 102, 63, 0.15)",
                    borderRadius: "0.8rem",
                    padding: "1.6rem 2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1.4rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1.6rem" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "0.8rem",
                        background: isPaid ? "rgba(16, 185, 129, 0.1)" : "rgba(129, 102, 63, 0.1)",
                        color: isPaid ? "#059669" : "#81663F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CreditCard size={20} />
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1C1917" }}>
                          {inv.title}
                        </span>
                        <span
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 800,
                            padding: "0.2rem 0.6rem",
                            borderRadius: "999px",
                            background: isPaid ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                            color: isPaid ? "#059669" : "#D97706",
                          }}
                        >
                          {isPaid ? "PAID ✓" : "UNPAID"}
                        </span>
                      </div>
                      <div style={{ fontSize: "1.15rem", color: "#5E5852", marginTop: "0.3rem" }}>
                        <span>Invoice: <strong>{inv.invoiceNumber}</strong></span>
                        {inv.dueDate && <span> • Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#81663F" }}>
                        ₹{inv.amount.toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize: "1rem", color: "rgba(0,0,0,0.4)" }}>INR (incl. GST)</div>
                    </div>

                    {!isPaid ? (
                      <button
                        disabled={isProcessing}
                        onClick={() => handlePay(inv)}
                        style={{
                          background: "#81663F",
                          color: "#FFFFFF",
                          border: "none",
                          padding: "0.9rem 1.8rem",
                          borderRadius: "0.8rem",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          cursor: isProcessing ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          boxShadow: "0 4px 12px rgba(129, 102, 63, 0.25)",
                        }}
                      >
                        <CreditCard size={15} />
                        <span>{isProcessing ? "Connecting to Stripe..." : "Pay with Stripe →"}</span>
                      </button>
                    ) : (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          color: "#059669",
                          fontWeight: 800,
                          fontSize: "1.2rem",
                        }}
                      >
                        <CheckCircle2 size={16} /> Paid on {new Date(inv.paidAt || inv.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
