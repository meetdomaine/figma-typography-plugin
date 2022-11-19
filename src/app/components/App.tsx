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
    }, []);

    return (
        <div className="main">
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
