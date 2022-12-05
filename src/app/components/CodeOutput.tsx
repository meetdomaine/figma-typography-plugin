import * as React from 'react';

const CodeOutput = () => {
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
        <div className="code-output">
            <nav>
                <button
                    type="button"
                    onClick={() => setShowTailwindConfig(true)}
                    className={`tab type--small type--bold ${showTailwindConfig ? 'selected' : ''}`}
                >
                    <p>tailwind.config.js</p>
                </button>
                <button
                    type="button"
                    onClick={() => setShowTailwindConfig(false)}
                    className={`tab type--small type--bold ${!showTailwindConfig ? 'selected' : ''}`}
                >
                    <p>typography.css</p>
                </button>
                <a href="https://github.com/codyscott1/figma-typography-plugin/issues" target="_blank">
                    Submit an issue
                </a>
            </nav>
            <textarea
                className="code-output-area"
                spellCheck={false}
                value={showTailwindConfig ? output.config : output.css}
                onChange={() => {}}
            />
            <div className="sticky-button-wrapper">
                <button className="button button--primary button--clipboard">
                    <div className="icon icon--hyperlink icon--white"></div>
                    Copy to Clipboard
                </button>
            </div>
        </div>
    );
};

export default CodeOutput;
