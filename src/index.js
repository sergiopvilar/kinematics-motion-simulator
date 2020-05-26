import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/AppComponent';

const defaultLanguage = window.location.hash !== '' ? decodeURI(window.location.hash).replace('#', '') : 'Português'

ReactDOM.render(
  <React.StrictMode>
    <App language={defaultLanguage} width={window.outerWidth} />
  </React.StrictMode>,
  document.getElementById('root')
);
