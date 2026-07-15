export function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-drift-a absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, var(--accent-primary), transparent 70%)",
        }}
      />
      <div
        className="animate-drift-b absolute top-1/3 -right-40 h-[42rem] w-[42rem] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, var(--accent-secondary), transparent 70%)",
        }}
      />
      <div
        className="animate-drift-c absolute bottom-[-14rem] left-1/4 h-[30rem] w-[30rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--accent-gold), transparent 70%)",
        }}
      />
      <div className="bg-grain absolute inset-0" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
