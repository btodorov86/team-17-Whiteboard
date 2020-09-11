
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';


const Chat = () => {

    const [message, setMessage] = useState({
        msg: '',
        room: 'myRoom',
    });
    const [points, setPoints] = useState({room: 'myRoom', x: 50, y: 50});
    // const [comePoints, setComePoints] = useState({x: 0, y: 0});
    const [messages, setMessages] = useState([]);

    const socketRef = useRef();
    useEffect(() => {
        socketRef.current = io('http://localhost:3000/chat');
        console.log('from use');


        socketRef.current.on('mesg', ({msg, room}) => {
            setMessages(prev => [...prev, msg])
        })
        socketRef.current.on('come', data => {
            console.log(data);
            setPoints({...data})
        })

    }, []);

    const sendMessage = (message) => {
        socketRef.current.emit('mesg', message);
        setMessage({...message, msg: ''});
    }

    const handler = (x, y) => {
        if (Math.abs(points.x - x) > 10 && Math.abs(points.y - y) > 10) {
            socketRef.current.emit('send', {x: x, y: y, room: 'myRoom'})
        }

    }


    return (
        <div onMouseMove={(e) => handler(e.clientX, e.clientY)} style={{height: 800, width: 800}} >
            <p style={{
                position: 'absolute',
                top: points.y,
                left: points.x,
            }}>SHARE</p>
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
