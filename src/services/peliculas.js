import { collection, addDoc, getDocs, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Importamos la instancia de Firestore

// Referencia a la colección 'peliculas'
const peliculasCollection = collection(db, "peliculas");

// Función para guardar una nueva película en Firestore
export const crearPelicula = async (datosPelicula) => {
    try {
        // addDoc recibe la referencia de la colección y el objeto de datos
        const docRef = await addDoc(peliculasCollection, datosPelicula);
        console.log("Documento escrito con ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error al añadir el documento: ", e);
        throw e; 
    }
};

// Función para obtener todas las películas de Firestore
export const obtenerPeliculas = async () => {
    try {
        const querySnapshot = await getDocs(peliculasCollection);
        
        // Mapeamos los resultados para obtener solo los datos y el ID del documento
        const peliculas = querySnapshot.docs.map(doc => ({
            id: doc.id, // El ID único del documento es crucial
            ...doc.data() // El resto de los datos
        }));
        
        return peliculas;
    } catch (e) {
        console.error("Error al obtener documentos: ", e);
        throw e;
    }
};

// Función para obtener una sola película por su ID de Firestore
export const obtenerPeliculaPorId = async (id) => {
    try {
        const docRef = doc(db, "peliculas", id); // Referencia al documento específico
        const docSnap = await getDoc(docRef); // Obtener el documento
        
        if (docSnap.exists()) {
            // Retornamos el objeto con el ID y los datos
            return { id: docSnap.id, ...docSnap.data() }; 
        } else {
            // El documento no existe
            return null;
        }
    } catch (e) {
        console.error("Error al obtener el documento: ", e);
        throw e;
    }
};

// Función para eliminar una película por su ID
export const eliminarPelicula = async (id) => {
    try {
        const docRef = doc(db, "peliculas", id);
        await deleteDoc(docRef);
        console.log(`Documento con ID ${id} eliminado exitosamente.`);
    } catch (e) {
        console.error("Error al eliminar el documento: ", e);
        throw e;
    }
};

// Función para actualizar una película por su ID
export const actualizarPelicula = async (id, datosActualizados) => {
    try {
        const docRef = doc(db, "peliculas", id);
        // updateDoc actualiza los campos que se le pasan sin sobrescribir el resto del documento
        await updateDoc(docRef, datosActualizados); 
        console.log(`Documento con ID ${id} actualizado exitosamente.`);
    } catch (e) {
        console.error("Error al actualizar el documento: ", e);
        throw e;
    }
};