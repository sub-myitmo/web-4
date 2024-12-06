import React, {useState} from 'react';
import validator from "../../validatorXYR";
import InputText from "../custom/InputText";
import Button from "../custom/Button";
import api from "../../api";
import {useDispatch, useSelector} from "react-redux";
import {addPoint, changeR, clearPoints} from "../../store/tokenSlice";

import './xyrForm.css'

const XYRForm = () => {
    const [point, setPoint] = useState({x: '0', y: '0', r: '1'})

    const [xValid, setXValid] = useState({error: '', success: true})
    const [yValid, setYValid] = useState({error: '', success: true})
    const [rValid, setRValid] = useState({error: '', success: true})

    const tokenFromStore = useSelector(state => state.token.token)
    //const pointsFromState = useSelector(state => state.token.points)

    const dispatch = useDispatch()

    const sendPoint = (e) => {
        e.preventDefault()
        if (xValid.success && yValid.success && rValid.success) {
            api.sendPoint(point, tokenFromStore)
                .then(p => {
                    dispatch(addPoint(p))
                })
        } else {
            console.debug(xValid.error + " " + yValid.error + " " + rValid.error)
        }
    }

    const deletePoints = (e) => {
        e.preventDefault()
        api.deletePoints(tokenFromStore)
            .then(dispatch(clearPoints()))

    }


    const updateR = (e) => {
        setPoint({...point, r: e.target.value})
        setRValid(validator.isValid(e.target.value, "R"))
        if (rValid.success === true) {
            dispatch(changeR(e.target.value))
            console.debug("R=" + e.target.value)
        }

    }

    return (
        <form className="coordinates">

            <div className="xSelection">
                <h3 className="selection-label">Выбери X:</h3>
                <div className="text-field text-field_floating-3">
                    <InputText id="xInput"
                               type="text"
                               placeholder="-5...3"
                               onChange={(e) => {
                                   setPoint({...point, x: e.target.value})
                                   setXValid(validator.isValid(e.target.value, "X"))
                               }}
                               value={point.x}
                    />
                    <label className="text-field__label" htmlFor="xInput">X (-5...3)</label>
                </div>
                {xValid.success ? <div/> : <span style={{color: 'red'}}>{xValid.error}</span>}
            </div>

            <div className="ySelection">
                <h3 className="selection-label">Выбери Y:</h3>
                <div className="text-field text-field_floating-3">
                    <InputText id="yInput"
                               type="text"
                               placeholder="-5...3"
                               onChange={(e) => {
                                   setPoint({...point, y: e.target.value})
                                   setYValid(validator.isValid(e.target.value, "Y"))
                               }}
                               value={point.y}
                    />
                    <label className="text-field__label" htmlFor="yInput">Y (-5...3)</label>
                </div>
                {yValid.success ? <div/> : <span style={{color: 'red'}}>{yValid.error}</span>}
            </div>

            <div className="rSelection">
                <h3 className="selection-label">Выбери R:</h3>

                <div className={"radio-choice"}>

                    <div className="form_radio_btn">
                        <input type="radio" id="contactChoice1" name="contact" value="1" checked={point.r === '1'}
                               onChange={(e) => updateR(e)}/>
                        <label htmlFor="contactChoice1">R = 1</label>
                    </div>

                    <div className="form_radio_btn">
                        <input type="radio" id="contactChoice2" name="contact" value="2" checked={point.r === '2'}
                               onChange={(e) => updateR(e)}/>
                        <label htmlFor="contactChoice2">R = 2</label>
                    </div>
                    <div className="form_radio_btn">
                        <input type="radio" id="contactChoice3" name="contact" value="3" checked={point.r === '3'}
                               onChange={(e) => updateR(e)}/>
                        <label htmlFor="contactChoice3">R = 3</label>
                    </div>
                </div>

                {/*<InputText id="rInput"*/}
                {/*           type="text"*/}
                {/*           placeholder="1...3"*/}

                {/*           value={point.r}*/}
                {/*/>*/}
                {rValid.success ? <div/> : <span style={{color: 'red'}}>{rValid.error}</span>}

            </div>

            <div className="buttons">
                <Button onClick={sendPoint}
                        disabled={!xValid.success || !yValid.success || !rValid.success || point.x === '' || point.y === ''}>Отправить</Button>
                <Button onClick={deletePoints}>Очистить таблицу</Button>
            </div>


        </form>

    )
}

export default XYRForm;