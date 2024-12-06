import React from 'react';
import Auth from './components/auth/Auth'
import Main from './components/main/Main'
import {Routes, Route, Navigate} from 'react-router-dom'
import {useSelector} from "react-redux";
import Profile from "./components/profile/Profile";
import Header from "./components/header/Header";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import Admin from "./components/admin/Admin";


function App() {

    const isAuth = Boolean(useSelector(state => state.token.auth))

    const createPage = (component) => {
        return (
            <div className={"mainComponent"}>
                <Header/>
                <Nav/>
                {component}
                <Footer/>
            </div>
        )
    }

    return (
        <div className={"wrapper"}>
            <Routes>

                <Route path="/main"
                       element={
                           isAuth ? createPage(<Main/>) : <Navigate to="/"/>
                       }/>

                <Route path="/"
                       element={
                           isAuth ? <Navigate to="/main"/> : <Auth/>
                       }/>

                <Route path="/profile"
                       element={
                           isAuth ? createPage(<Profile/>) : <Navigate to="/"/>
                       }/>

                <Route path="/admin-panel"
                       element={
                           isAuth ? createPage(<Admin/>) : <Navigate to="/"/>
                       }/>


                {/*<Route path="*" element={<NotFound/>}/>*/}
            </Routes>

        </div>
    );
}

export default App;