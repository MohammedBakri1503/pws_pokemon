import { BATTLE_PAGE, MY_POKEMON_PAGE } from "../../app-constants";
import Battle from "./battle-page/BattlePage";
import { MyPokemonPage } from "./my-pokemon-page/MyPokemonPage";

export interface PageLayoutProps {
    page: number;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    page,
}) => {

    switch(page) {
        case MY_POKEMON_PAGE:
            return <MyPokemonPage />
        case BATTLE_PAGE:
            return <Battle />
        default:
            return null;            
    }
}
