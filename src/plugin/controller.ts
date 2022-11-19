// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {width: 1200, height: 600});

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

const getFontStyles = (font, isDesktop, currentStyles) => {
    const breakpointModifier = isDesktop ? 'sm:' : '';
    const shouldShowValue = (value) => !!value && (!isDesktop || !currentStyles.includes(value.toLowerCase()));

    console.log(currentStyles);
    const styles = font.fontName.style.split(' ');
    const fontWeight = styles[0];
    const fontStyle = styles[1] || '';

    const parsedName = `${breakpointModifier}text-${font.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    const parsedWeight = shouldShowValue(fontWeight) ? ` ${breakpointModifier}font-${fontWeight.toLowerCase()}` : '';
    const parsedStyle = shouldShowValue(fontStyle) ? ` ${breakpointModifier}${fontStyle.toLowerCase()}` : '';
    const parsedFamily = shouldShowValue(font.fontName.family)
        ? ` ${breakpointModifier}font-${getBaseName(font.fontName.family)}`
        : '';
    console.log({parsedName, parsedWeight, parsedStyle, parsedFamily});
    return currentStyles + parsedName + parsedWeight + parsedStyle + parsedFamily;
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

            const stringified = JSON.stringify({fontSize: result}, null, 2);

            return stringified.slice(1, stringified.length - 1).trim();
        };

        const mapTypographyConfig = () => {
            const mobileFonts = savedTextStyles.filter((style) => style.name.toLowerCase().includes('mobile'));
            const desktopFonts = savedTextStyles.filter((style) => style.name.toLowerCase().includes('desktop'));

            const result = mobileFonts.map((font) => {
                const matchingDesktopFont = desktopFonts.find(({name}) =>
                    getBaseName(font.name).includes(getBaseName(name))
                );

                const getTitle = (font) => removeLeadingTrailingCharacters(getBaseName(font.name));

                let currentStyles = getFontStyles(font, false, '');
                currentStyles = getFontStyles(matchingDesktopFont, true, currentStyles + ' ');

                return `.${getTitle(font)} {\r @apply ${currentStyles}; \r}`;
            });

            return result.join('\r');
        };

        const mapCSSOutput = () => {};

        const result =
            outputType === 'tailwind'
                ? {
                      config: mapTailwindConfig(),
                      css: mapTypographyConfig(),
                  }
                : mapCSSOutput();

        figma.ui.postMessage(result);
    }
};

const round = (x: any) => parseFloat(x.toFixed(2));
