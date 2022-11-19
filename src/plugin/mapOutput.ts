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

const getFontStyles = (font, isDesktop, currentStyles) => {
    console.log(font);
    const breakpointModifier = isDesktop ? 'sm:' : '';
    const shouldShowValue = (value) => !!value && (!isDesktop || !currentStyles.includes(value.toLowerCase()));

    const styles = font.fontName.style.split(' ');
    const {textCase} = font;
    const fontWeight = styles[0];
    const fontStyle = styles[1] || '';

    const parsedName = `${breakpointModifier}text-${font.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    const parsedWeight = shouldShowValue(fontWeight) ? ` ${breakpointModifier}font-${fontWeight.toLowerCase()}` : '';
    const parsedStyle = shouldShowValue(fontStyle) ? ` ${breakpointModifier}${fontStyle.toLowerCase()}` : '';
    const parsedFamily = shouldShowValue(font.fontName.family)
        ? ` ${breakpointModifier}font-${getBaseName(font.fontName.family)}`
        : '';
    const uppercase = textCase === 'UPPER' && shouldShowValue('uppercase') ? ` ${breakpointModifier}uppercase` : '';

    const lowercase = textCase === 'LOWER' && shouldShowValue('lowercase') ? ` ${breakpointModifier}lowercase` : '';

    const originalCase =
        textCase === 'ORIGINAL' && (!shouldShowValue('uppercase') || !shouldShowValue('lowercase'))
            ? ` ${breakpointModifier}normal-case`
            : '';
    return (
        currentStyles + parsedName + parsedWeight + parsedStyle + parsedFamily + uppercase + lowercase + originalCase
    );
};

export const mapTailwindConfig = (outputUnits) => {
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

        return {
            [cleanedName]: [
                convertToCurrentUnits(fontSize, fontSize),
                {
                    letterSpacing: convertToCurrentUnits(letterSpacing, fontSize),
                    lineHeight: convertToCurrentUnits(lineHeight, fontSize),
                },
            ],
        };
    });

    const stringified = JSON.stringify({fontSize: result}, null, 2);

    return stringified.slice(1, stringified.length - 1).trim();
};

export const mapTypographyConfig = () => {
    const mobileFonts = savedTextStyles.filter((style) => style.name.toLowerCase().includes('mobile'));
    const desktopFonts = savedTextStyles.filter((style) => style.name.toLowerCase().includes('desktop'));

    const result = mobileFonts.map((font) => {
        const matchingDesktopFont = desktopFonts.find(({name}) => getBaseName(font.name).includes(getBaseName(name)));

        const getTitle = (font) => removeLeadingTrailingCharacters(getBaseName(font.name));

        let currentStyles = getFontStyles(font, false, '');
        currentStyles = getFontStyles(matchingDesktopFont, true, currentStyles + ' ');

        return `.${getTitle(font)} {\r @apply ${currentStyles}; \r}`;
    });

    return result.join('\r');
};
