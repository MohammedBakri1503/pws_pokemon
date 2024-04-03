import { useContext, useEffect, useState } from "react";
import './Arena.css'
import { AppContext } from "../../App";
import { BattleContext } from "../Pages/battle-page/BattlePage";
import { BATTLE_RESULT_WAIT_TIME, MIN_WINS_REQUIRED, MY_POKEMON_PAGE, POKEMON_WORD, ROUNDS_NUMBER, ROUND_RESULT_WAIT_TIME } from "../../app-constants";
import { Pokemon, PokemonData } from "../../types";
import { calculateTotalPower } from "../../auxiliary/CalculateMoveValue";
import { Button } from "../button/Button";

function getTotalPowers(appContext: AppContext, battleContext: BattleContext):
[number | undefined, number | undefined] {

    let userTotalPower: number | undefined, opponentTotalPower: number | undefined;

    if ((battleContext.userSelectedIndex !== undefined)
        && (battleContext.userSelectedMove !== undefined)
        && (battleContext.opponentSelectedIndex !== undefined)
        && (battleContext.opponentSelectedMove !== undefined)) {

        const { pokemonsData } = appContext;
        const { userSelectedIndex, opponentSelectedIndex,
            userSelectedMove, opponentSelectedMove, opponentPokemonsData } = battleContext;

        const userPokemon: PokemonData = pokemonsData[userSelectedIndex];
        const opponentPokemon: PokemonData = opponentPokemonsData[opponentSelectedIndex];

        userTotalPower = calculateTotalPower(userPokemon, opponentPokemon, userSelectedMove.move_power);
        opponentTotalPower = calculateTotalPower(opponentPokemon, userPokemon, opponentSelectedMove.move_power);
    }

    return [userTotalPower, opponentTotalPower];
}

function getTotalPowerLine(moveName: string, totalPower: number | undefined) : string {
    if (totalPower === undefined) {
        return `${moveName} >>> ...`;
    } else {
        return `${moveName} >>> ${totalPower}`;
    }
}

function getUserElement(appContext: AppContext, battleContext: BattleContext, totalPower: number | undefined) {
    if (battleContext.userSelectedIndex === undefined) {
        // If user has not selected a Pokemon
        return (
            <div className="user-line">
                Please select a {POKEMON_WORD} from your team.
            </div>
        )
    } else if (battleContext.userSelectedMove === undefined) {
        // If user has selected a Pokemon but not a move
        const pokemonName = appContext.pokemonsData[battleContext.userSelectedIndex].name;
        return (
            <div className="user-line">
                Please select a move for {pokemonName}.
            </div>
        )
    } else {
        // If user has selected a Pokemon and a move
        const moveName = battleContext.userSelectedMove.move_name;
        return (
            <div className="user-line">
                {getTotalPowerLine(moveName, totalPower)}
            </div>
        )
    }
}

function getOpponentElement(battleContext: BattleContext, totalPower: number | undefined) {
    if ((battleContext.userSelectedIndex !== undefined)
        &&(battleContext.opponentSelectedIndex === undefined)) {
        // If user has selected a Pokemon but opponent has not selected a Pokemon
        return (
            <div className="opponent-line">
                <div className="selecting-loader"></div>
                <div className="loader-line">Opponent selecting a {POKEMON_WORD}...</div>
            </div>
        )
    } else if ((battleContext.userSelectedIndex !== undefined)
            && (battleContext.userSelectedMove !== undefined)
            && (battleContext.opponentSelectedIndex !== undefined)
            && (battleContext.opponentSelectedMove === undefined)) {
        // If user has selected a Pokemon and a move
        // and opponent has selected a Pokemon but not a move
        const pokemonName = battleContext.opponentPokemonsData[battleContext.opponentSelectedIndex].name;
        return (
            <div className="opponent-line">
                <div className="selecting-loader"></div>
                <div className="loader-line">Opponent selecting a move for {pokemonName}...</div>
            </div>
        )
    } else if ((battleContext.opponentSelectedIndex !== undefined)
            && (battleContext.opponentSelectedMove !== undefined)) {
        // If opponent has selected a Pokemon and a move
        const moveName = battleContext.opponentSelectedMove.move_name;
        return (
            <div className="opponent-line">
                {getTotalPowerLine(moveName, totalPower)}
            </div>
        )
    }

    return null;
}

