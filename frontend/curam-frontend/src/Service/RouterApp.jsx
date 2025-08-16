import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from "../Pages/Home"
import Survey from "../Pages/Survey"
import CreateSurvey from "../Pages/CreateSurvey"
import Response from "../Pages/Response"



function RouterApp() {
  return (
    
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/createSurvey" element={<CreateSurvey />} />
        <Route path="/response" element={<Response />} />
      </Routes>
    
  )
}


export default RouterApp