import { useState } from "react";
import {
  getOrCreateQuotation,
  updateQuotationMeta,
  addQuotationItem,
  removeQuotationItem,
  publishQuotation,
  type Quotation,
  type QuotationItem,
} from "@/features/admin/bookings/api";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

export function QuotationBuilder({
  bookingId,
  quotation,
  items,
  onChange,
}: {
  bookingId: string;
  quotation: Quotation | null;
  items: QuotationItem[];
  onChange: () => void;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [itemDraft, setItemDraft] = useState({ label: "", quantity: "1", price: "" });
  const [discountInput, setDiscountInput] = useState(quotation ? String(quotation.discount_paise / 100) : "0");
  const [gstInput, setGstInput] = useState(quotation ? String(quotation.gst_percent) : "18");
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setIsCreating(true);
    setError(null);
    try {
      await getOrCreateQuotation(bookingId);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quotation.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!quotation) {
    return (
      <div className="rounded-card border border-dashed border-line-strong bg-surface/60 p-6 text-center">
        <p className="text-sm text-muted">No quotation yet for this booking.</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={create} disabled={isCreating}>
          {isCreating ? "Creating…" : "Start Quotation"}
        </Button>
        {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      </div>
    );
  }

  const addItem = async () => {
    if (!itemDraft.label.trim() || !itemDraft.price) return;
    setError(null);
    try {
      await addQuotationItem(quotation.id, {
        label: itemDraft.label,
        quantity: Number(itemDraft.quantity) || 1,
        unit_price_paise: Math.round(Number(itemDraft.price) * 100),
        sort_order: items.length,
      });
      setItemDraft({ label: "", quantity: "1", price: "" });
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item.");
    }
  };

  const saveMeta = async () => {
    setIsSavingMeta(true);
    setError(null);
    try {
      await updateQuotationMeta(quotation.id, {
        discount_paise: Math.round(Number(discountInput) * 100) || 0,
        gst_percent: Number(gstInput) || 0,
      });
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update.");
    } finally {
      setIsSavingMeta(false);
    }
  };

  const handlePublish = async () => {
    setError(null);
    try {
      await publishQuotation(quotation.id);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish.");
    }
  };

  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-black/[0.06] px-2.5 py-1 text-xs font-medium capitalize text-ink">
          {quotation.status}
        </span>
        {quotation.status === "draft" && items.length > 0 && (
          <Button size="sm" variant="gold" onClick={handlePublish}>
            Publish Quotation
          </Button>
        )}
      </div>

      {items.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-black/[0.02] text-left text-xs uppercase text-muted">
                <th className="px-3 py-2 font-medium">Item</th>
                <th className="px-3 py-2 font-medium">Qty</th>
                <th className="px-3 py-2 font-medium">Unit price</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                {quotation.status === "draft" && <th className="px-3 py-2" />}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-2">{item.label}</td>
                  <td className="px-3 py-2 text-muted">{item.quantity}</td>
                  <td className="px-3 py-2 text-muted">{formatINR(item.unit_price_paise)}</td>
                  <td className="px-3 py-2 text-muted">{formatINR(item.amount_paise)}</td>
                  {quotation.status === "draft" && (
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={async () => {
                          await removeQuotationItem(item.id);
                          onChange();
                        }}
                        className="text-xs font-medium text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {quotation.status === "draft" && (
        <div className="mb-4 flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-line-strong p-3">
          <Input label="Item" placeholder="e.g. Photography package" value={itemDraft.label} onChange={(e) => setItemDraft((d) => ({ ...d, label: e.target.value }))} />
          <Input label="Qty" type="number" min={1} className="w-20" value={itemDraft.quantity} onChange={(e) => setItemDraft((d) => ({ ...d, quantity: e.target.value }))} />
          <Input label="Unit price (₹)" type="number" min={0} value={itemDraft.price} onChange={(e) => setItemDraft((d) => ({ ...d, price: e.target.value }))} />
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            Add
          </Button>
        </div>
      )}

      {quotation.status === "draft" && (
        <div className="mb-4 flex flex-wrap items-end gap-2">
          <Input label="Discount (₹)" type="number" min={0} value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} />
          <Input label="GST %" type="number" min={0} value={gstInput} onChange={(e) => setGstInput(e.target.value)} />
          <Button type="button" variant="outline" size="sm" onClick={saveMeta} disabled={isSavingMeta}>
            {isSavingMeta ? "Saving…" : "Update"}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-1 border-t border-line pt-3 text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span>{formatINR(quotation.subtotal_paise)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Discount</span>
          <span>−{formatINR(quotation.discount_paise)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>GST ({quotation.gst_percent}%)</span>
          <span>{formatINR(quotation.gst_paise)}</span>
        </div>
        <div className="flex justify-between text-base font-medium text-ink">
          <span>Total</span>
          <span>{formatINR(quotation.total_paise)}</span>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
