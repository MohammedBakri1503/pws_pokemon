import { useEffect, useState } from "react";
import './MovesPanel.css'
import { Move, PokemonData } from "../../types";
import { fetchPokemonMoves } from "../../auxiliary/ApiRequests";
import { Status } from "../status/Status";
import { Button } from "../button/Button";
import { getRandomMovesIndexes } from "../../auxiliary/Randoms";

export interface MovesPanelProps {
    pokemon: PokemonData;
    enabled: boolean,
    setMove?: (move: Move | undefined) => void;
    setAvailableMoves?: (moves: Move[]) => void;
}

export const  MovesPanel: React.FC<MovesPanelProps> = ({
    pokemon,
    enabled,
    setMove,
    setAvailableMoves,
}) => {

    const [movesIndexes, setMovesIndexes] = useState<number[]>([]);
    const [selectedMoves, setSelectedMoves] = useState<Move[]>([]);
    const [movesLoading, setMovesLoading] = useState<boolean>(false);
    const [movesError, setMovesError] = useState<string | undefined>(undefined);

    // get random moves indexes of pokemon
    useEffect(() => {
        const randomIndexes = getRandomMovesIndexes(pokemon);
        setMovesIndexes(randomIndexes);

        return () => {
            setMovesIndexes([]);
        }
    }, [pokemon]);

    function fetchMoves() {
        fetchPokemonMoves(pokemon, movesIndexes, setSelectedMoves, setMovesLoading, setMovesError);
    }

    useEffect(() => {
        // moves fetched according to moves indexes of pokemon
        if (movesIndexes.length > 0) {
            fetchMoves();

            return () => {
                setSelectedMoves([]);
            }
        }
    }, [pokemon, movesIndexes]);

    useEffect(() => {
        if (setAvailableMoves !== undefined) {
            // update available moves according to the selected moves
            setAvailableMoves(selectedMoves);

            return () => {
                setAvailableMoves([]);
            }
        }
    }, [selectedMoves]);

    let panelElement;
    if (movesLoading || movesError) {
        panelElement = (
            <div className="panel-status">
                <Status loading={movesLoading} errorMessage={movesError} onRetry={fetchMoves} />
            </div>
        )
    } else {
        
        panelElement = selectedMoves.map((move, index) => (

            <Button key={index}
            text={move.move_name + ' (' + move.move_power + ')'}
            func={(enabled && (setMove !== undefined)) ? (() => setMove(move)) : (() => {})}
            className={(enabled) ? ("pokemon-move-button") : ("pokemon-move-button-disabled")} />
        ))
        panelElement = <div className="panel-display">{panelElement}</div>
    }

    return (
        <div className="panel">{panelElement}</div>
    );
};
