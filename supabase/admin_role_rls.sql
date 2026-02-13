-- Admin role + RLS alignment for import/admin flows.
-- Run in Supabase SQL Editor.

-- 1) Assign admin role in raw_user_meta_data.
update auth.users
set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'YOUR_EMAIL';

-- 2) Role helpers from JWT.
create or replace function public.current_jwt_role()
returns text
language sql
stable
as $$
  select coalesce(
    auth.jwt() -> 'user_metadata' ->> 'role',
    auth.jwt() -> 'app_metadata' ->> 'role'
  );
$$;

create or replace function public.is_admin_jwt()
returns boolean
language sql
stable
as $$
  select public.current_jwt_role() = 'admin';
$$;

-- 3) Recreate admin write policies.
do $$
declare
  tbl text;
  target_tables text[] := array[
    'teams',
    'drivers',
    'driver_teams',
    'circuits',
    'seasons',
    'races',
    'race_results_positions',
    'media',
    'driver_standings',
    'constructor_standings',
    'timeline_events'
  ];
begin
  foreach tbl in array target_tables
  loop
    execute format('alter table %I enable row level security;', tbl);
    execute format('drop policy if exists "Admin write" on %I;', tbl);
    execute format(
      'create policy "Admin write" on %I for all to authenticated using (public.is_admin_jwt()) with check (public.is_admin_jwt());',
      tbl
    );
  end loop;
end
$$;

-- 4) Re-login required after role change so JWT is refreshed.
