import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import ShowBook from './Pages/ShowBook'
import UpdateBook from './Pages/UpdateBook'
import DeleteBook from './Pages/DeleteBook'
import CreateBook from './Pages/CreateBook'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/books/details/:id' element={<ShowBook/>}/>
        <Route path='/books/edit/:id' element={<UpdateBook/>}/>
        <Route path='/books/delete/:id' element={<DeleteBook/>}/>
        <Route path='/books/create' element={<CreateBook/>}/>
        
      </Routes>
    </div>
  )
}

export default App
