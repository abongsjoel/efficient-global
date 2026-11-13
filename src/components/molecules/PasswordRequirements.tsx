import { CheckIcon } from "../icons";
import { getPasswordRequirementStatuses } from "../../utils/adminPassword";

type PasswordRequirementsProps = {
  label: string;
  password: string;
};

// Shown while the password is non-empty and still misses a rule.
const PasswordRequirements = ({ label, password }: PasswordRequirementsProps) => {
  const requirementStatuses = getPasswordRequirementStatuses(password);
  const shouldShow =
    password.length > 0 &&
    requirementStatuses.some((requirement) => !requirement.isMet);

  if (!shouldShow) {
    return null;
  }

  return (
    <ul
      aria-label={label}
      aria-live="polite"
      className="mt-3 grid gap-1.5 text-xs"
    >
      {requirementStatuses.map((requirement) => (
        <li
          key={requirement.label}
          className={`flex items-center gap-2 transition-colors ${
            requirement.isMet ? "text-green-700" : "text-slate-500"
          }`}
        >
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
              requirement.isMet
                ? "border-green-600 bg-green-600 text-white"
                : "border-slate-300 bg-white text-transparent"
            }`}
          >
            <CheckIcon className="h-3 w-3" />
          </span>
          <span>{requirement.label}</span>
        </li>
      ))}
    </ul>
  );
};

export default PasswordRequirements;
