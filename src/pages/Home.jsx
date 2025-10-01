import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { obtenerPeliculas } from '../services/peliculas';
import { Link } from 'react-router-dom';

const Home = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarPeliculas = async () => {
            try {
                const data = await obtenerPeliculas();
                setPeliculas(data);
                setError(null);
            } catch (err) {
                setError("Error al cargar las películas. Revisa tu conexión a Firebase.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        cargarPeliculas();
    }, []); // El array vacío asegura que se ejecuta solo una vez al montar

    // ------------------- Renderizado Condicional -------------------

    if (loading) {
        return (
            // Añadimos clases para altura completa de la ventana y centrado vertical/horizontal
            <Container className="text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner
                    animation="grow" // Cambiamos a animación 'grow' para un look diferente
                    role="status"
                    variant="primary" // Usamos el color primario (azul)
                    style={{ width: '3rem', height: '3rem' }} // Hacemos el spinner más grande
                >
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-3 fs-5 text-primary">
                    Cargando la colección de películas...
                </p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (peliculas.length === 0) {
        return (
            <Container className="text-center my-5">
                <h2>No hay películas registradas 😥</h2>
                <p>¡Ve a la sección "Añadir Película" para empezar tu colección!</p>
                <Button as={Link} to="/crear" variant="primary">
                    Añadir Película
                </Button>
            </Container>
        );
    }

    // ------------------- Renderizado del Listado -------------------

    return (
        <Container className="my-5">
            <h2 className="mb-4">🎬 Mi Colección de Películas</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
                {peliculas.map((pelicula) => (
                    // Usamos el ID como key, que es el ID único de Firestore
                    <Col key={pelicula.id}>
                        <Card className="h-100 shadow-sm">
                            <Card.Img
                                variant="top"
                                src={pelicula.imagenUrl}
                                alt={pelicula.titulo}
                                // Estilo básico para controlar la altura de la imagen en la tarjeta
                                style={{ height: '300px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{pelicula.titulo}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Director: {pelicula.director} ({pelicula.año})
                                </Card.Subtitle>
                                <p className="mb-2">
                                    <span className="badge bg-warning text-dark p-2">
                                        ⭐ {pelicula.calificacion} / 10
                                    </span>
                                </p>
                                {/* Implementación del Ruteo Dinámico: 
                  El Link lleva a /pelicula/ seguido del ID del documento.
                */}
                                <Button
                                    as={Link}
                                    to={`/pelicula/${pelicula.id}`}
                                    variant="outline-primary"
                                >
                                    Ver Detalles
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;