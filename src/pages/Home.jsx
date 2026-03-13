import { Link } from "react-router-dom";

function Home(){

return(

<div className="container">

<h1>Smart Healthcare Scheduler</h1>

<Link to="/doctor/register">Register Doctor</Link>
<br/>
<Link to="/patient/register">Register Patient</Link>
<br/>
<Link to="/book">Book Appointment</Link>

</div>

);

}

export default Home;