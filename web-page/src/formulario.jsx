import React, {useState} from "react";
import './formulario.css'

/* Definimos un componente funcional de React llamado form
Donde utilizamos el hook useState para crear un estado llamado formData.
SetFormData servira para actualizar el estado FormData cuando sea necesario */
export default function Formulario () {
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
// Creamos un formulario sencillo para la creacion de el usuario (Lo ideal es mandarlo al servidor, pero como no se crearlo me jodo)
    return (
        <body>
        <div className="min-h-screen w-full flex items-center justify-center bg-blue-50 p-4">
        <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border-4 border-yellow-400 space-y-6 relative overflow-hidden">
          {/* Fondo temático Pokémon */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="h-1/2 bg-red-600"></div>
            <div className="h-4 bg-black"></div>
            <div className="h-1/2 bg-white"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-black">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-black"></div>
            </div>
          </div>
          
          {/* Contenido del formulario */}
          <div className="relative z-10 bg-white bg-opacity-90 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">¡Conviértete en Entrenador!</h2>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                  Nombre de Entrenador
                </label>
                <input 
                  type="text" 
                  id="username"
                  name="username" 
                  value={formData.username || ''} 
                  onChange={handleChange}
                  className="px-4 py-2 border-2 border-yellow-400 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="Ash Ketchum" 
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  PokéEmail
                </label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  value={formData.email || ''} 
                  onChange={handleChange}
                  className="px-4 py-2 border-2 border-yellow-400 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="entrenador@pokemon.com" 
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Contraseña Secreta
                </label>
                <input 
                  type="password" 
                  id="password"
                  name="password" 
                  value={formData.password || ''} 
                  onChange={handleChange}
                  className="px-4 py-2 border-2 border-yellow-400 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="••••••••" 
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                  Confirmar Contraseña Secreta
                </label>
                <input 
                  type="password"
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={formData.confirmPassword || ''} 
                  onChange={handleChange}
                  className="px-4 py-2 border-2 border-yellow-400 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="••••••••" 
                />
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-bold flex items-center justify-center">
                    <span>¡Hazte con todos!</span>
                </button>
              </div>
            </div>
          </div>
          
          <p className="relative z-10 text-center text-sm text-gray-600 mt-4 bg-white bg-opacity-90 py-2 rounded-lg">
            ¿Ya tienes un PokéDex? <a href="#" className="text-red-600 hover:underline font-medium">¡Inicia tu aventura!</a>
          </p>
        </form>
      </div>
      </body>
    );

}
