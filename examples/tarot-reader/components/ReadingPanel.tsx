import type { TarotReading } from "@/lib/generateReading";

type ReadingPanelProps = {
  reading: TarotReading;
  onCopy: () => void;
  copyLabel: string;
};

export function ReadingPanel({
  reading,
  onCopy,
  copyLabel,
}: ReadingPanelProps) {
  return (
    <section className="reading-panel" aria-live="polite">
      <div className="reading-panel__header">
        <div>
          <p className="section-label">Your reading</p>
          <h2>Past, Present &amp; Future</h2>
        </div>
        <button className="ghost-button" type="button" onClick={onCopy}>
          {copyLabel}
        </button>
      </div>

      <div className="reading-grid">
        {reading.sections.map((section) => (
          <article className="reading-section" key={section.label}>
            <p className="section-label">{section.label}</p>
            <h3>{section.card.name}</h3>
            <p>{section.insight}</p>
          </article>
        ))}
      </div>

      <article className="overall-reading">
        <p className="section-label">Overall interpretation</p>
        <p>{reading.overall}</p>
      </article>
    </section>
  );
}
