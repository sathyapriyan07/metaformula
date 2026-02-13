"use client";
import { useFavoritesStore, FavoriteType } from "../store/favorites";

interface FavoriteButtonProps {
  id: number;
  type: FavoriteType;
  name: string;
  className?: string;
}

export default function FavoriteButton({ id, type, name, className }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorited = isFavorite(id, type);

  const handleToggle = () => {
    if (favorited) {
      removeFavorite(id, type);
    } else {
      addFavorite({ id, type, name });
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors ${className || ""}`}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={`w-5 h-5 ${favorited ? "fill-red-500 text-red-500" : "text-white/60"}`}
        fill={favorited ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
