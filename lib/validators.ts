import { z } from "zod";

const nullableText = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined) return null;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  });

const httpsUrl = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined) return null;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  })
  .refine((value) => value === null || value.startsWith("https://"), "URL must start with https://");

const yearSchema = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .refine((value) => /^\d{4}$/.test(value), "Year must be 4 digits")
  .transform((value) => Number(value));

const nullableNumber = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined) return null;
    const raw = String(value).trim();
    if (raw === "") return null;
    const num = Number(raw);
    return Number.isNaN(num) ? Number.NaN : num;
  })
  .refine((value) => value === null || !Number.isNaN(value), "Must be a number");

const requiredNumber = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .refine((value) => value.length > 0, "Required")
  .transform((value) => Number(value))
  .refine((value) => !Number.isNaN(value), "Must be a number");

const requiredId = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .refine((value) => value.length > 0, "Required")
  .transform((value) => Number(value))
  .refine((value) => !Number.isNaN(value), "Must be a number");

const nullableId = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined) return null;
    const raw = String(value).trim();
    if (raw === "") return null;
    const num = Number(raw);
    return Number.isNaN(num) ? Number.NaN : num;
  })
  .refine((value) => value === null || !Number.isNaN(value), "Must be a number");

export const driverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nationality: nullableText,
  birthdate: nullableText,
  profile_image_url: httpsUrl,
  championships: nullableNumber,
  wins: nullableNumber,
  podiums: nullableNumber,
  poles: nullableNumber,
  fastest_laps: nullableNumber,
  biography: nullableText,
  team_ids: z
    .array(
      z
        .union([z.string(), z.number()])
        .transform((value) => Number(value))
        .refine((value) => !Number.isNaN(value), "Must be a number")
    )
    .optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const teamSchema = z.object({
  team_name: z.string().min(1, "Team name is required"),
  logo_url: httpsUrl,
  base_country: nullableText,
  championships: nullableNumber,
  active_years: nullableText,
  status: z.enum(["draft", "published"]).optional(),
});

export const circuitSchema = z.object({
  circuit_name: z.string().min(1, "Circuit name is required"),
  country: nullableText,
  track_layout_url: httpsUrl,
  lap_length_km: nullableNumber,
  first_gp_year: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((value) => {
      if (value === null || value === undefined) return null;
      const raw = String(value).trim();
      if (raw === "") return null;
      return raw;
    })
    .refine((value) => value === null || /^\d{4}$/.test(value), "Year must be 4 digits")
    .transform((value) => (value === null ? null : Number(value))),
  status: z.enum(["draft", "published"]).optional(),
});

export const seasonSchema = z.object({
  year: yearSchema,
  champion_driver_id: nullableId,
  champion_team_id: nullableId,
  total_races: requiredNumber,
  banner_image_url: httpsUrl,
  status: z.enum(["draft", "published"]).optional(),
});

export const raceSchema = z.object({
  season_id: requiredId,
  circuit_id: requiredId,
  winner_driver_id: nullableId,
  second_driver_id: nullableId,
  third_driver_id: nullableId,
  fastest_lap_driver_id: nullableId,
  laps: nullableNumber,
  results_positions: z
    .array(
      z.object({
        driver_id: requiredId,
        team_id: nullableId,
        position: requiredNumber,
        points: requiredNumber,
        laps: nullableNumber,
        time: nullableText,
        status: z.enum(["Finished", "DNF", "DNS", "DSQ"]),
      })
    )
    .max(20, "Maximum 20 positions")
    .optional(),
}).superRefine((value, ctx) => {
  if (!value.results_positions || value.results_positions.length === 0) {
    if (!value.winner_driver_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["winner_driver_id"],
        message: "Winner is required when no full results are provided",
      });
    }
    return;
  }

  const seen = new Set<number>();
  for (let i = 0; i < value.results_positions.length; i += 1) {
    const position = value.results_positions[i].position;
    if (position < 1 || position > 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["results_positions", i, "position"],
        message: "Position must be between 1 and 20",
      });
    }
    if (seen.has(position)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["results_positions", i, "position"],
        message: "Positions must be unique per race",
      });
    }
    seen.add(position);
  }
});

export const mediaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .refine((value) => value.startsWith("https://"), "URL must start with https://"),
  category: nullableText,
  caption: nullableText,
});

export const driverStandingSchema = z.object({
  season_id: requiredId,
  driver_id: requiredId,
  team_id: nullableId,
  position: requiredNumber,
  points: requiredNumber,
  wins: requiredNumber,
});

export const constructorStandingSchema = z.object({
  season_id: requiredId,
  team_id: requiredId,
  position: requiredNumber,
  points: requiredNumber,
  wins: requiredNumber,
});

export const timelineEventSchema = z.object({
  year: yearSchema,
  title: z.string().trim().min(1, "Title is required"),
  description: nullableText,
  image_url: httpsUrl,
});
