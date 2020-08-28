import { createContext } from 'react';

const ExceptionContext = createContext({
    open: {
        value: false,
        msg: '',
        statusCode: null,
        statusType: ''
    },
    // isLogged: false,
    setOpen: () => {}
});

export default ExceptionContext
