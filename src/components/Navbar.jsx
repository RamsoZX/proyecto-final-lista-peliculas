import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="custom-navbar shadow-lg"> 
      <Container>
        <Navbar.Brand as={Link} to="/">
          🎬 Pelis
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> 
            
            <Nav.Link as={Link} to="/">
              Listado
            </Nav.Link>
            
            <Nav.Link as={Link} to="/crear">
              Añadir Película
            </Nav.Link>
            
           

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;