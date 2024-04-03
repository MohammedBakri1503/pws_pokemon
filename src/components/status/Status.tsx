import './Status.css'
import { Button } from "../button/Button";

export interface StatusProps {
    loading: boolean;
    errorMessage: string | undefined;
    onRetry: () => void;
}

export const Status: React.FC<StatusProps> = ({
    loading,
    errorMessage,
    onRetry,
  }) => {
    if (errorMessage) {
        return (
            <div className="status-error">
                <div className="error-title">Something went wrong!</div>
                <div className="error-message">
                    There was an error while fetching data: {errorMessage}.
                </div>
                <div className="retry-button"><Button text='Retry' func={onRetry} /></div>
            </div>);
    } else if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>);
    } else {
        return null;
    }
  };
