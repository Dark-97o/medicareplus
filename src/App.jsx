import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RegisterDoctor from "./pages/RegisterDoctor";
import RegisterPatient from "./pages/RegisterPatient";
import BookAppointment from "./pages/BookAppointment";
import Dashboard from "./pages/Dashboard";

function App(){

 return(

 <BrowserRouter>

 <Routes>

 <Route path="/" element={<Home/>}/>
 <Route path="/doctor/register" element={<RegisterDoctor/>}/>
 <Route path="/patient/register" element={<RegisterPatient/>}/>
 <Route path="/book" element={<BookAppointment/>}/>
 <Route path="/dashboard" element={<Dashboard/>}/>

 </Routes>

 </BrowserRouter>

 );

}

export default App;