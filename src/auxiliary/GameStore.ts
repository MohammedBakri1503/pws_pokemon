import { USER_PERFORM_KEY, TEAM_KEY } from "../app-constants";
import { Pokemon, Perform } from "../types";
import { getRandomTeamIds } from "./Randoms";

export function storeUserPerform(user_perform: Perform) {
    localStorage.setItem(USER_PERFORM_KEY, JSON.stringify(user_perform));
}

function fillUserPerform() {
    if (!localStorage.getItem(USER_PERFORM_KEY)) {
        storeUserPerform({wins: 0, losses: 0});
    }
}

export function loadUserPerform(): Perform {
    const user_perform = localStorage.getItem(USER_PERFORM_KEY);
    if (user_perform) {
        return JSON.parse(user_perform);
    }

    return { wins: -1, losses: -1 };
}


export function storeTeam(team: Pokemon[]) {
    localStorage.setItem(TEAM_KEY, JSON.stringify(team));
}

function fillTeam() {
    if (!localStorage.getItem(TEAM_KEY)) {
        const pokemon_ids: number[] = getRandomTeamIds();
        const team: Pokemon[] = pokemon_ids.map(
            (id) => ({pokemon_id: id, perform: {wins: 0, losses: 0}}));
        storeTeam(team);
    }
}

export function loadTeam(): Pokemon[] {
    const user_pokemons = localStorage.getItem(TEAM_KEY);
    if (user_pokemons) {
        return JSON.parse(user_pokemons);
    }

    return [];
}

export function initializeGameData() {
    fillUserPerform();
    fillTeam();
}

export function newGameData() {
    localStorage.clear();
    initializeGameData();
}
