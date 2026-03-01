"use client";

import Image from "next/image";

interface DriverCardProps {
  id: number;
  name: string;
  number: string;
  imageUrl?: string | null;
  teamName?: string | null;
  teamLogoUrl?: string | null;
}

export default function DriverCard({ name, number, imageUrl, teamName, teamLogoUrl }: DriverCardProps) {
  return (
    <article className="group h-full rounded-2xl border border-white/10 bg-[#111111] p-6 transition-all duration-200 ease-out hover:scale-105 hover:border-f1-red/50 hover:shadow-lg hover:shadow-f1-red/20">
      <div className="relative mb-5 h-52 overflow-hidden rounded-xl bg-black/60 md:h-56">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover object-top transition-transform duration-200 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
        )}
      </div>

      <div className="space-y-2">
        <h3 className="line-clamp-1 text-xl font-black uppercase tracking-wide text-white">{name}</h3>
        <p className="text-4xl font-black leading-none text-f1-red">{number}</p>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3">
          {teamLogoUrl ? (
            <Image src={teamLogoUrl} alt={teamName ?? "Team"} width={84} height={28} className="h-7 w-auto object-contain" unoptimized />
          ) : null}
          <p className="line-clamp-1 text-sm text-white/65">{teamName ?? "Independent"}</p>
        </div>
      </div>
    </article>
  );
}
