import { useRef } from 'react';
import Slider from 'react-slick'; // Importamos el componente Slider
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const Carrusel = ({ images }) => {
  const sliderRef = useRef(null);

  // Configuración del carrusel
  const settings = {
    dots: false, // Quitamos los puntos
    infinite: images.length > 1, // Desactiva "infinite" si hay solo una imagen
    speed: 500, // Velocidad de la transición
    slidesToShow: 1, // Muestra una imagen por vez
    slidesToScroll: 1, // Cambia una imagen por vez
    autoplay: false, // Desactivamos el autoplay
    arrows: false, // Quitamos las flechas del carrusel
  };

  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  return (
    <div className='carrusel-container'>
      <Slider ref={sliderRef} {...settings}>
        {images.map((image) => (
          <div key={image.id} className='carrusel-slide'>
            <img
              src={`${VITE_API_URL}/${image.name}`}
              alt={'Imagen del carrusel'}
              className='carrusel-image'
            />
          </div>
        ))}
      </Slider>
      <div className='carrusel-controls'>
        <button className='carrusel-button prev' onClick={goToPrev}>
          <img src='/flecha-izquierda.png' alt='Anterior' />
        </button>
        <button className='carrusel-button next' onClick={goToNext}>
          <img src='/flecha-derecha.png' alt='Siguiente' />
        </button>
      </div>
    </div>
  );
};

export default Carrusel;
