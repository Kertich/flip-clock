import { FlipClock } from "@/components/flip-clock/FlipClock";

export default function HomePage() {
  return (
    <main className="app-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.14),rgba(255,255,255,0)_48%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.08),rgba(255,255,255,0)_42%)]" />
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[2px]" />
      <FlipClock />
    </main>
  );
}
