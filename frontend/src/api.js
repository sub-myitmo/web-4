import axios from "axios";

export default class api {
    static path = 'http://localhost:8080'

    static async registerReq(email, password) {
        return await axios.post(api.path + "/auth/register", {
            email: email,
            password: password,
        }).then(res => res.data);
    }


    static async loginReq(emailOrUsername, password) {
        return await axios.post(this.path + '/auth/login', {
            emailOrUsername: emailOrUsername,
            password: password,
        }).then(res => res.data)
    }

    static async sendPoint(point, token) {
        return axios.post(this.path + '/point/add', {
            x: Number(point.x),
            y: Number(point.y),
            r: Number(point.r),
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.data)
            .catch(function (error) {
                if (error.response) {
                    return console.debug("Ошибка при отправке точки! "  + error.response.data.error);
                }
            })
    }

    static async deletePoints(token) {
        return axios.delete(this.path + '/point/delete', {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                "Authorization": "Bearer " + token
            }
        })
            .catch(function (error) {
                if (error.response) {
                    return console.debug(error.response);
                }
            })
    }

    static async getPoints(token) {
        return axios.get(this.path + '/point/getAll', {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.data)
            .catch(function (error) {
                if (error.response) {
                    return console.debug("Ошибка при получении массива точек! " + error.response.data.error);
                }
            })
    }

    static async changeUsername(username, token) {
        return axios.post(this.path + '/user/change', {
            username: username.trim()
        }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.data)
            .catch(function (error) {
                if (error.response) {
                    return console.debug("Ошибка при смене username! "  + error.response.data.error);
                }
            })
    }

    static async getProfile(token) {
        return axios.get(this.path + '/user/getProfile', {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.data)
            .catch(function (error) {
                if (error.response) {
                    return console.debug("Ошибка при получении данных о пользователе! " + error.response.data.error);
                }
            })
    }

    static async getAllUsers(token) {
        return axios.get(this.path + '/admin-panel/getAllUsers', {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.data)
            .catch(function (error) {
                if (error.response) {
                    return console.debug("Ошибка при получении данных о пользователях! " + error.response.data.error);
                }
            })
    }

}