import Pokeball from "./Pokeball";
import { Link } from "../../../../Link";
import { useTranslation } from "react-i18next";

const SignUpHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-8 text-center">
      <Link to="/" className="inline-block">
        <Pokeball />
      </Link>
      <h1 className="text-5xl font-bold mb-2 text-shadow">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-300">{t('signup_header_title')}</span>
      </h1>
      <p className="text-gray-800 dark:text-gray-300 text-lg text-shadow">{t('signup_header_subtitle')}</p>
    </div>
  );
};

export default SignUpHeader;