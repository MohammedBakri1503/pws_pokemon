import { POKEAPI_URL } from "../app-constants"
import { BaseStat, Move, PokemonData } from "../types";

/**
 * fetchPokemon: fetch pokemnon data by its id.
 * use with try-catch to handle errors.
 */
const fetchPokemon = async (id: number): Promise<PokemonData> => {
    const response = await fetch(POKEAPI_URL + id);
    const pokejson = await response.json();

    const newStats: BaseStat[] = pokejson.stats.map((stat: any) => ({
      stat_name: stat.stat.name,
      value: stat.base_stat
    }));

    const movesUrls = pokejson.moves.map((obj: any) => (obj.move.url));

    const newPokemon: PokemonData = {
      pokemon_id: pokejson.id,
      name: pokejson.name,
      height: pokejson.height,
      weight: pokejson.weight,
      type: pokejson.types[0].type.name,
      sprite: pokejson.sprites.other.dream_world.front_default,
      stats: newStats,

      moves_urls: movesUrls,
      moves_number: movesUrls.length,
    };

    return newPokemon;
}

export const fetchPokemons = async (
    pokemons_ids: number[],
    setPokemonsData: (value: PokemonData[]) => void,
    setLoading: (value: boolean) => void,
    setError: (value: string | undefined) => void,
) => {
    try {
      setLoading(true);
      setError(undefined);
      setPokemonsData([]);  // comment to prepare for new data while keeping the old data

      const pokemonsPromises = pokemons_ids.map((id) => fetchPokemon(id));
      const pokemonsData = await Promise.all(pokemonsPromises);

      setPokemonsData(pokemonsData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
}

/**
 * fetchMove: fetch move by move url.
 * use with try-catch to handle errors.
 */
const fetchMove = async (move_url: string): Promise<Move> => {
  const response = await fetch(move_url);
  const movejson = await response.json();

  const new_move: Move = {
    move_name: movejson.name,
    move_power: ((movejson.power !== null) ? movejson.power : 0)
  };

  return new_move;
}

export const fetchPokemonMoves = async (
  pokemon: PokemonData,
  selectedMovesIndexes: number[],
  setMoves: (value: Move[]) => void,
  setLoading: (value: boolean) => void,
  setError: (value: string | undefined) => void,
) => {
  try {
    setLoading(true);
    setError(undefined);
    setMoves([]);  // comment to prepare for new data while keeping the old data

    /*const response = await fetch(POKEAPI_URL + pokemon_id);
    const pokejson = await response.json();

    const pokemonMoves = pokejson.moves;
    const selectedMovesIndexes = getRandomNumbers(0, pokemonMoves.length - 1, moves_number);*/

    const selectedMovesPromises = selectedMovesIndexes.map((index: number) => fetchMove(pokemon.moves_urls[index]))
    const selectedMoves = await Promise.all(selectedMovesPromises);

    setMoves(selectedMoves);
  } catch (error: any) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
