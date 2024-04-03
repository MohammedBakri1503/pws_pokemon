import './PokemonDetails.css'
import { Perform, PokemonData } from "../../types";
import { POKEMON_WORD } from '../../app-constants';

export interface PokemonDetailsProps {
    pokemonData: PokemonData | undefined;
    pokemonPerform: Perform | undefined;
}

export const PokemonDetails: React.FC<PokemonDetailsProps> = ({
    pokemonData,
    pokemonPerform,
  }) => {
    if (pokemonData && pokemonPerform) {
        const totalGames = pokemonPerform.wins + pokemonPerform.losses;
        const winRate = (totalGames > 0) ? ((pokemonPerform.wins / totalGames) * 100) : 0;
        const winRateText = winRate.toFixed(2);
        const winRateClass = (winRate >= 50) ? ('good-win-rate') : ('bad-win-rate');

        return (
            <div className="pokemon-details">
                <div className="pokemon-name">
                    {pokemonData.name}
                </div>

                <div className='details-display'>
                    <div className="pokemon-data">
                        <div className="pokemon-general">
                            <ul>
                                <li key="type">Type: {pokemonData.type}</li>
                                <li key="height">Height: {pokemonData.height} dm</li>
                                <li key="weight">Weight: {pokemonData.weight} hg</li>
                            </ul>
                        </div>

                        <div className="pokemon-stats">
                            <ul>
                            Stats:
                                {pokemonData.stats.map(stat => (
                                    <li key={stat.stat_name}> {stat.stat_name + ": " + stat.value} </li>
                                ))}
                            </ul>    
                        </div>
                    </div>

                    <div className="pokemon-perform">
                        <ul>
                            <li className="pokemon-wins" key="wins">Wins: {pokemonPerform.wins}</li>
                            <li className="pokemon-losses" key="losses">Losses: {pokemonPerform.losses}</li>
                            <li className="pokemon-rate" key={winRateClass}>{winRateText}% Win Rate</li>
                        </ul>
                    </div>
                </div>
            </div>);
    } else {
        return (
            <div className="no-details">
                No {POKEMON_WORD} Selected
            </div>);
    }
  };
