import React from "react";
import styles from "./Navbar.module.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/auth/actions";
import ComingSoonModal from "../../Elements/ComingSoonModal";


const Navbar = () => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [isModelOpen, setIsModelOpen] = React.useState(false);


  const history = useHistory();
  const dispatch = useDispatch();


  const admin = JSON.parse(localStorage.getItem("admin"));


  const isLoggedIn = useSelector(
    (state)=>state.authReducer.isLoggedIn
  );


  const currentCustomer = useSelector(
    (state)=>state.authReducer.currentCustomer
  );


  const handleLogout = () =>{
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    history.push("/");
    window.location.reload();
  };


  const handleClick = (e)=>{
    setAnchorEl(e.currentTarget);
  };


  const handleClick2 = (e)=>{
    setAnchorEl2(e.currentTarget);
  };


  const handleClose = ()=>{
    setAnchorEl(null);
    setIsModelOpen(true);
  };


  const handleClose2 = ()=>{
    setAnchorEl2(null);
  };


  return (

<div className={styles.Navbar}>


<ComingSoonModal
isOpen={isModelOpen}
setIsOpen={setIsModelOpen}
/>


<div className={styles.leftSide_header}>


<img
src="https://www.redbus.in/i/59538b35953097248522a65b4b79650e.png"
alt="logo"
onClick={()=>history.push("/")}
/>


<ul className={styles.Navbar__listOne}>


<li>
<Link to="/">
BUS TICKETS
</Link>
</li>


<li onClick={()=>setIsModelOpen(true)}>
rPool<sup>New</sup>
</li>


<li>
<Link to="/bus-hire">
BUS HIRE
</Link>
</li>


</ul>


</div>



<ul className={styles.Navbar__listTwo}>

<div className={styles.rightSide_header}>


<li onClick={()=>setIsModelOpen(true)}>
MANAGE BOOKING
</li>



<li>

<RiArrowDropDownLine
className={styles.icons}
onClick={handleClick}
/>


<Menu
anchorEl={anchorEl}
open={Boolean(anchorEl)}
onClose={handleClose}
>


<MenuItem onClick={handleClose}>
Bus Ticket
</MenuItem>


<MenuItem onClick={handleClose}>
Cancel
</MenuItem>


<MenuItem onClick={handleClose}>
Reschedule
</MenuItem>


<MenuItem onClick={handleClose}>
Show My Ticket
</MenuItem>


<MenuItem onClick={handleClose}>
Email / SMS
</MenuItem>


</Menu>

</li>



<li>

<MdAccountCircle
className={styles.icons}
style={{fontSize:"30px"}}
/>

</li>



<li>


<RiArrowDropDownLine
className={styles.icons}
onClick={handleClick2}
/>



{/* ADMIN LOGIN */}

{admin ? (

<Menu
anchorEl={anchorEl2}
open={Boolean(anchorEl2)}
onClose={handleClose2}
>


<MenuItem
onClick={()=>{
history.push("/admin-dashboard");
handleClose2();
}}
>
Admin Dashboard
</MenuItem>



<MenuItem
onClick={()=>{

localStorage.removeItem("admin");

handleClose2();

history.push("/");

window.location.reload();

}}
>
Admin Logout
</MenuItem>


</Menu>


)

:

/* CUSTOMER LOGIN */

isLoggedIn && currentCustomer ? (


<Menu
anchorEl={anchorEl2}
open={Boolean(anchorEl2)}
onClose={handleClose2}
>


<MenuItem>
My Trips
</MenuItem>



<MenuItem>

<Link
to="/my-profile"
style={{
textDecoration:"none",
color:"black"
}}
>
My Profile
</Link>

</MenuItem>



<MenuItem onClick={handleLogout}>
SignOut
</MenuItem>


</Menu>


)

:

/* NORMAL USER */


(



<Menu
anchorEl={anchorEl2}
open={Boolean(anchorEl2)}
onClose={handleClose2}
>

<MenuItem
onClick={()=>{
  handleClose2();
  history.push("/login");
}}
>
Login
</MenuItem>


<MenuItem
onClick={()=>{
  handleClose2();
  history.push("/register");
}}
>
Create Account
</MenuItem>


<MenuItem
onClick={()=>{
  handleClose2();
  history.push("/admin-login");
}}
>
Admin Login
</MenuItem>


</Menu>


)


}



</li>



</div>


</ul>


</div>


  );
};


export default Navbar;