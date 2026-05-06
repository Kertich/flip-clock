"use client";

import { useEffect, useRef, useState } from "react";
import { FlipUnit } from "./FlipUnit";

type FlipState = {
  current: string;
  previous: string;
  isFlipping: boolean;
};

type ClockState = {
  hoursTens: FlipState;
  hoursOnes: FlipState;
  minutesTens: FlipState;
  minutesOnes: FlipState;
  secondsTens: FlipState;
  secondsOnes: FlipState;
};

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const FLIP_DURATION_MS = 640;
const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
const TIMEZONE_OPTIONS = [
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Tokyo",
  "Asia/Singapore",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney"
] as const;

function getTimeDigits(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone
  }).formatToParts(date);

  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  const second = parts.find((part) => part.type === "second")?.value ?? "00";

  const [hoursTens, hoursOnes] = hour.padStart(2, "0");
  const [minutesTens, minutesOnes] = minute.padStart(2, "0");
  const [secondsTens, secondsOnes] = second.padStart(2, "0");
  return { hoursTens, hoursOnes, minutesTens, minutesOnes, secondsTens, secondsOnes };
}

function makeFlipState(digit: string): FlipState {
  return { current: digit, previous: digit, isFlipping: false };
}

function makeClockState(date: Date, timeZone: string): ClockState {
  const digits = getTimeDigits(date, timeZone);
  return {
    hoursTens: makeFlipState(digits.hoursTens),
    hoursOnes: makeFlipState(digits.hoursOnes),
    minutesTens: makeFlipState(digits.minutesTens),
    minutesOnes: makeFlipState(digits.minutesOnes),
    secondsTens: makeFlipState(digits.secondsTens),
    secondsOnes: makeFlipState(digits.secondsOnes)
  };
}

export function FlipClock() {
  const [timeZone, setTimeZone] = useState<string>(DEFAULT_TIMEZONE);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [clockState, setClockState] = useState<ClockState>(() =>
    makeClockState(new Date(), DEFAULT_TIMEZONE)
  );
  const flipTimersRef = useRef<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  useEffect(() => {
    const playFlipSound = (amount: number) => {
      if (!isSoundEnabled || amount <= 0) return;

      try {
        const audioCtor =
          window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
        if (!audioCtor) return;
        const context = audioContextRef.current ?? new audioCtor();
        audioContextRef.current = context;

        if (context.state === "suspended") {
          void context.resume();
        }

        const now = context.currentTime;
        for (let index = 0; index < amount; index += 1) {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const startAt = now + index * 0.02;
          const duration = 0.05;

          oscillator.type = "triangle";
          oscillator.frequency.setValueAtTime(900 - index * 65, startAt);
          gain.gain.setValueAtTime(0.0001, startAt);
          gain.gain.exponentialRampToValueAtTime(0.03, startAt + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(startAt);
          oscillator.stop(startAt + duration);
        }
      } catch {
        // Sound is best-effort only.
      }
    };

    const tick = () => {
      const nowDigits = getTimeDigits(new Date(), timeZone);
      setClockState((prev) => {
        const next = { ...prev };
        let changedUnits = 0;
        (Object.keys(nowDigits) as Array<keyof ClockState>).forEach((key) => {
          const incoming = nowDigits[key];
          const unit = prev[key];
          if (incoming !== unit.current) {
            changedUnits += 1;
            next[key] = {
              previous: unit.current,
              current: incoming,
              isFlipping: true
            };

            const timer = window.setTimeout(() => {
              setClockState((latest) => ({
                ...latest,
                [key]: { ...latest[key], isFlipping: false }
              }));
            }, FLIP_DURATION_MS);

            flipTimersRef.current.push(timer);
          }
        });
        playFlipSound(changedUnits);
        return next;
      });
    };

    const interval = window.setInterval(() => {
      window.requestAnimationFrame(tick);
    }, 1000);
    tick();

    return () => {
      window.clearInterval(interval);
      flipTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      flipTimersRef.current = [];
    };
  }, [isSoundEnabled, timeZone]);

  return (
    <section className="relative z-10 w-full max-w-[78rem] rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-bg)] px-4 py-6 shadow-apple-soft backdrop-blur-xl sm:px-8 sm:py-8">
      <header className="mx-auto mb-5 flex w-full max-w-[72rem] flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Precision Flip Clock
        </p>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="rounded-full border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--control-bg-hover)]"
          >
            {isDarkMode ? "Dark" : "Light"}
          </button>

          <button
            type="button"
            onClick={() => setIsSoundEnabled((prev) => !prev)}
            className="rounded-full border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--control-bg-hover)]"
          >
            Sound {isSoundEnabled ? "On" : "Off"}
          </button>

          <select
            value={timeZone}
            onChange={(event) => setTimeZone(event.target.value)}
            className="rounded-full border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] outline-none transition hover:bg-[var(--control-bg-hover)]"
          >
            {!TIMEZONE_OPTIONS.includes(timeZone as (typeof TIMEZONE_OPTIONS)[number]) && (
              <option value={timeZone}>{timeZone}</option>
            )}
            {TIMEZONE_OPTIONS.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[72rem] items-center justify-center gap-2 sm:gap-3 md:gap-4">
        <ClockPair left={clockState.hoursTens} right={clockState.hoursOnes} />
        <ClockSeparator />
        <ClockPair left={clockState.minutesTens} right={clockState.minutesOnes} />
        <ClockSeparator />
        <ClockPair left={clockState.secondsTens} right={clockState.secondsOnes} />
      </div>

      <footer className="mt-5 text-center text-xs text-[var(--muted-foreground)]">
        {timeZone}
      </footer>
    </section>
  );
}

function ClockPair({ left, right }: { left: FlipState; right: FlipState }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
      <FlipUnit digit={left.current} previousDigit={left.previous} isFlipping={left.isFlipping} />
      <FlipUnit digit={right.current} previousDigit={right.previous} isFlipping={right.isFlipping} />
    </div>
  );
}

function ClockSeparator() {
  return (
    <div className="mx-[0.2rem] flex h-[clamp(4.5rem,18vw,10.25rem)] flex-col items-center justify-center gap-[0.85rem] sm:mx-1 sm:gap-[1.2rem]">
      <span className="h-[0.5rem] w-[0.5rem] rounded-full bg-[var(--separator-dot)] shadow-[var(--separator-glow)] sm:h-[0.65rem] sm:w-[0.65rem]" />
      <span className="h-[0.5rem] w-[0.5rem] rounded-full bg-[var(--separator-dot)] shadow-[var(--separator-glow)] sm:h-[0.65rem] sm:w-[0.65rem]" />
    </div>
  );
}
