export interface PokemonData {
    pokemon_id: number;
    name: string;
    height: number;
    weight: number;
    type: string;
    sprite: string;
    stats: BaseStat[];

    moves_urls: string[];
    moves_number: number;
}

export interface BaseStat {
    stat_name: string;
    value: number;
}

export interface Perform {
    wins: number;
    losses: number;
}

export interface Pokemon {
    pokemon_id: number;
    perform: Perform;
}

export interface Move {
    move_name: string;
    move_power: number;
}

export interface Move {
    move_name: string;
    move_power: number;
}
