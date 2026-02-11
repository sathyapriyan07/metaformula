import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface Option {
  value: number;
  label: string;
}

export default function MultiSelectField<T extends FieldValues>({
  label,
  name,
  control,
  options,
  error,
}: {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  error?: { message?: string };
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-white/60 mb-1 block">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <select
            multiple
            value={(field.value as number[] | undefined)?.map(String) ?? []}
            onChange={(event) => {
              const selected = Array.from(event.target.selectedOptions).map((opt) => Number(opt.value));
              field.onChange(selected);
            }}
            className={`w-full min-h-[120px] rounded-2xl bg-black/40 border border-white/10 text-white backdrop-blur-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/60 transition-all ${error ? "border-f1-red/60" : ""}`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-zinc-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      {error && <p className="text-xs text-f1-red">{error.message}</p>}
    </div>
  );
}