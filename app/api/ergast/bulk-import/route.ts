import { NextRequest } from "next/server";
import { createSupabaseServer } from "../../../../lib/supabase/server";
import {
  fetchDrivers,
  fetchConstructors,
  fetchCircuits,
  fetchRaces,
  fetchRaceResults,
  fetchDriverStandings,
  fetchConstructorStandings,
} from "../../../../lib/ergastImport";
import { isAdminUser } from "../../../../lib/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImportEvent =
  | { type: "log"; message: string }
  | { type: "error"; message: string; details?: string; code: string }
  | { type: "complete"; message: string };

type ResultStatus = "Finished" | "DNF" | "DNS" | "DSQ";

function toSseEvent(event: ImportEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

function toMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: string }).code === "42P10"
  ) {
    return "Missing unique constraint for upsert. Run supabase/add_upsert_constraints.sql and retry.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Unexpected import failure";
}

function adminOnlyResponse() {
  return Response.json({ error: "Admin only", code: "ADMIN_ONLY" }, { status: 403 });
}

function invalidPayloadResponse() {
  return Response.json(
    {
      error: "Invalid year range",
      code: "INVALID_YEAR_RANGE",
      details: "Provide startYear/endYear between 1950 and the current year",
    },
    { status: 400 }
  );
}

function normalizeYear(value: unknown): number | null {
  const num = typeof value === "string" || typeof value === "number" ? Number(value) : Number.NaN;
  if (!Number.isInteger(num)) {
    return null;
  }
  return num;
}

