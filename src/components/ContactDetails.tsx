
import { useEffect } from "react";
import {
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { wedding, mapsLink } from "../data/wedding";

interface ContactPanelProps {
  open: boolean;
  visible: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const FAMILIES = [
  {
    label: "மணமகன் குடும்பம்",
    name: "மணமகன் குடும்பத்தினர்",
    phone: "79495 38434",
  },
  {
    label: "மணமகள் குடும்பம்",
    name: "மணமகள் குடும்பத்தினர்",
    phone: "79495 38434",
  },
];

export default function ContactPanel({
  open,
  onClose,
}: ContactPanelProps) {
  const engagement = wedding.engagement;

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="தொடர்பு சாளரத்தை மூடு"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[300] cursor-default bg-black/65 backdrop-blur-[2px]"
          />

          {/* Contact drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="தொடர்பு விவரங்கள்"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed right-0 top-0 z-[310] flex h-[100dvh] w-full max-w-[560px] flex-col overflow-hidden border-l border-[#c9a45c]/40 bg-[#21060e] text-[#f5e7bf] shadow-2xl"
          >
            {/* Header */}
            <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-[#c9a45c]/25 bg-[#21060e] px-5 py-5 sm:px-7">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-[0.2em] text-[#c9a45c]">
                  ANDREW WEDS MARIYA
                </p>

                <h2 className="mt-2 font-serif text-xl text-[#f5e7bf] sm:text-2xl">
                  தொடர்பு விவரங்கள்
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="தொடர்பு விவரங்களை மூடு"
                className="relative z-20 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c9a45c]/60 bg-[#2b0711] text-[#e5c77c] transition hover:bg-[#4a1020] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e5c77c]"
              >
                <X size={23} strokeWidth={2.2} />
              </button>
            </header>

            {/* Scrollable content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
              <p className="font-serif text-sm leading-7 text-[#f5e7bf]/70 sm:text-base">
                ஆசீர்வாதங்கள், வருகை உறுதி மற்றும் விழா ஏற்பாடுகள்
                தொடர்பான விவரங்களுக்கு அன்புடன் தொடர்புகொள்ளுங்கள்.
              </p>

              {/* Family contact cards */}
              <div className="mt-6 flex flex-col gap-4">
                {FAMILIES.map((family) => {
                  const cleanPhone = family.phone.replace(/\D/g, "");
                  const whatsappPhone = cleanPhone;

                  return (
                    <section
                      key={family.label}
                      className="border border-[#c9a45c]/30 bg-[#3a0b18]/55 p-5"
                    >
                      <p className="text-[10px] tracking-[0.2em] text-[#c9a45c]">
                        {family.label}
                      </p>

                      <p className="mt-3 font-serif text-lg font-semibold">
                        {family.name}
                      </p>

                      <a
                        href={`tel:${cleanPhone}`}
                        className="mt-3 flex items-center gap-2 text-sm tracking-wider text-[#f5e7bf]/90 transition hover:text-[#e5c77c]"
                      >
                        <Phone size={16} className="text-[#e5c77c]" />
                        {family.phone}
                      </a>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {/* Call button */}
                        <a
                          href={`tel:${cleanPhone}`}
                          className="flex min-h-12 items-center justify-center gap-2 border border-[#c9a45c]/60 bg-[#c9a45c]/10 px-3 py-3 text-sm font-semibold text-[#e5c77c] transition hover:bg-[#c9a45c] hover:text-[#21060e]"
                        >
                          <Phone size={16} />
                          அழை
                        </a>

                        {/* WhatsApp button */}
                        <a
                          href={`https://wa.me/${whatsappPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-12 items-center justify-center gap-2 border border-[#c9a45c]/60 px-3 py-3 text-sm font-semibold text-[#e5c77c] transition hover:bg-[#c9a45c] hover:text-[#21060e]"
                        >
                          <MessageCircle size={16} />
                          WhatsApp
                        </a>
                      </div>
                    </section>
                  );
                })}

                {/* Venue details */}
                <section className="border border-[#c9a45c]/30 bg-[#3a0b18]/55 p-5">
                  <p className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#c9a45c]">
                    <MapPin size={15} />
                    விழா இடம்
                  </p>

                  <h3 className="mt-3 font-serif text-lg font-semibold leading-relaxed">
                    {engagement.venue}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#f5e7bf]/70">
                    {engagement.address}
                  </p>

                  <a
                    href={mapsLink(engagement.venue, engagement.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex min-h-12 items-center justify-center gap-2 border border-[#c9a45c]/50 px-4 py-3 text-sm text-[#e5c77c] transition hover:bg-[#c9a45c] hover:text-[#21060e]"
                  >
                    <Navigation size={16} />
                    வழி காண்க
                  </a>
                </section>
              </div>

              <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[#c9a45c]/70 to-transparent" />
            </div>

            {/* Footer */}
            <footer className="shrink-0 border-t border-[#c9a45c]/25 bg-[#21060e] px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-7">
              <p className="text-center font-serif text-sm leading-relaxed text-[#e5c77c]/80">
                அனைவரையும் அன்புடன் வரவேற்கிறோம்
              </p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
