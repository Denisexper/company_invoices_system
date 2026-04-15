export interface CompanyInfo {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  license: string;
}

export interface LineItem {
  description: string;
  details: string;
  price: string;
  qty: string;
}

export interface FormData {
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  terms: string;
  validUntil: string;
  taxRate: number;
  notes: string;
  paymentInfo: string;
  items: LineItem[];
}

export const defaultCompanyInfo: CompanyInfo = {
  name: "Crawlspace Improvement",
  tagline: "Environment Systems",
  phone: "",
  email: "",
  address: "",
  license: "",
};

export const defaultFormData: FormData = {
  clientName: "",
  clientAddress: "",
  clientPhone: "",
  clientEmail: "",
  invoiceNumber: "",
  date: new Date().toISOString().split("T")[0],
  dueDate: "",
  terms: "Net 30",
  validUntil: "",
  taxRate: 7,
  notes: "",
  paymentInfo: "",
  items: [{ description: "", details: "", price: "", qty: "1" }],
};