export const LoadingState = () => (
  <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6">
    <div className="h-6 w-32 rounded bg-menu-text/10" />
    <div className="mt-2 h-3 w-56 rounded bg-menu-text/10" />
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="aspect-[8/5] w-full rounded-menu-card bg-menu-text/10" />
      ))}
    </div>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
    <p className="font-display text-lg font-bold text-menu-text">Menü şu anda görüntülenemiyor</p>
    <p className="max-w-xs text-sm text-menu-text-muted">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-2 border-b border-menu-text pb-0.5 text-sm font-medium text-menu-text"
    >
      Tekrar dene
    </button>
  </div>
);

export const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
    <p className="text-sm text-menu-text-muted">{message}</p>
  </div>
);
