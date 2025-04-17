const functions = require("firebase-functions");
const { marcarEnBuk } = require("./markBuk");
const { notifyTelegram } = require("./notifyTelegram");
const users = require("./user-config");

exports.marcarEntradaManual = functions.https.onRequest(async (req, res) => {
    const user = users[0]; // por ahora solo Manuel

    try {
        await marcarEnBuk(user, "ENTRADA");
        await notifyTelegram(user, `✅ Entrada registrada manualmente para ${user.nombre}`);
        res.status(200).send("Entrada registrada correctamente.");
    } catch (error) {
        const msg = `❌ Error al registrar entrada manual: ${error.message}`;
        await notifyTelegram(user, msg);
        res.status(500).send(msg);
    }
});

exports.marcarSalidaManual = functions.https.onRequest(async (req, res) => {
    const user = users[0];

    try {
        await marcarEnBuk(user, "SALIDA");
        await notifyTelegram(user, `✅ Salida registrada manualmente para ${user.nombre}`);
        res.status(200).send("Salida registrada correctamente.");
    } catch (error) {
        const msg = `❌ Error al registrar salida manual: ${error.message}`;
        await notifyTelegram(user, msg);
        res.status(500).send(msg);
    }
});
