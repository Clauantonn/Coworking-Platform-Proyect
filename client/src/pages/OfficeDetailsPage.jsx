import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSingleOffice from "../hooks/useSingleOffice";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import Carrusel from "../components/CarruselFotosOfi";

const { VITE_API_URL } = import.meta.env;

const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}h`;
};

const OfficeDetailsPage = () => {
  const { idOffice } = useParams();
  const { authToken, authUser } = useContext(AuthContext);
  const { office } = useSingleOffice(idOffice);
  const [isEditing, setIsEditing] = useState(false); // Estado para habilitar la edición
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [opening, setOpening] = useState("");
  const [closing, setClosing] = useState("");
  const [equipments, setEquipments] = useState([]); // Estado para los equipamientos

  // Estados para edicion de equipamientos.
  const [allEquipments, setAllEquipments] = useState([]); // Todos los equipamientos posibles
  const [selectedEquipments, setSelectedEquipments] = useState(new Set());

  const [loading, setLoading] = useState(false);

  // Inicializamos los valores de la oficina para editar
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/office/equipments`, {
          headers: {
            Authorization: authToken,
          },
        });
        const body = await res.json();
        console.log(body.data.equipments[0].name);

        setAllEquipments(body.data.equipments); // Todos los equipamientos
        if (body.status === "error") {
          throw new Error(body.message);
        }
      } catch (err) {
        toast.error("Error al cargar los equipamientos");
      }
    };

    fetchEquipments();

    if (office) {
      setName(office.name);
      setDescription(office.description);
      setAddress(office.address);
      setWorkspace(office.workspace);
      setCapacity(office.capacity);
      setPrice(office.price);
      setOpening(office.opening.slice(0, 5)); // Mantener solo HH:MM
      setClosing(office.closing.slice(0, 5)); // Mantener solo HH:MM
      setEquipments(office.equipments);
      setSelectedEquipments(new Set(office.equipments.map((eq) => eq.id)));
    }
  }, [office, authToken]);

  const sendToBooking = async (e) => {
    try {
      e.preventDefault();
      if (!authUser) {
        toast.error("Debes estar logueado para poder reservar.");
        navigate("/login");
      } else {
        navigate(`/booking/${idOffice}`);
      }
    } catch (err) {
      toast(err.message);
    }
  };

  // Habilitar la edición
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Cuando se activa el modo de edición, cargamos todos los equipamientos
      fetchAllEquipments();
    }
  };

  const fetchAllEquipments = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/office/equipments`, {
        headers: {
          Authorization: authToken,
        },
      });
      const body = await res.json();
      if (body.status === "error") {
        throw new Error(body.message);
      }
      setAllEquipments(body.data.equipments);
    } catch (err) {
      toast.error("Error al cargar los equipamientos");
    }
  };

  // Función para actualizar la oficina desde la misma página
  const handleUpdateOffice = async (e) => {
    e.preventDefault();

    const formattedOpening = opening.length === 5 ? `${opening}:00` : opening;
    const formattedClosing = closing.length === 5 ? `${closing}:00` : closing;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("capacity", capacity);
      formData.append("workspace", workspace);
      formData.append("price", price);
      formData.append("opening", formattedOpening);
      formData.append("closing", formattedClosing);

      // Modificar esta línea para enviar el array de IDs de equipamientos seleccionados
      formData.append(
        "equipments",
        JSON.stringify(Array.from(selectedEquipments))
      );

      const res = await fetch(`${VITE_API_URL}/api/office/${idOffice}`, {
        method: "PUT",
        headers: {
          Authorization: authToken,
        },
        body: formData,
      });

      const body = await res.json();

      if (body.status === "error") {
        throw new Error(body.message);
      }
      toast.success("Oficina actualizada correctamente");
      setIsEditing(false);

      // Actualizar el estado local con los nuevos equipamientos
      setEquipments(
        allEquipments.filter((eq) => selectedEquipments.has(eq.id))
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funcion para eliminar una oficina
  const handleDeleteOffice = async (e) => {
    e.preventDefault();
    try {
      // Si el usuario NO confirma que desea eliminar finalizamos la función.
      if (!confirm("¿Quieres borrar ésta oficina?")) {
        return;
      }
      if (
        !confirm(
          "Esto eliminará todo lo referente a esta oficina (reservas, fotos, equipamientos...) ¿Seguro que deseas continuar?"
        )
      ) {
        return;
      }
      const res = await fetch(`${VITE_API_URL}/api/office/${idOffice}`, {
        method: "DELETE",
        headers: {
          Authorization: authToken,
        },
      });
      // Obtenemos el body.
      const body = await res.json();

      // Si hay algún error lo lanzamos.
      if (body.status === "error") {
        throw new Error(body.message);
      }

      // Redirigimos a la lista de oficinas.
      navigate("/office/list");

      // Mostramos un mensaje satisfactorio al usuario.
      toast.success(body.message, {
        id: "OfficeDelete",
      });
    } catch (err) {
      toast.error(err.message, {
        id: "OfficeDelete",
      });
    }
  };

  // Manejo de selección de equipamientos
  const handleEquipmentChange = (e) => {
    const { value, checked } = e.target;
    const id = Number(value);

    setSelectedEquipments((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  // Función para mostrar el tipo de espacio en español
  const displayWorkspace = (workspace) => {
    switch (workspace) {
      case "DESK":
        return "Escritorio";
      case "OFFICE":
        return "Oficina";
      default:
        return workspace;
    }
  };

  // Función para formatear el horario
  const formatSchedule = (opening, closing) => {
    return `${formatTime(opening)} - ${formatTime(closing)}`;
  };

  return (
    <div className={`office-details ${isEditing ? "editing" : ""}`}>
      {office && (
        <main className="office-details">
          <div className="office-header">
            <div className="office-title">
              <h2>{office.name}</h2>
            </div>
            {authUser && authUser.role === "ADMIN" && (
              <div className="admin-buttons">
                {isEditing && (
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleUpdateOffice}
                    className="save-button"
                  >
                    {loading ? "Enviando..." : "Guardar"}
                  </button>
                )}{" "}
                {isEditing && (
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleDeleteOffice}
                    className="delete-button"
                  >
                    {loading ? "Eliminando..." : "Eliminar"}
                  </button>
                )}
                <button className="edit-button" onClick={toggleEditMode}>
                  {isEditing ? (
                    "Cancelar"
                  ) : (
                    <>
                      <img src="/edit-pencil.png" alt="Editar" />
                      Editar
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="carrusel">
            <Carrusel images={office.photos}></Carrusel>
          </div>
          <div className="office-details-content">
            {authUser && authUser.role === "ADMIN" ? (
              <form onSubmit={handleUpdateOffice}>
                <ul className="details-list">
                  {isEditing && (
                    <li>
                      <label htmlFor="name">Nombre del espacio:</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </li>
                  )}
                  <li>
                    <label htmlFor="description">Descripción:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    ) : (
                      <span>{description}</span>
                    )}
                  </li>

                  <li>
                    <label htmlFor="address">Dirección:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    ) : (
                      <span>{address}</span>
                    )}
                  </li>

                  <div className="details-row">
                    <li>
                      <label htmlFor="capacity">Capacidad:</label>
                      {isEditing ? (
                        <div className="input-wrapper">
                          <input
                            type="number"
                            id="capacity"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                          />
                          <span className="capacity-unit">Personas</span>
                        </div>
                      ) : (
                        <span>{capacity} Personas</span>
                      )}
                    </li>
                    <li>
                      <label htmlFor="price">Precio por hora:</label>
                      {isEditing ? (
                        <div className="input-wrapper">
                          <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>
                      ) : (
                        <span>{price}€</span>
                      )}
                    </li>
                  </div>

                  <div className="details-row">
                    <li>
                      <label htmlFor="workspace">Tipo de espacio:</label>
                      {isEditing ? (
                        <div className="select-wrapper">
                          <select
                            id="workspace"
                            value={workspace}
                            onChange={(e) => setWorkspace(e.target.value)}
                          >
                            <option value="OFFICE">Oficina</option>
                            <option value="DESK">Escritorio</option>
                          </select>
                          <img
                            src="/arrowdown.png"
                            alt="Flecha abajo"
                            className="select-arrow"
                          />
                        </div>
                      ) : (
                        <span>{displayWorkspace(workspace)}</span>
                      )}
                    </li>
                    <li>
                      <label>Horario:</label>
                      {isEditing ? (
                        <>
                          <div className="select-wrapper">
                            <select
                              id="opening"
                              value={opening}
                              onChange={(e) => setOpening(e.target.value)}
                            >
                              {Array.from({ length: 24 }, (_, i) => {
                                const time = `${i
                                  .toString()
                                  .padStart(2, "0")}:00`;
                                return (
                                  <option key={i} value={time}>
                                    {formatTime(time)}
                                  </option>
                                );
                              })}
                            </select>
                            <img
                              src="/arrowdown.png"
                              alt="Flecha abajo"
                              className="select-arrow"
                            />
                          </div>
                          <span> - </span>
                          <div className="select-wrapper">
                            <select
                              id="closing"
                              value={closing}
                              onChange={(e) => setClosing(e.target.value)}
                            >
                              {Array.from({ length: 24 }, (_, i) => {
                                const time = `${i
                                  .toString()
                                  .padStart(2, "0")}:00`;
                                return (
                                  <option key={i} value={time}>
                                    {formatTime(time)}
                                  </option>
                                );
                              })}
                            </select>
                            <img
                              src="/arrowdown.png"
                              alt="Flecha abajo"
                              className="select-arrow"
                            />
                          </div>
                        </>
                      ) : (
                        <span>{formatSchedule(opening, closing)}</span>
                      )}
                    </li>
                  </div>
                </ul>
                <div className="equipments-list">
                  <h2>Equipamientos de la oficina</h2>
                  {isEditing ? (
                    allEquipments.length > 0 ? (
                      <div className="equipment-container">
                        {allEquipments.map((equipment) => (
                          <div
                            key={equipment.id}
                            className="equipment-checkbox"
                          >
                            <label>
                              <input
                                type="checkbox"
                                value={equipment.id}
                                onChange={handleEquipmentChange}
                                checked={selectedEquipments.has(equipment.id)}
                              />
                              {equipment.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Cargando equipamientos...</p>
                    )
                  ) : selectedEquipments.size > 0 ? (
                    <div className="equipment-container">
                      {Array.from(selectedEquipments).map((id) => {
                        const equipment = allEquipments.find(
                          (eq) => eq.id === id
                        );
                        return equipment ? (
                          <div key={id} className="equipment-item">
                            {equipment.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p>Esta oficina no tiene equipamientos.</p>
                  )}
                </div>
              </form>
            ) : (
              <>
                <ul className="details-list">
                  <li>
                    <label>Dirección:</label> <span>{office.address}</span>
                  </li>
                  <div className="details-row">
                    <li>
                      <label>Capacidad:</label>{" "}
                      <span>{office.capacity} Personas</span>
                    </li>
                    <li>
                      <label>Precio por hora:</label>{" "}
                      <span>{office.price}€</span>
                    </li>
                  </div>
                  <div className="details-row">
                    <li>
                      <label>Tipo de espacio:</label>{" "}
                      <span>{displayWorkspace(office.workspace)}</span>
                    </li>
                    <li>
                      <label>Horario:</label>{" "}
                      <span>
                        {formatSchedule(office.opening, office.closing)}
                      </span>
                    </li>
                  </div>
                  <li>
                    <label>Descripción:</label>{" "}
                    <span>{office.description}</span>
                  </li>
                </ul>
                <div className="equipments-list">
                  <h2>Equipamientos de la oficina</h2>
                  {selectedEquipments.size > 0 ? (
                    <div className="equipment-container">
                      {Array.from(selectedEquipments).map((id) => {
                        const equipment = allEquipments.find(
                          (eq) => eq.id === id
                        );
                        return equipment ? (
                          <div key={id} className="equipment-item">
                            {equipment.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p>Esta oficina no tiene equipamientos.</p>
                  )}
                </div>
              </>
            )}
          </div>
          {!isEditing && (
            <div className="reserve-button-container">
              <button onClick={sendToBooking} className="reserve-button">
                Reservar
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default OfficeDetailsPage;
