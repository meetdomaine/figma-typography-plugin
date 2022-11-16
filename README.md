# Figma Typography generator plugin

![image](https://user-images.githubusercontent.com/58891378/202256831-4fdd702e-9cba-4f77-bb9c-c557624b9b21.png)

This plugin generates typography styles based on saved text styles within a figma project. It currently only outputs styles for tailwindcss, but vanilla CSS support is in the roadmap. 

## Quickstart
* Run `yarn` to install dependencies.
* Run `yarn build:watch` to start webpack in watch mode.
* Open `Figma` -> `Plugins` -> `Development` -> `Import plugin from manifest...` and choose `manifest.json` file from this repo.

⭐ Read more on the [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/).

## Toolings
This repo is using:
* React + Webpack
* TypeScript
* Prettier precommit hook
