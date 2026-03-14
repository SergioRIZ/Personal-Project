import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchTeams,
  createTeam as createTeamApi,
  deleteTeam as deleteTeamApi,
  renameTeam as renameTeamApi,
  upsertTeamMember,
  removeTeamMember,
  updateMemberMoves as updateMemberMovesApi,
  updateMemberAbility as updateMemberAbilityApi,
  updateMemberItem as updateMemberItemApi,
  updateMemberNature as updateMemberNatureApi,
  updateMemberEVs as updateMemberEVsApi,
  updateMemberIVs as updateMemberIVsApi,
  type Team,
  type TeamMember,
  type TeamMemberInput,
  type EVSpread,
  type IVSpread,
} from '../lib/teams';

interface TeamsContextValue {
  teams: Team[];
  loading: boolean;
  createTeam: (name: string) => Promise<Team | null>;
  deleteTeam: (teamId: string) => Promise<void>;
  renameTeam: (teamId: string, name: string) => Promise<void>;
  addMember: (teamId: string, member: TeamMemberInput) => Promise<void>;
  removeMember: (teamId: string, slot: number) => Promise<void>;
  updateMemberMoves: (teamId: string, slot: number, moves: string[]) => Promise<void>;
  updateMemberAbility: (teamId: string, slot: number, ability: string | null) => Promise<void>;
  updateMemberItem: (teamId: string, slot: number, item: string | null) => Promise<void>;
  updateMemberNature: (teamId: string, slot: number, nature: string | null) => Promise<void>;
  updateMemberEVs: (teamId: string, slot: number, evs: EVSpread | null) => Promise<void>;
  updateMemberIVs: (teamId: string, slot: number, ivs: IVSpread | null) => Promise<void>;
}

const TeamsContext = createContext<TeamsContextValue | null>(null);

export function TeamsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setTeams([]);
      return;
    }
    setLoading(true);
    fetchTeams(user.id)
      .then(setTeams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // Helper to refetch teams on error
  const refetch = useCallback(() => {
    if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
  }, [user]);

  const createTeam = useCallback(async (name: string): Promise<Team | null> => {
    if (!user) return null;
    const newTeam = await createTeamApi(user.id, name);
    setTeams(prev => [...prev, newTeam]);
    return newTeam;
  }, [user]);

  const deleteTeam = useCallback(async (teamId: string): Promise<void> => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    try {
      await deleteTeamApi(teamId);
    } catch (err) {
      refetch();
      console.error(err);
    }
  }, [refetch]);

  const renameTeam = useCallback(async (teamId: string, name: string): Promise<void> => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, name } : t));
    try {
      await renameTeamApi(teamId, name);
    } catch (err) {
      refetch();
      console.error(err);
    }
  }, [refetch]);

  const addMember = useCallback(async (teamId: string, member: TeamMemberInput): Promise<void> => {
    const optimisticMember: TeamMember = {
      id: `optimistic-${Date.now()}`,
      team_id: teamId,
      moves: [],
      ability: null,
      item: null,
      nature: null,
      evs: null,
      ivs: null,
      ...member,
    };
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      const filtered = t.members.filter(m => m.slot !== member.slot);
      return {
        ...t,
        members: [...filtered, optimisticMember].sort((a, b) => a.slot - b.slot),
      };
    }));
    try {
      const saved = await upsertTeamMember(teamId, member);
      setTeams(prev => prev.map(t => {
        if (t.id !== teamId) return t;
        return {
          ...t,
          members: t.members.map(m => m.id === optimisticMember.id ? saved : m),
        };
      }));
    } catch (err) {
      refetch();
      console.error(err);
    }
  }, [refetch]);

  const removeMember = useCallback(async (teamId: string, slot: number): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.filter(m => m.slot !== slot) };
    }));
    try {
      await removeTeamMember(teamId, slot);
    } catch (err) {
      refetch();
      console.error(err);
    }
  }, [refetch]);

  const updateMemberMoves = useCallback(async (teamId: string, slot: number, moves: string[]): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        members: t.members.map(m => m.slot === slot ? { ...m, moves } : m),
      };
    }));
    try {
      await updateMemberMovesApi(teamId, slot, moves);
    } catch (err) {
      refetch();
      console.error(err);
    }
  }, [refetch]);

  const updateMemberAbility = useCallback(async (teamId: string, slot: number, ability: string | null): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.map(m => m.slot === slot ? { ...m, ability } : m) };
    }));
    try {
      await updateMemberAbilityApi(teamId, slot, ability);
    } catch (err) {
      refetch();
      console.error(err);
    }
  }, [refetch]);

  const updateMemberItem = useCallback(async (teamId: string, slot: number, item: string | null): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.map(m => m.slot === slot ? { ...m, item } : m) };
    }));
    try {
      await updateMemberItemApi(teamId, slot, item);
    } catch (err) {
      refetch();
      console.error(err);
    }
  }, [refetch]);

  const updateMemberNature = useCallback(async (teamId: string, slot: number, nature: string | null): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.map(m => m.slot === slot ? { ...m, nature } : m) };
    }));
    try {
      await updateMemberNatureApi(teamId, slot, nature);
    } catch (err) {
      refetch();
      console.error(err);
    }
  }, [refetch]);

  const updateMemberEVs = useCallback(async (teamId: string, slot: number, evs: EVSpread | null): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.map(m => m.slot === slot ? { ...m, evs } : m) };
    }));
    try {
      await updateMemberEVsApi(teamId, slot, evs);
    } catch (err) {
      refetch();
      console.error(err);
    }
  }, [refetch]);

  const updateMemberIVs = useCallback(async (teamId: string, slot: number, ivs: IVSpread | null): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.map(m => m.slot === slot ? { ...m, ivs } : m) };
    }));
    try {
      await updateMemberIVsApi(teamId, slot, ivs);
    } catch (err) {
      refetch();
      console.error(err);
    }
  }, [refetch]);

  const value = useMemo(() => ({
    teams, loading, createTeam, deleteTeam, renameTeam, addMember, removeMember,
    updateMemberMoves, updateMemberAbility, updateMemberItem, updateMemberNature,
    updateMemberEVs, updateMemberIVs,
  }), [teams, loading, createTeam, deleteTeam, renameTeam, addMember, removeMember,
    updateMemberMoves, updateMemberAbility, updateMemberItem, updateMemberNature,
    updateMemberEVs, updateMemberIVs]);

  return (
    <TeamsContext.Provider value={value}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams(): TeamsContextValue {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error('useTeams must be used within TeamsProvider');
  return ctx;
}
