"use client";
import Image from "next/image";
import Link from "next/link";
import { typeColors } from "@/lib/typeColors";

// Mapping warna background berdasarkan tipe pertama
export default function PokemonCard({ pokemon }) {
  const type = pokemon.types[0].type.name;
  const bgColor = typeColors[type] || typeColors.default;
  const id = pokemon.id.toString().padStart(4, "0");

  return (
    <Link href={`/pokemon/${pokemon.name}`}>
      <div
        className={`relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group h-55 pb-4 ${bgColor}`}
      >
        {/* Overlay putih transparan kanan */}
        <div className="absolute top-0 right-0 h-full w-1/3 bg-white/40"></div>

        {/* Kode Pokémon */}
        <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {id}
        </div>

        {/* Nama Pokémon */}
        <div className="p-4 relative z-10">
          <h2 className="text-4xl font-bold text-white truncate">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h2>

          {/* Badge tipe */}
          <div className="flex gap-2 mt-2">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="bg-black/80 text-white text-sm px-3 py-1 rounded-full"
              >
                {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
              </span>
            ))}
          </div>
        </div>

        {/* Gambar Pokémon */}
        <div className="absolute bottom-0 right-2 z-10">
          <Image
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            width={150}
            height={150}
            className="drop-shadow-lg"
          />
        </div>
      </div>
    </Link>
  );
}