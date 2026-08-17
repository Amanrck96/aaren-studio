import AarenDesignerWorkspace from "@/modules/aaren-intpro-designer-workspace";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal & Design Workspace | Aaren Studio",
  description: "Aaren Studio Interior and Design Workspace — client portal for project approvals, architectural drawings, specification tracking, and milestone invoices.",
};

export default function WorkspacePage() {
  return <AarenDesignerWorkspace />;
}
