import { PAGES } from "../../app-constants";
import './Header.css'

export interface HeaderProps {
    page: number;
}

export const Header: React.FC<HeaderProps> = ({
    page,
}) => {
    return (<div className="app-header"><h1>{PAGES[page]}</h1></div>);
}
