import {copyToClipboard} from 'figx';
import React, {useEffect} from 'react';

const CopyIcon = ({value}) => {
    const [error, setError] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const handleOnClick = async () => {
        try {
            copyToClipboard(value);
            setCopied(true);
        } catch (err) {
            console.error('Failed to copy to clipboard', err);
            setError(true);
        }
    };

    useEffect(() => setCopied(false), [value]);

    return (
        <button type="button" onClick={handleOnClick} className="copy-icon">
            <p>
                {error ? 'Failed to' : ''}
                {!error && copied ? 'Copied ' : 'Copy '}
                to clipboard
            </p>
            {copied ? (
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.3335 3.95684L4.29958 6.92292L10.6668 0.555664" stroke="currentColor" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V18M8 5C8 6.10457 8.89543 7 10 7H12C13.1046 7 14 6.10457 14 5M8 5C8 3.89543 8.89543 3 10 3H12C13.1046 3 14 3.89543 14 5M14 5H16C17.1046 5 18 5.89543 18 7V10M20 14H10M10 14L13 11M10 14L13 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </button>
    );
};

export default CopyIcon;
