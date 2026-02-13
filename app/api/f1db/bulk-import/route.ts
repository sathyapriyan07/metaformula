import { createSupabaseServer } from "../../../../lib/supabase/server";
import {
  fetchF1DBDrivers,
  fetchF1DBConstructors,
  fetchF1DBCircuits,
  fetchF1DBSeasons,
} from "../../../../lib/f1dbImport";
import { isAdminUser } from "../../../../lib/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImportEvent =
  | { type: "log"; message: string }
  | { type: "error"; message: string; details?: string; code: string }
  | { type: "complete"; message: string };

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

export async function POST() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !isAdminUser(user)) {
    return adminOnlyResponse();
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const push = (event: ImportEvent) => {
        controller.enqueue(encoder.encode(toSseEvent(event)));
      };

      const log = (message: string) => push({ type: "log", message });

      try {
        log("Starting F1DB bulk import");
        log("Source: https://github.com/f1db/f1db (CC BY 4.0)");

        log("Importing circuits...");
        const circuits = await fetchF1DBCircuits();
        log(`Found ${circuits.length} circuits`);

        for (const circuit of circuits) {
          const lapLength = circuit.length ? Number.parseFloat(circuit.length) : null;
          const { error } = await supabase.from("circuits").upsert(
            {
              circuit_name: circuit.name || circuit.circuit_name,
              country: circuit.country,
              lap_length_km: Number.isFinite(lapLength) ? lapLength : null,
            },
            { onConflict: "circuit_name" }
          );

          if (error) {
            throw new Error(`Failed to import circuit \"${circuit.name || circuit.circuit_name}\": ${error.message}`);
          }
        }
        log(`Imported ${circuits.length} circuits`);

        log("Importing constructors...");
        const constructors = await fetchF1DBConstructors();
        log(`Found ${constructors.length} constructors`);

        for (const constructor of constructors) {
          const { error } = await supabase.from("teams").upsert(
            {
              team_name: constructor.name || constructor.constructor_name,
              base_country: constructor.nationality || constructor.country,
            },
            { onConflict: "team_name" }
          );

          if (error) {
            throw new Error(
              `Failed to import constructor \"${constructor.name || constructor.constructor_name}\": ${error.message}`
            );
          }
        }
        log(`Imported ${constructors.length} constructors`);

        log("Importing drivers...");
        const drivers = await fetchF1DBDrivers();
        log(`Found ${drivers.length} drivers`);

        for (const driver of drivers) {
          const name = `${driver.forename || driver.first_name || ""} ${driver.surname || driver.last_name || ""}`.trim();
          const { error } = await supabase.from("drivers").upsert(
            {
              name,
              nationality: driver.nationality || driver.country,
              birthdate: driver.dob || driver.date_of_birth,
            },
            { onConflict: "name" }
          );

          if (error) {
            throw new Error(`Failed to import driver \"${name}\": ${error.message}`);
          }
        }
        log(`Imported ${drivers.length} drivers`);

        log("Importing seasons...");
        const seasons = await fetchF1DBSeasons();
        log(`Found ${seasons.length} seasons`);

        for (const season of seasons) {
          const { error } = await supabase.from("seasons").upsert(
            {
              year: Number.parseInt(season.year, 10),
              total_races: 0,
            },
            { onConflict: "year" }
          );

          if (error) {
            throw new Error(`Failed to import season \"${season.year}\": ${error.message}`);
          }
        }
        log(`Imported ${seasons.length} seasons`);

        push({ type: "complete", message: "F1DB bulk import completed successfully" });
      } catch (error) {
        console.error("[F1DB bulk import] Failed", error);
        push({
          type: "error",
          code: "IMPORT_FAILED",
          message: "F1DB import failed",
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
