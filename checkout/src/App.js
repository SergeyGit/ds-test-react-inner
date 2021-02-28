import React from 'react';
import './index.scss';
import Checkout from "./components/Checkout/Checkout";
import Header from "./components/Header/Header";


function App() {
  return (
      <div className={"Layout"} >
        <Header/>
        <Checkout/>
      </div>
  );
}

export default App;
