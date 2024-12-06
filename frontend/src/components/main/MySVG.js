import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import api from "../../api";
import {addPoint} from "../../store/tokenSlice";

const MySVG = () => {


    const dispatch = useDispatch();
    const points = useSelector(state => state.token.points)

    const rFromStore = useSelector(state => state.token.r)
    const tokenFromStore = useSelector(state => state.token.token)

    const clickSVG = (e) => {
        e.preventDefault()
        let svg = document.getElementById('paint');
        let pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;

        // The cursor point, translated into SVG coordinates
        let cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());

        let reallyX = cursorpt.x - 150;
        let reallyY = 150 - cursorpt.y;

        api.sendPoint({
            x: (reallyX / 25).toFixed(2),
            y: (reallyY / 25).toFixed(2),
            r: rFromStore
        }, tokenFromStore)
            .then(p => {
                dispatch(addPoint(p))
            })

    }

    return (
        <svg onClick={e => clickSVG(e)} height="300" width="300" xmlns="http://www.w3.org/2000/svg" id="paint">

            <line stroke="black" x1="0" x2="300" y1="150" y2="150"/>
            <line stroke="black" x1="150" x2="150" y1="0" y2="300"/>
            <polygon fill="black" points="150,0 144,15 156,15" stroke="black"/>
            <polygon fill="black" points="300,150 285,156 285,144" stroke="black"/>

            <text fill="black" x="285" y="140">X</text>
            <text fill="black" x="160" y="10">Y</text>

            <text fill="black" x="172" y="140">1</text>
            <text fill="black" x="197" y="140">2</text>
            <text fill="black" x="222" y="140">3</text>
            <text fill="black" x="247" y="140">4</text>
            <text fill="black" x="272" y="140">5</text>


            <text fill="black" x="127" y="140">-1</text>
            <text fill="black" x="102" y="140">-2</text>
            <text fill="black" x="67" y="140">-3</text>
            <text fill="black" x="42" y="140">-4</text>
            <text fill="black" x="17" y="140">-5</text>


            <text fill="black" x="160" y="130">1</text>
            <text fill="black" x="160" y="105">2</text>
            <text fill="black" x="160" y="80">3</text>
            <text fill="black" x="160" y="55">4</text>
            <text fill="black" x="160" y="30">5</text>

            <text fill="black" x="160" y="178">-1</text>
            <text fill="black" x="160" y="203">-2</text>
            <text fill="black" x="160" y="228">-3</text>
            <text fill="black" x="160" y="253">-4</text>
            <text fill="black" x="160" y="278">-5</text>

            <polygon id="triangle"
                     points={"150,150 " + (150 + 25 * rFromStore) + ",150 150," + (150 - 12.5 * rFromStore)}
                     fillOpacity="0.4" stroke="navy"
                     fill="blue"/>

            <rect id="square" x={150 - 25 * rFromStore} y={150 - 25 * rFromStore} width={25 * rFromStore}
                  height={25 * rFromStore} fillOpacity="0.4" stroke="navy"
                  fill="blue"/>

            <path id="arc"
                  d={"M 150 150 L 150 " + (150 + 25 * rFromStore) + " A" + (25*rFromStore) + "," + (25*rFromStore) + " 0 0,1 " + (150 - 25 * rFromStore) + ",150 Z"}
                  fillOpacity="0.4" stroke="navy"
                  fill="blue"/>

            <line stroke="black" x1="25" x2="25" y1="155" y2="145"/>
            <line stroke="black" x1="50" x2="50" y1="155" y2="145"/>
            <line stroke="black" x1="75" x2="75" y1="155" y2="145"/>
            <line stroke="black" x1="100" x2="100" y1="155" y2="145"/>
            <line stroke="black" x1="125" x2="125" y1="155" y2="145"/>

            <line stroke="black" x1="175" x2="175" y1="155" y2="145"/>
            <line stroke="black" x1="200" x2="200" y1="155" y2="145"/>
            <line stroke="black" x1="225" x2="225" y1="155" y2="145"/>
            <line stroke="black" x1="250" x2="250" y1="155" y2="145"/>
            <line stroke="black" x1="275" x2="275" y1="155" y2="145"/>

            <line stroke="black" x1="145" x2="155" y1="25" y2="25"/>
            <line stroke="black" x1="145" x2="155" y1="50" y2="50"/>
            <line stroke="black" x1="145" x2="155" y1="75" y2="75"/>
            <line stroke="black" x1="145" x2="155" y1="100" y2="100"/>
            <line stroke="black" x1="145" x2="155" y1="125" y2="125"/>

            <line stroke="black" x1="145" x2="155" y1="175" y2="175"/>
            <line stroke="black" x1="145" x2="155" y1="200" y2="200"/>
            <line stroke="black" x1="145" x2="155" y1="225" y2="225"/>
            <line stroke="black" x1="145" x2="155" y1="250" y2="250"/>
            <line stroke="black" x1="145" x2="155" y1="275" y2="275"/>

            {(points.length > 0) &&
                points.map(point => {
                    let xPoint = 150 + point.x / point.r * 25 * rFromStore;
                    let yPoint = 150 - point.y / point.r * 25 * rFromStore;

                    if (1 < xPoint && xPoint < 299 && 1 < yPoint && yPoint < 299) {
                        return (
                            <circle key={"pointKey" + point.id}
                                    cx={xPoint}
                                    cy={yPoint}
                                    r={3}
                                    fill={point.result ? "#258a17" : "#f32a15"}
                            />
                        );
                    } return (<text key={"pointKey" + point.id}/>);
                })
            }
        </svg>
    )

}
export default MySVG;
// export default connect()(MySVG);