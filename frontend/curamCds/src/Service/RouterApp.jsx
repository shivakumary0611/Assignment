import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from "../pages/Home"
import Survey from "../pages/Survey"
import CreateSurvey from  "../pages/CreateSurvey"
import Response from "../pages/Response"



function RouterApp() {
  return (
    
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/createSurvey" element={<CreateSurvey />} />
        <Route path="/createSurvey/:id" element={<CreateSurvey />} />
        <Route path="/response" element={<Response />} />
      </Routes>
    
  )
}


export default RouterApp