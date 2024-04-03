import { createContext, useContext, useEffect, useState } from "react";
import './BattlePage.css'
import { AppContext } from "../../../App";
import { getRandomNumber, getRandomTeamIds } from "../../../auxiliary/Randoms";
import { Move, Pokemon, PokemonData } from "../../../types";
import { fetchPokemons } from "../../../auxiliary/ApiRequests";
import { PokemonCard } from "../../pokemon-card/PokemonCard";
import { Status } from "../../status/Status";
import { MovesPanel } from "../../moves-panel/MovesPanel";
import { Arena } from "../../arena/Arena";
import { PICK_MOVE_WAIT_TIME, PICK_POKEMON_WAIT_TIME } from "../../../app-constants";

export interface BattleContext {
    setUserTeam: (new_team: Pokemon[]) => void;
    userTeam: Pokemon[];
    invalidateUserIndex: (index: number | undefined) => void;
    userSelectedIndex: number | undefined;
    setUserSelectedIndex: (index: number | undefined) => void;
    userSelectedMove: Move | undefined;
    setUserSelectedMove: (move: Move | undefined) => void;

    opponentPokemonsData: PokemonData[];
    opponentTeam: number[];
    invalidateOpponentIndex: (index: number | undefined) => void;
    opponentSelectedIndex: number | undefined;
    setOpponentSelectedIndex: (index: number | undefined) => void;
    opponentSelectedMove: Move | undefined;
    setOpponentSelectedMove: (move: Move | undefined) => void;
}

export const BattleContext = createContext<BattleContext | null>(null);

function trueArray(length: number): boolean[] {
    return Array.from({ length }, () => true);
}