function normalizeRaceResultStatus(input: string | null | undefined): ResultStatus {
  const status = (input || "").trim().toLowerCase();

  if (!status) {
    return "Finished";
  }

  if (status.includes("disqual")) {
    return "DSQ";
  }

  if (
    status.includes("did not start") ||
    status === "dns" ||
    status.includes("withdraw") ||
    status.includes("not start")
  ) {
    return "DNS";
  }

  if (
    status.includes("finished") ||
    status.includes("lap") ||
    status.includes("classified") ||
    status.includes("winner")
  ) {
    return "Finished";
  }

  return "DNF";
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !isAdminUser(user)) {
    return adminOnlyResponse();
  }

  let body: { startYear?: number; endYear?: number };
  try {
    body = await req.json();
  } catch {
    return invalidPayloadResponse();
  }

  const currentYear = new Date().getFullYear();
  const startYear = normalizeYear(body.startYear);
  const endYear = normalizeYear(body.endYear);

  if (
    startYear === null ||
    endYear === null ||
    startYear < 1950 ||
    endYear > currentYear ||
    startYear > endYear
  ) {
    return invalidPayloadResponse();
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const push = (event: ImportEvent) => {
        controller.enqueue(encoder.encode(toSseEvent(event)));
      };

      const log = (message: string) => push({ type: "log", message });

      try {
        log(`Starting Ergast bulk import: ${startYear}-${endYear}`);

        log("Importing circuits...");
        const circuits = await fetchCircuits();
        log(`Found ${circuits.length} circuits`);

        const circuitSlugToName = new Map<string, string>();

        for (const circuit of circuits) {
          const { error } = await supabase.from("circuits").upsert(
            {
              circuit_name: circuit.name,
              country: circuit.country,
            },
            { onConflict: "circuit_name" }
          );

          if (error) {
            throw new Error(`Failed to import circuit \"${circuit.name}\": ${error.message}`);
          }

          circuitSlugToName.set(circuit.slug, circuit.name);
        }
        log(`Imported ${circuits.length} circuits`);

        for (let year = startYear; year <= endYear; year += 1) {
          log(`Processing ${year}`);

          const { data: season, error: seasonError } = await supabase
            .from("seasons")
            .upsert({ year, total_races: 0 }, { onConflict: "year" })
            .select("id")
            .single();

          if (seasonError || !season) {
            throw new Error(`Failed to create season ${year}: ${seasonError?.message || "Unknown error"}`);
          }

          // Clear previous imported season data so reruns do not duplicate races/results/standings.
          const { error: clearDriverStandingsError } = await supabase
            .from("driver_standings")
            .delete()
            .eq("season_id", season.id);

          if (clearDriverStandingsError) {
            throw new Error(`Failed clearing driver standings for ${year}: ${clearDriverStandingsError.message}`);
          }

          const { error: clearConstructorStandingsError } = await supabase
            .from("constructor_standings")
            .delete()
            .eq("season_id", season.id);

          if (clearConstructorStandingsError) {
            throw new Error(`Failed clearing constructor standings for ${year}: ${clearConstructorStandingsError.message}`);
          }

          const { error: clearRacesError } = await supabase
            .from("races")
            .delete()
            .eq("season_id", season.id);

          if (clearRacesError) {
            throw new Error(`Failed clearing races for ${year}: ${clearRacesError.message}`);
          }

          log(`Importing drivers for ${year}...`);
          const drivers = await fetchDrivers(year);
          log(`Found ${drivers.length} drivers`);

          for (const driver of drivers) {
            const { error } = await supabase.from("drivers").upsert(
              {
                name: driver.name,
                nationality: driver.nationality,
                birthdate: driver.birthdate,
              },
              { onConflict: "name" }
            );

            if (error) {
              throw new Error(`Failed to import driver \"${driver.name}\": ${error.message}`);
            }
          }
          log(`Imported ${drivers.length} drivers for ${year}`);

          log(`Importing constructors for ${year}...`);
          const constructors = await fetchConstructors(year);
          log(`Found ${constructors.length} constructors`);

          for (const constructor of constructors) {
            const { error } = await supabase.from("teams").upsert(
              {
                team_name: constructor.team_name,
                base_country: constructor.base_country,
              },
              { onConflict: "team_name" }
            );

            if (error) {
              throw new Error(`Failed to import constructor \"${constructor.team_name}\": ${error.message}`);
            }
          }
          log(`Imported ${constructors.length} constructors for ${year}`);

          log(`Importing races for ${year}...`);
          const races = await fetchRaces(year);
          log(`Found ${races.length} races`);

          let importedRaces = 0;
          let importedRaceResults = 0;
          let skippedRaceResults = 0;

          for (const race of races) {
            const circuitName = circuitSlugToName.get(race.circuit_slug);
            if (!circuitName) {
              log(`Skipping race \"${race.race_name}\": circuit slug not found (${race.circuit_slug})`);
              continue;
            }

            const { data: circuit, error: circuitError } = await supabase
              .from("circuits")
              .select("id")
              .eq("circuit_name", circuitName)
              .single();

            if (circuitError || !circuit) {
              throw new Error(
                `Failed to resolve circuit for race \"${race.race_name}\" (${circuitName}): ${circuitError?.message || "not found"}`
              );
            }

            const { data: insertedRace, error: raceError } = await supabase.from("races").insert({
              season_id: season.id,
              circuit_id: circuit.id,
              laps: null,
            }).select("id").single();

            if (raceError || !insertedRace) {
              throw new Error(
                `Failed to import race \"${race.race_name}\": ${raceError?.message || "insert returned no row"}`
              );
            }

            importedRaces += 1;

            const raceResults = await fetchRaceResults(year, race.round);
            for (const result of raceResults) {
              if (!Number.isInteger(result.position) || result.position === null) {
                skippedRaceResults += 1;
                continue;
              }

              const { data: driver, error: driverError } = await supabase
                .from("drivers")
                .select("id")
                .eq("name", result.driver_name)
                .single();

              if (driverError || !driver) {
                skippedRaceResults += 1;
                continue;
              }

              let teamId: number | null = null;
              if (result.constructor_name) {
                const { data: team } = await supabase
                  .from("teams")
                  .select("id")
                  .eq("team_name", result.constructor_name)
                  .single();
                teamId = team?.id ?? null;
              }

              const { error: resultError } = await supabase.from("race_results_positions").insert({
                race_id: insertedRace.id,
                driver_id: driver.id,
                team_id: teamId,
                position: result.position,
                points: result.points,
                laps: result.laps,
                time: result.time,
                status: normalizeRaceResultStatus(result.status),
              });

              if (resultError) {
                throw new Error(
                  `Failed to import race result for ${result.driver_name} (${year} round ${race.round}): ${resultError.message}`
                );
              }

              importedRaceResults += 1;
            }
          }

          const { error: seasonUpdateError } = await supabase
            .from("seasons")
            .update({ total_races: importedRaces })
            .eq("id", season.id);

          if (seasonUpdateError) {
            throw new Error(`Failed to update race count for ${year}: ${seasonUpdateError.message}`);
          }

          log(`Imported ${importedRaces} races for ${year}`);
          log(`Imported ${importedRaceResults} race results for ${year} (${skippedRaceResults} skipped)`);

          log(`Importing driver standings for ${year}...`);
          const driverStandings = await fetchDriverStandings(year);
          let importedDriverStandings = 0;
          let skippedDriverStandings = 0;

          for (const standing of driverStandings) {
            if (!Number.isInteger(standing.position) || standing.position === null) {
              skippedDriverStandings += 1;
              continue;
            }

            const { data: driver } = await supabase
              .from("drivers")
              .select("id")
              .eq("name", standing.driver_name)
              .single();

            if (!driver) {
              skippedDriverStandings += 1;
              continue;
            }

            let teamId: number | null = null;
            if (standing.constructor_name) {
              const { data: team } = await supabase
                .from("teams")
                .select("id")
                .eq("team_name", standing.constructor_name)
                .single();
              teamId = team?.id ?? null;
            }

            const { error: dsError } = await supabase.from("driver_standings").insert({
              season_id: season.id,
              driver_id: driver.id,
              team_id: teamId,
              position: standing.position,
              points: standing.points,
              wins: standing.wins,
            });

            if (dsError) {
              throw new Error(`Failed to import driver standings for ${standing.driver_name}: ${dsError.message}`);
            }

            importedDriverStandings += 1;
          }
          log(
            `Imported ${importedDriverStandings} driver standings for ${year} (${skippedDriverStandings} skipped)`
          );

          log(`Importing constructor standings for ${year}...`);
          const constructorStandings = await fetchConstructorStandings(year);
          let importedConstructorStandings = 0;
          let skippedConstructorStandings = 0;

          for (const standing of constructorStandings) {
            if (!standing.constructor_name || !Number.isInteger(standing.position) || standing.position === null) {
              skippedConstructorStandings += 1;
              continue;
            }

            const { data: team } = await supabase
              .from("teams")
              .select("id")
              .eq("team_name", standing.constructor_name)
              .single();

            if (!team) {
              skippedConstructorStandings += 1;
              continue;
            }

            const { error: csError } = await supabase.from("constructor_standings").insert({
              season_id: season.id,
              team_id: team.id,
              position: standing.position,
              points: standing.points,
              wins: standing.wins,
            });

            if (csError) {
              throw new Error(
                `Failed to import constructor standings for ${standing.constructor_name}: ${csError.message}`
              );
            }

            importedConstructorStandings += 1;
          }
          log(
            `Imported ${importedConstructorStandings} constructor standings for ${year} (${skippedConstructorStandings} skipped)`
          );
        }

        push({ type: "complete", message: "Ergast bulk import completed successfully" });
      } catch (error) {
        console.error("[Ergast bulk import] Failed", error);
        push({
          type: "error",
          code: "IMPORT_FAILED",
          message: "Ergast import failed",
          details: toMessage(error),
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
