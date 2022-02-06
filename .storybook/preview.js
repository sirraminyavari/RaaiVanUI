import cssVariablesTheme from '@etchteam/storybook-addon-css-variables-theme'
import defaultTheme from '!!style-loader?injectType=lazyStyleTag!css-loader!../src/stories/assets/css/theme-default.css'

export const decorators = [
  cssVariablesTheme,
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  cssVariables: {
    files: {
      defaultTheme
    }
  }
};