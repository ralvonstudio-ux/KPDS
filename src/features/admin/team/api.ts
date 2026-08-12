import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/database";

export type TeamMember = Tables<"team_members">;
export type TeamMemberInput = Omit<TeamMember, "id" | "created_at" | "updated_at">;

export function useTeamMembers() {
  const [data, setData] = useState<TeamMember[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase.from("team_members").select("*").order("full_name", { ascending: true });
    if (error) setError(error.message);
    else setData(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export async function createTeamMember(input: Partial<TeamMemberInput>) {
  const { data, error } = await supabase.from("team_members").insert(input).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTeamMember(id: string, input: Partial<TeamMemberInput>) {
  const { data, error } = await supabase.from("team_members").update(input).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTeamMember(id: string) {
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
