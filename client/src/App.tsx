import React from 'react';
import {AppRouter} from "./router";
import {AuthContextProvider} from "./context";

function App() {
  return (
    <AuthContextProvider>
        <AppRouter/>
    </AuthContextProvider>
  );
}

export default App;
