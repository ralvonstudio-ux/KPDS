import { useState } from "react";
import { useTeamMembers } from "@/features/admin/team/api";
import { assignTeamMember, removeAssignment, type BookingAssignment } from "@/features/admin/bookings/api";
import { Select, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function TeamAssignmentPanel({
  bookingId,
  assignments,
  onChange,
}: {
  bookingId: string;
  assignments: BookingAssignment[];
  onChange: () => void;
}) {
  const { data: members } = useTeamMembers();
  const [selectedId, setSelectedId] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  const available = (members ?? []).filter((m) => m.is_active && !assignments.some((a) => a.team_member_id === m.id));

  const handleAssign = async () => {
    if (!selectedId) return;
    setError(null);
    try {
      await assignTeamMember(bookingId, selectedId, role || null);
      setSelectedId("");
      setRole("");
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign.");
    }
  };

  return (
    <div className="rounded-card border border-line bg-surface p-5">
      {assignments.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {assignments.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm">
              <span>
                {a.team_members?.full_name} <span className="text-muted">({a.assigned_role || a.team_members?.role})</span>
              </span>
              <button
                onClick={async () => {
                  await removeAssignment(a.id);
                  onChange();
                }}
                className="text-xs font-medium text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {available.length > 0 ? (
        <div className="flex flex-wrap items-end gap-2">
          <Select label="Team member" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="">Select…</option>
            {available.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name} — {m.role}
              </option>
            ))}
          </Select>
          <Input label="Role on this booking (optional)" placeholder="e.g. Lead photographer" value={role} onChange={(e) => setRole(e.target.value)} />
          <Button type="button" variant="outline" size="sm" onClick={handleAssign} disabled={!selectedId}>
            Assign
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted">
          {members && members.length === 0 ? "No team members yet — add some in Team." : "All active team members are already assigned."}
        </p>
      )}
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
