import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // 👈 Añadimos useNavigate y Link
import { Container, Card, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { obtenerPeliculaPorId, eliminarPelicula } from '../services/peliculas';

const ItemDetail = () => {
    const { id } = useParams(); //  ID de la URL
    const navigate = useNavigate(); // Hook para redirigir

    const [pelicula, setPelicula] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Lógica para obtener el detalle de la película
    useEffect(() => {
        const cargarDetalle = async () => {
            try {
                const data = await obtenerPeliculaPorId(id);
                if (data) {
                    setPelicula(data);
                } else {
                    setError("Película no encontrada.");
                }
            } catch (err) {
                setError("Error al cargar los detalles.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        cargarDetalle();
    }, [id]); 

    // 2. Lógica para eliminar la película
    const handleEliminar = async () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la película "${pelicula.titulo}"?`)) {
            try {
                await eliminarPelicula(id);
                alert("¡Película eliminada con éxito!");
                navigate("/"); 
            } catch (e) {
                alert("Hubo un error al intentar eliminar la película.");
                console.error(e);
            }
        }
    };

    // ------------------- Renderizado Condicional -------------------
    if (loading) {
        return (
            <Container className="text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner
                    animation="border" 
                    role="status"
                    variant="warning" 
                    style={{ width: '3rem', height: '3rem' }}
                >
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-3 fs-5 text-warning">
                    Obteniendo detalles de la película...
                </p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">{error}</Alert>
                <Button as={Link} to="/" variant="secondary">Volver al listado</Button>
            </Container>
        );
    }

    
    return (
        <Container className="my-5">
            <div className="detail-container"> 
                <Row>
                    {/* Columna de la imagen */}
                    <Col md={4} className="mb-4">
                        <Card className="shadow-lg">
                            <Card.Img
                                variant="top"
                                src={pelicula.imagenUrl}
                                alt={`Póster de ${pelicula.titulo}`}
                                style={{ maxHeight: '500px', objectFit: 'cover' }}
                            />
                        </Card>
                    </Col>

                    {/* Columna de la información y acciones */}
                    <Col md={8}>
                        <h1 className="mb-4">{pelicula.titulo}</h1>
                        <hr />

                        <p className="lead">
                            <strong>Director:</strong> {pelicula.director}
                        </p>
                        <p className="lead">
                            <strong>Año de Estreno:</strong> {pelicula.año}
                        </p>
                        <p className="lead">
                            <strong>Calificación:</strong>
                            <span className="badge bg-warning text-dark ms-2 p-2">
                                ⭐ {pelicula.calificacion} / 10
                            </span>
                        </p>

                        <h3 className="mt-4">Mi Reseña</h3>
                        <p>{pelicula.reseña}</p>

                        <div className="mt-5 d-flex gap-3">
                            {/* Botón de Editar */}
                            <Button
                                as={Link}
                                to={`/crear?editId=${pelicula.id}`}
                                variant="warning"
                            >
                                ✏️ Editar Película
                            </Button>

                            {/* Botón de Eliminar */}
                            <Button
                                variant="danger"
                                onClick={handleEliminar}
                            >
                                🗑️ Eliminar Película
                            </Button>
                        </div>

                        <Button as={Link} to="/" variant="outline-secondary" className="mt-4">
                            ← Volver al Listado
                        </Button>

                    </Col>
                </Row>
            </div> 
        </Container>
    );
};

export default ItemDetail;