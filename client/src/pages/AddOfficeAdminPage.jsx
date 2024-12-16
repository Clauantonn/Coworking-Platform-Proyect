import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

// Obtención de la URL de la API desde las variables de entorno
const { VITE_API_URL } = import.meta.env;

const AddOfficeAdminPage = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [opening, setOpening] = useState("08:00");
  const [closing, setClosing] = useState("19:00");
  const [photos, setPhotos] = useState([]);
  const [equipments, setEquipments] = useState([]); // Estado para los equipamientos
  const [selectedEquipments, setSelectedEquipments] = useState([]); // Equipamientos seleccionados
  const [photoPreview, setPhotoPreview] = useState([]);

  // Obtener equipamientos al montar el componente
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/office/equipments`, {
          headers: {
            Authorization: authToken,
          },
        });

        if (!res.ok) {
          throw new Error("Error al obtener los equipamientos"); // Manejar error si no es 2xx
        }

        const body = await res.json();
        if (body.status === "ok") {
          setEquipments(body.data.equipments);
        } else {
          toast.error(body.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchEquipments();
  }, [authToken]);

  // Función para manejar el envío del formulario
  const handleAddSpace = async (e) => {
    try {
      e.preventDefault();

      const formattedOpening = opening.length === 5 ? `${opening}:00` : opening;
      const formattedClosing = closing.length === 5 ? `${closing}:00` : closing;

      // Creación del objeto FormData para enviar los datos
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("workspace", workspace);
      formData.append("capacity", capacity);
      formData.append("price", price);
      formData.append("opening", formattedOpening);
      formData.append("closing", formattedClosing);

      // Agregar los equipamientos seleccionados al FormData
      formData.append("equipments", JSON.stringify(selectedEquipments));

      // Agregar las fotos al FormData
      for (let i = 0; i < photos.length; i++) {
        formData.append(`photo${i + 1}`, photos[i]);
      }

      // Envío de la solicitud POST a la API
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/office/create`,
        {
          method: "POST",
          headers: {
            Authorization: authToken,
          },
          body: formData,
        }
      );

      // Procesamiento de la respuesta
      const body = await res.json();

      if (body.status === "error") {
        throw new Error(body.message);
      }

      // Mostrar mensaje de éxito y navegar a la página principal
      toast.success(body.message);
      navigate(`/office/list`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Manejo de selección de equipamientos
  const handleEquipmentChange = (e) => {
    const { value, checked } = e.target;
    const id = Number(value); // Asegúrate de convertir el valor a número
    if (checked) {
      setSelectedEquipments((prev) => [...prev, id]); // Añadir el ID como número
    } else {
      setSelectedEquipments((prev) =>
        prev.filter((id) => id !== Number(value))
      ); // Filtrar el ID como número
    }
  };

  // Función para generar un ID único
  const generateUniqueId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  // Función para manejar la selección de archivos
  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prevPhotos) => [...prevPhotos, ...files]);

    // Crear previsualizaciones con ID único
    const newPreviews = files.map((file) => ({
      id: generateUniqueId(),
      url: URL.createObjectURL(file),
      file: file,
    }));
    setPhotoPreview((prevPreviews) => [...prevPreviews, ...newPreviews]);

    // Limpiar el valor del input de archivo
    e.target.value = null;
  };

  const removePhoto = (id) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, i) => photoPreview[i].id !== id)
    );
    setPhotoPreview((prevPreviews) =>
      prevPreviews.filter((preview) => preview.id !== id)
    );
  };

  // Limpieza de las URLs de objeto creadas
  useEffect(() => {
    return () => {
      photoPreview.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [photoPreview]);

  return (
    <div className="add-office-container">
      <h1>Crear Nuevo Espacio</h1>
      <form onSubmit={handleAddSpace} className="add-office-form">
        <div className="form-group full-width">
          <label htmlFor="name">Nombre del Espacio</label>
          <input
            id="name"
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            placeholder="Describe las características del espacio, como la iluminación, el ambiente, las vistas, el mobiliario, etc. Menciona también cualquier detalle único o atractivo especial."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              type="text"
              placeholder="Calle, número, ciudad"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="workspace">Tipo de Espacio</label>
            <select
              id="workspace"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              required
            >
              <option value="">Seleccionar tipo de espacio</option>
              <option value="OFFICE">Oficina</option>
              <option value="DESK">Escritorio</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="capacity">Capacidad</label>
            <div className="capacity-input-container">
              <input
                id="capacity"
                type="number"
                placeholder="0"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
                required
              />
              <span className="people-symbol">Personas</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="price">Precio por Hora</label>
            <div className="price-input-container">
              <input
                id="price"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                required
              />
              <span className="euro-symbol">€</span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="opening">Hora de Apertura</label>
            <select
              id="opening"
              value={opening}
              onChange={(e) => setOpening(e.target.value)}
              required
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                  {`${i.toString().padStart(2, "0")}:00`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="closing">Hora de Cierre</label>
            <select
              id="closing"
              value={closing}
              onChange={(e) => setClosing(e.target.value)}
              required
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                  {`${i.toString().padStart(2, "0")}:00`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group photo-upload">
          <label htmlFor="photos">Fotos</label>
          <div className="photo-upload-content">
            <div className="photo-upload-container">
              <input
                type="file"
                id="photos"
                onChange={handleFile}
                accept="image/jpeg, image/png"
                multiple
              />
              <div className="photo-upload-button">
                <span>+</span>
              </div>
            </div>
            <div className="photo-previews">
              {photoPreview.map((preview) => (
                <div key={preview.id} className="photo-preview-item">
                  <img src={preview.url} alt={`Vista previa ${preview.id}`} />
                  <button
                    className="photo-remove-button"
                    onClick={() => removePhoto(preview.id)}
                    aria-label="Eliminar imagen"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="equipment-section">
          <h2>Equipamientos disponibles</h2>
          <div className="equipment-list">
            {Array.isArray(equipments) &&
              equipments.map((equipment) => (
                <div key={equipment.id} className="equipment-item">
                  <label>
                    <input
                      type="checkbox"
                      value={equipment.id}
                      onChange={handleEquipmentChange}
                      checked={selectedEquipments.includes(equipment.id)}
                    />
                    {equipment.name.toLowerCase()}
                  </label>
                </div>
              ))}
          </div>
        </div>

        <button type="submit">Crear Oficina</button>
      </form>
    </div>
  );
};

export default AddOfficeAdminPage;
