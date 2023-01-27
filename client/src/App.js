import './App.css';
import {Routes, Route} from 'react-router-dom';
import Homepage from './Components/homepage';
import Customerlogin from './Components/login';
import Customerregister from './Components/register.js';
import Allhotels from './Components/Dashboard/allhotels';
import Mybookings from './Components/Dashboard/mybookings';
import Dashboard from './Components/dashboard.js';


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Customerlogin />} />
        <Route path='/register' element={<Customerregister />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/hotels' element= {<Allhotels />} />
        <Route path='/bookings' element= {<Mybookings />} />
      </Routes>
    </>
  );
}

export default App;
