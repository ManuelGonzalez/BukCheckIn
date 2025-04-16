# 🤖 Buk Auto Check-In (Entrada y Salida Automática)

Automatización del registro de **entrada (08:30)** y **salida (18:30)** laboral en Buk, con **notificación por Telegram**.  
Funciona desde la nube (Firebase), no requiere tener la computadora encendida.

---

## 🚀 ¿Qué hace este proyecto?

✅ Marca tu **entrada y salida** automáticamente en Buk  
✅ Funciona todos los días hábiles (lunes a viernes)  
✅ Te **notifica por Telegram** si la marca fue exitosa o falló  
✅ Escalable: puede usarse con más de un usuario en el futuro

---

## 🧩 Requisitos

Antes de comenzar, necesitás:

1. ✅ Una cuenta de [Firebase](https://firebase.google.com/)
2. ✅ Una tarjeta (para activar el plan **Blaze** — no te cobrará si no sobrepasás los límites)
3. ✅ Tu usuario y contraseña de Buk
4. ✅ Una cuenta de Telegram
5. ✅ Crear un bot de Telegram (súper simple, explicado abajo)

---

## 🛠️ Paso a paso

### 1. Clonar o descargar el proyecto

> Si recibiste un `.zip`, descomprimilo y abrí la carpeta

---

### 2. Instalar Node.js

- Descargar e instalar desde: [https://nodejs.org/](https://nodejs.org/)
- Verificá en consola:
  ```bash
  node -v
  npm -v
  ```

---

### 3. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

---

### 4. Iniciar sesión en Firebase

```bash
firebase login
```

---

### 5. Crear un proyecto en Firebase

1. Ir a: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Clic en “Agregar proyecto”
3. Llamalo por ejemplo `buk-checkin`
4. Finalizá con los pasos por defecto

---

### 6. Activar plan Blaze (requerido por Firebase Functions programadas)

1. Ir a: https://console.firebase.google.com/project/<tu-proyecto>/settings/billing
2. Hacé clic en **"Cambiar a Blaze"**
3. Agregá tu tarjeta
> 💸 No se cobra nada mientras el uso sea bajo

---

### 7. Asociar tu carpeta al proyecto Firebase

Desde la carpeta del proyecto:

```bash
firebase use --add
```

Elegí el proyecto que creaste y poné un alias, por ejemplo `default`.

---

### 8. Instalar dependencias del proyecto

```bash
cd functions
npm install
cd ..
```

---

### 9. Crear un bot de Telegram

1. Buscá [@BotFather](https://t.me/BotFather) en Telegram
2. Escribí `/newbot` y seguí los pasos
3. Copiá el **token del bot**, se ve así:
   ```
   8043000699:ABC...XYZ
   ```

4. Abrí tu bot y escribile un mensaje (ej. "Hola")

5. Pegá esta URL en tu navegador (reemplazá `<TOKEN>`):

```
https://api.telegram.org/bot<TOKEN>/getUpdates
```

6. En la respuesta JSON vas a ver tu `chat.id`, por ejemplo:

```json
"chat": {
  "id": 6887344367
}
```

---

### 10. Configurar tus credenciales en Firebase

Ejecutá esto desde la terminal (reemplazando por tus datos reales):

```bash
firebase functions:config:set \
  buk.email="TU_CORREO_BUK" \
  buk.pass="TU_PASSWORD_BUK" \
  telegram.token="TU_TOKEN_BOT_TELEGRAM" \
  telegram.chat="TU_CHAT_ID"
```

Ejemplo real:

```bash
firebase functions:config:set \
  buk.email="m3gonzalez.cl@gmail.com" \
  buk.pass="Manuel20189843" \
  telegram.token="8043000699:AAFrTaoyznAcIhwWiUVxhUfmazG2VLCDaBo" \
  telegram.chat="6887344367"
```

---

### 11. Desplegar las funciones a Firebase

```bash
firebase deploy --only functions
```

---

## 🧪 Probar que funciona

Después del deploy, abrí la URL que te da la consola para esta función:

```
testTelegramNotification
```

Ejemplo:

```
https://us-central1-TU_PROYECTO.cloudfunctions.net/testTelegramNotification
```

Si todo está bien, vas a recibir este mensaje en Telegram:

```
✅ Hola Manuel, tu bot BukCheckin está funcionando 👋
```

---

## 🕒 ¿Cuándo se ejecuta?

- Entrada: todos los días lunes a viernes a las **08:30 AM (hora Chile)**
- Salida: lunes a viernes a las **18:30 PM (hora Chile)**

---

## 📦 Estructura del proyecto

```
buk-auto-checkin/
├── functions/
│   ├── index.js               # Configura funciones programadas
│   ├── markBuk.js             # Lógica de Puppeteer para marcar en Buk
│   ├── notifyTelegram.js      # Envío de mensajes por Telegram
│   ├── testTelegram.js        # Función para probar Telegram
│   ├── user-config.js         # Configuración de usuarios
│   └── package.json           # Dependencias
├── firebase.json              # Configuración del proyecto Firebase
└── .firebaserc                # Alias del proyecto
```

---

## 📩 ¿Problemas o preguntas?

Contactá a quien te compartió este proyecto o revisá los logs desde:

- [Firebase Console > Functions](https://console.firebase.google.com/functions/)
- O usando este comando:
  ```bash
  firebase functions:log
  ```