"use client";

import { FlipCard } from "./FlipCard";

type FlipUnitProps = {
  digit: string;
  previousDigit: string;
  isFlipping: boolean;
};

export function FlipUnit({ digit, previousDigit, isFlipping }: FlipUnitProps) {
  return (
    <div className="relative h-[clamp(4.5rem,18vw,10.25rem)] w-[clamp(3.3rem,12vw,7.2rem)]">
      <FlipCard digit={digit} previousDigit={previousDigit} isFlipping={isFlipping} />
    </div>
  );
}
