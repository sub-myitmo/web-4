import React, {useEffect} from 'react';
import XYRForm from "./XYRForm";
import MySVG from "./MySVG";
import ResultsTable from "./ResultsTable";
import {useDispatch} from "react-redux";
import {addPoint, authorize, clearPoints, setToken} from "../../store/tokenSlice";
import api from "../../api";
import Cookies from "js-cookie";
import './main.css'

function Main() {

    const dispatch = useDispatch();
    //const tokenFromStore = useSelector(state => state.token.token)

    useEffect(() => {
        const token = Cookies.get('authToken');
        console.debug("token from cookies: " + token)
        if (token) {
            dispatch(setToken(token))
            //dispatch(authorize()); // Сохраните токен в хранилище

            api.getPoints(token)
                .then(data => {
                    console.debug("Пришедшие точки: " + data)
                    dispatch(clearPoints())
                    data.map(point => dispatch(addPoint(point)))
                })
                .catch(error => {
                    console.log('Ошибка при запросе точек!')
                });
        }
    }, [dispatch])

    return (
        <main className="main">
            <div className={"graph"}>
                <MySVG/>
                <XYRForm/>
            </div>
                <h1>Результаты:</h1>
                <ResultsTable/>

        </main>
    );
}

export default Main;