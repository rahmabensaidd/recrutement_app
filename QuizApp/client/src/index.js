import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
import DarkMode from './pages/Dashboard/Settings/DarkMode';

ReactDOM.render(
  <Provider store={store}>
   
    <App />
  </Provider>,
  document.getElementById('root')
);
