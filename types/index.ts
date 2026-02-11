export interface Team {
  id: number;
  team_name: string;
  logo_url?: string | null;
  base_country?: string | null;
  championships: number | null;
  active_years?: string | null;
}

export interface Driver {
  id: number;
  name: string;
  nationality?: string | null;
  birthdate?: string | null;
  profile_image_url?: string | null;
  championships: number | null;
  wins: number | null;
  podiums: number | null;
  poles: number | null;
  fastest_laps: number | null;
  biography?: string | null;
  team_ids?: number[];
}

export interface Circuit {
  id: number;
  circuit_name: string;
  country?: string | null;
  track_layout_url?: string | null;
  lap_length_km?: number | null;
  first_gp_year?: number | null;
}

export interface Season {
  id: number;
  year: number;
  champion_driver_id?: number | null;
  champion_team_id?: number | null;
  total_races: number;
  banner_image_url?: string | null;
}

export interface Race {
  id: number;
  season_id: number;
  circuit_id: number;
  winner_driver_id?: number | null;
  second_driver_id?: number | null;
  third_driver_id?: number | null;
  fastest_lap_driver_id?: number | null;
  laps?: number | null;
  results_positions?: Omit<RaceResultPosition, "id" | "race_id">[];
}

export interface RaceResultPosition {
  id: number;
  race_id: number;
  driver_id: number;
  team_id?: number | null;
  position: number;
  points: number;
  laps?: number | null;
  time?: string | null;
  status: "Finished" | "DNF" | "DNS" | "DSQ";
}

export interface Media {
  id: number;
  title: string;
  url: string;
  category?: string | null;
  caption?: string | null;
}

export interface DriverStanding {
  id: number;
  season_id: number;
  driver_id: number;
  team_id?: number | null;
  position: number;
  points: number;
  wins: number;
}

export interface ConstructorStanding {
  id: number;
  season_id: number;
  team_id: number;
  position: number;
  points: number;
  wins: number;
}

export interface TimelineEvent {
  id: number;
  year: number;
  title: string;
  description?: string | null;
  image_url?: string | null;
}

export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
}

export type IdParam = { id: string };
