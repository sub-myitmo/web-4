import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from "react-redux";
import api from "../../api";
import Button from "../custom/Button";
import {authorize, setToken} from "../../store/tokenSlice";

function AuthForm() {

    const [isActive, setIsActive] = useState(false);


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailDirty, setEmailDirty] = useState(false)
    const [passwordDirty, setPasswordDirty] = useState(false)
    const [emailError, setEmailError] = useState('Email не может быть пустым!')
    const [passwordError, setPasswordError] = useState('Password не может быть пустым!')

    const [formValid, setFormValid] = useState(false)
    const [signInMsg, setSignInMsg] = React.useState({
        success: true,
        message: ''
    })

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
        if (emailError || passwordError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }, [emailError, passwordError])

    const emailHandler = (e) => {
        setEmail(e.target.value)
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!re.test(String(e.target.value).toLowerCase())) {
            setEmailError('Некорректный email')
        } else {
            setEmailError('')
        }
    }

    const emailHandlerLogin = (e) => {
        setEmail(e.target.value)
        if (e.target.value.length < 1) {
            setEmailError('Некорректный email')
        } else {
            setEmailError('')
        }
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value)
        if (e.target.value.length < 5) {
            setPasswordError('Пароль должен содержать минимум 5 символов')
            if (!e.target.value) {
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
                    navigate(`/main`, {replace: true})
                    dispatch(setToken(data.token))
                    dispatch(authorize())
                    //data.pointsList.map(point => dispatch(addPoint(point)))
                })
                .catch(error => {
                    setEmailError(`Неверный пароль к аккаунту ${email}!`)
                    console.log('Can not sign in')
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
                    console.log('Can not sign in')
                });
        }
    }

    return (
        <div className={isActive ? 'container active' : 'container'} id="container">
            <div className="form-container sign-up">
                <form>
                    <h1>Create Account</h1>
                    <span>use your email for registration</span>
                    {(emailDirty && emailError) && <span style={{color: 'red'}}>{emailError}</span>}
                    <input onChange={e => emailHandler(e)} onBlur={e => blurHandler(e)} name="email" type="text"
                           placeholder="Enter your email..."/>
                    {(passwordDirty && passwordError) && <span style={{color: 'red'}}>{passwordError}</span>}
                    <input onChange={e => passwordHandler(e)} onBlur={e => blurHandler(e)} name="password"
                           type="password"
                           placeholder="Enter your password..."/>
                    <Button disabled={!formValid} type="submit" onClick={e => authHandler(e, 'register')}>Sign
                        Up</Button>
                </form>
            </div>
            <div className="form-container sign-in">
                <form>
                    <h1>Sign In</h1>
                    <span>use your email for registration</span>
                    {(emailDirty && emailError) && <span style={{color: 'red'}}>{emailError}</span>}
                    <input onChange={e => emailHandlerLogin(e)} onBlur={e => blurHandler(e)} name="email" type="text"
                           placeholder="Enter your email or username..."/>
                    {(passwordDirty && passwordError) && <span style={{color: 'red'}}>{passwordError}</span>}
                    <input onChange={e => passwordHandler(e)} onBlur={e => blurHandler(e)} name="password"
                           type="password"
                           placeholder="Enter your password..."/>
                    <Button disabled={!formValid} type="submit" onClick={e => authHandler(e, 'login')}>Sign In</Button>
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

    );
}

export default AuthForm;