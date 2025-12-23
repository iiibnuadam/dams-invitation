export default function Footer() {
  return (
    <footer className="py-12 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-6 space-y-4">
            <h2 className="font-heading text-2xl">Sasti & Adam</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">17 . 07 . 26</p>
            <div className="pt-8">
                <p className="text-xs text-white/30">
                    Built with <span className="text-red-400">♥</span> using Next.js & Shadcn UI
                </p>
            </div>
        </div>
    </footer>
  );
}
