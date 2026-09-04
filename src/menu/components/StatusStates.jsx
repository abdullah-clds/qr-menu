export const LoadingState = () => (
  <div className="mx-auto max-w-2xl animate-pulse px-6 pb-10 pt-9">
    <div className="flex flex-col items-center gap-3">
      <div className="size-12 rounded-full bg-menu-ink/10" />
      <div className="h-4 w-40 rounded bg-menu-ink/10" />
      <div className="h-2.5 w-20 rounded bg-menu-ink/10" />
    </div>

    <div className="mt-7 flex gap-5 border-b border-menu-line pb-3">
      <div className="h-3 w-16 rounded bg-menu-ink/10" />
      <div className="h-3 w-20 rounded bg-menu-ink/10" />
      <div className="h-3 w-14 rounded bg-menu-ink/10" />
    </div>

    <div className="mt-6 flex flex-col gap-5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 border-b border-menu-line pb-5">
          <div className="size-[76px] shrink-0 rounded-md bg-menu-ink/10" />
          <div className="flex-1">
            <div className="h-3.5 w-2/3 rounded bg-menu-ink/10" />
            <div className="mt-2.5 h-2.5 w-full rounded bg-menu-ink/10" />
            <div className="mt-1.5 h-2.5 w-4/5 rounded bg-menu-ink/10" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
    <p className="font-display text-lg uppercase tracking-wide text-menu-ink">
      Menü şu anda görüntülenemiyor
    </p>
    <p className="max-w-xs text-sm text-menu-muted">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-2 border-b border-menu-ink pb-0.5 text-sm font-medium text-menu-ink"
    >
      Tekrar dene
    </button>
  </div>
);

export const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center gap-2 px-6 py-20 text-center">
    <p className="font-display text-lg uppercase tracking-wide text-menu-ink">{message}</p>
  </div>
);
