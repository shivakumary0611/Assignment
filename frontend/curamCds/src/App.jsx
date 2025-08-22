import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Navbar from './Service/Navbar'
import RouterApp from './Service/RouterApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <RouterApp/>
    </>
  )
}

export default App
