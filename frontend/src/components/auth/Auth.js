import React, {useEffect} from 'react';
import AuthForm from "./AuthForm";
import './auth.css'

function Auth() {

    useEffect(() => {
        document.title = "Авторизация"
    }, []);
    return (
        <main className="auth">
            <AuthForm/>
        </main>
    );
}

export default Auth;