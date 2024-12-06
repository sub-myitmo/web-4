import {createSlice} from '@reduxjs/toolkit';
import localStorage from "redux-persist/es/storage";
import Cookies from 'js-cookie';

const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        token: '',
        points: [],
        r: 1,
        auth: Boolean(Cookies.get('authToken') != null && Cookies.get('authToken').length > 20),
        username: null,
        email: null,
        users: []
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload

            Cookies.set('authToken', action.payload.toString(), { expires: 1 });
            localStorage.setItem("token", "Can be replace: "+action.payload.toString())
            console.debug("Установлен токен: " + state.token)
        },
        clearToken(state, action) {
            state.token = ''
            Cookies.remove('authToken');
            localStorage.setItem("token", null)
            console.debug("Токен очищен")
        },
        addPoint(state, action) {
            state.points.push(action.payload)
        },
        clearPoints(state, action) {
            state.points = []
            console.debug("Хранилище точек очищено")
        },
        changeR(state, action) {
            state.r = parseFloat(action.payload)
        },
        authorize(state, action) {
            state.auth = true

            console.debug("auth установлен")
            localStorage.setItem("auth", "true")
        },
        logOut(state, action) {
            state.auth = false
            Cookies.remove('authToken');
            console.debug("auth сброшен")
            localStorage.setItem("auth", "false")
        },
        setUsername(state, action) {
            state.username = action.payload
            console.debug("Установлен username: " + state.username)
        },
        setEmail(state, action) {
            state.email = action.payload
            console.debug("Установлен email: " + state.email)
        },
        clearUsername(state, action) {
            state.username = null
            console.debug("Username сброшен")
        },
        clearEmail(state, action) {
            state.email = null
            console.debug("Email сброшен")
        },
        addUser(state, action) {
            state.users.push(action.payload)
        },
        clearUsers(state, action) {
            state.users = []
            console.debug("Хранилище пользователей очищено")
        },
    },
});

export const {setToken, clearToken, addPoint, clearPoints, changeR, authorize, logOut, setEmail, setUsername, clearEmail, clearUsername, addUser, clearUsers} = tokenSlice.actions;

export default tokenSlice.reducer;