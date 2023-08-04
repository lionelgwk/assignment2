import logo from './logo.svg';
import { useState, useEffect, useContext, useMemo } from "react";
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider, Routes } from "react-router-dom";
import { ethers } from "ethers";
import { votingABI } from "./abi/voting";

// context
import { MetamaskInstalledContext } from "./context/MetamaskInstalledContext";

// components
import Navbar from './components/navbar/navbar';
import Register from './pages/register/register';
import Home from './pages/home/home';
import NoMetamask from './pages/noMetamask/noMetamask';
import Event from './pages/event/event';
import Create from './pages/create/create';



// styles
import './App.css';





function App() {

  const metamaskInstalled = useContext(MetamaskInstalledContext);
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;



  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={metamaskInstalled ? <Navbar /> : <NoMetamask/>}>
        <Route index element={<Register /> }/>
          <Route path="home" element={<Home />} />
          <Route path="event/:id" element={<Event />} />
          <Route path="create" element={<Create />} />
          {/* <Route path="profile" element={<Profile />} /> */}
        <Route path="register" element={<Register />} />
      </Route>
    )
  );

  const getAccount = async () => {
    return window.ethereum.request({
      method: 'eth_requestAccounts'
    });
  }


  const setWalletAddress = async () => {
    try {
      const accounts = await getAccount();
      localStorage.setItem("walletAddress", String(accounts[0]));
    }
    catch (err) {
      console.log(err);
    }
  }
  
  useEffect(() => {
    if (metamaskInstalled) {
      window.ethereum.on("accountsChanged", () => {
        setWalletAddress();
        window.location.reload();
      });
    }
  }, [metamaskInstalled]);
          
  return (
    <>  
      <RouterProvider forceRefresh={true} router={router}/>
    </>
  );
}

export default App;
