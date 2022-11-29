import {fontWeights} from './constants';

const savedTextStyles = figma.getLocalTextStyles();

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

const round = (x) => parseFloat(x.toFixed(2));

const getFontStyles = (font, isDesktop, currentStyles, customBreakpoint) => {
    const breakpointModifier = isDesktop ? `${customBreakpoint}:` : '';
    const shouldShowValue = (value) => !!value && (!isDesktop || !currentStyles.includes(value.toLowerCase()));

    const styles = getBaseName(font.fontName.style);

    const mappedStyles = fontWeights[styles];
    const {textCase} = font;

    const parsedName = `${breakpointModifier}text-${font.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    const parsedWeight = shouldShowValue(mappedStyles[0]) ? ` ${breakpointModifier}${mappedStyles[0]}` : '';
    const parsedStyle = shouldShowValue(mappedStyles[1]) ? ` ${breakpointModifier}${mappedStyles[1]}` : '';
    const parsedFamily = shouldShowValue(getBaseName(font.fontName.family))
        ? ` ${breakpointModifier}font-${getBaseName(font.fontName.family)}`
        : '';

    const uppercase = textCase === 'UPPER' && shouldShowValue('uppercase') ? ` ${breakpointModifier}uppercase` : '';

    const lowercase = textCase === 'LOWER' && shouldShowValue('lowercase') ? ` ${breakpointModifier}lowercase` : '';

    const originalCase =
        textCase === 'ORIGINAL' && (!shouldShowValue('uppercase') || !shouldShowValue('lowercase'))
            ? ` ${breakpointModifier}normal-case`
            : '';

    const casing = uppercase + lowercase + originalCase;

    return currentStyles + parsedName + parsedWeight + parsedStyle + parsedFamily + casing;
};

const getColors = () => {
    const colors = figma.getLocalPaintStyles();

    const mapped = colors.map((color) => {
        const {r, g, b} = color.paints[0].color || {};
        const {name} = color;

        return {
            key: removeLeadingTrailingCharacters(getBaseName(name)),
            value: `rgb(${round(r * 255)}, ${round(g * 255)}, ${round(b * 255)})`,
        };
    });

    return mapped.reduce((obj, item) => Object.assign(obj, {[item.key]: item.value}), {});
};

export const mapTailwindConfig = (outputUnits, showColors) => {
    const convertToCurrentUnits = (fontStyle, fontSize) => {
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

    const result = savedTextStyles.map(({name, fontSize, letterSpacing, lineHeight}) => {
        const cleanedName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

        if (letterSpacing) {
            return {
                key: cleanedName,
                value: [
                    convertToCurrentUnits(fontSize, fontSize),
                    {
                        letterSpacing: convertToCurrentUnits(letterSpacing, fontSize),
                        lineHeight: convertToCurrentUnits(lineHeight, fontSize),
                    },
                ],
            };
        }

        return {
            key: cleanedName,
            value: [convertToCurrentUnits(fontSize, fontSize), convertToCurrentUnits(lineHeight, fontSize)],
        };
    });

    const reduced = result.reduce((obj, item) => Object.assign(obj, {[item.key]: item.value}), {});

    const stringified = JSON.stringify({fontSize: reduced, colors: showColors ? getColors() : undefined}, null, 2);

    return stringified.slice(1, stringified.length - 1).trim();
};

export const mapTypographyConfig = (customBreakpoint) => {
    let outputArray = [];
    const mobileFonts = savedTextStyles.filter((style) => style.name.toLowerCase().includes('mobile'));
    const desktopFonts = savedTextStyles.filter((style) => style.name.toLowerCase().includes('desktop'));
    const unsizedFonts = savedTextStyles.filter(
        (style) => !style.name.toLowerCase().includes('desktop') && !style.name.toLowerCase().includes('mobile')
    );

    if (!mobileFonts.length || !desktopFonts.length) {
        outputArray = savedTextStyles;
    } else {
        outputArray = [...mobileFonts, ...unsizedFonts];
    }

    const result = outputArray.map((font) => {
        const matchingDesktopFont = desktopFonts.find(({name}) => getBaseName(font.name).includes(getBaseName(name)));

        const getTitle = (font) => removeLeadingTrailingCharacters(getBaseName(font.name));

        let currentStyles = getFontStyles(font, false, '', customBreakpoint);
        if (matchingDesktopFont) {
            currentStyles = getFontStyles(matchingDesktopFont, true, currentStyles + ' ', customBreakpoint);
        }

        return `.${getTitle(font)} {\r @apply ${currentStyles}; \r}`;
    });

    return result.join('\r');
};
