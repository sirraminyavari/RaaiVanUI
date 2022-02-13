import cssVariablesTheme from '@etchteam/storybook-addon-css-variables-theme';
import defaultTheme from '!!style-loader?injectType=lazyStyleTag!css-loader!../src/stories/assets/css/theme-default.css';
import * as cssVariables from '../src/constant/CssVariables';

const cssVars = Object.entries(cssVariables).map(([key, val]) => ({
  title: key,
  color: val,
}));
export const decorators = [cssVariablesTheme];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    presetColors: [...cssVars],
    matchers: {
      color: /(background|color|fill)$/i,
      date: /Date$/,
    },
  },
  cssVariables: {
    files: {
      defaultTheme,
    },
  },
};
