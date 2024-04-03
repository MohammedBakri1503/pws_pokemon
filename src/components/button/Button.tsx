
import './Button.css'

export interface ButtonProps {
    text: string;
    func: () => void;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    text,
    func,
    className = "default-button",
}) => {
    return (  
        <div className={className} onClick={func}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {text}
        </div> 
    );
};
