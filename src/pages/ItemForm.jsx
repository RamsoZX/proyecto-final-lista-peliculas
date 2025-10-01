import { useForm } from 'react-hook-form';
import { Form, Button, Container, Row, Col, Alert, Spinner, ListGroup } from 'react-bootstrap'; 
import { crearPelicula, actualizarPelicula, obtenerPeliculaPorId} from '../services/peliculas';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { TMDB_API_KEY } from '../firebase/config'; // <-- clave de TMDB

// Constantes para la API de TMDB
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const ItemForm = () => {
    // 1. Obtener parámetros de la URL para detectar modo Edición
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('editId');
    const navigate = useNavigate();

    // Incluimos 'watch' para monitorear 'titulo' y 'setValue' para rellenar campos
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();

    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(!!editId);

    //  estados para la funcionalidad de autocompletar de TMDB
    const [sugerencias, setSugerencias] = useState([]); 
    const [buscandoSugerencias, setBuscandoSugerencias] = useState(false);

    // 2. Función para rellenar el formulario al hacer clic en una sugerencia de TMDB
    const handleSugerenciaClick = async (pelicula) => {
        // Rellenamos el título
        setValue('titulo', pelicula.title, { shouldValidate: true });
        
        //  obtener el director (requiere una llamada adicional a TMDB)
        let director = 'Desconocido';
        try {
            const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${pelicula.id}/credits?api_key=${TMDB_API_KEY}`);
            const creditsData = await creditsResponse.json();
            
            const directorEntry = creditsData.crew.find(member => member.job === 'Director');
            if (directorEntry) {
                director = directorEntry.name;
            }
        } catch (e) {
            console.error("Error al obtener el director:", e);
        }

        setValue('director', director, { shouldValidate: true });
        
        //  Año, Calificación, Reseña y URL de Imagen
        const añoEstreno = pelicula.release_date ? parseInt(pelicula.release_date.substring(0, 4)) : '';
        setValue('año', añoEstreno, { shouldValidate: true });

        // Calificación de 0 a 10
        setValue('calificacion', pelicula.vote_average ? pelicula.vote_average.toFixed(1) : 0, { shouldValidate: true });
        
        setValue('reseña', pelicula.overview || 'Sin reseña disponible. Añade tu propia reseña.', { shouldValidate: true });
        
        setValue('imagenUrl', `${TMDB_IMAGE_BASE_URL}${pelicula.poster_path}`, { shouldValidate: true });

        // Limpiar las sugerencias después de seleccionar una
        setSugerencias([]);
    };

    // useEffect para cargar los datos en modo Edición 
    useEffect(() => {
        if (editId) {
            const cargarDatos = async () => {
                try {
                    const data = await obtenerPeliculaPorId(editId);
                    if (data) {
                        reset({
                            ...data,
                            año: data.año || '',
                            calificacion: data.calificacion || '',
                        });
                    } else {
                        setMensaje({ tipo: 'danger', texto: 'Error: La película a editar no fue encontrada.' });
                    }
                } catch (error) {
                    setMensaje({ tipo: 'danger', texto: 'Error al cargar los datos de la película para edición.' });
                } finally {
                    setIsDataLoading(false);
                }
            };
            cargarDatos();
        }
        if (!editId) {
            setIsDataLoading(false);
        }
    }, [editId, reset]);

    //  useEffect para la Lógica de Búsqueda de Sugerencias (TMDB) con Debounce
    useEffect(() => {
        const subscription = watch(async (value, { name }) => {
            const query = value.titulo;
            
            // Solo buscar si estamos en modo CREACIÓN, si el campo es 'titulo', y si hay más de 2 caracteres
            if (!editId && name === 'titulo' && query && query.length > 2) {
                setBuscandoSugerencias(true);
                setSugerencias([]);
                
                //  retraso (debounce) de 500ms
                const timer = setTimeout(async () => {
                    try {
                        if (!TMDB_API_KEY) {
                            console.warn("ADVERTENCIA: Clave TMDB no configurada. La funcionalidad de autocompletado no funcionará.");
                            setBuscandoSugerencias(false);
                            return;
                        }
                        
                        const response = await fetch(
                            `${TMDB_BASE_URL}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`
                        );
                        const data = await response.json();
                        
                        // Limitamos a 5 sugerencias y nos aseguramos de que tengan un póster
                        const resultados = data.results
                            .filter(movie => movie.poster_path)
                            .slice(0, 5);

                        setSugerencias(resultados);
                    } catch (error) {
                        console.error("Error buscando sugerencias de TMDB:", error);
                    } finally {
                        setBuscandoSugerencias(false);
                    }
                }, 500); 

                return () => clearTimeout(timer); // Limpiar el timer
            } else {
                setSugerencias([]);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setValue, editId]);


    //  Lógica central: decide si CREA o ACTUALIZA 
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const datosParaGuardar = {
                ...data,
                año: Number(data.año),
                calificacion: Number(data.calificacion),
            };

            if (editId) {
                await actualizarPelicula(editId, datosParaGuardar);
                setMensaje({ tipo: 'success', texto: '¡Película actualizada con éxito!' });
                navigate(`/pelicula/${editId}`);
            } else {
                await crearPelicula(datosParaGuardar);
                setMensaje({ tipo: 'success', texto: '¡Película creada con éxito! Puedes añadir otra.' });
                reset(); 
            }

        } catch (error) {
            setMensaje({ tipo: 'danger', texto: 'Ocurrió un error al guardar/actualizar la película. Revisa la consola.' });
        } finally {
            setLoading(false);
        }
    };

    if (isDataLoading) {
        return (
            <Container className="text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-2 fs-5 text-success">Cargando datos de la película...</p>
            </Container>
        );
    }

    // Renderizado del Formulario
    return (
        <Container className="my-5">
            <div className="detail-container"> 
                
                <h2 className="mb-4">
                    {editId ? 'Editar Película' : 'Añadir Nueva Película'}
                </h2>

                {mensaje.texto && (
                    <Alert variant={mensaje.tipo} onClose={() => setMensaje({ tipo: '', texto: '' })} dismissible>
                        {mensaje.texto}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>

                    {/* Título y Sugerencias  */}
                    <Form.Group className="mb-3" controlId="formTitulo" style={{ position: 'relative' }}>
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Comienza a escribir el nombre de la película ..."
                            {...register("titulo", { required: "El título es obligatorio" })}
                            isInvalid={!!errors.titulo}
                            disabled={!!editId} 
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.titulo?.message}
                        </Form.Control.Feedback>

                        {/* SPINNER DE BÚSQUEDA */}
                        {buscandoSugerencias && (
                            <div className="text-center mt-2">
                                <Spinner animation="border" size="sm" variant="info" />
                            </div>
                        )}

                        {/* LISTA DE SUGERENCIAS */}
                        {sugerencias.length > 0 && (
                            <ListGroup className="mt-2 shadow-lg" 
                                style={{ 
                                    maxHeight: '300px', 
                                    overflowY: 'auto', 
                                    position: 'absolute', 
                                    zIndex: 1000, 
                                    width: '100%',
                                    left: 0,
                                    right: 0
                                }}
                            >
                                {sugerencias.map(pelicula => (
                                    <ListGroup.Item 
                                        key={pelicula.id} 
                                        action 
                                        onClick={() => handleSugerenciaClick(pelicula)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={`${TMDB_IMAGE_BASE_URL}${pelicula.poster_path}`} 
                                                alt={pelicula.title} 
                                                style={{ width: '40px', marginRight: '10px' }} 
                                                className="rounded"
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40x60?text=No+Img' }}
                                            />
                                            <div>
                                                <strong>{pelicula.title}</strong> <small className="text-muted">({pelicula.release_date ? pelicula.release_date.substring(0, 4) : 'N/A'})</small>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Form.Group>

                    
                    {/* Director */}
                    <Form.Group className="mb-3" controlId="formDirector">
                        <Form.Label>Director</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nombre del director/a"
                            {...register("director", { required: "El director es obligatorio" })}
                            isInvalid={!!errors.director}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.director?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Año y Calificación en la misma fila */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formAnio">
                            <Form.Label>Año de Estreno</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ej: 2010"
                                {...register("año", {
                                    required: "El año es obligatorio",
                                    min: { value: 1888, message: "Año inválido" },
                                })}
                                isInvalid={!!errors.año}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.año?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formCalificacion">
                            <Form.Label>Calificación (1-10)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ej: 8.5"
                                step="0.1"
                                {...register("calificacion", {
                                    required: "La calificación es obligatoria",
                                    min: { value: 1, message: "Mínimo 1" },
                                    max: { value: 10, message: "Máximo 10" }
                                })}
                                isInvalid={!!errors.calificacion}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.calificacion?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    {/* URL de Imagen */}
                    <Form.Group className="mb-3" controlId="formImagenUrl">
                        <Form.Label>URL del Póster</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="Enlace a la imagen del póster"
                            {...register("imagenUrl", {
                                required: "La URL es obligatoria",
                                pattern: {
                                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                                    message: "Debe ser una URL válida"
                                }
                            })}
                            isInvalid={!!errors.imagenUrl}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.imagenUrl?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Reseña */}
                    <Form.Group className="mb-3" controlId="formResena">
                        <Form.Label>Reseña</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Escribe tu reseña de la película"
                            {...register("reseña", { required: "La reseña es obligatoria" })}
                            isInvalid={!!errors.reseña}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.reseña?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Botón de Enviar */}
                    <Button variant={editId ? 'warning' : 'success'} type="submit" className="mt-3" disabled={loading}>
                        {loading
                            ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            : (editId ? 'Guardar Cambios' : 'Guardar Película')
                        }
                    </Button>
                </Form>

                {/* Botón para volver al listado */}
                <Button
                    as={Link}
                    to={editId ? `/pelicula/${editId}` : "/"}
                    variant="outline-secondary"
                    className="mt-4 ms-3"
                >
                    {editId ? 'Cancelar Edición' : 'Volver al Listado'}
                </Button>

            </div>
        </Container>
    );
};

export default ItemForm;