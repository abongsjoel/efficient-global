import Button from "../../atoms/Button";
import { MailIcon, PhoneIcon } from "../../icons";
import { getMailtoHref, getTelHref } from "../../../utils/contactLinks";

type AdminRequestRowActionsProps = {
  email?: string;
  emailSubject?: string;
  name: string;
  onView: () => void;
  phone?: string;
};

const contactLinkClassName =
  "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:border-primary-200 hover:text-primary-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/20";

const AdminRequestRowActions = ({
  email,
  emailSubject,
  name,
  onView,
  phone,
}: AdminRequestRowActionsProps) => {
  const mailtoHref = getMailtoHref(email, emailSubject);
  const telHref = getTelHref(phone);

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        aria-label={`View details for ${name}`}
        className="rounded-full border border-slate-200 px-2.5 py-1.5 hover:border-primary-200"
        size="sm"
        variant="link"
        onClick={onView}
      >
        View
      </Button>

      {mailtoHref ? (
        <a
          aria-label={`Email ${name}`}
          className={contactLinkClassName}
          href={mailtoHref}
          title={email}
        >
          <MailIcon className="h-3.5 w-3.5" />
        </a>
      ) : null}

      {telHref ? (
        <a
          aria-label={`Call ${name}`}
          className={contactLinkClassName}
          href={telHref}
          title={phone}
        >
          <PhoneIcon className="h-3.5 w-3.5" />
        </a>
      ) : null}
    </div>
  );
};

export default AdminRequestRowActions;
