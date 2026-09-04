import { useState } from "react";
import {
  InstagramIcon,
  FacebookIcon,
  TiktokIcon,
  WhatsappIcon,
  PhoneIcon,
  MailIcon,
} from "./icons";

const SOCIAL_ICON_CLASS = "size-5";

function renderSocialIcon(key) {
  switch (key) {
    case "instagram":
      return <InstagramIcon className={SOCIAL_ICON_CLASS} />;
    case "facebook":
      return <FacebookIcon className={SOCIAL_ICON_CLASS} />;
    case "tiktok":
      return <TiktokIcon className={SOCIAL_ICON_CLASS} />;
    case "whatsapp":
      return <WhatsappIcon className={SOCIAL_ICON_CLASS} />;
    case "phone":
      return <PhoneIcon className={SOCIAL_ICON_CLASS} />;
    case "email":
      return <MailIcon className={SOCIAL_ICON_CLASS} />;
    default:
      return null;
  }
}

function buildSocialLinks(settings) {
  const links = [];
  if (settings.instagram) {
    links.push({ key: "instagram", href: settings.instagram, label: "Instagram" });
  }
  if (settings.facebook) {
    links.push({ key: "facebook", href: settings.facebook, label: "Facebook" });
  }
  if (settings.tiktok) {
    links.push({ key: "tiktok", href: settings.tiktok, label: "TikTok" });
  }
  if (settings.whatsapp) {
    const digits = settings.whatsapp.replace(/[^\d+]/g, "");
    links.push({ key: "whatsapp", href: `https://wa.me/${digits.replace(/^\+/, "")}`, label: "WhatsApp" });
  }
  if (settings.phone) {
    links.push({ key: "phone", href: `tel:${settings.phone.replace(/\s+/g, "")}`, label: "Telefon" });
  }
  if (settings.email) {
    links.push({ key: "email", href: `mailto:${settings.email}`, label: "E-posta" });
  }
  return links;
}

const MenuHero = ({ settings }) => {
  const { restaurantName, menuDescription, logo } = settings;
  const [logoFailed, setLogoFailed] = useState(false);
  const socialLinks = buildSocialLinks(settings);
  const showLogo = logo && !logoFailed;

  return (
    <header className="bg-menu-hero px-4 pb-9 pt-10 text-center sm:px-6 sm:pb-12 sm:pt-14">
      <div className="mx-auto flex max-w-md flex-col items-center">
        {showLogo ? (
          <img
            src={logo}
            alt={restaurantName || "Logo"}
            onError={() => setLogoFailed(true)}
            className="size-16 rounded-3xl object-cover sm:size-20"
          />
        ) : null}

        <h1
          className={
            "font-display font-extrabold tracking-tight text-menu-hero-text " +
            "text-[clamp(1.75rem,7vw,2.75rem)] sm:text-[clamp(2.25rem,4.5vw,3.5rem)] " +
            (showLogo ? "mt-4" : "")
          }
        >
          {restaurantName || "Restoranınız"}
        </h1>

        {menuDescription ? (
          <p className="mt-3 text-sm leading-relaxed text-menu-hero-text-muted sm:text-base">
            {menuDescription}
          </p>
        ) : null}

        {socialLinks.length > 0 ? (
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {socialLinks.map(({ key, href, label }) => (
              <a
                key={key}
                href={href}
                target={key === "phone" || key === "email" ? undefined : "_blank"}
                rel="noreferrer noopener"
                aria-label={label}
                className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/15"
              >
                {renderSocialIcon(key)}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default MenuHero;
