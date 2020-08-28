import React, { useState, useContext } from 'react';
import { BASE_URL, exceptionStatus, isErrorResponse, exceptionMsg } from '../../Constants/Constant';
import ExceptionContext from '../../Providers/Context/ExceptionContext';


const CreateBook = (props) => {

    const { setOpen } = useContext(ExceptionContext);

    const [ book, setBook ] = useState({
        header: '',
        author: '',
        contents: '',
    })

    const createHandler = (e) => {
        if (Object.values(book).includes('')) {
            setOpen({ value: true, msg: 'You miss at least one required field', statusType: exceptionStatus.error})
        }
        fetch(`${BASE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify(book)
        })
        .then( r => r.json())
        .then( resp => {
            isErrorResponse(resp);
            setOpen({ value: true, msg: exceptionMsg.success, statusType: exceptionStatus.success})
        })
        .catch( err => setOpen({ value: true, msg: err.message, statusType: exceptionStatus.error}))
    }

    return (
        <>
        <input id='header' onChange={(e) => setBook({ ...book, header: e.target.value})} />
        <input id='author' onChange={(e) => setBook({ ...book, author: e.target.value})} />
        <input id='content' onChange={(e) => setBook({ ...book, contents: e.target.value})} />
        <button onClick={createHandler}>Submit</button>
        </>
    )

}

export default CreateBook
