import React from 'react';

// css styles
import './header.css'

function Header() {



    return (
        <header id={"header"} className="header">
                <div className="header-title">
                    <h3>
                        <a href="https://github.com/petrovviacheslav">Petrov Viacheslav
                            P3208 lab4 var.lol</a>
                    </h3>
            </div>

        </header>

    )
}

Header.propTypes = {}

export default Header
