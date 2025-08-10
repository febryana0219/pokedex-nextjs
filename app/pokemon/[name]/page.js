import PokemonDetail from '../../../components/PokemonDetail'

export default async function Page(props) {
  const params = await props.params
  return <PokemonDetail name={params.name} />
}

