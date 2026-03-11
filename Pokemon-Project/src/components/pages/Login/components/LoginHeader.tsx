import { Link } from "../../../../Link";
import Pokeball from "./Pokeball";
import { useTranslation } from "react-i18next";

const LoginHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-8 text-center">
      <Link to="/" className="inline-block">
        <Pokeball />
      </Link>
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-300 mb-2 drop-shadow-md" style={{ lineHeight: "1.2", paddingBottom: "0.1em" }}>{t('login_header_title')}</h1>
      <p className="text-gray-800 dark:text-gray-300 text-lg mt-4">{t('login_header_subtitle')}</p>
    </div>
  );
};

export default LoginHeader;