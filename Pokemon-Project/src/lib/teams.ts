import { supabase } from './supabase';

export interface TeamMember {
  id: string;
  team_id: string;
  pokemon_id: number;
  pokemon_name: string;
  pokemon_types: string[];
  slot: number;
  moves: string[];
  ability: string | null;
}

export interface Team {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  members: TeamMember[];
}

export interface TeamMemberInput {
  pokemon_id: number;
  pokemon_name: string;
  pokemon_types: string[];
  slot: number;
  moves?: string[];
  ability?: string | null;
}

export async function fetchTeams(userId: string): Promise<Team[]> {
  const { data: teamsData, error: teamsError } = await supabase
    .from('user_teams')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (teamsError) throw teamsError;
  const teams = (teamsData ?? []) as Omit<Team, 'members'>[];
  if (teams.length === 0) return [];

  const teamIds = teams.map(t => t.id);
  const { data: membersData, error: membersError } = await supabase
    .from('team_members')
    .select('*')
    .in('team_id', teamIds)
    .order('slot', { ascending: true });

  if (membersError) throw membersError;

  const membersByTeam = new Map<string, TeamMember[]>();
  for (const m of (membersData ?? []) as TeamMember[]) {
    if (!membersByTeam.has(m.team_id)) membersByTeam.set(m.team_id, []);
    membersByTeam.get(m.team_id)!.push(m);
  }

  return teams.map(t => ({ ...t, members: membersByTeam.get(t.id) ?? [] }));
}

export async function createTeam(userId: string, name: string): Promise<Team> {
  const { data, error } = await supabase
    .from('user_teams')
    .insert({ user_id: userId, name })
    .select()
    .single();
  if (error) throw error;
  return { ...(data as Omit<Team, 'members'>), members: [] };
}

export async function deleteTeam(teamId: string): Promise<void> {
  const { error } = await supabase.from('user_teams').delete().eq('id', teamId);
  if (error) throw error;
}

export async function renameTeam(teamId: string, name: string): Promise<void> {
  const { error } = await supabase.from('user_teams').update({ name }).eq('id', teamId);
  if (error) throw error;
}

export async function upsertTeamMember(teamId: string, member: TeamMemberInput): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .upsert(
      { team_id: teamId, ...member },
      { onConflict: 'team_id,slot' }
    )
    .select()
    .single();
  if (error) throw error;
  return data as TeamMember;
}

export async function removeTeamMember(teamId: string, slot: number): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('slot', slot);
  if (error) throw error;
}

export async function updateMemberMoves(teamId: string, slot: number, moves: string[]): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .update({ moves })
    .eq('team_id', teamId)
    .eq('slot', slot);
  if (error) throw error;
}

export async function updateMemberAbility(teamId: string, slot: number, ability: string | null): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .update({ ability })
    .eq('team_id', teamId)
    .eq('slot', slot);
  if (error) throw error;
}
