import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import SignIn from './sign-in/SignIn'
import SignUp from './sign-up/SignUp'
import InvoiceForm from './invoice/Invoice'
import { BrowserRouter } from 'react-router-dom'
import AppRoute from './route/AppRoute'
// import Dashboard from './dashboard/Dashboard'


function App() {

  return (
 
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  )
}

export default App
