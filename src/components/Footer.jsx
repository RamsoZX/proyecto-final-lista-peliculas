import { Container } from 'react-bootstrap';
// Importamos los íconos necesarios de React Icons (Font Awesome)
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'; 

const Footer = () => {
    // ⚠️ IMPORTANTE: Reemplaza estas URLs de ejemplo con tus enlaces reales.
    const socialLinks = {
        github: "https://github.com/tu-usuario",
        linkedin: "https://www.linkedin.com/in/tu-perfil/",
        instagram: "https://www.instagram.com/tu-perfil/",
    };

    return (
        // Aplicamos la clase custom-footer y lo fijamos abajo (fixed-bottom) si lo prefieres, aunque "mt-5 py-3" funciona bien.
        <footer className="mt-5 py-4 custom-footer border-top"> 
            <Container className="text-center">
                
                {/* Contenedor de Iconos de Redes */}
                <div className="mb-3 d-flex justify-content-center gap-4">
                    
                    {/* GitHub Icon */}
                    <a 
                        href={socialLinks.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="GitHub Profile"
                        className="text-dark" 
                        style={{ fontSize: '1.8rem', transition: 'color 0.3s' }}
                    >
                        <FaGithub />
                    </a>

                    {/* LinkedIn Icon */}
                    <a 
                        href={socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="LinkedIn Profile"
                        className="text-dark" 
                        style={{ fontSize: '1.8rem', transition: 'color 0.3s' }}
                    >
                        <FaLinkedin />
                    </a>

                    {/* Instagram Icon */}
                    <a 
                        href={socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Instagram Profile"
                        className="text-dark" 
                        style={{ fontSize: '1.8rem', transition: 'color 0.3s' }}
                    >
                        <FaInstagram />
                    </a>
                </div>

                {/* Texto del Copyright */}
                <p className="m-0 text-muted small">
                    © {new Date().getFullYear()} Mi Lista de Películas | Proyecto Final Desarrollo Web | Osmar Villagran
                </p>
            </Container>
        </footer>
    );
};

export default Footer;