import {mapTypographyConfig, mapTailwindConfig} from './mapOutput';

figma.showUI(__html__, {width: 1200, height: 600});

figma.ui.onmessage = async ({type, outputType, outputUnits}) => {
    if (type === 'cancel') {
        figma.closePlugin();
    }

    if (type === 'output-typography') {
        await figma.loadFontAsync({family: 'Inter', style: 'Regular'});

        const result =
            outputType === 'tailwind'
                ? {
                      config: mapTailwindConfig(outputUnits),
                      css: mapTypographyConfig(),
                  }
                : {};

        figma.ui.postMessage(result);
    }
};
