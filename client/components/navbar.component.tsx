import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../services/use-auth";
import i18n from "../i18n/i18n";


const NavigationBar = () => {
  const { isAuthenticated, processLogout } = useAuth();
  const displayNavbar = () => {
    if (isAuthenticated) {
      return (
        <Nav>
          <Nav.Link data-testid="mypage-nav" as={NavLink} to={"/mypage"}>
            {i18n.t("header.MyPage")}
          </Nav.Link>
          <Nav.Link data-testid="editpage-nav" as={NavLink} to={"/editpage"}>
            EditPage
          </Nav.Link>
          <Nav.Link
            data-testid="logout-nav"
            onClick={processLogout}
            as={NavLink}
            to={"/"}
          >
            Logout
          </Nav.Link>
        </Nav>
      );
    } else {
      return (
        <Nav>
          <Nav.Link data-testid="login-nav" as={NavLink} to={"/login"}>
            {i18n.t("header.MyPage")}
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
