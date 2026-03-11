import { Link } from "../../../../Link";
import { useTranslation } from "react-i18next";

const SignUpFooter = () => {
  const { t } = useTranslation();
  return (
    <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 flex items-center justify-center">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {t('signup_has_account')}
        <Link to="/login" className="ml-1 font-medium text-red-600 hover:text-red-800">
          {t('signup_login')}
        </Link>
      </p>
    </div>
  );
};

export default SignUpFooter;