import React from 'react';
import {AppRouter} from "./router";
// import { io } from 'socket.io-client';

function App() {
  
  // const socket = io("http://localhost:2024");

  // socket.emit('chat message', "je suis le monde");
  // useEffect(()=>{

  // },[socket])  

  return (
    <>
        <AppRouter/>
    </>
  );
}

export default App;
