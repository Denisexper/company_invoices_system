import { fmt } from "../utils/pdfGenerator";
import type { FormData } from "../utils/types";

interface Props {
  formData: FormData;
  updateField: (field: keyof FormData, value: string | number) => void;
  updateItem: (index: number, field: string, value: string) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  isQuote: boolean;
}

export default function InvoiceForm({
  formData,
  updateField,
  updateItem,
  addItem,
  removeItem,
  isQuote,
}: Props) {
  const docType = isQuote ? "Quote" : "Invoice";
  const sub = formData.items.reduce(
    (s, i) => s + (parseFloat(i.price) || 0) * (parseFloat(i.qty) || 0),
    0
  );
  const tax = sub * (formData.taxRate / 100);
  const total = sub + tax;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Client */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-[#3a7a5a] mb-3">
          Client Information
        </h3>
        <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden divide-y divide-[#e5e0d8]">
          <Field
            label="Client / Property Owner"
            value={formData.clientName}
            onChange={(v) => updateField("clientName", v)}
            placeholder="John Smith"
          />
          <Field
            label="Address"
            value={formData.clientAddress}
            onChange={(v) => updateField("clientAddress", v)}
            placeholder="456 Oak Ave, City, State ZIP"
          />
          <Field
            label="Phone"
            value={formData.clientPhone}
            onChange={(v) => updateField("clientPhone", v)}
            placeholder="(555) 987-6543"
            type="tel"
          />
          <Field
            label="Email"
            value={formData.clientEmail}
            onChange={(v) => updateField("clientEmail", v)}
            placeholder="client@email.com"
            type="email"
          />
        </div>
      </div>

      {/* Document Details */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-[#3a7a5a] mb-3">
          {docType} Details
        </h3>
        <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden divide-y divide-[#e5e0d8]">
          <Field
            label={`${docType} Number`}
            value={formData.invoiceNumber}
            onChange={(v) => updateField("invoiceNumber", v)}
            placeholder={isQuote ? "QTE-001" : "INV-001"}
          />
          <Field
            label="Date"
            value={formData.date}
            onChange={(v) => updateField("date", v)}
            type="date"
          />
          {isQuote ? (
            <Field
              label="Valid Until"
              value={formData.validUntil}
              onChange={(v) => updateField("validUntil", v)}
              type="date"
            />
          ) : (
            <>
              <div className="px-3.5 py-3">
                <label className="block text-[10px] font-semibold uppercase tracking-[1px] text-gray-500 mb-1">
                  Payment Terms
                </label>
                <select
                  value={formData.terms}
                  onChange={(e) => updateField("terms", e.target.value)}
                  className="w-full border-none bg-transparent text-[15px] text-gray-900 outline-none appearance-none cursor-pointer"
                >
                  <option>Due on Receipt</option>
                  <option>Net 15</option>
                  <option>Net 30</option>
                  <option>Net 60</option>
                  <option>50% Upfront</option>
                </select>
              </div>
              <Field
                label="Due Date"
                value={formData.dueDate}
                onChange={(v) => updateField("dueDate", v)}
                type="date"
              />
            </>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-[#3a7a5a] mb-3">
          Services / Line Items
        </h3>
        <div className="space-y-2">
          {formData.items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#e5e0d8] p-3.5"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-[#3a7a5a] uppercase tracking-[1px]">
                  Item {i + 1}
                </span>
                {formData.items.length > 1 && (
                  <button
                    onClick={() => removeItem(i)}
                    className="w-7 h-7 rounded-full bg-red-50 text-red-500 text-base font-bold flex items-center justify-center hover:bg-red-100 transition"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <MiniField
                  label="Description"
                  value={item.description}
                  onChange={(v) => updateItem(i, "description", v)}
                  placeholder="e.g. Crawlspace Encapsulation"
                />
                <MiniField
                  label="Details (optional)"
                  value={item.details}
                  onChange={(v) => updateItem(i, "details", v)}
                  placeholder="Additional details..."
                  textarea
                />
                <div className="grid grid-cols-3 gap-2">
                  <MiniField
                    label="Price ($)"
                    value={item.price}
                    onChange={(v) => updateItem(i, "price", v)}
                    placeholder="0.00"
                    type="number"
                  />
                  <MiniField
                    label="Qty"
                    value={item.qty}
                    onChange={(v) => updateItem(i, "qty", v)}
                    placeholder="1"
                    type="number"
                  />
                  <div className="bg-[#f8f6f1] rounded-lg px-2.5 py-2">
                    <label className="block text-[9px] font-semibold uppercase tracking-[1px] text-gray-500 mb-0.5">
                      Amount
                    </label>
                    <div className="text-sm font-bold text-[#3a7a5a]">
                      {fmt(
                        (parseFloat(item.price) || 0) *
                          (parseFloat(item.qty) || 0)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="w-full mt-2 py-3.5 border-2 border-dashed border-[#e5e0d8] rounded-xl text-[#3a7a5a] font-semibold text-sm hover:bg-[#3a7a5a]/5 active:scale-[0.99] transition"
        >
          + Add Service / Item
        </button>
      </div>

      {/* Tax */}
      <div className="bg-white rounded-xl border border-[#e5e0d8] px-3.5 py-3 flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-500 whitespace-nowrap">
          Tax Rate:
        </label>
        <input
          type="number"
          value={formData.taxRate}
          onChange={(e) =>
            updateField("taxRate", parseFloat(e.target.value) || 0)
          }
          inputMode="decimal"
          className="w-16 border-b-2 border-[#e5e0d8] bg-transparent text-center text-[15px] text-gray-900 outline-none focus:border-[#3a7a5a] transition"
        />
        <span className="text-sm text-gray-500">%</span>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-xl border border-[#e5e0d8] p-3.5 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{fmt(sub)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax ({formData.taxRate}%)</span>
          <span>+{fmt(tax)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-[#1a2e1a] border-t-2 border-[#3a7a5a] mt-2 pt-3">
          <span>{isQuote ? "Est. Total" : "Balance Due"}</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-[#3a7a5a] mb-3">
          Additional Info
        </h3>
        <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden divide-y divide-[#e5e0d8]">
          <FieldTextarea
            label="Notes"
            value={formData.notes}
            onChange={(v) => updateField("notes", v)}
            placeholder="Thank you for your business!"
          />
          <FieldTextarea
            label="Payment Instructions"
            value={formData.paymentInfo}
            onChange={(v) => updateField("paymentInfo", v)}
            placeholder="Accepted: Check, Zelle, Cash App..."
          />
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

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

function FieldTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="px-3.5 py-3">
      <label className="block text-[10px] font-semibold uppercase tracking-[1px] text-gray-500 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-[15px] text-gray-900 outline-none resize-y min-h-[50px] placeholder:text-gray-300"
      />
    </div>
  );
}

function MiniField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div className="bg-[#f8f6f1] rounded-lg px-2.5 py-2">
      <label className="block text-[9px] font-semibold uppercase tracking-[1px] text-gray-500 mb-0.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border-none bg-transparent text-sm text-gray-900 outline-none resize-none min-h-[32px] placeholder:text-gray-300"
        />
      ) : (
        <input
          type={type}
          inputMode={type === "number" ? "decimal" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-300"
        />
      )}
    </div>
  );
}