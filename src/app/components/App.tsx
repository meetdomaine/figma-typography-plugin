import * as React from 'react';
import '../styles/ui.css';
import '../styles/figma_ui.css'
import SettingsPanel from './SettingsPanel';
import CodeOutput from './CodeOutput';
import stringLookup from './StringLookup';

// declare function require(path: string): any;

const App = ({}) => {

    const [outputType, setOutputType] = React.useState<string>(stringLookup.tailwind);
    const [showTextStyles, setShowTextStyles] = React.useState<boolean>(false);
    const [fontUnits, setFontUnits] = React.useState<string>(stringLookup.rem);
    const [fontBaseSize, setFontBaseSize] = React.useState<number>(16);
    const [breakpointName, setBreakpointName] = React.useState<string>('sm');
    const [breakpointSize, setBreakpointSize] = React.useState<number>(768);
    const [showColorUnits, setShowColorUnits] = React.useState<boolean>(false);
    const [colorUnits, setColorUnits] = React.useState<string>(stringLookup.hex);
    const [showEffects, setShowEffects] = React.useState<boolean>(false);
    const [showInnerShadows, setShowInnerShadows] = React.useState<boolean>(false);
    const [showDropShadows, setShowDropShadows] = React.useState<boolean>(false);
    const [showLayerBlur, setShowLayerBlur] = React.useState<boolean>(false);
    const [showBackgroundBlur, setShowBackgroundBlur] = React.useState<boolean>(false);

    return (
        <div className="main">
            <SettingsPanel
                outputType={outputType}
                setOutputType={setOutputType}
                showTextStyles={showTextStyles}
                setShowTextStyles={setShowTextStyles}
                fontUnits = {fontUnits}
                setFontUnits = {setFontUnits}
                fontBaseSize = {fontBaseSize}
                setFontBaseSize = {setFontBaseSize}
                breakpointName = {breakpointName}
                setBreakpointName = {setBreakpointName}
                breakpointSize = {breakpointSize}
                setBreakpointSize = {setBreakpointSize}
                showColorUnits = {showColorUnits}
                setShowColorUnits = {setShowColorUnits}
                colorUnits = {colorUnits}
                setColorUnits = {setColorUnits}
                showEffects = {showEffects}
                setShowEffects = {setShowEffects}
                showInnerShadows = {showInnerShadows}
                setShowInnerShadows = {setShowInnerShadows}
                showDropShadows = {showDropShadows}
                setShowDropShadows = {setShowDropShadows}
                showLayerBlur = {showLayerBlur}
                setShowLayerBlur = {setShowLayerBlur}
                showBackgroundBlur = {showBackgroundBlur}
                setShowBackgroundBlur = {setShowBackgroundBlur}
            />
            <CodeOutput 
                outputType={outputType}
                showTextStyles={showTextStyles}
                fontUnits = {fontUnits}
                fontBaseSize = {fontBaseSize}
                breakpointName = {breakpointName}
                breakpointSize = {breakpointSize}
                showColorUnits = {showColorUnits}
                colorUnits = {colorUnits}
                showEffects = {showEffects}
                showInnerShadows = {showInnerShadows}
                showDropShadows = {showDropShadows}
                showLayerBlur = {showLayerBlur}
                showBackgroundBlur = {showBackgroundBlur}
            />
        </div>
    );
};

export default App;
