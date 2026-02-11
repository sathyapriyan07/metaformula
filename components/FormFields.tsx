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
      <label className="text-xs uppercase tracking-wider text-white/60 mb-1 block" htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        step={step}
        {...register(name)}
        className={clsx(
          "w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 backdrop-blur-md caret-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/60 transition-all",
          error && "border-f1-red/60"
        )}
      />
      {error && <p className="text-xs text-f1-red">{error.message}</p>}
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
      <label className="text-xs uppercase tracking-wider text-white/60 mb-1 block" htmlFor={name}>{label}</label>
      <select
        id={name}
        {...register(name)}
        className={clsx(
          "w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/60 transition-all appearance-none",
          error && "border-f1-red/60"
        )}
      >
        <option value="">{placeholder ?? "Select"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-f1-red">{error.message}</p>}
    </div>
  );
}

export function TextAreaField<T extends FieldValues>({ label, name, register, error, placeholder }: FieldProps<T>) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-white/60 mb-1 block" htmlFor={name}>{label}</label>
      <textarea
        id={name}
        placeholder={placeholder}
        {...register(name)}
        className={clsx(
          "min-h-[160px] w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 backdrop-blur-md caret-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/60 transition-all",
          error && "border-f1-red/60"
        )}
      />
      {error && <p className="text-xs text-f1-red">{error.message}</p>}
    </div>
  );
}
