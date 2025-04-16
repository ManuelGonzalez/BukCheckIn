const functions = require("firebase-functions");
const { marcarEnBuk } = require("./markBuk");
const { notifyTelegram } = require("./notifyTelegram");
const users = require("./user-config");

function programarMarcaje(hora, sentido) {
  return functions.pubsub
    .schedule(hora)
    .timeZone("America/Santiago")
    .onRun(async () => {
      for (const user of users) {
        try {
          await marcarEnBuk(user, sentido);
          await notifyTelegram(user, `✅ ${sentido} registrada correctamente para ${user.nombre}`);
        } catch (error) {
          console.error(`❌ Error al registrar ${sentido} para ${user.nombre}:`, error);
          await notifyTelegram(user, `❌ Error al registrar ${sentido} para ${user.nombre}: ${error.message}`);
        }
      }
    });
}

exports.marcarEntrada = programarMarcaje("30 8 * * 1-5", "ENTRADA");
exports.marcarSalida = programarMarcaje("30 18 * * 1-5", "SALIDA");