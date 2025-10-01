import { useForm } from 'react-hook-form';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { crearPelicula, actualizarPelicula, obtenerPeliculaPorId} from '../services/peliculas';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const ItemForm = () => {
    // 1. Obtener parámetros de la URL para detectar modo Edición
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('editId'); // Captura el ID si existe
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(!!editId); // Muestra carga si hay ID

    // 2. useEffect para cargar los datos en modo Edición
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
                        setMensaje({
                            tipo: 'danger',
                            texto: 'Error: La película a editar no fue encontrada.'
                        });
                    }
                } catch (error) {
                    setMensaje({
                        tipo: 'danger',
                        texto: 'Error al cargar los datos de la película para edición.'
                    });
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

    // 3. Lógica central: decide si CREA o ACTUALIZA
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const datosParaGuardar = {
                ...data,
                año: Number(data.año),
                calificacion: Number(data.calificacion),
            };

            if (editId) {
                // MODO EDICIÓN (UPDATE)
                await actualizarPelicula(editId, datosParaGuardar);

                setMensaje({
                    tipo: 'success',
                    texto: '¡Película actualizada con éxito!'
                });

                navigate(`/pelicula/${editId}`);

            } else {
                // MODO CREACIÓN (CREATE)
                await crearPelicula(datosParaGuardar);

                setMensaje({
                    tipo: 'success',
                    texto: '¡Película creada con éxito! Puedes añadir otra.'
                });
                reset(); 
            }

        } catch (error) {
            setMensaje({
                tipo: 'danger',
                texto: 'Ocurrió un error al guardar/actualizar la película. Revisa la consola.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (isDataLoading) {
        return (
            <Container className="text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner
                    animation="border"
                    variant="success" 
                    style={{ width: '3rem', height: '3rem' }}
                />
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

                {/* Muestra mensaje de éxito/error */}
                {mensaje.texto && (
                    <Alert variant={mensaje.tipo} onClose={() => setMensaje({ tipo: '', texto: '' })} dismissible>
                        {mensaje.texto}
                    </Alert>
                )}

                {/* Formulario */}
                <Form onSubmit={handleSubmit(onSubmit)}>

                    {/* Título */}
                    <Form.Group className="mb-3" controlId="formTitulo">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="El nombre de la película"
                            {...register("titulo", { required: "El título es obligatorio" })}
                            isInvalid={!!errors.titulo}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.titulo?.message}
                        </Form.Control.Feedback>
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

                    {/* URL de Imagen (Validación básica de URL) */}
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