import React from 'react';

// css styles
import './footer.css'
import image from './favicon.jpg'

function Footer() {


    return (
        <footer className="footer fixed-bottom">
            <div>
                <a href="https://se.ifmo.ru">
                    <img className="vt" src={image} alt=""/>
                </a>
            </div>
            <small>
                Проект доступен с открытым исходным кодом на условиях Лицензии CC BY-NC-SA 4.0. Авторские права 2024
                Петров
                Вячеслав
            </small>
        </footer>
    )
}

Footer.propTypes = {}

export default Footer