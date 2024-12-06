import React, {useEffect, useState} from 'react';

import './profile.css'

import {useDispatch, useSelector} from "react-redux";
import InputText from "../custom/InputText";
import Button from "../custom/Button";
import api from "../../api";
import {clearPoints, clearToken, logOut, setEmail, setToken, setUsername} from "../../store/tokenSlice";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import Nav from "../nav/Nav";


function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //const tokenFromStore = useSelector(state => state.token.token)
    const tokenFromStore = useSelector(state => state.token.token)
    const emailFromStore = useSelector(state => state.token.email)
    const usernameFromStore = useSelector(state => state.token.username)


    const [username, setUsername2] = useState('')
    const [usernameInfo, setUsernameInfo] = useState({info: '', success: true})

    useEffect(() => {
        const token = Cookies.get('authToken');
        console.debug("token from cookies: " + token)
        if (token) {
            dispatch(setToken(token))
            //dispatch(authorize()); // Сохраните токен в хранилище

            api.getProfile(token)
                .then(data => {
                    dispatch(setEmail(data.email))
                    dispatch(setUsername(data.username))
                })
                .catch(error => {
                    console.log('Ошибка при запросе данных о пользователе!')
                });
        }
    }, [dispatch])

    const logout = (e) => {
        e.preventDefault();
        dispatch(clearToken())
        dispatch(logOut())
        dispatch(clearPoints())
        navigate("/", {replace: true})
    }


    const changeUsername = (e) => {
        e.preventDefault()
        if (username.trim().length > 4) {
            api.changeUsername(username.trim(), tokenFromStore)
                .then(res => {
                    if (res.success) {
                        dispatch(setUsername(username.trim()))
                        setUsernameInfo({info: 'Вы успешно сменили username на "' + username + '"', success: true});
                    } else {
                        setUsernameInfo({info: 'Username "' + username + '" уже занят!', success: false});
                    }
                })
                .catch(e => {
                    setUsernameInfo({info: "Ошибка при отправке username", success: false})
                })
        } else {
            setUsernameInfo({info: "Username должен состоять минимум из 5 символов", success: false})
        }
    }
    return (

        <main className="profile-container">
            <div className="profile-header">
                {/*<img src={user.avatar} alt="Аватар пользователя" className="profile-avatar"/>*/}
                <h1 className="profile-name">Ваш
                    username: {usernameFromStore == null ? "его нет" : usernameFromStore}</h1>
                <p className="profile-email">Ваша почта: {emailFromStore}</p>
            </div>

            <div className={"change"}>
                <form className="login-change">
                    <h3 className="selection-label">Сменить username:</h3>
                    <div className="text-field text-field_floating-3">
                        <InputText id="login"
                                   type="text"
                                   placeholder={"username"}
                                   onChange={(e) => {
                                       setUsername2(e.target.value)
                                       //setUserValid(validator.isValid(e.target.value, "X"))
                                   }}
                                   value={username === null ? '' : username}
                        />
                        <label className="text-field__label" htmlFor="login">Username</label>
                    </div>
                    <div style={{color: usernameInfo.success ? "green" : "red"}}>{usernameInfo.info}</div>
                    <Button disabled={username === usernameFromStore || username.length <= 4}
                            onClick={changeUsername}>Сменить</Button>

                    <Button onClick={logout}>Выйти из аккаунта</Button>
                </form>
            </div>
        </main>

    );
}

export default Profile;