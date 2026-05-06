"use client";

type FlipCardProps = {
  digit: string;
  previousDigit: string;
  isFlipping: boolean;
};

export function FlipCard({ digit, previousDigit, isFlipping }: FlipCardProps) {
  return (
    <div className="flip-unit relative h-full w-full rounded-[0.9rem] shadow-apple-card">
      <div className="flip-card-bg absolute inset-0 rounded-[0.9rem]" />
      <div className="flip-separator absolute left-0 right-0 top-1/2 z-20 h-[1px] -translate-y-1/2 bg-[var(--digit-divider)]" />
      <div className="flip-gloss pointer-events-none absolute inset-0 z-[30] rounded-[0.9rem]" />

      <div className="flip-top-static absolute left-0 right-0 top-0 h-1/2 overflow-hidden rounded-t-[0.9rem]">
        <DigitFace digit={isFlipping ? previousDigit : digit} top />
      </div>
      <div className="flip-bottom-static absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden rounded-b-[0.9rem]">
        <DigitFace digit={digit} />
      </div>

      {isFlipping && (
        <>
          <div className="flip-top-animated absolute left-0 right-0 top-0 z-40 h-1/2 origin-bottom overflow-hidden rounded-t-[0.9rem]">
            <DigitFace digit={previousDigit} top />
          </div>
          <div className="flip-bottom-animated absolute bottom-0 left-0 right-0 z-40 h-1/2 origin-top overflow-hidden rounded-b-[0.9rem]">
            <DigitFace digit={digit} />
          </div>
        </>
      )}
    </div>
  );
}

function DigitFace({ digit, top = false }: { digit: string; top?: boolean }) {
  return (
    <div
      className={[
        "digit-face",
        "relative flex h-[200%] w-full items-center justify-center",
        "text-[clamp(2.2rem,8vw,8rem)] font-bold leading-none text-[var(--digit-text)]",
        top ? "top-0" : "-top-full"
      ].join(" ")}
    >
      <span className="digit-content">{digit}</span>
    </div>
  );
}
