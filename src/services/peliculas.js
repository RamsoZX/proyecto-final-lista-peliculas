import { collection, addDoc, getDocs, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config"; 
const peliculasCollection = collection(db, "peliculas");

export const crearPelicula = async (datosPelicula) => {
    try {
        // addDoc añade un nuevo documento con un ID generado automáticamente
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
        
        // Mapeamos los documentos para incluir el ID junto con los datos
        const peliculas = querySnapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data() 
        }));
        
        return peliculas;
    } catch (e) {
        console.error("Error al obtener documentos: ", e);
        throw e;
    }
};


export const obtenerPeliculaPorId = async (id) => {
    try {
        const docRef = doc(db, "peliculas", id); 
        const docSnap = await getDoc(docRef); 
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() }; 
        } else {
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
        await updateDoc(docRef, datosActualizados); 
        console.log(`Documento con ID ${id} actualizado exitosamente.`);
    } catch (e) {
        console.error("Error al actualizar el documento: ", e);
        throw e;
    }
};