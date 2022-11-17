import * as React from 'react';
import '../styles/ui.css';
import CopyIcon from './CopyIcon';

declare function require(path: string): any;

const App = ({}) => {
    const [outputType, setOutputType] = React.useState('tailwind');
    const [outputUnits, setOutputUnits] = React.useState('rem');
    const [output, setOutput] = React.useState('');
    const [showTailwindConfig, setShowTailwindConfig] = React.useState(true);

    const handleCreate = () => {
        parent.postMessage(
            {
                pluginMessage: {type: 'output-typography', outputType, outputUnits},
            },
            '*'
        );
    };

    const onCancel = () => {
        parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
    };

    React.useEffect(() => {
        handleCreate();
    }, [outputType, outputUnits]);

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = ({data: {pluginMessage}}) => {
            setOutput(pluginMessage);
        };
        handleCreate();
    }, []);

    return (
        <div className="main">
            {/* <h2>Typography boilerplate</h2> */}
            {/* <p>
                This plugin is intended to minimize the time developers spend setting up fonts for development, and
                reduce the back and forth required between design and developers.
            </p>
            <p>Getting Started</p> */}
            {/* <ol>
                <li>Save some text styles in your Figma project. (Most projects should already have these)</li>
                <li>select your output format (Currently only supports tailwind but native css support is coming)</li>
                <li>select output units (px or rem)</li>
            </ol> */}
            {/* <span>
                <p>Select output (CSS/Tailwind)</p>
                <select name="output" id="output" disabled>
                    <option value="tailwind">Tailwind</option>
                    <option value="css">CSS</option>
                </select>
            </span> */}
            {/* <span className="output-units">
                <p> output units (px, rem): </p>
                <select name="units" id="units" onChange={({target: {value}}) => setOutputUnits(value)}>
                    <option value="rem">rem</option>
                    <option value="px">pixels</option>
                </select>
            </span> */}

            {output && (
                <div className="main-wrapper">
                    <nav className="header">
                        <button
                            type="button"
                            onClick={() => setShowTailwindConfig(true)}
                            className={`file-name ${showTailwindConfig ? 'selected' : ''}`}
                        >
                            <p>tailwind.config.js</p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowTailwindConfig(false)}
                            className={`file-name ${!showTailwindConfig ? 'selected' : ''}`}
                        >
                            <p>typography.css</p>
                        </button>
                        <CopyIcon value={showTailwindConfig ? output.config : output.css} />
                        <button type="button" onClick={() => setOutputUnits(outputUnits === 'rem' ? 'px' : 'rem')}>
                            Toggle output to {outputUnits === 'rem' ? 'pixels' : 'rem'}
                        </button>
                        <button onClick={onCancel} className="close">
                            Close
                        </button>
                    </nav>
                    <textarea spellCheck={false} value={showTailwindConfig ? output.config : output.css} readOnly />
                </div>
            )}
        </div>
    );
};

export default App;
