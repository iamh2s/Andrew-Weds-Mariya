import { SectionHeading, MiniRule } from "./Ornaments";
import InvitationCard from "./InvitationCard";

/** நிச்சயதார்த்த விழாவிற்கான ஒரே அழைப்பிதழ் பகுதி. */
export function EngagementSection() {
  return (
    <section id="nichayam" className="paper relative overflow-hidden py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          num="01"
          overline="அன்பின் முதல் வாக்குறுதி"
          title="நிச்சயதார்த்த விழா"
          tone="light"
        />
        <InvitationCard />
        <MiniRule tone="light" className="mt-20" />
      </div>
    </section>
  );
}