'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { typeColors } from '@/lib/typeColors'
import { ChevronRight } from 'lucide-react'

export default function PokemonDetail({ name }) {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [species, setSpecies] = useState(null)
  const [evolution, setEvolution] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about')
  const [backLoading, setBackLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const pokeData = await res.json()
        setData(pokeData)

        const speciesRes = await fetch(pokeData.species.url)
        const speciesData = await speciesRes.json()
        setSpecies(speciesData)

        const evoRes = await fetch(speciesData.evolution_chain.url)
        const evoData = await evoRes.json()
        setEvolution(evoData)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchData()
  }, [name])

  if (loading || !data || !species) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src="/gif/loading.gif" alt="Loading..." className="w-100 h-auto" />
      </div>
    )
  }

  if (backLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src="/gif/loading.gif" alt="Loading..." className="w-100 h-auto" />
      </div>
    )
  }

  const primaryType = data.types[0].type.name
  const bgGradient = typeColors[primaryType] || typeColors.default
  const img = data.sprites.other['official-artwork'].front_default

  const getEvolutionChain = () => {
    let chain = []
    let current = evolution.chain
    while (current) {
      chain.push(current.species)
      current = current.evolves_to[0]
    }
    return chain
  }

  return (
    <div className="max-w-4xl mx-auto space-y-0">
      {/* Header */}
      <div className={`text-center relative overflow-hidden rounded-t-lg shadow bg-gradient-to-br ${bgGradient}`}>
        <img
          src="/img/pokemon.png"
          alt="Pokemon background"
          className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
          style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
        />
        <div className="relative z-10 p-4 text-white">
          <h2 className="text-4xl font-bold capitalize">{data.name}</h2>
          <p className="text-lg font-mono">{String(data.id).padStart(4, '0')}</p>
          <div className="flex justify-center gap-2 mt-2">
            {data.types.map(t => (
              <span
                key={t.type.name}
                className="px-3 py-1 rounded-full text-white text-sm"
                style={{
                  backgroundColor: typeColors[t.type.name]?.split(' ')[1] || '#666',
                }}
              >
                {t.type.name}
              </span>
            ))}
          </div>
          <img
            src={img}
            alt={data.name}
            className="w-48 h-48 object-contain mx-auto relative z-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex">
        {['about', 'stats', 'evolution', 'moves'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold capitalize ${
              activeTab === tab
                ? `text-white bg-gradient-to-br ${bgGradient}`
                : 'text-black bg-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 rounded-b-lg shadow bg-white">
        {activeTab === 'about' && (
          <div className="space-y-4 text-black">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="font-bold py-2 w-32">Species</td>
                  <td>{species.genera.find(g => g.language.name === 'en')?.genus}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-bold py-2">Height</td>
                  <td>{data.height / 10} m</td>
                </tr>
                <tr className="border-b">
                  <td className="font-bold py-2">Weight</td>
                  <td>{data.weight / 10} kg</td>
                </tr>
                <tr className="border-b">
                  <td className="font-bold py-2">Abilities</td>
                  <td>{data.abilities.map(a => a.ability.name).join(', ')}</td>
                </tr>
              </tbody>
            </table>

            <h3 className="mt-6 text-xl font-bold border-b pb-1">Breeding</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="font-bold py-2 w-32">Gender</td>
                  <td>
                    <span className="text-blue-500">♂</span>{' '}
                    {Math.round(100 - species.gender_rate * 12.5)}% /{' '}
                    <span className="text-pink-500">♀</span>{' '}
                    {Math.round(species.gender_rate * 12.5)}%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-bold py-2">Egg Groups</td>
                  <td>{species.egg_groups.map(e => e.name).join(', ')}</td>
                </tr>
                <tr>
                  <td className="font-bold py-2">Egg Cycle</td>
                  <td>{species.hatch_counter} cycles</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-3 text-black">
            {data.stats.map(s => {
              const percentage = (s.base_stat / 255) * 100
              let barColor = ''
              if (s.base_stat <= 30) {
                barColor = 'bg-red-500'
              } else if (s.base_stat <= 60) {
                barColor = 'bg-yellow-500'
              } else if (s.base_stat <= 80) {
                barColor = 'bg-green-400'
              } else {
                barColor = 'bg-green-600'
              }

              return (
                <div key={s.stat.name} className="flex items-center gap-4">
                  <div className="capitalize w-28">{s.stat.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 ${barColor}`}
                      style={{
                        width: `${percentage}%`,
                        transition: 'width 0.5s ease-in-out'
                      }}
                    ></div>
                  </div>
                  <div className="w-10 text-right">{s.base_stat}</div>
                </div>
              )
            })}
          </div>
        )}


        {activeTab === 'evolution' && (
          <div className="flex items-center gap-4 flex-wrap justify-center text-black">
            {getEvolutionChain().map((poke, idx, arr) => (
              <div key={poke.name} className="flex items-center gap-4">
                <div className="text-center">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.url.split('/')[6]}.png`}
                    alt={poke.name}
                    className="w-24 h-24 object-contain mx-auto"
                  />
                  <p className="capitalize">{poke.name}</p>
                </div>
                {idx < arr.length - 1 && <ChevronRight size={24} />}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'moves' && (
          <ul className="columns-2 md:columns-3 lg:columns-4 gap-4 text-black">
            {data.moves.map(m => (
              <li key={m.move.name} className="capitalize">{m.move.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => {
          setBackLoading(true)
          setTimeout(() => {
            router.push('/')
          }, 800) // delay biar gif sempat terlihat
        }}
        className="block text-blue-500 mt-4"
      >
        ← Back to Pokédex
      </button>
    </div>
  )
}
