import './App.css';
import {Routes, Route} from 'react-router-dom';
// import Homepage from './Components/homepage';
import Customerlogin from './Components/login';
import Customerregister from './Components/register.js';
import Allhotels from './Components/Dashboard/allhotels';
// import Mybookings from './Components/Dashboard/mybookings';
import Dashboard from './Components/dashboard.js';
import Forgetroute from './Components/forgetroute.js';
import Viewhotel from './Components/Dashboard/viewHotel.js';
import Resetpassword from './Components/resetPassword.js';

function App() {
  return (
    <>
      <Routes>
        
        <Route path='/login' element={<Customerlogin />} /> {/* ./Components/login  */}
        <Route path='/register' element={<Customerregister />} /> {/* ./Components/register */}
        <Route path='forgetpassword' element={<Forgetroute />} /> {/* /Components/forgetroute.js */}
        <Route path='resetpassword/*' element={<Resetpassword />} /> {/* filepath:  /Components/resetPassword.js */}
        <Route path='/dashboard' element={<Dashboard />} /> {/* filepath: /Components/dashboard.js  */}
        <Route path="/viewhotel/*" element={<Viewhotel />} /> {/* filepath : /Components/Dashboard/viewHotel.js  */}
        <Route path='/hotels' element= {<Allhotels />} /> {/* file path : /Components/Dashboard/allhotels.js */}
        <Route path='/*' element={<Dashboard />} />  {/* Anything except above will direct to /dashboard */}
      </Routes>
    </>
  );
}

export default App;
