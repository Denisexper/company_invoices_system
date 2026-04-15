import type { CompanyInfo } from "../utils/types";

interface Props {
  companyInfo: CompanyInfo;
  setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}

export default function CompanySettings({ companyInfo, setCompanyInfo }: Props) {
  const update = (field: keyof CompanyInfo, value: string) =>
    setCompanyInfo((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-4 lg:p-6">
      <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-[#3a7a5a] mb-3">
        Company Information
      </h3>
      <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden divide-y divide-[#e5e0d8]">
        <Field label="Company Name" value={companyInfo.name} onChange={(v) => update("name", v)} placeholder="Crawlspace Improvement" />
        <Field label="Tagline" value={companyInfo.tagline} onChange={(v) => update("tagline", v)} placeholder="Environment Systems" />
        <Field label="Address" value={companyInfo.address} onChange={(v) => update("address", v)} placeholder="123 Main St, City, State ZIP" />
        <Field label="Phone" value={companyInfo.phone} onChange={(v) => update("phone", v)} placeholder="(555) 123-4567" type="tel" />
        <Field label="Email" value={companyInfo.email} onChange={(v) => update("email", v)} placeholder="info@crawlspaceimprovement.com" type="email" />
        <Field label="License Number" value={companyInfo.license} onChange={(v) => update("license", v)} placeholder="e.g. CBC1234567" />
      </div>
      <p className="text-xs text-gray-400 mt-3 px-1 leading-relaxed">
        This information appears on all invoices and quotes.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="px-3.5 py-3">
      <label className="block text-[10px] font-semibold uppercase tracking-[1px] text-gray-500 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-300"
      />
    </div>
  );
}