import { MOVES_NUMBER, POKEMONS_LIMIT, POKEMONS_NUMBER } from "../app-constants";
import { PokemonData } from "../types";


/**
 * getRandomNumber: returns a random number between lower_bound and upper_bound (inclusive).
 */
export function getRandomNumber(lower_bound: number, upper_bound: number): number {
    if (lower_bound > upper_bound) {
        return 0;
    }

    return Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound;
}

/**
 * getRandomNumbers: returns an array of length total of random numbers within the range [lower_bound, upper_bound].
 * If not enough numbers, returns all the numbers in the range [lower_bound, upper_bound].
 */
export function getRandomNumbers(lower_bound: number, upper_bound: number, total: number): number[] {
    if (lower_bound > upper_bound) {
        return [];
    }

    const rangeSize = upper_bound - lower_bound + 1;

    if (total > rangeSize) {
        // Return all numbers in the range [lower_bound, upper_bound]
        return Array.from({ length: rangeSize }, (_, index) => lower_bound + index);
    }

    const uniqueNumbers: Set<number> = new Set();
    while (uniqueNumbers.size < total) {
        uniqueNumbers.add(getRandomNumber(lower_bound, upper_bound));
    }

    return Array.from(uniqueNumbers);
}


export function getRandomTeamIds(): number[] {
    return getRandomNumbers(1, POKEMONS_LIMIT, POKEMONS_NUMBER);
}

export function getRandomMovesIndexes(pokemon: PokemonData): number[] {
    return getRandomNumbers(0, pokemon.moves_number - 1, MOVES_NUMBER);
}
