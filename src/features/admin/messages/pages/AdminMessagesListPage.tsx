import { useState } from "react";
import { Mail, Phone, CheckCircle2, Circle } from "lucide-react";
import { useAdminContactMessages, markContactMessageRead } from "@/features/contact/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";
import { formatDate } from "@/lib/utils";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { motion } from "framer-motion";

export default function AdminMessagesListPage() {
  const { data: messages, isLoading, error, refetch } = useAdminContactMessages();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const toggleRead = async (id: string, isRead: boolean) => {
    setPendingId(id);
    try {
      await markContactMessageRead(id, !isRead);
      await refetch();
    } finally {
      setPendingId(null);
    }
  };

  const unreadCount = messages?.filter((m) => !m.is_read).length ?? 0;

  return (
    <div>
      <AdminPageHeader
        eyebrow="Run the studio"
        title={unreadCount > 0 ? `Messages (${unreadCount} unread)` : "Messages"}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} onRetry={refetch} />}
      {!isLoading && !error && messages && messages.length === 0 && (
        <EmptyState
          title="No enquiries yet"
          description="Messages submitted through the public Contact page will show up here."
        />
      )}

      {!isLoading && !error && messages && messages.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={staggerChildren} className="flex flex-col gap-3">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              variants={fadeUp}
              className={`rounded-card border p-5 shadow-clay ${m.is_read ? "border-line bg-surface" : "border-gold/40 bg-gold-soft/10"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink">{m.name}</p>
                    {!m.is_read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <a href={`mailto:${m.email}`} className="flex items-center gap-1 hover:text-ink">
                      <Mail size={13} strokeWidth={1.75} /> {m.email}
                    </a>
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="flex items-center gap-1 hover:text-ink">
                        <Phone size={13} strokeWidth={1.75} /> {m.phone}
                      </a>
                    )}
                    <span>{formatDate(m.created_at)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRead(m.id, m.is_read)}
                  disabled={pendingId === m.id}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-xs font-medium text-ink/80 transition-colors hover:border-espresso disabled:opacity-50"
                >
                  {m.is_read ? (
                    <>
                      <CheckCircle2 size={14} strokeWidth={1.75} /> Read
                    </>
                  ) : (
                    <>
                      <Circle size={14} strokeWidth={1.75} /> Mark as read
                    </>
                  )}
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink/90">{m.message}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
