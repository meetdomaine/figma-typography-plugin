import * as React from 'react';
import Icon from './Icon';

interface Output {
    config? : any,
    css? : any
}

interface CodeOutputProps {
    outputType: string,
    showTextStyles: boolean,
    fontUnits: string,
    fontBaseSize: number,
    breakpointName: string,
    breakpointSize: number,
    showColorUnits: boolean,
    colorUnits: string,
    showEffects: boolean,
    showInnerShadows: boolean,
    showDropShadows: boolean,
    showLayerBlur: boolean,
    showBackgroundBlur: boolean,
}

const CodeOutput = (props: CodeOutputProps) => {
    
    const [output, setOutput] = React.useState<Output>();
    const [showTailwindConfig, setShowTailwindConfig] = React.useState(true);

    const handleCreate = () => {
        parent.postMessage(
            {
                pluginMessage: {type: 'output-typography', outputType: props.outputType, outputUnits: props.fontUnits, showColors: props.showColorUnits, customBreakpoint: props.breakpointName},
            },
            '*'
        );
    };

    React.useEffect(() => {
        handleCreate();
    }, [props.outputType, props.fontUnits, props.showColorUnits, props.breakpointName]);

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
        <div className="output-panel">
            <nav className="output-tabs">
                <div className="tab-navigation">
                    <button
                        type="button"
                        onClick={() => setShowTailwindConfig(true)}
                        className={`tab type--small type--bold ${showTailwindConfig ? 'selected' : ''}`}
                    >
                        tailwind.config.js
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowTailwindConfig(false)}
                        className={`tab type--small type--bold ${!showTailwindConfig ? 'selected' : ''}`}
                    >
                        typography.css
                    </button>
                </div>
                <a href="https://github.com/codyscott1/figma-typography-plugin/issues" target="_blank">
                    Submit an issue
                </a>
            </nav>

            {/* <p>Output Type: {props.outputType}</p> */}
            {/* <p>Font Units: {props.fontUnits}</p> */}
            {/* <p>Show Fonts: {props.showTextStyles.toString()}</p> */}
            {/* <p>Font Base Size: {props.fontBaseSize}</p> */}
            {/* <p>Breakpoint Name: {props.breakpointName}</p> */}
            {/* <p>Breakpoint Size: {props.breakpointSize}</p> */}
            {/* <p>Show Color Units: {props.showColorUnits.toString()}</p>  */}
            {/* <p>Color Units: {props.colorUnits}</p> */}
            {/* <p>Show Effects: {props.showEffects.toString()}</p> */}
            {/* <p>Show Inner Shadows: {props.showInnerShadows.toString()}</p> */}
            {/* <p>Show Drop Shadows: {props.showDropShadows.toString()}</p> */}
            {/* <p>Show Layer Blur: {props.showLayerBlur.toString()}</p> */}
            {/* <p>Show Background Blur: {props.showBackgroundBlur.toString()}</p> */}
            <textarea
                className="code-output"
                spellCheck={false}
                value={showTailwindConfig ? output.config : output.css}
                onChange={() => {}}
            />
            <div className="sticky-button-wrapper">
                <button className="button button--primary button--clipboard">
                    <Icon icon="link" />
                    Copy to Clipboard
                </button>
            </div>
        </div>
    );
};

export default CodeOutput;
