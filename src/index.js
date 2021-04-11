import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
import { WindowProvider } from 'context/WindowProvider';

render(
  <StrictMode>
    <WindowProvider>
      <App />
    </WindowProvider>
  </StrictMode>,
  document.getElementById('root')
);