function Battle() {  
    const context = useContext(AppContext);
    if (context !== null) {
        const [userTeam, setUserTeam] = useState<Pokemon[]>(context.team);
        const [userAvailable, setUserAvailable] = useState<boolean[]>(trueArray(userTeam.length));

        const [opponentTeam, setOpponentTeam] = useState<number[]>([]);
        const [opponentAvailable, setOpponentAvailable] = useState<boolean[]>([]);
    
        const [opponentPokemonsData, setOpponentPokemonsData] = useState<PokemonData[]>([]);
        const [opponentPokemonsLoading, setOpponentPokemonsLoading] = useState<boolean>(false);
        const [opponentPokemonsError, setOpponentPokemonsError] = useState<string | undefined>(undefined);

        const [userSelectedIndex, setUserSelectedIndex] = useState<number | undefined>(undefined);
        const [userSelectedMove, setUserSelectedMove] = useState<Move | undefined>(undefined);

        const [opponentSelectedIndex, setOpponentSelectedIndex] = useState<number | undefined>(undefined);
        const [opponentSelectedMove, setOpponentSelectedMove] = useState<Move | undefined>(undefined);
        const [opponentAvailableMoves, setOpponentAvailableMoves] = useState<Move[]>([]);

        // generate new pokemon team ids for the opponent
        useEffect(() => {
            const newTeam = getRandomTeamIds();
            setOpponentTeam(newTeam);
            setOpponentAvailable(trueArray(newTeam.length));
        }, []);

        function fetchOpponentPokemons() {
            fetchPokemons(opponentTeam, setOpponentPokemonsData, setOpponentPokemonsLoading, setOpponentPokemonsError);
        }

        // Fetch opponent pokemons data (name, sprite, stats...).
        useEffect(() => {
            fetchOpponentPokemons();

            return () => {
                setOpponentPokemonsData([]);
            }
        }, [opponentTeam]);

        // When the user selects a pokemon, the opponent also selects one.
        useEffect(() => {
            const opponentPickPokemon = () => {
                const true_indexes: number[] = opponentAvailable
                .map((value, index) => (value ? index : -1))
                .filter((index) => index !== -1);

                if (true_indexes.length === 0) {
                    // no available pokemons
                    setOpponentSelectedIndex(undefined);
                } else {
                    // pick random available pokemon
                    setOpponentSelectedIndex(true_indexes[getRandomNumber(0, true_indexes.length - 1)]);
                }
            }

            if (userSelectedIndex !== undefined) {
                const pickPokemonTimeout = setTimeout(() => {
                    //opponent select index
                    opponentPickPokemon();
                }, PICK_POKEMON_WAIT_TIME);

                return () => {
                    clearTimeout(pickPokemonTimeout);
                    setOpponentSelectedIndex(undefined);
                };
            } 
        }, [userSelectedIndex, opponentAvailable]);

        // When the user selects its move, the opponent selects a counter move from available moves.
        useEffect(() => {
            const opponentPickMove = () => {
                if (opponentAvailableMoves.length === 0) {
                    // no available moves
                    setOpponentSelectedMove(undefined);
                } else {
                    // pick random available move
                    setOpponentSelectedMove(opponentAvailableMoves[getRandomNumber(0, opponentAvailableMoves.length - 1)]);
                }
            }

            if (userSelectedMove !== undefined) {
                const pickMoveTimeout = setTimeout(() => {
                    //opponent select move from available
                    opponentPickMove();
                }, PICK_MOVE_WAIT_TIME);

                return () => {
                    clearTimeout(pickMoveTimeout);
                    setOpponentSelectedMove(undefined);
                };
            }
        }, [userSelectedMove, opponentAvailableMoves]);

        const setIndexToFalse =
            (arr: boolean[], setArr: (newArr: boolean[]) => void, index: number | undefined): void => {
                if (index !== undefined) {
                    const newArr = [...arr];
                    newArr[index] = false;
                    setArr(newArr);
                }
        };

        const battleContextValue: BattleContext = {
            setUserTeam: setUserTeam,
            userTeam: userTeam,
            invalidateUserIndex: (index: number | undefined) => setIndexToFalse(userAvailable, setUserAvailable, index),
            userSelectedIndex: userSelectedIndex,
            setUserSelectedIndex: setUserSelectedIndex,
            userSelectedMove: userSelectedMove,
            setUserSelectedMove: setUserSelectedMove,

            opponentPokemonsData: opponentPokemonsData,
            opponentTeam: opponentTeam,
            invalidateOpponentIndex: (index: number | undefined) => setIndexToFalse(opponentAvailable, setOpponentAvailable, index),
            opponentSelectedIndex: opponentSelectedIndex,
            setOpponentSelectedIndex:  setOpponentSelectedIndex,
            opponentSelectedMove: opponentSelectedMove,
            setOpponentSelectedMove: setOpponentSelectedMove,
        }

        let battleElement, userElement, opponentElement;
        if (opponentPokemonsLoading || opponentPokemonsError) {
            battleElement = (
                <div className="battle-display">
                    <Status loading={opponentPokemonsLoading} errorMessage={opponentPokemonsError} onRetry={fetchOpponentPokemons} />
                </div>
            )
        } else {
            if ((userSelectedIndex === undefined) || (opponentSelectedIndex === undefined)) {
                userElement = context.pokemonsData.map((pokemon, index) => (
                    <div key={index} className="user-pokemon-display">
                        <div className="user-pokemon-name">{pokemon.name}</div>
                        <div className="user-pokemon-card">
                            <PokemonCard
                                pokemonData={pokemon}
                                index={index}
                                selectedIndex={userSelectedIndex}
                                setSelectedIndex={setUserSelectedIndex}
                                enabled={userAvailable[index] && (userSelectedIndex === undefined)}/>
                        </div>
                    </div>
                ))
            } else {
                const pokemon: PokemonData = context.pokemonsData[userSelectedIndex];
                userElement = (
                    <div className="user-selected-display">
                        <div className="user-pokemon-display">
                            <div className="user-pokemon-name">{pokemon.name}</div>
                            <div className="user-pokemon-card">
                                <PokemonCard
                                pokemonData={pokemon}
                                index={userSelectedIndex}
                                selectedIndex={userSelectedIndex} />
                            </div>
                        </div>
    
                        <div className="moves-panel">
                            <MovesPanel pokemon={pokemon}
                                enabled={(userSelectedMove === undefined) && (opponentAvailableMoves.length !== 0)}
                                setMove={setUserSelectedMove} />
                        </div>
                    </div>
                )
            }
    
           if ((userSelectedIndex === undefined) || (opponentSelectedIndex === undefined)) {
                opponentElement = opponentPokemonsData.map((pokemon, index) => (
                    <div key={index} className="opponent-pokemon-display">
                        <div className="opponent-pokemon-name">{pokemon.name}</div>
                        <div className="opponent-pokemon-card">
                            <PokemonCard
                                pokemonData={pokemon}
                                index={index}
                                selectedIndex={opponentSelectedIndex}
                                enabled={opponentAvailable[index]}/>
                        </div>
                    </div>
                ))
            } else {
                const pokemon: PokemonData = opponentPokemonsData[opponentSelectedIndex];
                opponentElement = (
                    <div className="opponent-selected-display">
                        <div className="opponent-pokemon-display">
                            <div className="opponent-pokemon-name">{pokemon.name}</div>
    
                            <div className="opponent-pokemon-card">
                                <PokemonCard
                                    pokemonData={pokemon}
                                    index={opponentSelectedIndex}
                                    selectedIndex={opponentSelectedIndex} />
                            </div>
                        </div>
    
                        <div className="moves-panel">
                            <MovesPanel pokemon={pokemon}
                                enabled={false}
                                setAvailableMoves={setOpponentAvailableMoves} />
                        </div>
                    </div>
                )
            }

            battleElement = (
                <div className="battle-display">
                    <div className="opponent-display">
                        {opponentElement}
                    </div>

                    <div className="arena-display">
                        <Arena />
                    </div>

                    <div className="user-display">
                        {userElement}
                    </div>
                </div>
            )
        }

        return (
            <BattleContext.Provider value={battleContextValue}>
                {battleElement}
            </BattleContext.Provider>
        )

    }

    return null;
}

export default Battle
