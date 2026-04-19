import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-16">
      <div className="bg-white border border-sand rounded-2xl p-12 text-center max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">404</p>
        <h1 className="font-serif text-4xl text-forest mb-6">Page not found</h1>
        <p className="text-slate mb-8">The route does not exist in the current Career Arth deployment.</p>
        <Link href="/" className="inline-block px-8 py-4 bg-forest text-ivory text-sm font-medium rounded tracking-wide btn-primary">
          Return Home
        </Link>
      </div>
    </main>
  );
}
