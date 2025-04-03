import React from "react";
import { Link } from "../../../../Link";

const LoginFooter = () => {
  return (
    <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-center">
      <p className="text-sm text-gray-600">
        ¿No tienes una cuenta? 
        <Link to="/signup" className="ml-1 font-medium text-green-600 hover:text-green-800 transition-colors duration-200">
          Regístrate
        </Link>
      </p>
    </div>
  );
};

export default LoginFooter;