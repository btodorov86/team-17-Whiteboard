export const BASE_URL = 'http://localhost:3000';

export const isErrorResponse = (value) => {
    if (value.error) {
        throw new Error(value.message)
    }
    return
}
export const dateFormat = (date) => date.toLocaleDateString('en-GB', {
    day : 'numeric',
    month : 'short',
    year : 'numeric'
}).split(' ').join('-');

export const logOutHandler = (setUser, history) => {
    setUser(null);
    localStorage.removeItem("token");
    history.push("/home");
  };

export const exceptionStatus = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    success: 'success'
};
export const exceptionMsg = {
    error: 'Try again after few seconds',
    warning: 'NO PERMISSION ',
    info: 'info',
    success: `Success everything is OK`
};
