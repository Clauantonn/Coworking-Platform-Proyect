import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const { VITE_API_URL } = import.meta.env;

const EditOfficePage = () => {
    const { authToken } = useContext(AuthContext);
    const { idOffice } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [workspace, setWorkspace] = useState("");
    const [capacity, setCapacity] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdateOffice = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            const formData = new FormData();

            formData.append("name", name);
            formData.append("price", price);
            formData.append("address", address);
            formData.append("workspace", workspace);
            formData.append("capacity", capacity);

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
            toast.success("Oficina editada");
            navigate(`/office/details/${idOffice}`);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <h2>`Editar Oficina</h2>
            <form onSubmit={handleUpdateOffice}>
                <label htmlFor="name">Nombre:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="price">Precio:</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                />

                <label htmlFor="address">Dirección:</label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <label htmlFor="workspace">Espacio de trabajo:</label>
                <input
                    type="text"
                    id="workspace"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                />

                <label htmlFor="capacity">Capacidad:</label>
                <input
                    type="number"
                    id="capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    min="0"
                />
                <button type="sumbit">ENVIAR CAMBIOS!!??</button>
            </form>
        </main>
    );
};
export default EditOfficePage;
