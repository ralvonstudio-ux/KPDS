import { useState } from "react";
import { useTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, type TeamMember } from "@/features/admin/team/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Modal } from "@/components/admin/Modal";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Toggle } from "@/components/admin/Toggle";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";

const emptyDraft = { full_name: "", role: "", phone: "", email: "", is_active: true };

export default function AdminTeamPage() {
  const { data: members, isLoading, error, refetch } = useTeamMembers();
  const { confirm, dialog } = useConfirm();
  const [editing, setEditing] = useState<TeamMember | null | typeof emptyDraft>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreate = () => {
    setDraft(emptyDraft);
    setEditing(emptyDraft);
  };
  const openEdit = (m: TeamMember) => {
    setDraft({ full_name: m.full_name, role: m.role, phone: m.phone ?? "", email: m.email ?? "", is_active: m.is_active });
    setEditing(m);
  };
  const close = () => setEditing(null);

  const save = async () => {
    setFormError(null);
    if (!draft.full_name.trim() || !draft.role.trim()) {
      setFormError("Name and role are required.");
      return;
    }
    setIsSaving(true);
    try {
      if (editing && "id" in editing) await updateTeamMember(editing.id, draft);
      else await createTeamMember(draft);
      close();
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save team member.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (m: TeamMember) => {
    const ok = await confirm({
      title: "Remove team member?",
      description: `"${m.full_name}" will be removed from the roster. Past booking assignments are kept for record.`,
      confirmLabel: "Remove",
      destructive: true,
    });
    if (!ok) return;
    await deleteTeamMember(m.id);
    refetch();
  };

  return (
    <div>
      <AdminPageHeader eyebrow="Studio" title="Team" action={<Button onClick={openCreate}>+ New Team Member</Button>} />

      {isLoading && <LoadingState />}
      {error && <ErrorState description={error} onRetry={refetch} />}
      {!isLoading && !error && members && members.length === 0 && (
        <EmptyState title="No team members yet" description="Add photographers, videographers, and editors to assign to bookings." />
      )}

      {!isLoading && !error && members && members.length > 0 && (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{m.full_name}</td>
                  <td className="px-4 py-3 text-muted">{m.role}</td>
                  <td className="px-4 py-3 text-muted">{m.phone || m.email || "—"}</td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={m.is_active}
                      onChange={async (val) => {
                        await updateTeamMember(m.id, { is_active: val });
                        refetch();
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(m)} className="mr-3 text-xs font-medium text-ink underline underline-offset-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(m)} className="text-xs font-medium text-red-700 underline underline-offset-2">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={close} title={editing && "id" in editing ? "Edit Team Member" : "New Team Member"}>
        <div className="flex flex-col gap-4">
          <Input label="Full name" required value={draft.full_name} onChange={(e) => setDraft((d) => ({ ...d, full_name: e.target.value }))} />
          <Input label="Role" required placeholder="e.g. Photographer" value={draft.role} onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))} />
          <Input label="Phone" type="tel" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
          <Input label="Email" type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
          <div className="flex items-center gap-2">
            <Toggle checked={draft.is_active} onChange={(v) => setDraft((d) => ({ ...d, is_active: v }))} />
            <span className="text-sm text-ink">Active</span>
          </div>
          {formError && <p className="text-sm text-red-700">{formError}</p>}
          <Button onClick={save} disabled={isSaving} className="mt-2 w-full">
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}
