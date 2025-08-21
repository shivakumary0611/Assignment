import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@carbon/react';
import {Add} from '@carbon/react/icons';
import SignUp from './SignUp';

function App() {
  const [count, setCount] = useState(0)

  return (
    
   <>
   <SignUp/>
   </>
  
  )
}

export default App
