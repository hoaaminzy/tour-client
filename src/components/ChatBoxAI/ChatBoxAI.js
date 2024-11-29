import axios from "axios";
import React, { useState } from "react";

const ChatBoxAI = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
  
    const handleSend = async () => {
      if (message.trim() === '') return;
  
      const userMessage = { sender: 'user', message };
      setChat([...chat, userMessage]);
  
      try {
        const response = await axios.post('http://localhost:8000/api/chat', { message });
        console.log("Server response: ", response.data);
        const botReply = { sender: 'bot', message: response.data.reply };
        setChat([...chat, userMessage, botReply]);
      } catch (error) {
        console.error('Error with AI response:', error);
      }
  
      setMessage('');
    };
  

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <span>{msg.sender === 'user' ? 'You' : 'AI'}: </span>{msg.message}
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBoxAI;
