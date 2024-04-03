import './PokemonCard.css'
import { PokemonData } from "../../types";

export interface PokemonCardProps {
    pokemonData: PokemonData;
    index: number;
    selectedIndex: number | undefined;
    setSelectedIndex?: (value: number | undefined) => void;
    enabled?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
    pokemonData,
    index,
    selectedIndex,
    setSelectedIndex,
    enabled = true,
  }) => {
    const { sprite: imageSrc, name: pokemonName } = pokemonData;
  
    let className: string = '';
    if (setSelectedIndex === undefined) {
      className = 'viewable';
    } else {
      className = 'clickable';
    }

    if (!enabled) {
      className += ' disabled-pokemon-card';
    } else if (selectedIndex === index) {
      className += ' selected-pokemon-card';
    } else if (selectedIndex !== undefined) {
      className += ' unselected-pokemon-card';
    }  else {
      className += ' pokemon-card';
    }

    const selectPokemon = () => {
        if (enabled && setSelectedIndex) {
            const nextIndex = (selectedIndex === index) ? undefined : index; 
            setSelectedIndex(nextIndex);
        } else {
            alert(`${pokemonName} cannot be selected!`)
        }
    }
  
    return (                    
        <div className={'image-container ' + className} onClick={setSelectedIndex ? selectPokemon : undefined}>
          <img src={imageSrc} alt={pokemonName} />
        </div>        
    );
  };
