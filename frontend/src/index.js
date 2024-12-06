import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store'
import {Provider} from "react-redux";
import  {BrowserRouter} from 'react-router-dom'

localStorage.setItem('token', null)
localStorage.setItem('points', '')
localStorage.setItem('auth', 'false')
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    //<React.StrictMode>
        <BrowserRouter>
            <Provider  store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    //</React.StrictMode>
);

