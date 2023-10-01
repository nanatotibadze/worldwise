import {NavLink} from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import {useAuth} from "../context/authContext";
import User from "./User";

function PageNav() {
  const {isAuth} = useAuth();
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to='/product'>Product</NavLink>
        </li>
        <li>
          <NavLink to='/pricing'>Pricing</NavLink>
        </li>
        <li>
          {isAuth ? (
            <User />
          ) : (
            <NavLink to='/login' className={styles.ctaLink}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
