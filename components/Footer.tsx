import Link from "next/link";

export default function Footer({ text }: { text?: string }) {
  return (
    <footer className="max-w-7xl mx-auto px-8 py-12 mt-20">
      <div className="f1-panel rounded-lg p-6 space-y-4">
        {text && <div className="text-center text-sm text-white/60">{text}</div>}
        
        <div className="border-t border-white/10 pt-4 text-center text-xs text-white/50 space-y-2">
          <p>
            Historical Formula 1 data powered by{" "}
            <a 
              href="https://github.com/f1db/f1db" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-f1-red hover:text-f1-red-hover underline"
            >
              F1DB
            </a>.
          </p>
          <p>
            Licensed under{" "}
            <a 
              href="https://creativecommons.org/licenses/by/4.0/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline"
            >
              Creative Commons Attribution 4.0 (CC BY 4.0)
            </a>.
          </p>
          <p>Data modified for this project. This site is unofficial and not affiliated with Formula 1.</p>
          <p className="mt-4">
            <Link href="/about" className="text-white/70 hover:text-white underline">
              About & Attribution
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
