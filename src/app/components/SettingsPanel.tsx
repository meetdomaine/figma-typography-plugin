import * as React from 'react';
// import { selectMenu } from 'figma-plugin-ds';

const SettingsPanel = (props) => {
    // React.useEffect(() => {
    //     selectMenu.init();
    // })

    const handleValueChange = (event, setter) => {
        console.log(event.target.value);
    };

    return (
        <div className="settings-panel">
            {/* <div className="title_wrapper"> */}
            {/* <div className="type--xlarge type--bold">Boilerplate Generator</div> */}
            {/* <div className="type--small type--bold">Output css from saved styles.</div>
            </div> */}

            <div className="label">Output:</div>

            <div className="radio">
                <input
                    id="radio_tailwind"
                    type="radio"
                    className="radio__button"
                    value="Tailwind"
                    name="outputType"
                    onClick={props.setOutputType('tailwind')}
                />
                <label htmlFor="radio_tailwind" className="radio__label">
                    Tailwind
                </label>

                <input
                    id="radio_css"
                    type="radio"
                    className="radio__button"
                    value="Vanilla CSS"
                    name="outputType"
                    onClick={props.setOutputType('vanilla')}
                />
                <label htmlFor="radio_css" className="radio__label">
                    Vanilla CSS
                </label>
            </div>

            <div className="label">Units:</div>
            <div className="radio">
                <input id="radio_rem" type="radio" className="radio__button" value="Tailwind" name="radioGroup" />
                <label htmlFor="radio_rem" className="radio__label">
                    rem
                </label>
                <input id="radio_px" type="radio" className="radio__button" value="Vanilla CSS" name="radioGroup" />
                <label htmlFor="radio_px" className="radio__label">
                    px
                </label>
            </div>
            <div className="input">
                <label htmlFor="base_px" className="label">
                    Base Size
                </label>
                <input id="base_px" type="number" className="input__field" min="10" max="30" defaultValue="16" />
            </div>

            <div className="label">Include:</div>
            <div className="switch">
                <input className="switch__toggle" type="checkbox" id="include_colors" />
                <label className="switch__label" htmlFor="include_colors">
                    Colors
                </label>
            </div>
            <div className="switch">
                <input className="switch__toggle" type="checkbox" id="include_font_imports" />
                <label className="switch__label" htmlFor="include_font_imports">
                    Font Imports
                </label>
            </div>
            <div className="switch">
                <input className="switch__toggle" type="checkbox" id="include_effects" />
                <label className="switch__label" htmlFor="include_effects">
                    Effect Styles
                </label>
            </div>
        </div>
    );
};

export default SettingsPanel;
