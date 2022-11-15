import * as React from 'react';
import '../styles/ui.css';

declare function require(path: string): any;

const App = ({}) => {
    const [outputType, setOutputType] = React.useState('tailwind');
    const [outputUnits, setOutputUnits] = React.useState('rem');
    const [output, setOutput] = React.useState('');

    const onCreate = () => {
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
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const {type, message} = event.data.pluginMessage;
            console.log({type, message}, event.data);
        };
    }, []);

    return (
        <div>
            <h2>Typography boilerplate</h2>
            <p>
                This plugin is intended to minimize the time developers spend setting up fonts for development, and
                reduce the back and forth required between design and developers.
            </p>
            <p>Getting Started</p>
            <ol>
                <li>Save some text styles in your Figma project. (Most projects should already have these)</li>
                <li>select your output format (Currently only supports tailwind but native css support is coming)</li>
                <li>select output units (px or rem)</li>
                <li>click Create</li>
            </ol>
            <span>Select output (CSS/Tailwind)</span>
            <select name="output" id="output" disabled>
                <option value="tailwind">Tailwind</option>
                <option value="css">CSS</option>
            </select>

            <span> output units (px, rem): </span>
            <select name="units" id="units" onChange={({target: {value}}) => setOutputUnits(value)}>
                <option value="rem">rem</option>
                <option value="px">pixels</option>
            </select>
            <span>
                <button onClick={onCreate}>Create</button>
                <button onClick={onCancel}>Cancel</button>
            </span>

            <textarea>{output}</textarea>
        </div>
    );
};

export default App;
