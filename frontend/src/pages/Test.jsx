import { useEffect, useRef, useState } from "react"

function Test () {
    const [message, setMessage] = useState(''); // setting the message for the form
    const [messages, setMessages] = useState([]); // storing the array of messages
    const [ws, setWs] = useState(null); // setting the socket

  /**
   * @param {React.FormEvent} event - The event triggered by the form submission.
   */

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws'); // creates the socket for this specific client
        // socketRef.current = socket;
        
        socket.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data])
            console.log("Messages", messages)
        };

        socket.onopen = () => {
        console.log("WebSocket Connected!");
        };

        socket.onerror = (err) => {
        console.error("WebSocket Error", err);
        };

        socket.onclose = () => {
        console.log("WebSocket Disconnected!");
        };

        setWs(socket); // setting the socket

        return () => {
            socket.close();
            // if (socketRef.current) {
            //     socketRef.current.close();
            // }
        };
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        if (ws && message) { // only allow to send a message if there is a socket and a message
            ws.send(message);
            setMessage("");
        }
    };

    return (
        <div className="test-page">
            <h1>FastAPI WebSocketChat</h1>
            <h2>{Date.now()}</h2>

            <form onSubmit={sendMessage}>
                <input
                    type="text"            
                    className="form-control"
                    id="messageText"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    autoComplete="off"
                />
                <button className="btn btn-outline-primary mt-2">Send</button>
            </form>

            <ul id="messages" className="mt-5">
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    )
}

export default Test;