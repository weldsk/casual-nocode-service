import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../services/use-auth";

const NavigationBar = () => {
  const { isAuthenticated, processLogout } = useAuth();
  const displayNavbar = () => {
    if (isAuthenticated) {
      return (
        <Nav>
          <Nav.Link data-testid="mypage-nav" as={NavLink} to={"/mypage"}>
            MyPage
          </Nav.Link>
          <Nav.Link
            data-testid="logout-nav"
            onClick={processLogout}
            as={NavLink}
            to={"/"}
          >
            Logout
          </Nav.Link>
          <Nav.Link href={"/editpage"}>
            EditPage 
          </Nav.Link>
        </Nav>
      );
    } else {
      return (
        <Nav>
          <Nav.Link data-testid="login-nav" as={NavLink} to={"/login"}>
            Login
          </Nav.Link>
          <Nav.Link data-testid="signup-nav" as={NavLink} to={"/signup"}>
            Sign up
          </Nav.Link>
        </Nav>
      );
    }
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" fixed="top">
      <Container fluid>
        <Navbar.Brand href={"/"}>cncs</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarTogglerContent" />
        <Navbar.Collapse id="navbarTogglerContent">
          <Nav className="me-auto mb-2 mb-lg-0">{displayNavbar()}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
