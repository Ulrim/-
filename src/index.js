import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import State from './core/State';
import * as serviceWorker from './serviceWorker';
import './master.css';


// parseInt : 숫자값만 // ..pathname : 주소값 '/' 뒤에 
// substr(num) : 문자열에서 특정 부분을 골라냄.
const activeRoomId = parseInt(window.location.pathname.substr(1)) || null;
const state = new State({ activeRoomId });

ReactDOM.render(<App state={state}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
