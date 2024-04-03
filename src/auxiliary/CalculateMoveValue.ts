import { PokemonData } from '../types';

export function calculateTotalPower (pokemon_attacker: PokemonData, pokemon_defender: PokemonData, MP: number) {
    const BASE_ATTACK_INDEX: number = 1;
    const BASE_DEFENSE_INDEX = 2;

    const PA = pokemon_attacker.stats[BASE_ATTACK_INDEX].value;
    const PD = pokemon_defender.stats[BASE_DEFENSE_INDEX].value;

    const attacker_type = pokemon_attacker.type;
    const defender_type = pokemon_defender.type;

    const matrix = [[1,1,1,1,1,1,1,1,1,1,1,1,0.5,0,1,1,0.5,1],
    [1,0.5,0.5,1,2,2,1,1,1,1,1,2,0.5,1,0.5,1,2,1],
    [1,2,0.5,1,0.5,1,1,1,2,1,1,1,2,1,0.5,1,1,1],
    [1,1,2,0.5,0.5,1,1,1,0,2,1,1,1,1,0.5,1,1,1],
    [1,0.5,2,1,0.5,1,1,0.5,2,0.5,1,0.5,2,1,0.5,1,0.5,1],
    [1,0.5,0.5,1,2,0.5,1,1,2,2,1,1,1,1,2,1,0.5,1],
    [2,1,1,1,1,2,1,0.5,1,0.5,0.5,0.5,2,0,1,2,2,0.5],
    [1,1,1,1,2,1,1,0.5,0.5,1,1,1,0.5,0.5,1,1,0,2],
    [1,2,1,2,0.5,1,1,2,1,0,1,0.5,2,1,1,1,2,1],
    [1,1,1,0.5,2,1,2,1,1,1,1,2,0.5,1,1,1,0.5,1],
    [1,1,1,1,1,1,2,2,1,1,0.5,1,1,1,1,0,0.5,1],
    [1,0.5,1,1,2,1,0.5,0.5,1,0.5,2,1,1,0.5,1,2,0.5,0.5],
    [1,2,1,1,1,2,0.5,1,0.5,2,1,2,1,1,1,1,0.5,1],
    [0,1,1,1,1,1,1,1,1,1,2,1,1,2,1,0.5,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,0.5,0],
    [1,1,1,1,1,1,0.5,1,1,1,2,1,1,2,1,0.5,1,0.5],
    [1,0.5,0.5,0.5,1,2,1,1,1,1,1,1,2,1,1,1,0.5,2],
    [1,0.5,1,1,1,1,2,0.5,1,1,1,1,1,1,2,2,0.5,1]];

    const types = ['normal','fire','water','electric','grass','ice','fighting','poison','ground',
                    'flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
    const attacker = types.indexOf(attacker_type);
    const defender = types.indexOf(defender_type);

    const TF = matrix[attacker][defender];

    return (MP + PA) * TF - PD;
}
