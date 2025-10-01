import { Container } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'; 

const Footer = () => {
    // ⚠️ IMPORTANTE: Reemplaza estas URLs de ejemplo con tus enlaces reales.
    const socialLinks = {
        github: "https://github.com/RamsoZX",
        linkedin: "https://www.linkedin.com",
        instagram: "https://www.instagram.com/omarxero/",
    };

    return (
        <footer className="mt-5 py-4 custom-footer border-top"> 
            <Container className="text-center">
                
                <div className="mb-3 d-flex justify-content-center gap-4">
                    
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

                <p className="m-0 text-muted small">
                    © {new Date().getFullYear()} Mi Lista de Películas | Proyecto Final Desarrollo Web | Osmar Villagran
                </p>
            </Container>
        </footer>
    );
};

export default Footer;