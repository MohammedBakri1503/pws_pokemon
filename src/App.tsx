import { createContext, useEffect, useState } from 'react'
import './App.css'

import { Pokemon, Perform, PokemonData } from './types'
import { loadTeam, loadUserPerform, initializeGameData, storeUserPerform, storeTeam, newGameData } from './auxiliary/GameStore'
import { fetchPokemons } from './auxiliary/ApiRequests'
import { Button } from './components/button/Button'
import { MY_POKEMON_PAGE, PAGES } from './app-constants'
import { Status } from './components/status/Status'
import { PageLayout } from './components/Pages/PageLayout'
import { Header } from './components/header/Header'

export interface AppContext {
  page: number;
  changePage: (newPage: number) => void;

  userPerform: Perform;
  userWin: () => void;
  userLose: () => void;

  team: Pokemon[];
  updateTeam: (new_team: Pokemon[]) => void;
  pokemonsData: PokemonData[];
}

export const AppContext = createContext<AppContext | null>(null);

function App() {
  initializeGameData();
  const [page, setPage] = useState<number>(MY_POKEMON_PAGE);
  const [userPerform, setUserPerform] = useState<Perform>(loadUserPerform());
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [teamIds, setTeamIds] = useState<number[]>([]);

  const [userPokemonsData, setUserPokemonsData] = useState<PokemonData[]>([]);
  const [userPokemonsLoading, setUserPokemonsLoading] = useState<boolean>(false);
  const [userPokemonsError, setUserPokemonsError] = useState<string | undefined>(undefined);

  const changePage = (newPage: number) => {    
    if ((newPage >= 0) && (newPage < PAGES.length)) {
      setPage(newPage);
    } else {
      setPage(MY_POKEMON_PAGE);
    }
  }

  function startOver() {
    newGameData();
    setUserPerform(loadUserPerform());
    getStoredTeam();

    changePage(MY_POKEMON_PAGE);
  }

  function userWin() {
    const new_user_perform: Perform = {wins: (userPerform.wins + 1), losses: (userPerform.losses)};
    storeUserPerform(new_user_perform);
    setUserPerform(new_user_perform);
  };

  function userLose() {
    const new_user_perform: Perform = {wins: (userPerform.wins), losses: (userPerform.losses + 1)};
    storeUserPerform(new_user_perform);
    setUserPerform(new_user_perform);
  };

  function updateTeam(new_team: Pokemon[]) {
    storeTeam(new_team);
    setTeam(new_team);
  }

  function getStoredTeam() {
    // pokemons ids and their performs
    const storedTeam = loadTeam();
    const user_pokemons_ids = storedTeam.map((pokemon) => (pokemon.pokemon_id));
    setTeamIds(user_pokemons_ids);
    setTeam(storedTeam);
  }

  useEffect(() => {
    getStoredTeam();
  }, []);

  function fetchUserPokemons() {
    fetchPokemons(teamIds, setUserPokemonsData, setUserPokemonsLoading, setUserPokemonsError);
  }

  useEffect(() => {
    fetchUserPokemons();

    return () => {
      setUserPokemonsData([]);
    }
  }, [teamIds]);

  const appContextValue: AppContext = {
    page: page,
    changePage: changePage,
    userPerform: userPerform,
    userWin: userWin,
    userLose: userLose,
    team: team,
    updateTeam: updateTeam,
    pokemonsData: userPokemonsData,
  }

  let topBar;
  let mainApp;
  if (userPokemonsLoading || userPokemonsError) {
    mainApp = (
      <Status loading={userPokemonsLoading} errorMessage={userPokemonsError} onRetry={fetchUserPokemons} />
    )
  } else {
    mainApp = (
      <PageLayout page={page} />
    )

    if (page == MY_POKEMON_PAGE) {
      topBar = (
        <div className='top-bar'>
          <div className='start-over-button'><Button text='Start Over' func={startOver} /></div>
        </div>
      )
    }
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <div className='main-display'>
        {topBar}
        <div className='app-header'><Header page={page} /></div>
        <div className='main-app'>{mainApp}</div>
      </div>
    </AppContext.Provider>
  )
}

export default App
