import { PageHeader } from "@/components/ui/PageHeader";
import { usePageMeta } from "@/lib/usePageMeta";

const DESCRIPTION =
  "A photography, videography, and gifting studio built around one idea: your memories deserve craft, not just coverage.";

export default function AboutPage() {
  usePageMeta("About", DESCRIPTION);
  return (
    <div className="page-space content-wrap">
      <PageHeader
        eyebrow="Our story"
        title="About Khatu Pixel"
        description={DESCRIPTION}
      />
      <div className="mx-auto mt-16 max-w-2xl space-y-6 text-base leading-relaxed text-ink/90">
        <p>
          Khatu Pixel Digital Studio works across weddings, portraits, brand shoots, and
          celebrations — pairing a documentary eye with a considered, editorial finish. Every
          booking is treated as a collaboration: we listen first, plan carefully, and deliver
          work that holds up years later.
        </p>
        <p>
          Alongside photography and videography, our gifting studio turns favourite frames into
          keepsakes — printed, framed, and customised by hand.
        </p>
      </div>
    </div>
  );
}
