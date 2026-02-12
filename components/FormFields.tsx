import { UseFormRegister, FieldValues, Path, FieldError } from "react-hook-form";
import clsx from "clsx";

interface FieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  type?: string;
  placeholder?: string;
  step?: string;
}

export function TextField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  type = "text",
  placeholder,
  step,
}: FieldProps<T>) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80" htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        step={step}
        {...register(name)}
        className={clsx(
          "w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30",
          error && "border-red-500/60"
        )}
      />
      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  );
}

interface SelectOption {
  value: string | number;
  label: string;
}

export function SelectField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  options,
  placeholder,
}: FieldProps<T> & { options: SelectOption[]; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80" htmlFor={name}>{label}</label>
      <select
        id={name}
        {...register(name)}
        className={clsx(
          "w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30",
          error && "border-red-500/60"
        )}
      >
        <option value="">{placeholder ?? "Select"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  );
}

export function TextAreaField<T extends FieldValues>({ label, name, register, error, placeholder }: FieldProps<T>) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80" htmlFor={name}>{label}</label>
      <textarea
        id={name}
        placeholder={placeholder}
        {...register(name)}
        className={clsx(
          "min-h-[160px] w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30",
          error && "border-red-500/60"
        )}
      />
      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  );
}
