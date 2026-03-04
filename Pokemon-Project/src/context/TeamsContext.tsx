import React, { createContext, useContext, useEffect, useState } from 'react';
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

  const createTeam = async (name: string): Promise<Team | null> => {
    if (!user) return null;
    const newTeam = await createTeamApi(user.id, name);
    setTeams(prev => [...prev, newTeam]);
    return newTeam;
  };

  const deleteTeam = async (teamId: string): Promise<void> => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    try {
      await deleteTeamApi(teamId);
    } catch (err) {
      if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
      console.error(err);
    }
  };

  const renameTeam = async (teamId: string, name: string): Promise<void> => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, name } : t));
    try {
      await renameTeamApi(teamId, name);
    } catch (err) {
      if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
      console.error(err);
    }
  };

  const addMember = async (teamId: string, member: TeamMemberInput): Promise<void> => {
    const optimisticMember: TeamMember = {
      id: `optimistic-${Date.now()}`,
      team_id: teamId,
      moves: [],
      ...member,
    };
    // Optimistic update
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
      // Replace optimistic member with real one
      setTeams(prev => prev.map(t => {
        if (t.id !== teamId) return t;
        return {
          ...t,
          members: t.members.map(m => m.id === optimisticMember.id ? saved : m),
        };
      }));
    } catch (err) {
      if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
      console.error(err);
    }
  };

  const removeMember = async (teamId: string, slot: number): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.filter(m => m.slot !== slot) };
    }));
    try {
      await removeTeamMember(teamId, slot);
    } catch (err) {
      if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
      console.error(err);
    }
  };

  const updateMemberMoves = async (teamId: string, slot: number, moves: string[]): Promise<void> => {
    // Optimistic update
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
      if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
      console.error(err);
    }
  };

  const updateMemberAbility = async (teamId: string, slot: number, ability: string | null): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.map(m => m.slot === slot ? { ...m, ability } : m) };
    }));
    try {
      await updateMemberAbilityApi(teamId, slot, ability);
    } catch (err) {
      if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
      console.error(err);
    }
  };

  const updateMemberItem = async (teamId: string, slot: number, item: string | null): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.map(m => m.slot === slot ? { ...m, item } : m) };
    }));
    try {
      await updateMemberItemApi(teamId, slot, item);
    } catch (err) {
      if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
      console.error(err);
    }
  };

  const updateMemberNature = async (teamId: string, slot: number, nature: string | null): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.map(m => m.slot === slot ? { ...m, nature } : m) };
    }));
    try {
      await updateMemberNatureApi(teamId, slot, nature);
    } catch (err) {
      if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
      console.error(err);
    }
  };

  const updateMemberEVs = async (teamId: string, slot: number, evs: EVSpread | null): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.map(m => m.slot === slot ? { ...m, evs } : m) };
    }));
    try {
      await updateMemberEVsApi(teamId, slot, evs);
    } catch (err) {
      if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
      console.error(err);
    }
  };

  const updateMemberIVs = async (teamId: string, slot: number, ivs: IVSpread | null): Promise<void> => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      return { ...t, members: t.members.map(m => m.slot === slot ? { ...m, ivs } : m) };
    }));
    try {
      await updateMemberIVsApi(teamId, slot, ivs);
    } catch (err) {
      if (user) fetchTeams(user.id).then(setTeams).catch(console.error);
      console.error(err);
    }
  };

  return (
    <TeamsContext.Provider value={{ teams, loading, createTeam, deleteTeam, renameTeam, addMember, removeMember, updateMemberMoves, updateMemberAbility, updateMemberItem, updateMemberNature, updateMemberEVs, updateMemberIVs }}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams(): TeamsContextValue {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error('useTeams must be used within TeamsProvider');
  return ctx;
}
