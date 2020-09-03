import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';


const Chat = () => {

    const [message, setMessage] = useState({
        msg: '',
        room: 'myRoom',
    });
    const [messages, setMessages] = useState([]);

    const socketRef = useRef();

    useEffect(() => {
        console.log('from use');

        socketRef.current = io('http://localhost:3000/chat');

        socketRef.current.on('mesg', ({msg, room}) => {
            setMessages(prev => [...prev, msg])
        })

    }, [messages]);

    const sendMessage = (message) => {
        socketRef.current.emit('mesg', message);
        setMessage({...message, msg: ''});
    }


    return (
        <div>
            <h1>Chat</h1>
            <div>
                <ul>
                    {messages.map( message => <li>{message}</li>)}
                </ul>
            </div>
            <input type='text' value={message.msg} onChange={e => setMessage({ ...message, msg: e.target.value})} onKeyPress={e => e.key === "Enter" ? sendMessage(message) : null}></input>
            <button type='submit' onClick={e => { e.preventDefault(); sendMessage(message)}}>Send</button>
            <button type='submit' onClick={e => { e.preventDefault(); socketRef.current.emit('joinRoom', message.room)}}>Join</button>
        </div>
    )

}

export default Chat
