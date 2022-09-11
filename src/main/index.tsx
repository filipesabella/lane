import '@fontsource/barlow';
import 'modern-css-reset';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../style/index.less';
import { App } from './components/App';

createRoot(document.getElementById('root')!)
  .render(
    <React.StrictMode>
      <BrowserRouter basename={process.env.BASE_PATH ?? '/'}>
        <App />
      </BrowserRouter>
    </React.StrictMode>);

