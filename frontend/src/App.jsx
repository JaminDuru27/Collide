import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Menu } from './pages/menu'
import { Register } from './pages/register'
import { Editor } from './pages/editor'

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <>
          {/* <Home/> */}
          </>
        }></Route>
        <Route path='/register' element={
          <>
          <Register/>
          </>
        }></Route>
        <Route path='/menu' element={
          <>
          <Menu/>
          </>
        }></Route>
        <Route path='/editor' element={
          <>
          <Editor/>
          </>
        }></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


window.addEventListener(`contextmenu`, (e)=>{
  e.preventDefault()
})