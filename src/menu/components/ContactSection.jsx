import { PhoneIcon, MailIcon, PinIcon, ClockIcon, WhatsappIcon } from "./icons";

const ICON_CLASS = "mt-0.5 size-[18px] shrink-0 text-menu-text-muted";

function renderIcon(kind) {
  switch (kind) {
    case "pin":
      return <PinIcon className={ICON_CLASS} />;
    case "clock":
      return <ClockIcon className={ICON_CLASS} />;
    case "phone":
      return <PhoneIcon className={ICON_CLASS} />;
    case "whatsapp":
      return <WhatsappIcon className={ICON_CLASS} />;
    case "mail":
      return <MailIcon className={ICON_CLASS} />;
    default:
      return null;
  }
}

const Row = ({ kind, children, href }) => {
  const content = (
    <span className="flex items-start gap-3">
      {renderIcon(kind)}
      <span className="text-sm leading-relaxed text-menu-text">{children}</span>
    </span>
  );
  return href ? (
    <a href={href} className="block transition-opacity hover:opacity-70">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
};

const ContactSection = ({ settings }) => {
  const { phone, whatsapp, email, address, openingHours } = settings;
  if (!phone && !whatsapp && !email && !address && !openingHours) return null;

  return (
    <section className="px-4 pb-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[1.75rem] border border-menu-line bg-menu-surface p-5 shadow-menu-card sm:p-7">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-menu-text sm:text-2xl">
            İletişim
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {address ? <Row kind="pin">{address}</Row> : null}
            {openingHours ? <Row kind="clock">{openingHours}</Row> : null}
            {phone ? (
              <Row kind="phone" href={`tel:${phone.replace(/\s+/g, "")}`}>
                {phone}
              </Row>
            ) : null}
            {whatsapp ? (
              <Row
                kind="whatsapp"
                href={`https://wa.me/${whatsapp.replace(/[^\d+]/g, "").replace(/^\+/, "")}`}
              >
                {whatsapp}
              </Row>
            ) : null}
            {email ? (
              <Row kind="mail" href={`mailto:${email}`}>
                {email}
              </Row>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
