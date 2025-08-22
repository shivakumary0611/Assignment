import React from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className='navbar'>
      <div className='logo'>Curam</div>
      <ul className='nav-links'>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/survey">Survey</Link></li>
        <li><Link to="/createSurvey">Create Survey</Link></li>
        <li><Link to="/response">Response</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
