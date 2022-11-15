// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {width: 1000, height: 1000});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
const removeLeadingTrailingCharacters = (str) => {
    const specialCharacters = ['-', '_', '/', ' '];
    if (specialCharacters.includes(str[0])) {
        return str.substring(1);
    }
    if (specialCharacters.includes(str[str.length - 1])) {
        return str.substring(0, str.length - 1);
    }
    return str.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
};

const getBaseName = (name) =>
    name
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/mobile|desktop/gi, '')
        .toLowerCase();

const getFontStyles = (font, isDesktop = false, otherViewportFont = null) => {
    const breakpointModifier = isDesktop ? 'sm:' : '';
    const name = `${breakpointModifier}text-${font.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

    const shouldShowValue = (value, otherValue) => !isDesktop || value !== otherValue;

    const fontWeight = shouldShowValue(font.fontName.style, otherViewportFont?.fontName?.style)
        ? `${breakpointModifier}font-${font.fontName.style.toLowerCase()}`
        : '';

    const fontFamily = shouldShowValue(font.fontName.family, otherViewportFont?.fontName?.family)
        ? `${breakpointModifier}font-${getBaseName(font.fontName.family)}`
        : '';

    return `${name} ${fontWeight} ${fontFamily}`;
};

figma.ui.onmessage = async (msg) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }

    if (msg.type === 'output-typography') {
        await figma.loadFontAsync({family: 'Inter', style: 'Regular'});

        const savedTextStyles = figma.getLocalTextStyles();
        const {outputType, outputUnits} = msg;

        const mapTailwindConfig = () => {
            const result = savedTextStyles.map(({name, fontSize, letterSpacing, lineHeight}) => {
                const cleanedName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

                const convertToCurrentUnits = (fontStyle) => {
                    let value;
                    if (typeof fontStyle === 'number') {
                        value = fontStyle;
                    } else if (fontStyle.unit === 'PERCENT') {
                        value = round((fontStyle.value / 100) * fontSize);
                    } else if (fontStyle.unit === 'PIXELS') {
                        value = fontStyle.value;
                    }

                    return (outputUnits === 'rem' ? round(value / 16) : value) + outputUnits;
                };

                return {
                    [cleanedName]: [
                        convertToCurrentUnits(fontSize),
                        {
                            letterSpacing: convertToCurrentUnits(letterSpacing),
                            lineHeight: convertToCurrentUnits(lineHeight),
                        },
                    ],
                };
            });

            return {theme: {fontSize: result}};
        };

        const mapTypographyConfig = () => {
            const mobileFonts = savedTextStyles.filter((style) => style.name.toLowerCase().includes('mobile'));

            const result = mobileFonts.map((font) => {
                const matchingDesktopFont = savedTextStyles.find(({name}) =>
                    getBaseName(font.name).includes(getBaseName(name))
                );

                const getTitle = (font) => removeLeadingTrailingCharacters(getBaseName(font.name));

                return `.${getTitle(font)} {@apply ${getFontStyles(font)} ${getFontStyles(
                    matchingDesktopFont,
                    true,
                    font
                )}}`;
            });

            return result.join('<br/>');
        };

        const mapCSSOutput = () => {};

        const result =
            outputType === 'tailwind'
                ? {
                      config: {'tailwind.config.js': mapTailwindConfig()},
                      css: {'typography.css': mapTypographyConfig()},
                  }
                : mapCSSOutput();

        figma.ui.postMessage(result);
        // figma.showUI(
        //   __html__ +
        //     JSON.stringify(result?.config, null, "\t") +
        //     "<br/><br/><br/>" +
        //     JSON.stringify(result?.css, null, "<br/>"),
        //   {
        //     width: 1000,
        //     height: 1000,
        //   }
        // );
    }
};

const round = (x: any) => parseFloat(x.toFixed(2));
