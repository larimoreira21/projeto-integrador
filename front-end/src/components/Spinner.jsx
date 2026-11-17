import { LoaderCircle } from 'lucide-react';

export function Spinner({ className = 'h-5 w-5' }) {
  return <LoaderCircle className={`animate-spin ${className}`} aria-hidden="true" />;
}

export function SkeletonCards({ quantidade = 3 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: quantidade }, (_, indice) => (
        <div key={indice} className="h-40 animate-pulse rounded-2xl bg-white" />
      ))}
    </div>
  );
}
