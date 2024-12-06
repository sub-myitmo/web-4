import React from 'react';
import {useSelector} from "react-redux";
import './resultTable.css'

const ResultsTable = () => {

    const points = useSelector(state => state.token.points)

    return (

        <table id="check" className="table-check">
            <thead>
            <tr className="table-header">
                <th scope="col">X</th>
                <th scope="col">Y</th>
                <th scope="col">R</th>
                <th scope="col">Попал?</th>
                <th scope="col">Дата</th>
            </tr>
            </thead>
            <tbody>
            {(points.length === 0) && <tr>
                <td colSpan="5" id="no-results">Нет результатов</td>
            </tr>}

            { (points.length > 0) &&
                points.map(point => {
                    return (
                        <tr key={"tableKey"+point.id} className={point.result ? "hit" : "miss"}>
                            <td>{point.x}</td>
                            <td>{point.y}</td>
                            <td>{point.r}</td>
                            <td>{point.result ? "Да" : "Нет"}</td>
                            <td>{point.currenttime}</td>
                        </tr>
                    );
                })
            }
            </tbody>
        </table>
    )

}
export default ResultsTable;