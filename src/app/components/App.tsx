import * as React from 'react';
import '../styles/ui.css';
import CopyIcon from './CopyIcon';

declare function require(path: string): any;

const App = ({}) => {
    const [outputType, setOutputType] = React.useState('tailwind');
    const [outputUnits, setOutputUnits] = React.useState('rem');
    const [showColors, setShowColors] = React.useState(true);
    const [output, setOutput] = React.useState('');
    const [showTailwindConfig, setShowTailwindConfig] = React.useState(true);
    const [customBreakpoint, setCustomBreakpoint] = React.useState('sm');
    const [showSettings, setShowSettings] = React.useState(false);

    const handleCreate = () => {
        parent.postMessage(
            {
                pluginMessage: {type: 'output-typography', outputType, outputUnits, showColors, customBreakpoint},
            },
            '*'
        );
    };

    const handleClose = () => {
        parent.postMessage({pluginMessage: {type: 'close'}}, '*');
    };

    React.useEffect(() => {
        handleCreate();
    }, [outputType, outputUnits, showColors, customBreakpoint]);

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = ({data: {pluginMessage}}) => {
            setOutput(pluginMessage);
        };
    }, []);

    if (!output) {
        return null;
    }

    return (
        <div className="main">
            <div className="main-wrapper">
                <nav>
                    <button className="close" type="button" onClick={handleClose}>
                        <svg
                            width="6"
                            height="6"
                            viewBox="0 0 26 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="close-cross"
                        >
                            <path
                                d="M25 1L1.33997 24.66L25 1Z"
                                stroke="black"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                            />
                            <path
                                d="M24.66 24.66L1 1L24.66 24.66Z"
                                stroke="black"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                            />
                        </svg>
                        <p className="sr-only">Close Plugin</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowTailwindConfig(true)}
                        className={`tab ${showTailwindConfig ? 'selected' : ''}`}
                    >
                        <p>tailwind.config.js</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowTailwindConfig(false)}
                        className={`tab ${!showTailwindConfig ? 'selected' : ''}`}
                    >
                        <p>typography.css</p>
                    </button>
                    <a href="https://github.com/codyscott1/figma-typography-plugin/issues" target="_blank">
                        Submit an issue
                    </a>
                </nav>
                <div className="output">
                    <div className="toggles-wrapper">
                        <CopyIcon value={showTailwindConfig ? output.config : output.css} />

                        {!showSettings ? (
                            <button type="button" className="toggle" onClick={() => setShowSettings(true)}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M0 5L24 5" stroke="currentColor" />
                                    <path d="M0 12L24 12" stroke="currentColor" />
                                    <path d="M0 19L24 19" stroke="currentColor" />
                                    <circle cx="19.5" cy="4.87189" r="2.5" fill="currentColor" />
                                    <circle cx="4.5" cy="12" r="2.5" fill="currentColor" />
                                    <circle cx="12" cy="19.1281" r="2.5" fill="currentColor" />
                                </svg>
                            </button>
                        ) : (
                            <div className="settings-wrapper">
                                {showTailwindConfig ? (
                                    <>
                                        <button
                                            className="toggle"
                                            type="button"
                                            onClick={() => setOutputUnits(outputUnits === 'rem' ? 'px' : 'rem')}
                                        >
                                            View in {outputUnits === 'rem' ? 'pixels' : 'rem'}
                                        </button>
                                        <button
                                            className="toggle"
                                            type="button"
                                            onClick={() => setShowColors(!showColors)}
                                        >
                                            {showColors ? 'Hide' : 'Show'} colors
                                        </button>
                                    </>
                                ) : (
                                    <div className="breakpoint-wrapper">
                                        <span className="breakpoint-label">breakpoint</span>
                                        <input
                                            type="text"
                                            className="toggle breakpoint"
                                            value={customBreakpoint}
                                            onChange={({target: {value}}) => setCustomBreakpoint(value.trim())}
                                        />
                                    </div>
                                )}
                                <button type="button" className="toggle" onClick={() => setShowSettings(false)}>
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 26 26"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="close-settings"
                                    >
                                        <path
                                            d="M25 1L1.33997 24.66L25 1Z"
                                            stroke="currentColor"
                                            strokeMiterlimit="10"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M24.66 24.66L1 1L24.66 24.66Z"
                                            stroke="currentColor"
                                            strokeMiterlimit="10"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                    <textarea
                        spellCheck={false}
                        value={showTailwindConfig ? output.config : output.css}
                        onChange={() => {}}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
