import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {addUser, clearUsers, setToken} from "../../store/tokenSlice";
import api from "../../api";
import {useDispatch, useSelector} from "react-redux";

// Это временный костыль, если дадут доп на админскую панель
function Admin() {

    const dispatch = useDispatch()
    const users = useSelector(state => state.token.users)
    const [lol, setLol] = useState(false)


    useEffect(() => {
        const token = Cookies.get('authToken');
        console.debug("token from cookies: " + token)
        if (token) {
            dispatch(setToken(token))
            //dispatch(authorize()); // Сохраните токен в хранилище

            api.getAllUsers(token)
                .then(data => {
                    if (data === '') setLol(true)
                    else {
                        dispatch(clearUsers())
                        data.map(user => dispatch(addUser(user)))
                    }
                })
                .catch(error => {
                    console.debug('Ошибка при запросе пользователей!')
                });
        }
    }, [])

    return (
        <table>
            <tbody>
            {lol && <tr><td>а что ты тут делаешь??</td></tr>}
            {users.map(user => {
                    return (
                        <tr key={"tr"+user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                        </tr>
                    )
                }
            )}
            </tbody>
        </table>
    )

}

export default Admin