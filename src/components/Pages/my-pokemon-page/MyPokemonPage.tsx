import { useContext, useState } from "react";
import './MyPokemonPage.css'
import { AppContext } from "../../../App";
import { PokemonCard } from "../../pokemon-card/PokemonCard";
import { PokemonDetails } from "../../pokemon-details/PokemonDetails";
import { UserPerform } from "../../user-perform/UserPerform";
import { BATTLE_PAGE } from "../../../app-constants";
import { Button } from "../../button/Button";

export const MyPokemonPage: React.FC = () => {
    const context = useContext(AppContext);
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

    const pokemonData = (selectedIndex !== undefined) ? (context?.pokemonsData[selectedIndex]) : (undefined);
    const pokemonPerform = (selectedIndex !== undefined) ? (context?.team[selectedIndex].perform) : (undefined);

    function letsBattle() {
        setSelectedIndex(undefined);
        context?.changePage(BATTLE_PAGE);
    }

    return (
        <div className="my-pokemon-page">
            <div className="team-display">
                <div className="team-pokemons-display">
                {
                    context?.pokemonsData.map((pokemon, index) =>
                        (<PokemonCard 
                            key={index}
                            pokemonData={pokemon}
                            index={index}
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}/>))
                }
                </div>

                <div className="pokemon-details-display">
                    <PokemonDetails pokemonData={pokemonData} pokemonPerform={pokemonPerform} />
                </div>
            </div>

            <div className="lets-battle-button">
                <Button text='Lets Battle' func={letsBattle}/>
            </div>

            <div className="user-perform-display">
                <UserPerform perform={context?.userPerform} />
            </div>

        </div>
    );
}
