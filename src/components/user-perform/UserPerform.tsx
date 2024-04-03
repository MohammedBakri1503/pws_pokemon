import { POKEMON_WORD } from "../../app-constants";
import { Perform } from "../../types";

import './UserPerform.css';

export interface UserPerformProps {
    perform: Perform | undefined;
}

export const UserPerform: React.FC<UserPerformProps> = ({
    perform
  }) => {
    if (perform) {
        const totalGames = perform.wins + perform.losses;
        const winRate = (totalGames > 0) ? ((perform.wins / totalGames) * 100) : 0;
        const WinRateString = (totalGames > 0) ? (winRate.toFixed(2)) : "0"
        const WinRateStars = '⭐'.repeat(Math.ceil(winRate / 20));
        if (totalGames > 0) {
            return (
                <div className="user-perform">
                    <div className="user-win-battles">
                      You won {perform.wins} out of {totalGames} battles

                    </div>
                    <div className="user-win-rate">
                    {WinRateString}% {WinRateStars}
                    </div>
                </div>);
        } else {
            return (
                (<div className="user-perform">
                    Zero {POKEMON_WORD} battles on record.
                </div>)
            );
        }
    }

    return null;
  };
