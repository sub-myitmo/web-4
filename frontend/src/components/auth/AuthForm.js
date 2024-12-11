import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from "react-redux";
import api from "../../api";
import Button from "../custom/Button";
import {authorize, setToken} from "../../store/tokenSlice";
import TwoFactorInput from "../custom/TwoFactorInput";

function AuthForm() {

    const [isActive, setIsActive] = useState(false);


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailDirty, setEmailDirty] = useState(false)
    const [passwordDirty, setPasswordDirty] = useState(false)
    const [emailError, setEmailError] = useState('Email не может быть пустым!')
    const [passwordError, setPasswordError] = useState('Password не может быть пустым!')

    const [formValid, setFormValid] = useState(false)

    const [seconds, setSeconds] = useState(0)

    const toggleClass = () => {
        setIsActive(!isActive);
        setEmailError('Email не может быть пустым!')
        setPasswordError('Password не может быть пустым!')
        setPasswordDirty(false)
        setEmailDirty(false)
        setFormValid(false)
    };

    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        //secondsRef.current = seconds;
        if (emailError || passwordError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }, [emailError, passwordError, seconds])

    const emailHandler = (e) => {
        console.debug(e)
        setEmail(e)
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!re.test(String(e).toLowerCase())) {
            setEmailError('Некорректный email')
        } else {
            setEmailError('')
        }
    }

    const emailHandlerLogin = (e) => {
        setEmail(e)
        if (e.length < 1) {
            setEmailError('Некорректный email')
        } else {
            setEmailError('')
        }
    }

    const passwordHandler = (e) => {
        setPassword(e)
        if (e.length < 5) {
            setPasswordError('Пароль должен содержать минимум 5 символов')
            if (!e) {
                setPasswordError('Пароль не может быть пустым')
            }
        } else {
            setPasswordError('')
        }
    }

    const blurHandler = (e) => {
        if (e.target.name === 'email') setEmailDirty(true)
        else if (e.target.name === 'password') setPasswordDirty(true)
    }


    const authHandler = (e, type) => {
        e.preventDefault();
        if (type === "login") {
            api.loginReq(email, password)
                .then(data => {
                    // проявить инпут, куда пишем код из соо
                    console.debug(data)

                    document.getElementById("two_factor").classList.remove("hidden-code")
                    document.getElementById("overlay-modal").classList.remove("hidden-code")

                    setSeconds(59)
                    const intervalId = setInterval(() => {
                        setSeconds(prevCount => {
                            // Проверяем, достигли ли мы значения 10
                            if (prevCount <= 0) {
                                clearInterval(intervalId); // Останавливаем интервал
                                console.debug(prevCount)
                                return prevCount; // Возвращаем текущее значение
                            }
                            return prevCount - 1; // Увеличиваем счетчик
                        });
                    }, 1000);

                    return () => clearInterval(intervalId);
                    // navigate(`/main`, {replace: true})
                    // dispatch(setToken(data.token))
                    // dispatch(authorize())
                })
                .catch(error => {
                    setEmailError(`Неверный пароль к аккаунту ${email}!`)
                    console.debug('Can not sign in! ' + error)
                });
        } else if (type === "register") {
            api.registerReq(email, password)
                .then(data => {
                    if (data.token === null) {
                        setEmailError(`Аккаунт с таким email (${email}) уже зарегистрирован!`)
                    } else {

                        dispatch(setToken(data.token))
                        dispatch(authorize())
                        navigate("/main", {replace: true})
                    }
                })
                .catch(error => {
                    console.debug('Can not sign in! ' + error)
                });
        }
    }

    const loginWithCode = (code) => {
        api.twoFactorLogin(email, password, code)
            .then(data => {
                dispatch(setToken(data.token))
                dispatch(authorize())
                navigate("/main", {replace: true})

            })
            .catch(error => {
                console.debug('Can not sign up! ' + error)
            });
    }

    const close = (e) => {
        document.getElementById("two_factor").classList.add("hidden-code")
        document.getElementById("overlay-modal").classList.add("hidden-code")

    }

    return (
        <div className={"second-root"}>
            <div className={isActive ? 'container active' : 'container'} id="container">
                <div className="form-container sign-up">
                    <form>
                        <h1>Create Account</h1>
                        <span>use your email for registration</span>
                        {(emailDirty && emailError) && <span style={{color: 'red'}}>{emailError}</span>}
                        <input onChange={e => emailHandler(e.target.value)} onBlur={e => blurHandler(e)} name="email"
                               type="text"
                               placeholder="Enter your email..."/>
                        {(passwordDirty && passwordError) && <span style={{color: 'red'}}>{passwordError}</span>}
                        <input onChange={e => {
                            passwordHandler(e.target.value)
                            emailHandler(email)
                        }} onBlur={e => blurHandler(e)} name="password"
                               type="password"
                               placeholder="Enter your password..."/>
                        <Button disabled={!formValid} type="submit" onClick={e => authHandler(e, 'register')}>Sign
                            Up</Button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form>
                        <h1>Sign In</h1>
                        <span>use your email or username for authorization</span>
                        {(emailDirty && emailError) && <span style={{color: 'red'}}>{emailError}</span>}
                        <input onChange={e => emailHandlerLogin(e.target.value)} onBlur={e => blurHandler(e)}
                               name="email" type="text"
                               placeholder="Enter your email or username..."/>
                        {(passwordDirty && passwordError) && <span style={{color: 'red'}}>{passwordError}</span>}
                        <input onChange={e => {
                            passwordHandler(e.target.value)
                            emailHandlerLogin(email)
                        }} onBlur={e => blurHandler(e)} name="password"
                               type="password"
                               placeholder="Enter your password..."/>
                        <Button disabled={!formValid} type="submit" onClick={e => authHandler(e, 'login')}>Sign
                            In</Button>
                    </form>
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <Button onClick={() => toggleClass()} className="hidden" id="login">Sign In</Button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of site features</p>
                            <Button onClick={() => toggleClass()} className="hidden" id="register">Sign Up</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden-code overlay" id="overlay-modal">
                <div id={"two_factor"} className={"hidden-code two-factor"}>
                    <label className="two-factor-label" htmlFor="code">Введите код, отправленный на вашу почту, в
                        течениe минуты:</label>
                    <TwoFactorInput onChange={e => {
                        console.debug(e.target.value)
                        if (e.target.value.length === 6) loginWithCode(e.target.value)
                    }} name="code" id={"code"} type="text"/>

                    <div className={"time"}>0:{seconds < 10 ? "0"+(seconds) : seconds}</div>
                    <Button disabled={!(seconds === 0)} onClick={e => authHandler(e, 'login')}>Запросить код
                        повторно</Button>
                    <Button id={"close"} onClick={e => close(e)}>X</Button>
                </div>
            </div>

        </div>

    );
}

export default AuthForm;