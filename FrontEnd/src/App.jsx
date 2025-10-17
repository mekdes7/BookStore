
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './component/pages/HomePage'
import ReaderSignPage from './component/pages/ReaderSignPage';
import ReaderLogin from './component/pages/ReaderLogin';
import AuthorSignPage from './component/pages/AuthorSignPage';
import AuthorLogin from './component/pages/AuthorLogin';
import AddBook from './component/dashboard/AddBook';
import AuthorPanel from './component/dashboard/AuthorPanel';
import ReaderDashboard from './component/dashboard/ReaderDashboard';



function App() {


  return (
    <>
    
    <div>
     
       <Router>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path="/signup/reader" element={<ReaderSignPage/>} />
        <Route path="/signup/author" element={<AuthorSignPage/>}/>
     <Route path='/login/reader' element={<ReaderLogin/>}/>
     <Route path='/login/author' element={<AuthorLogin/>}/>
     <Route path='/login' element={<AuthorLogin/>}/>
     <Route path='/dashboard/author' element={<AuthorPanel/>}/>
     <Route path='/dashboard/reader' element={<ReaderDashboard/>}/>
       <Route path='/add-book' element={<AddBook/>}/>
      </Routes>
    </Router>
     </div>
    </>
  )
}

export default App
