import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Importamos la URL del servidor.
const { VITE_API_URL } = import.meta.env;

const OfficeListPage = () => {
  const [offices, setOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para los filtros
  const [filters, setFilters] = useState({
    capacity: "",
    priceSort: "",
    workspace: "",
    equipments: [],
  });

  // Equipamientos disponibles
  const equipments = [
    "Pizarra",
    "Proyector",
    "Catering",
    "Cafetera",
    "Monitor",
    "Equipo de Sonido",
    "TV",
    "Dispensador de Agua",
  ];

  // Estado para el desplegable de equipamientos
  const [isEquipmentDropdownOpen, setIsEquipmentDropdownOpen] = useState(false);
  const equipmentDropdownRef = useRef(null);

  // Fetch para obtener las oficinas
  useEffect(() => {
    const fetchOffices = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${VITE_API_URL}/api/office/list`);
        if (!res.ok) {
          throw new Error("Error al cargar las oficinas");
        }
        const body = await res.json();

        // Procesamos los equipamientos y ordenamos por ID descendente
        const processedOffices = body.data.offices
          .map((office) => ({
            ...office,
            equipments: [
              ...new Set(office.equipments.map((eq) => eq.name)),
            ].map((name) => ({ name })),
          }))
          .sort((a, b) => b.id - a.id); // Ordenamos de mayor a menor ID

        setOffices(processedOffices);
        setFilteredOffices(processedOffices);

        // Aplicar filtro inicial basado en el parámetro de la URL
        const params = new URLSearchParams(location.search);
        const workspaceParam = params.get("workspace");
        if (workspaceParam) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            workspace: workspaceParam,
          }));
        }
      } catch (err) {
        setError(`Error al cargar las oficinas.`);
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, [location.search]);

  // Función para manejar los cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "equipments") {
      const selectedEquipments = filters.equipments.includes(value)
        ? filters.equipments.filter((item) => item !== value)
        : [...filters.equipments, value];

      setFilters((prevFilters) => ({
        ...prevFilters,
        equipments: selectedEquipments,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };
  // para evitar que al pulsar enter se resetee el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const toggleEquipmentDropdown = () => {
    setIsEquipmentDropdownOpen(!isEquipmentDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        equipmentDropdownRef.current &&
        !equipmentDropdownRef.current.contains(event.target)
      ) {
        setIsEquipmentDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filtrar oficinas cuando cambian los filtros o las oficinas originales

  useEffect(() => {
    const filterAndSortOffices = () => {
      let filtered = offices.filter((office) => {
        // Filtro de capacidad
        if (filters.capacity && office.capacity < parseInt(filters.capacity)) {
          return false;
        }

        // Filtro de tipo de espacio
        if (filters.workspace && office.workspace !== filters.workspace) {
          return false;
        }

        // Filtro de equipamientos
        if (filters.equipments.length > 0) {
          const officeEquipments = office.equipments.map((eq) => eq.name);
          if (
            !filters.equipments.every((eq) => officeEquipments.includes(eq))
          ) {
            return false;
          }
        }

        return true;
      });

      // Ordenar por precio
      if (filters.priceSort) {
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price);
          const priceB = parseFloat(b.price);
          if (filters.priceSort === "asc") {
            return priceA - priceB;
          } else {
            return priceB - priceA;
          }
        });
      }

      setFilteredOffices(filtered);
    };

    filterAndSortOffices();
  }, [filters, offices]);

  const handleEquipmentChange = (equipment) => {
    setFilters((prevFilters) => {
      const newEquipments = prevFilters.equipments.includes(equipment)
        ? prevFilters.equipments.filter((e) => e !== equipment)
        : [...prevFilters.equipments, equipment];
      return { ...prevFilters, equipments: newEquipments };
    });
  };

  // if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="office-list-page">
      <h1>Nuestros Espacios</h1>
      <form onSubmit={handleSubmit}>
        <fieldset className="ol-fields1">
          <div className="filter-group">
            <label htmlFor="capacity">Capacidad</label>
            <div className="input-with-icon">
              <input
                id="capacity"
                type="number"
                name="capacity"
                placeholder="0"
                value={filters.capacity}
                onChange={handleFilterChange}
              />
              <img
                src="/person.png"
                alt="Icono de persona"
                className="input-icon"
              />
            </div>
          </div>
          <div className="filter-group">
            <label htmlFor="workspace">Tipo de espacio</label>
            <div className="select-wrapper">
              <select
                id="workspace"
                name="workspace"
                value={filters.workspace}
                onChange={handleFilterChange}
              >
                <option value="">Todos los espacios</option>
                <option value="OFFICE">Oficina</option>
                <option value="DESK">Escritorio</option>
              </select>
              <img
                src="/arrowdown.png"
                alt="Flecha abajo"
                className="select-arrow"
              />
            </div>
          </div>
          <div className="filter-group">
            <label htmlFor="priceSort">Ordenar</label>
            <div className="select-wrapper">
              <select
                id="priceSort"
                name="priceSort"
                value={filters.priceSort}
                onChange={handleFilterChange}
              >
                <option value="">Añadidos recientemente</option>
                <option value="asc">Precio más bajo</option>
                <option value="desc">Precio más alto</option>
              </select>
              <img
                src="/arrowdown.png"
                alt="Flecha abajo"
                className="select-arrow"
              />
            </div>
          </div>
          <div className="filter-group" ref={equipmentDropdownRef}>
            <label htmlFor="equipments">Equipamientos</label>
            <div className="custom-select select-wrapper">
              <div
                className="select-selected"
                onClick={toggleEquipmentDropdown}
              >
                {filters.equipments.length > 0
                  ? `${filters.equipments.length} seleccionados`
                  : "Seleccionar"}
              </div>
              <img
                src="/arrowdown.png"
                alt="Flecha abajo"
                className="select-arrow"
              />
              {isEquipmentDropdownOpen && (
                <div className="select-items">
                  {equipments.map((equipment) => (
                    <label key={equipment} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.equipments.includes(equipment)}
                        onChange={() => handleEquipmentChange(equipment)}
                      />
                      {equipment}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </fieldset>
      </form>

      {/* Lista de oficinas */}
      <ul className="ol-list">
        {filteredOffices.map((office) => (
          <li
            className="ol-card"
            key={office.id}
            onClick={() => navigate(`/office/details/${office.id}`)}
          >
            <div className="olc-imgcontainer">
              {office.photos && office.photos.length > 0 ? (
                <img
                  className="olc-img"
                  src={`${VITE_API_URL}/${office.photos[0].name}`}
                  alt={`Foto ${office.photos[0].name}`}
                />
              ) : (
                <p>No hay fotos disponibles.</p>
              )}
            </div>
            <div className="olc-info">
              <h2>{office.name}</h2>
              <div className="olci-text">
                <ul className="olci-office">
                  <li>
                    <strong>Dirección:</strong> {office.address}
                  </li>
                  <li className="olci-row">
                    <span>
                      <strong>Capacidad: </strong> {office.capacity} Personas
                    </span>
                    <span>
                      <strong>Precio: </strong>
                      {office.price}€/h
                    </span>
                  </li>
                  <li className="olci-row">
                    <span>
                      <strong>Tipo de espacio: </strong>
                      {office.workspace === "OFFICE"
                        ? "Oficina"
                        : office.workspace === "DESK"
                        ? "Escritorio"
                        : office.workspace}
                    </span>
                    <span>
                      <strong>Horario:</strong> {office.opening.slice(0, 5)}h -{" "}
                      {office.closing.slice(0, 5)}h
                    </span>
                  </li>
                  <li className="olci-row">
                    <span>
                      <strong>Valoración: </strong>
                      <div
                        className="star-rating"
                        title={`${Number(office.votesAvg).toFixed(
                          1
                        )} de 5 estrellas`}
                      >
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={
                              index < Math.round(office.votesAvg)
                                ? "star filled"
                                : "star"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </span>
                    <span>
                      <strong>Cantidad de valoraciones: </strong>
                      {office.totalVotes}
                    </span>
                  </li>
                </ul>
                <div className="olci-equipments">
                  <h3>Equipamientos:</h3>
                  <ul className="olcie-list">
                    {office.equipments && office.equipments.length > 0 ? (
                      office.equipments.map((equipment, index) => (
                        <li key={`${office.id}-${equipment.name}-${index}`}>
                          {equipment.name}
                        </li>
                      ))
                    ) : (
                      <li>No hay equipamientos disponibles.</li>
                    )}
                  </ul>
                  <button
                    className="office-card-reserve-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/booking/${office.id}`);
                    }}
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default OfficeListPage;
