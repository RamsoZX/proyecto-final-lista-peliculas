import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

const CustomNavbar = () => {
  return (
    // Aplicamos bg="dark", data-bs-theme="dark" para el contraste 
    // y la clase custom-navbar para nuestro estilo personalizado y la sombra.
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="custom-navbar shadow-lg"> 
      <Container>
        {/* Usamos 'as={Link}' para que el Navbar.Brand navegue */}
        <Navbar.Brand as={Link} to="/">
          🎬 Pelis
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> {/* ms-auto alinea los enlaces a la derecha */}
            
            <Nav.Link as={Link} to="/">
              Listado
            </Nav.Link>
            
            <Nav.Link as={Link} to="/crear">
              Añadir Película
            </Nav.Link>
            
            {/* Opcional: Si quieres un enlace a GitHub en el Navbar para el proyecto */}
           

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;