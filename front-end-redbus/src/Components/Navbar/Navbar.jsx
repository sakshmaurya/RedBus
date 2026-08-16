import React from "react";
import axios from "axios";
import styles from "./Navbar.module.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdMenu, MdClose } from "react-icons/md";
import { FaBus, FaRoute, FaUsers, FaComments, FaMapMarkedAlt, FaTicketAlt, FaCalendarAlt, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/auth/actions";
import ComingSoonModal from "../../Elements/ComingSoonModal";
import { useTranslation } from "react-i18next";
import { MdLanguage, MdDarkMode, MdLightMode } from "react-icons/md";


const Navbar = () => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [anchorElLang, setAnchorElLang] = React.useState(null);
  const [darkMode, setDarkMode] = React.useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { t, i18n } = useTranslation();


  const navigate = useNavigate();
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
    navigate("/");
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


  const handleLanguageClick = (e) => {
    setAnchorElLang(e.currentTarget);
  };


  const handleLanguageClose = (lang) => {
    setAnchorElLang(null);
    if (!lang || typeof lang !== 'string') return;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    if (currentCustomer?._id) {
      axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customers/${currentCustomer._id}/preferences`, {
        language: lang
      }).catch(err => console.log("Failed to sync language preference:", err));
    }
  };


  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', newMode);
    if (currentCustomer?._id) {
      axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customers/${currentCustomer._id}/preferences`, {
        theme: newMode ? 'dark' : 'light'
      }).catch(err => console.log("Failed to sync theme preference:", err));
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerItems = [
    { text: t('nav.busTickets'), icon: <FaBus />, link: "/" },
    { text: t('nav.busHire'), icon: <FaRoute />, link: "/bus-hire" },
    { text: t('nav.travelCommunity'), icon: <FaUsers />, link: "/community" },
    { text: t('nav.forum'), icon: <FaComments />, link: "/forum" },
    { text: t('routePlanner.title'), icon: <FaMapMarkedAlt />, link: "/route-planner" },
  ];


  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
    if (currentCustomer?._id) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customers/${currentCustomer._id}/preferences`)
        .then(res => {
          if (res.data?.preferences) {
            const { language: serverLang, theme: serverTheme } = res.data.preferences;
            if (serverTheme && !localStorage.getItem('theme')) {
              setDarkMode(serverTheme === 'dark');
              document.body.classList.toggle('dark-mode', serverTheme === 'dark');
              localStorage.setItem('theme', serverTheme);
            }
            if (serverLang && !localStorage.getItem('language')) {
              i18n.changeLanguage(serverLang);
              localStorage.setItem('language', serverLang);
            }
          }
        })
        .catch(() => {});
    }
  }, [currentCustomer?._id, i18n]);

  // Force white color on navbar links in dark mode
  React.useEffect(() => {
    const updateLinkColors = () => {
      const links = document.querySelectorAll('.Navbar__listOne a');
      links.forEach(link => {
        if (darkMode) {
          link.style.color = '#ffffff';
          link.style.setProperty('color', '#ffffff', 'important');
        } else {
          link.style.color = 'white';
          link.style.removeProperty('color');
        }
      });
    };

    updateLinkColors();
    
    // Also update when DOM changes
    const observer = new MutationObserver(() => {
      updateLinkColors();
    });

    const navbarListOne = document.querySelector('.Navbar__listOne');
    if (navbarListOne) {
      observer.observe(navbarListOne, { childList: true, subtree: true });
    }

    return () => {
      if (navbarListOne) {
        observer.disconnect();
      }
    };
  }, [darkMode]);

  // Force white color on navbar links on hover in dark mode
  React.useEffect(() => {
    const handleMouseEnter = (e) => {
      if (darkMode) {
        e.target.style.color = '#ffffff';
        e.target.style.setProperty('color', '#ffffff', 'important');
      }
    };
    
    const handleMouseLeave = (e) => {
      if (darkMode) {
        e.target.style.color = '#ffffff';
        e.target.style.setProperty('color', '#ffffff', 'important');
      }
    };

    const addListeners = () => {
      const links = document.querySelectorAll('.Navbar__listOne a');
      links.forEach(link => {
        link.addEventListener('mouseenter', handleMouseEnter);
        link.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    const removeListeners = () => {
      const links = document.querySelectorAll('.Navbar__listOne a');
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
    };

    addListeners();

    return () => {
      removeListeners();
    };
  }, [darkMode]);


  return (

<div className={styles.Navbar}>


<ComingSoonModal
isOpen={isModelOpen}
setIsOpen={setIsModelOpen}
/>

{/* Mobile Menu Button */}
<IconButton
className={styles.mobileMenuButton}
onClick={handleDrawerToggle}
edge="start"
sx={{ display: { sm: 'none' } }}
>
{mobileOpen ? <MdClose /> : <MdMenu />}
</IconButton>

<div className={styles.leftSide_header}>


<img
src="https://www.redbus.in/i/59538b35953097248522a65b4b79650e.png"
alt="logo"
onClick={()=>navigate("/")}
className={styles.logo}
/>



<ul className={styles.Navbar__listOne}>


<li>
<Link to="/">
<FaBus className={styles.navIcon} />
{t('nav.busTickets')}
</Link>
</li>




<li>
<Link to="/bus-hire">
<FaRoute className={styles.navIcon} />
{t('nav.busHire')}
</Link>
</li>


<li>
<Link to="/community">
<FaUsers className={styles.navIcon} />
{t('nav.travelCommunity')}
</Link>
</li>


<li>
<Link to="/forum">
<FaComments className={styles.navIcon} />
{t('nav.forum')}
</Link>
</li>


<li>
<Link to="/route-planner">
<FaMapMarkedAlt className={styles.navIcon} />
{t('routePlanner.title')}
</Link>
</li>


</ul>


</div>



<ul className={styles.Navbar__listTwo}>

<div className={styles.rightSide_header}>


{/* Language Selector */}
<li>
<MdLanguage
className={styles.icons}
onClick={handleLanguageClick}
/>
<Menu
anchorEl={anchorElLang}
open={Boolean(anchorElLang)}
onClose={() => setAnchorElLang(null)}
>
<MenuItem onClick={() => handleLanguageClose('en')}>
{t('language.english')}
</MenuItem>
<MenuItem onClick={() => handleLanguageClose('hi')}>
{t('language.hindi')}
</MenuItem>
</Menu>
</li>


{/* Dark Mode Toggle */}
<li>
{darkMode ? (
<MdLightMode
className={styles.icons}
onClick={toggleDarkMode}
/>
) : (
<MdDarkMode
className={styles.icons}
onClick={toggleDarkMode}
/>
)}
</li>


<li onClick={()=>setIsModelOpen(true)}>
<FaTicketAlt className={styles.navIcon} />
{t('nav.manageBooking')}
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
{t('nav.busTicket')}
</MenuItem>


<MenuItem onClick={handleClose}>
{t('nav.cancel')}
</MenuItem>


<MenuItem onClick={handleClose}>
{t('nav.reschedule')}
</MenuItem>


<MenuItem onClick={handleClose}>
{t('nav.showMyTicket')}
</MenuItem>


<MenuItem onClick={handleClose}>
{t('nav.emailSms')}
</MenuItem>


</Menu>

</li>



<li>

<FaUser className={styles.navIcon} />

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
navigate("/admin-dashboard");
handleClose2();
}}
>
<FaShieldAlt className={styles.navIcon} />
{t('nav.adminDashboard')}
</MenuItem>



<MenuItem
onClick={()=>{
localStorage.removeItem("admin");
handleClose2();
navigate("/");
window.location.reload();
}}
>
<FaSignOutAlt className={styles.navIcon} />
{t('nav.adminLogout')}
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
<FaCalendarAlt className={styles.navIcon} />
{t('nav.myTrips')}
</MenuItem>



<MenuItem>

<Link
to="/my-profile"
style={{
textDecoration:"none",
color:"black"
}}
>
<FaUser className={styles.navIcon} />
{t('nav.myProfile')}
</Link>



</MenuItem>



<MenuItem onClick={handleLogout}>
<FaSignOutAlt className={styles.navIcon} />
{t('nav.signOut')}
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
  navigate("/login");
}}
>
<FaSignInAlt className={styles.navIcon} />
{t('nav.login')}
</MenuItem>


<MenuItem
onClick={()=>{
  handleClose2();
  navigate("/register");
}}
>
<FaUserPlus className={styles.navIcon} />
{t('nav.createAccount')}
</MenuItem>


<MenuItem
onClick={()=>{
  handleClose2();
  navigate("/admin-login");
}}
>
<FaShieldAlt className={styles.navIcon} />
{t('nav.adminLogin')}
</MenuItem>


</Menu>


)


}



</li>



</div>


</ul>


{/* Mobile Drawer */}
<Drawer
variant="temporary"
anchor="right"
open={mobileOpen}
onClose={handleDrawerToggle}
ModalProps={{
keepMounted: true,
}}
sx={{
display: { xs: 'block', sm: 'none' },
'& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
}}
>
<div className={styles.drawerHeader}>
<img
src="https://www.redbus.in/i/59538b35953097248522a65b4b79650e.png"
alt="logo"
onClick={() => {
navigate("/");
handleDrawerToggle();
}}
className={styles.drawerLogo}
/>
<IconButton onClick={handleDrawerToggle}>
<MdClose />
</IconButton>
</div>
<Divider />
<List>
{drawerItems.map((item, index) => (
<ListItem button key={index} onClick={() => {
navigate(item.link);
handleDrawerToggle();
}}>
{item.icon}
<ListItemText primary={item.text} sx={{ ml: 2 }} />
</ListItem>
))}
</List>
<Divider />
<List>
<ListItem button onClick={() => {
handleLanguageClose('en');
handleDrawerToggle();
}}>
<MdLanguage />
<ListItemText primary={t('language.english')} sx={{ ml: 2 }} />
</ListItem>
<ListItem button onClick={() => {
handleLanguageClose('hi');
handleDrawerToggle();
}}>
<MdLanguage />
<ListItemText primary={t('language.hindi')} sx={{ ml: 2 }} />
</ListItem>
</List>
<Divider />
<List>
<ListItem button onClick={() => {
toggleDarkMode();
handleDrawerToggle();
}}>
{darkMode ? <MdLightMode /> : <MdDarkMode />}
<ListItemText primary={darkMode ? t('nav.lightMode') : t('nav.darkMode')} sx={{ ml: 2 }} />
</ListItem>
</List>
<Divider />
{/* Manage Booking Section */}
<List>
<ListItem button onClick={() => {
setIsModelOpen(true);
handleDrawerToggle();
}}>
<FaTicketAlt />
<ListItemText primary={t('nav.manageBooking')} sx={{ ml: 2 }} />
</ListItem>
</List>
<Divider />
{/* Account Section */}
{admin ? (
<List>
<ListItem button onClick={() => {
navigate("/admin-dashboard");
handleDrawerToggle();
}}>
<FaShieldAlt />
<ListItemText primary={t('nav.adminDashboard')} sx={{ ml: 2 }} />
</ListItem>
<ListItem button onClick={() => {
localStorage.removeItem("admin");
handleDrawerToggle();
navigate("/");
window.location.reload();
}}>
<FaSignOutAlt />
<ListItemText primary={t('nav.adminLogout')} sx={{ ml: 2 }} />
</ListItem>
</List>
) : isLoggedIn && currentCustomer ? (
<List>
<ListItem button onClick={() => {
navigate("/my-trips");
handleDrawerToggle();
}}>
<FaCalendarAlt />
<ListItemText primary={t('nav.myTrips')} sx={{ ml: 2 }} />
</ListItem>
<ListItem button onClick={() => {
navigate("/my-profile");
handleDrawerToggle();
}}>
<FaUser />
<ListItemText primary={t('nav.myProfile')} sx={{ ml: 2 }} />
</ListItem>
<ListItem button onClick={() => {
handleLogout();
handleDrawerToggle();
}}>
<FaSignOutAlt />
<ListItemText primary={t('nav.signOut')} sx={{ ml: 2 }} />
</ListItem>
</List>
) : (
<List>
<ListItem button onClick={() => {
navigate("/login");
handleDrawerToggle();
}}>
<FaSignInAlt />
<ListItemText primary={t('nav.login')} sx={{ ml: 2 }} />
</ListItem>
<ListItem button onClick={() => {
navigate("/register");
handleDrawerToggle();
}}>
<FaUserPlus />
<ListItemText primary={t('nav.createAccount')} sx={{ ml: 2 }} />
</ListItem>
<ListItem button onClick={() => {
navigate("/admin-login");
handleDrawerToggle();
}}>
<FaShieldAlt />
<ListItemText primary={t('nav.adminLogin')} sx={{ ml: 2 }} />
</ListItem>
</List>
)}
</Drawer>


</div>


  );
};


export default Navbar;