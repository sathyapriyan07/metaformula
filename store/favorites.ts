"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FavoriteType = "driver" | "team" | "circuit" | "season";

export interface Favorite {
  id: number;
  type: FavoriteType;
  name: string;
  addedAt: number;
}

interface FavoritesStore {
  favorites: Favorite[];
  addFavorite: (item: Omit<Favorite, "addedAt">) => void;
  removeFavorite: (id: number, type: FavoriteType) => void;
  isFavorite: (id: number, type: FavoriteType) => boolean;
  getFavoritesByType: (type: FavoriteType) => Favorite[];
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (item) => {
        const { favorites } = get();
        if (favorites.length >= 50) return;
        if (favorites.some((f) => f.id === item.id && f.type === item.type)) return;
        set({ favorites: [...favorites, { ...item, addedAt: Date.now() }] });
      },
      removeFavorite: (id, type) => {
        set({ favorites: get().favorites.filter((f) => !(f.id === id && f.type === type)) });
      },
      isFavorite: (id, type) => {
        return get().favorites.some((f) => f.id === id && f.type === type);
      },
      getFavoritesByType: (type) => {
        return get().favorites.filter((f) => f.type === type);
      },
    }),
    {
      name: "f1-favorites",
    }
  )
);
