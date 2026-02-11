﻿import { create } from "zustand";
import type { Circuit, Driver, Season, Team, User } from "../types";

interface ReferenceState {
  drivers: Driver[];
  teams: Team[];
  circuits: Circuit[];
  seasons: Season[];
  user: User | null;
  load: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useReferenceStore = create<ReferenceState>((set) => ({
  drivers: [],
  teams: [],
  circuits: [],
  seasons: [],
  user: null,
  load: async () => {
    const safeJson = async <T>(url: string, fallback: T): Promise<T> => {
      try {
        const res = await fetch(url);
        if (!res.ok) return fallback;
        return (await res.json()) as T;
      } catch {
        return fallback;
      }
    };

    const [drivers, teams, circuits, seasons] = await Promise.all([
      safeJson<Driver[]>("/api/drivers", []),
      safeJson<Team[]>("/api/teams", []),
      safeJson<Circuit[]>("/api/circuits", []),
      safeJson<Season[]>("/api/seasons", []),
    ]);

    set({ drivers, teams, circuits, seasons });
  },
  setUser: (user: User | null) => set({ user }),
}));
