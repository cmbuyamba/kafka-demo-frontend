import './App.css';
import axios from 'axios';
import { useState } from 'react';
import SockJsClient from 'react-stomp';

const App = () => {

  const [message, setMessage] = useState('');
  const [topics, setTopics] = useState([]);

  const onSendBtnClick = () => {
    axios.get("http://192.168.1.104:8080/api?oid=1.3.6.1.4.1.1206.4.2.3.9.8.1.0")
      .then(() => {
        console.log("Request Sent");
      }
      ).catch(() => {
        console.error("Erroe");
      });
  }

  const SOCKET_URL = 'http://192.168.1.104:8080/ws-snmp/';

  const onConnected = () => {
    console.log("Connected!!");
    setTopics(['/topic/snmp-messages']);
  }

  const onDisconnected = () => {
    console.log("Disconnected!");
  }

  const onMessageReceived = (msg) => {
    console.log('New Message Received!!', msg);
    setMessage(msg);
  }

  const date = new Date();

  return (
    <div className="App">
      <SockJsClient 
        url={SOCKET_URL}
        topics={topics}
        onConnect={onConnected}
        onDisconnect={onDisconnected}
        onMessage={onMessageReceived}
        debug={true}
      />
      <header className="App-header">
        <button className="App-button" onClick={onSendBtnClick}>Send</button>
        {message && ((date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()) + ' >> ' + (((typeof message === 'string') && ('From Button >> ' + message)) || ('From Kafka Connector >> ' + message?.payload?.DEVICE_IP + ' >> ' + message?.payload?.VARIABLE)))}
      </header>
    </div>
  );
}

export default App;