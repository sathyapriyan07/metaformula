"use client";
import { useFavoritesStore } from "../../store/favorites";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoritesStore();

  const getLink = (type: string, id: number) => {
    switch (type) {
      case "driver": return `/drivers/${id}`;
      case "team": return `/teams/${id}`;
      case "circuit": return `/circuits/${id}`;
      case "season": return `/seasons/${id}`;
      default: return "/";
    }
  };

  const typeLabels: Record<string, string> = {
    driver: "Driver",
    team: "Team",
    circuit: "Circuit",
    season: "Season",
  };

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto px-8 py-16 space-y-12">
        <div>
          <h1 className="section-title">Favorites</h1>
          <p className="mt-4 text-white/60">Your saved items ({favorites.length}/50)</p>
        </div>

        {favorites.length === 0 ? (
          <Card className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">No favorites yet</h2>
            <p className="text-white/50">Start adding your favorite drivers, teams, and circuits</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <Card key={`${fav.type}-${fav.id}`} className="flex items-center justify-between">
                <Link href={getLink(fav.type, fav.id)} className="flex-1">
                  <div className="text-xs text-white/50 mb-1">{typeLabels[fav.type]}</div>
                  <div className="text-lg font-semibold">{fav.name}</div>
                </Link>
                <button
                  onClick={() => removeFavorite(fav.id, fav.type)}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer text="Your personal F1 collection" />
    </div>
  );
}
