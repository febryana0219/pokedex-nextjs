'use client'
import { useEffect, useState } from 'react'
import PokemonCard from "@/components/PokemonCard"
import Image from "next/image"

export default function Page() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)

  async function getPokemons(limit = 16, offset = 0) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    const json = await res.json()
    return json.results // hanya simpan nama + URL
  }

  async function getPokemonDetails(list) {
    return Promise.all(
      list.map(async (p) => {
        const r = await fetch(p.url)
        return r.json()
      })
    )
  }

  // Load pertama
  useEffect(() => {
    async function fetchData() {
      const savedList = localStorage.getItem('pokemonList')
      const savedOffset = localStorage.getItem('offset')

      if (savedList && savedOffset) {
        const list = JSON.parse(savedList)
        const details = await getPokemonDetails(list)
        setPokemons(details)
        setOffset(parseInt(savedOffset))
        setLoading(false)
      } else {
        setLoading(true)
        const list = await getPokemons(16, 0)
        const details = await getPokemonDetails(list)
        setPokemons(details)
        setOffset(16)

        localStorage.setItem('pokemonList', JSON.stringify(list))
        localStorage.setItem('offset', '16')
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handler Show More
  async function handleShowMore() {
    setLoadingMore(true)
    const moreList = await getPokemons(16, offset)
    const moreDetails = await getPokemonDetails(moreList)
    const newPokemons = [...pokemons, ...moreDetails]

    setPokemons(newPokemons)
    const newOffset = offset + 16
    setOffset(newOffset)

    // Simpan hanya nama + URL
    const savedList = JSON.parse(localStorage.getItem('pokemonList') || '[]')
    const updatedList = [...savedList, ...moreList]
    localStorage.setItem('pokemonList', JSON.stringify(updatedList))
    localStorage.setItem('offset', String(newOffset))
    setLoadingMore(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div className="w-100">
          <Image
            src="/gif/loading.gif.gif"
            alt="Loading..."
            width={0}
            height={0}
            sizes="100vw"
            unoptimized
            priority
            className="w-full h-auto"
            style={{ aspectRatio: 'auto' }}
          />
        </div>
      </div>
    )
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Image
            src="/img/pokemon_1169608.png"
            alt="Pokémon Logo"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
          <h1 className="text-2xl md:text-4xl font-bold">Pokédex</h1>
        </div>
      </header>

      {/* Grid 4x4 */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        {pokemons.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </section>

      {/* Show More Button */}
      <div className="flex justify-center">
        <button
          onClick={handleShowMore}
          disabled={loadingMore}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loadingMore ? 'Loading...' : 'Show More'}
        </button>
      </div>
    </main>
  )
}
