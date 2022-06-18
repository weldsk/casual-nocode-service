import { Container, Nav, Navbar } from "react-bootstrap"
import { useAuth } from "../services/use-auth"

const NavigationBar = () => {
  const {isAuthenticated, processLogout} = useAuth();
  const displayNavbar = () => {
    if (isAuthenticated) {
      return (
        <Nav>
          <Nav.Link href={"/mypage"}>
            MyPage
          </Nav.Link>
          <Nav.Link onClick={processLogout} href={"/"}>
            Logout
          </Nav.Link>
          <Nav.Link href={"/editpage"}>
            EditPage 
          </Nav.Link>
        </Nav>
      )
    } else {
      return (
        <>
          <Nav.Link href={"/login"}>
            Login
          </Nav.Link>
          <Nav.Link href={"/signup"}>
            Sign up
          </Nav.Link>
        </>
      )
    }
  }
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" fixed="top">
      <Container fluid>
        <Navbar.Brand href={"/"}>
          cncs
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarTogglerContent" />
        <Navbar.Collapse id="navbarTogglerContent">
          <Nav className="me-auto mb-2 mb-lg-0">
            {displayNavbar()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar;