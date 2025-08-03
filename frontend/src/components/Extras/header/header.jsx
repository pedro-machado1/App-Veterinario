import { Link } from "react-router-dom";
import AccountContainer from "../accountContainer/AccountContainer";
import "./header.css";

function Header({ isLoggedIn }) {
  return (
    <>
      <header className="header">
        <Link className='link'to={'/home'}><h1 className="logo">VetHelp</h1></Link>
        <AccountContainer isLoggedIn={isLoggedIn} />
      </header>
    </>
  );
}

export default Header;