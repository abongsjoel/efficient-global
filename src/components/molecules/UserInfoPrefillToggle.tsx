type UserInfoPrefillToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const UserInfoPrefillToggle = ({
  checked,
  onChange,
}: UserInfoPrefillToggleProps) => (
  <button
    type="button"
    aria-pressed={checked}
    className="inline-flex h-8 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition hover:border-primary-200 hover:text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/25"
    onClick={() => onChange(!checked)}
  >
    <span
      aria-hidden="true"
      className={[
        "relative h-4 w-7 rounded-full transition",
        checked ? "bg-primary-200" : "bg-slate-200",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-3" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </span>
    <span>Use saved info</span>
  </button>
);

export default UserInfoPrefillToggle;
