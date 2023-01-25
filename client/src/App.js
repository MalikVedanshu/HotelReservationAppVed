import './App.css';
import {Routes, Route} from 'react-router-dom';
import Homepage from './components/homepage';
import Customerlogin from './components/login';
import Customerregister from './components/register.js';


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage />}></Route>
        <Route path='/login' element={<Customerlogin />}></Route>
        <Route path='/register' element={<Customerregister />}></Route>
      </Routes>
    </>
  );
}

export default App;
