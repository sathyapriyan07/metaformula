import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <div>
      <Navigation />
      <main className="max-w-4xl mx-auto px-8 py-16 space-y-12">
        <div>
          <h1 className="section-title red-accent pb-4">ABOUT</h1>
          <p className="mt-6 text-white/70 text-lg">
            F1 Historical Archive is an unofficial Formula 1 database showcasing historical racing data.
          </p>
        </div>

        <section className="f1-panel rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold uppercase tracking-f1">Data Source & Attribution</h2>
          
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>
              Historical Formula 1 data is powered by{" "}
              <a 
                href="https://github.com/f1db/f1db" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-f1-red hover:text-f1-red-hover underline font-semibold"
              >
                F1DB
              </a>, an open-source Formula 1 database.
            </p>

            <p>
              The F1DB dataset is licensed under{" "}
              <a 
                href="https://creativecommons.org/licenses/by/4.0/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-f1-red hover:text-f1-red-hover underline font-semibold"
              >
                Creative Commons Attribution 4.0 International (CC BY 4.0)
              </a>.
            </p>

            <div className="bg-black/40 border border-white/10 rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-bold text-f1-red">License Summary</h3>
              <p className="text-sm">
                You are free to:
              </p>
              <ul className="text-sm space-y-2 ml-6 list-disc">
                <li><strong>Share</strong> — copy and redistribute the material in any medium or format</li>
                <li><strong>Adapt</strong> — remix, transform, and build upon the material for any purpose</li>
              </ul>
              <p className="text-sm mt-4">
                Under the following terms:
              </p>
              <ul className="text-sm space-y-2 ml-6 list-disc">
                <li><strong>Attribution</strong> — You must give appropriate credit, provide a link to the license, and indicate if changes were made</li>
              </ul>
            </div>

            <p>
              <strong>Modifications:</strong> The data has been imported, normalized, and adapted for use in this web application. 
              Additional fields, relationships, and computed statistics have been added.
            </p>

            <p>
              <strong>Original Source:</strong>{" "}
              <a 
                href="https://github.com/f1db/f1db" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white underline"
              >
                https://github.com/f1db/f1db
              </a>
            </p>
          </div>
        </section>

        <section className="f1-panel rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold uppercase tracking-f1">Disclaimer</h2>
          
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>
              This website is <strong>unofficial</strong> and is <strong>not affiliated with, endorsed by, or connected to</strong> Formula 1, 
              Formula One Management, FIA, or any Formula 1 teams, drivers, or sponsors.
            </p>

            <p>
              Formula 1, F1, and related marks are trademarks of Formula One Licensing BV. 
              This site uses publicly available historical data for educational and informational purposes only.
            </p>

            <p>
              No official Formula 1 logos, copyrighted images, or proprietary assets are used on this website.
            </p>
          </div>
        </section>

        <section className="f1-panel rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold uppercase tracking-f1">Technology</h2>
          
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>Built with:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Next.js 15 (React 18, App Router)</li>
              <li>Supabase (PostgreSQL database)</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </section>

        <section className="f1-panel rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold uppercase tracking-f1">Contact</h2>
          
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>
              For questions about data attribution, licensing, or this project, please refer to the{" "}
              <a 
                href="https://github.com/f1db/f1db" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-f1-red hover:text-f1-red-hover underline"
              >
                F1DB repository
              </a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
