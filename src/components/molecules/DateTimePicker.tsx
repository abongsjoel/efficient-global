import { useEffect, useRef, useState } from "react";

// shared control styling (mirrors FormFields so the trigger matches inputs)
const baseControl =
  "mt-2 flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm shadow-sm outline-none transition duration-200";
const normalState =
  "border-slate-200 bg-slate-50/70 hover:border-slate-300 focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-200/20";
const errorState =
  "border-red-400 bg-red-50/40 hover:border-red-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/20";

const innerControl =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30";

// a datetime-local string is "YYYY-MM-DDTHH:mm"
const splitValue = (value: string) => ({
  date: value.slice(0, 10),
  time: value.length >= 16 ? value.slice(11, 16) : "",
});

const formatDisplay = (value: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

type DateTimePickerProps = {
  /** form field name; a hidden input carries the value for FormData */
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  error?: string;
  required?: boolean;
  /** earliest selectable date, as "YYYY-MM-DD" */
  minDate?: string;
  placeholder?: string;
};

const DateTimePicker = ({
  name,
  label,
  value,
  onChange,
  id = name,
  error,
  required,
  minDate,
  placeholder = "Select date and time",
}: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const errorId = error ? `${name}-error` : undefined;

  // keep date and time parts internally so a partial pick isn't lost
  // (the combined value is only emitted once both are present)
  const [date, setDate] = useState(() => splitValue(value).date);
  const [time, setTime] = useState(() => splitValue(value).time);

  const emit = (nextDate: string, nextTime: string) => {
    onChange(nextDate && nextTime ? `${nextDate}T${nextTime}` : "");
  };

  const handleDate = (nextDate: string) => {
    setDate(nextDate);
    emit(nextDate, time);
  };

  const handleTime = (nextTime: string) => {
    setTime(nextTime);
    emit(date, nextTime);
  };

  const handleClear = () => {
    setDate("");
    setTime("");
    onChange("");
    setOpen(false);
  };

  // close on outside click or Escape while open
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative text-sm font-medium text-slate-700">
      <label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required && (
          <span aria-hidden className="text-primary-200">
            *
          </span>
        )}
      </label>

      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`${baseControl} ${error ? errorState : normalState}`}
      >
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {formatDisplay(value) || placeholder}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5 shrink-0 text-slate-400"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path
            strokeLinecap="round"
            d="M16 2v4M8 2v4M3 10h18"
          />
        </svg>
      </button>

      {/* hidden field so the value is captured by FormData/validation */}
      <input type="hidden" name={name} value={value} />

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute left-0 z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10"
        >
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Date
              <input
                type="date"
                value={date}
                min={minDate}
                onChange={(e) => handleDate(e.target.value)}
                className={`mt-1.5 ${innerControl}`}
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Time
              <input
                type="time"
                value={time}
                onChange={(e) => handleTime(e.target.value)}
                className={`mt-1.5 ${innerControl}`}
              />
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-primary-200 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-primary-300"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {error && (
        <span
          id={errorId}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-sm font-normal text-red-600"
        >
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-5a.9.9 0 00-.9 1l.35 4.5a.55.55 0 001.1 0L10.9 6a.9.9 0 00-.9-1zm0 8a1 1 0 100 2 1 1 0 000-2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};

export default DateTimePicker;
