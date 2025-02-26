import React, {useState} from "react";

/* Definimos un componente funcional de React llamado form
Donde utilizamos el hook useState para crear un estado llamado formData.
SetFormData servira para actualizar el estado FormData cuando sea necesario */
function Formulario () {
const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});

/* Definimos un evento onChange para cada input del formulario que actualiza el estado formData */
const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData ({
        ...formData,
        [name]: value || '',
    });
};

/* Con este evitamos que la pagina se recargue cuando se activa el evento onSubmit para enviar los datos */
const handleSubmit = async (e) => {
    e.preventDefault();
    console.log ('Datos del formulario: ' , formData)

    if (!formData.username || !formData.email || !formData.password) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;

    }

    if (formData.username && formData.email && formData.password && formData.confirmPassword) { 
        alert ('El usuario ha sido creado correctamente');
        return;
    }
}

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nombre de Usuario:
                <input 
                type="text" 
                name="username" 
                value={formData.username || ''} 
                onChange={handleChange} 
                />
            </label>
            <label>
                Email:
                <input 
                type="email" 
                name="email" 
                value={formData.email || ''} 
                onChange={handleChange} 
                />
            </label>
            <label>
                Contraseña:
                <input 
                type="password" 
                name="password" 
                value={formData.password || ''} 
                onChange={handleChange} 
                />
            </label>
            <label>
                Confirmar Contraseña:
                <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword || ''} 
                onChange={handleChange} 
                />
            </label>
            <button type="submit">Enviar</button>
        </form>
    );

}

export default Formulario;

