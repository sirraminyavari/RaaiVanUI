# Raaivan.React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Notice:
Add `scripts`, `css` and `fonts` folders from backend source folder to `public/load` ( Ignored by git for file size reduction).

## Quick Start:

In the project directory, you can run:

### `npm install`
This command will install dependencies.
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### Proxy Settings

the app proxies to a SaaS environment by default. if you want to proxy to an Enterprise environment do the steps below:
1. add file named .env in the root of the project.
2. add this line to the file:

```
REACT_APP_ENV = 'ORG'
```

3. if you want to proxy to a custom server, add this line:

```
REACT_APP_PROXY = 'http[s]://[some_address]'
```
