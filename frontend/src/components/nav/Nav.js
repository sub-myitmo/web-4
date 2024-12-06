import React, {useEffect, useState} from 'react';

import './nav.css'


function Nav() {

    const [isFixed, setIsFixed] = useState("");

    const handleScroll = () => {
        const headerDown = document.getElementById('header').getBoundingClientRect().bottom;
        const scrollPosition = window.scrollY;

        // Если верхняя часть navbar находится в пределах видимости экрана
        if (scrollPosition >= headerDown) {
            setIsFixed("fixed");
        } else {
            setIsFixed("");
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav id={"navbar"} className={"navbar " + isFixed}>
            <div className="navbar-logo">
                <h1>Меню</h1>
            </div>
            <ul className="navbar-links">
                <li><a href="/main">Главная</a></li>
                <li><a href="/profile">Профиль</a></li>
            </ul>
        </nav>

    );
}

export default Nav;