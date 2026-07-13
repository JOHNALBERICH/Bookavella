export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-text-primary gap-4">
      <h1 className="font-heading text-4xl font-bold text-accent">404</h1>
      <p className="text-text-secondary">Page not found</p>
      <a href="/" className="text-accent hover:text-accent-hover underline">
        Back to Home
      </a>
    </div>
  );
}