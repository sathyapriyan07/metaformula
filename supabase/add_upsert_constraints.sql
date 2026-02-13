-- Required unique constraints for Supabase upsert(onConflict: ...)
-- Run this once in Supabase SQL Editor before using bulk import routes.

-- 1) Remove duplicate rows that would block unique constraints.
delete from public.circuits a
using public.circuits b
where a.id > b.id
  and a.circuit_name = b.circuit_name;

delete from public.teams a
using public.teams b
where a.id > b.id
  and a.team_name = b.team_name;

delete from public.drivers a
using public.drivers b
where a.id > b.id
  and a.name = b.name;

delete from public.seasons a
using public.seasons b
where a.id > b.id
  and a.year = b.year;

-- 2) Add unique constraints used by import upserts.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'circuits_circuit_name_key'
  ) then
    alter table public.circuits
      add constraint circuits_circuit_name_key unique (circuit_name);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'teams_team_name_key'
  ) then
    alter table public.teams
      add constraint teams_team_name_key unique (team_name);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'drivers_name_key'
  ) then
    alter table public.drivers
      add constraint drivers_name_key unique (name);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'seasons_year_key'
  ) then
    alter table public.seasons
      add constraint seasons_year_key unique (year);
  end if;
end
$$;
