export type ScheduleStatus = "PENDING" | "APPROVED" | "NEEDS_REVIEW" | "REJECTED";
export type InvoiceStatus = "UNPAID" | "PAID" | "VOID";
export type ProjectStatus = "ACTIVE" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";

export interface ClientData {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  logoUrl?: string | null;
  industry?: string | null;
  accessCode?: string | null;
}

export interface ScheduleCommentData {
  id: string;
  scheduleItemId: string;
  authorName: string;
  authorEmail?: string | null;
  authorRole: "CLIENT" | "ARCHITECT" | "ADMIN";
  content: string;
  createdAt: string;
}

export interface ScheduleItemData {
  id: string;
  projectId: string;
  name: string;
  room?: string | null;
  category?: string | null;
  supplier?: string | null;
  tradePrice?: number | null;
  clientPrice?: number | null;
  price?: number | null;
  status: ScheduleStatus;
  imageUrl?: string | null;
  specs?: string | null;
  dimensions?: string | null;
  quantity: number;
  unit?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  comments: ScheduleCommentData[];
}

export interface ProjectDocumentData {
  id: string;
  projectId: string;
  clientId?: string | null;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number | null;
  uploadedBy?: string | null;
  createdAt: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  projectId: string;
  clientId: string;
  title: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate?: string | null;
  stripePaymentLink?: string | null;
  stripeSessionId?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

export interface WorkspaceProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  client: string;
  clientId?: string | null;
  projectCode: string;
  imageUrl: string;
  gallery: string[];
  status: ProjectStatus;
  budget?: number | null;
  createdAt: string;
  scheduleItems: ScheduleItemData[];
  documents: ProjectDocumentData[];
  invoices: InvoiceData[];
}
