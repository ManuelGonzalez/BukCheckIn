# Buk Auto Check-in 🔒🕒

Este proyecto automatiza el proceso de marcaje de **entrada** y **salida** en el portal de colaboradores de Buk, utilizando **Firebase Functions** y **Puppeteer**.

---

## 🚀 Funcionalidades

- ✅ Marca automática de entrada y salida programada (cron)
- ✅ Funciones manuales HTTP (`/marcarEntradaManual`, `/marcarSalidaManual`)
- ✅ Login simulado (formulario con email, Next, contraseña, Sign In)
- ✅ Click automatizado en botones `Entrada` / `Salida`
- ✅ Inserción de latitud y longitud en los botones si no existen
- ✅ Notificación por Telegram ante éxito o fallo

---

## 📁 Estructura del proyecto

```
functions/
│
├── index.js                 // Entrypoint con funciones programadas
├── markBuk.js               // Lógica de navegación y marcaje
├── notifyTelegram.js        // Notificación vía bot Telegram
├── manualCheckin.js         // Funciones HTTP manuales
├── testTelegram.js          // Función para probar Telegram
├── user-config.js           // Configuración de usuario y empresa
└── package.json             // Dependencias y entorno
```

---

## 🛠️ Instalación

1. Clonar el proyecto y entrar a la carpeta `functions`:

```bash
cd functions
npm install --legacy-peer-deps
```

2. Configurar las variables de entorno de Firebase:

```bash
firebase functions:config:set \
  buk.email="TU_EMAIL" \
  buk.pass="TU_PASSWORD" \
  telegram.token="TELEGRAM_BOT_TOKEN" \
  telegram.chat="TELEGRAM_CHAT_ID"
```

3. Desplegar funciones:

```bash
firebase deploy --only functions
```

---

## 👤 `user-config.js`

Ejemplo de usuario:

```js
module.exports = [
  {
    nombre: "Manuel Gonzalez",
    email: "m3gonzalez.cl@gmail.com",
    password: process.env.BUK_PASSWORD,
    telegramBotToken: process.env.TELEGRAM_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT,
    latitud: -33.4528512,
    longitud: -70.6281472,
    urlLogin: "https://23people.buk.cl/users/sign_in",
    urlPortal: "https://23people.buk.cl/static_pages/portal"
  }
];
```

> 📌 Soporta múltiples usuarios en el array.

---

## 🧪 Funciones manuales

Una vez desplegadas, podés probar desde navegador o Postman:

```
https://us-central1-TU_PROYECTO.cloudfunctions.net/marcarEntradaManual
https://us-central1-TU_PROYECTO.cloudfunctions.net/marcarSalidaManual
```

---

## 🧠 Requisitos especiales

- `runWith({ memory: "1GB", timeoutSeconds: 60 })` para Puppeteer
- Plan **Blaze** habilitado en Firebase (necesario para programar funciones)
- `chrome-aws-lambda` y `puppeteer-core@10.4.0` para ejecución en GCP

---

## 🛑 Advertencias

- Google Cloud puede cobrar si se exceden los límites gratuitos
- Usar `firebase billing budgets` para configurar alertas de gasto

---

## 📬 Créditos

Desarrollado por un usuario automatizador de procesos 😎  
Telegram + Puppeteer + Firebase = 💥

---