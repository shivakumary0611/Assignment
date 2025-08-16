import { useState } from 'react'
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
