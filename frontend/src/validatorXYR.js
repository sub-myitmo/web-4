export default class validator {
    static isValid(n, type) {
        if (n === null || isNaN(n) || n === undefined || n.trim() === '') return {error: type + " должно быть числом", success: false}
        try {
            n = parseFloat(n)
        } catch (error) {
            return {error: type + " должно быть числом", success: false}
        }
        if (type === "R") {
            if (n > 3 || n < 1) return {error: type + " должно быть в интервале [1, 3]", success: false}
        } else {
            if (n > 3 || n < -5) return {error: type + " должно быть в интервале [-5, 3]", success: false}
        }
        return {error: '', success: true}
    }
}