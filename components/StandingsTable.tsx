import Image from "next/image";

export interface StandingsRow {
  id: number;
  position: number;
  name: string;
  team: string;
  points: number;
  wins: number;
  image_url?: string | null;
  team_logo_url?: string | null;
}

export default function StandingsTable({ rows }: { rows: StandingsRow[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/80 p-6 shadow-glass">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Pos</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Name</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Team</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Points</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Wins</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 transition-all hover:bg-white/5">
                <td className="px-3 py-4 text-sm text-white/90">{row.position}</td>
                <td className="px-3 py-4 text-sm text-white/90">
                  <div className="flex items-center gap-2">
                    {row.image_url ? (
                      <Image src={row.image_url} alt={row.name} width={28} height={28} className="h-7 w-7 rounded-full object-cover" unoptimized />
                    ) : (
                      <span className="h-7 w-7 rounded-full border border-white/15 bg-white/5" />
                    )}
                    <span>{row.name}</span>
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-white/90">
                  <div className="flex items-center gap-2">
                    {row.team_logo_url ? (
                      <Image src={row.team_logo_url} alt={row.team} width={80} height={22} className="h-5 w-auto max-w-[90px] object-contain" unoptimized />
                    ) : null}
                    <span>{row.team}</span>
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-white/90">{row.points}</td>
                <td className="px-3 py-4 text-sm text-white/90">{row.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.14em] text-white/60">Pos {row.position}</span>
              <span className="text-sm text-white/70">{row.points} pts</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
              {row.image_url ? (
                <Image src={row.image_url} alt={row.name} width={24} height={24} className="h-6 w-6 rounded-full object-cover" unoptimized />
              ) : (
                <span className="h-6 w-6 rounded-full border border-white/15 bg-white/5" />
              )}
              <span>{row.name}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-white/90">
              {row.team_logo_url ? (
                <Image src={row.team_logo_url} alt={row.team} width={72} height={20} className="h-5 w-auto object-contain" unoptimized />
              ) : null}
              <span>{row.team}</span>
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.14em] text-white/60">Wins: <span className="normal-case tracking-normal text-white/90">{row.wins}</span></div>
          </article>
        ))}
      </div>
      {!rows.length ? <p className="text-sm text-white/70">No standings added for this season yet.</p> : null}
    </section>
  );
}