function getCommentatorElement(
    roundResult: boolean | undefined,
    setRoundResult: (value: boolean | undefined) => void,
    roundNumber: number,
    setRoundNumber: (value: number) => void,
    userWins: number,
    battleContext: BattleContext) {
    if (roundNumber > ROUNDS_NUMBER) {
        const resultWord = (userWins >= MIN_WINS_REQUIRED) ? 'Won!' : 'Lost :(';
        return (
            <div className="commentator-line">You {resultWord}</div>
        )
    } else if (roundResult === undefined) {
        if (battleContext.userSelectedIndex === undefined) {
            return (
                <div className="commentator-line">Round {roundNumber}, Fight</div>
            )
        } else if ((battleContext.userSelectedIndex !== undefined)
        && (battleContext.userSelectedMove !== undefined)
        && (battleContext.opponentSelectedIndex !== undefined)
        && (battleContext.opponentSelectedMove !== undefined)) {
            return (
                <div className="commentator-line">vs</div>
            )
        }

        return null;
    }

    const resultWord = (roundResult) ? 'Won' : 'Lost';
    const nextWord = (roundNumber === ROUNDS_NUMBER) ? 'End Battle' : 'Next Round';
    const nextFunc = () => nextRound(roundNumber, setRoundNumber, setRoundResult, battleContext);
        
    return (
        <div className="commentator-line">
            <div className="result-line">Your {POKEMON_WORD} {resultWord} Round {roundNumber}!</div>
            <div className="next-step">
                <Button text={nextWord} func={nextFunc} />
            </div>
        </div>
    )
}

function nextRound(roundNumber: number, setRoundNumber: (value: number) => void,
    setRoundResult: (value: boolean | undefined) => void, battleContext: BattleContext) {
    
    battleContext.invalidateUserIndex(battleContext.userSelectedIndex);
    battleContext.invalidateOpponentIndex(battleContext.opponentSelectedIndex);

    battleContext.setUserSelectedIndex(undefined);
    battleContext.setUserSelectedMove(undefined);
    battleContext.setOpponentSelectedIndex(undefined);
    battleContext.setOpponentSelectedMove(undefined);

    setRoundResult(undefined);
    setRoundNumber(roundNumber + 1);
}

function endBattle(userWins: number, appContext: AppContext, battleContext: BattleContext) {

    // update perform
    updateBattleResult(userWins, appContext, battleContext);
    
    // move to My Pokemon page
    appContext.changePage(MY_POKEMON_PAGE);
}

function updateRoundResult(userTotalPower: number, opponentTotalPower: number,
    setRoundResult: (result: boolean | undefined) => void, userWins: number, setUserWins: (value: number) => void, battleContext: BattleContext) {
    const index = battleContext.userSelectedIndex;
    if (index !== undefined) {
        const oldPerform = battleContext.userTeam[index].perform;
        let newTeam: Pokemon[] = [...battleContext.userTeam];

        if (userTotalPower >= opponentTotalPower) {
            // user's pokemon wins this round
            newTeam[index].perform.wins = oldPerform.wins + 1;
            setUserWins(userWins + 1);
            setRoundResult(true);
        } else {
            // user's pokemon losses this round
            newTeam[index].perform.losses = oldPerform.losses + 1;
            setRoundResult(false);
        }
        battleContext.setUserTeam(newTeam);
    }
}

function updateBattleResult(userWins: number, appContext: AppContext, battleContext: BattleContext) {
    // update team perform
    appContext.updateTeam(battleContext.userTeam);

    // update user perform
    if (userWins >= MIN_WINS_REQUIRED) {
        appContext.userWin();
    } else {
        appContext.userLose();
    }
}

export const Arena: React.FC = () => {
    const appContext = useContext(AppContext);
    const battleContext = useContext(BattleContext);

    if ((appContext !== null) && (battleContext !== null)) {
        const [userTotalPower, opponentTotalPower] = getTotalPowers(appContext, battleContext);
        const [roundNumber, setRoundNumber] = useState<number>(1);
        const [roundResult, setRoundResult] = useState<boolean | undefined>(undefined);
        const [userWins, setUserWins] = useState<number>(0);

        const userElement = ((roundResult === undefined) && (roundNumber <= ROUNDS_NUMBER)) ?
            getUserElement(appContext, battleContext, userTotalPower) : null;

        const opponentElement = ((roundResult === undefined) && (roundNumber <= ROUNDS_NUMBER)) ?
            getOpponentElement(battleContext, opponentTotalPower) : null;

        const commentatorElement = getCommentatorElement(roundResult, setRoundResult,
            roundNumber, setRoundNumber, userWins, battleContext);

        useEffect(() => {
            // Wait before updating round result
            if ((userTotalPower !== undefined) && (opponentTotalPower != undefined)) {
                const roundResultTimeout = setTimeout(() => {
                    updateRoundResult(userTotalPower, opponentTotalPower, setRoundResult, userWins, setUserWins, battleContext);
                }, ROUND_RESULT_WAIT_TIME);
                    
                return () => clearTimeout(roundResultTimeout);
            }
        }, [userTotalPower, opponentTotalPower]);


        useEffect(() => {
            if (roundNumber > ROUNDS_NUMBER) {
                // Wait before ending battle
                const battleResultTimeout = setTimeout(() => {
                    endBattle(userWins, appContext, battleContext)
                }, BATTLE_RESULT_WAIT_TIME);

                return () => clearTimeout(battleResultTimeout);
            }
        }, [roundNumber]);

        return (
            <div className="arena-box">
                <div className="opponent">{opponentElement}</div>
                <div className="commentator">{commentatorElement}</div>
                <div className="user">{userElement}</div>
            </div>
        )
    }
    return null;
}
