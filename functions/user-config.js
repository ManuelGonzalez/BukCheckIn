const functions = require("firebase-functions");

const config = functions.config();

// Función que lee desde .env o desde Firebase config
const getConfigValue = (envKey, configPath, fallback = null) => {
  return process.env[envKey] || configPath || fallback;
};

module.exports = [
  {
    nombre: "Manuel Gonzalez",
    email: getConfigValue("BUK_EMAIL", config?.buk?.email),
    password: getConfigValue("BUK_PASS", config?.buk?.pass),
    telegramBotToken: getConfigValue("TELEGRAM_BOT_TOKEN", config?.telegram?.token),
    telegramChatId: getConfigValue("TELEGRAM_CHAT_ID", config?.telegram?.chat),
    latitud: -33.4528512,
    longitud: -70.6281472,
    urlLogin: "https://23people.buk.cl/users/sign_in",
    urlPortal: "https://23people.buk.cl/static_pages/portal"
  }
];
