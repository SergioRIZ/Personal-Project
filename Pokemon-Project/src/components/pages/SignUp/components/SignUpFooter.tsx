import { Link } from "../../../../Link";

const SignUpFooter = () => {
  return (
    <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 flex items-center justify-center">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        ¿Ya tienes una cuenta?
        <Link to="/login" className="ml-1 font-medium text-red-600 hover:text-red-800">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
};

export default SignUpFooter;