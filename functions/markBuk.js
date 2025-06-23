const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const axios = require("axios");
const fs = require("fs");

async function resolverRecaptcha(apiKey, sitekey, pageUrl) {
  console.log("🧠 Enviando captcha a 2Captcha...");
  const { data: reqResp } = await axios.get("http://2captcha.com/in.php", {
    params: {
      key: apiKey,
      method: "userrecaptcha",
      googlekey: sitekey,
      pageurl: pageUrl,
      invisible: 1,
      json: 1
    }
  });

  console.log("📥 Respuesta inicial de 2Captcha:", reqResp);

  if (reqResp.status !== 1) {
    throw new Error("Solicitud reCAPTCHA fallida: " + reqResp.request);
  }

  const requestId = reqResp.request;
  console.log("🆔 ID de solicitud:", requestId);

  console.log("⏳ Esperando resolución (ej. 20 s) …");
  await new Promise(res => setTimeout(res, 20000));

  for (let i = 0; i < 12; i++) {
    console.log(`⌛ Intento ${i + 1}/12 para obtener token…`);
    const { data: resResp } = await axios.get("http://2captcha.com/res.php", {
      params: { key: apiKey, action: "get", id: requestId, json: 1 }
    });

    console.log("📥 Respuesta del intento:", resResp);

    if (resResp.status === 1) {
      console.log("✅ Token recibido:", resResp.request);
      return resResp.request;
    }

    if (resResp.request !== "CAPCHA_NOT_READY") {
      throw new Error("Error al resolver captcha: " + resResp.request);
    }

    await new Promise(res => setTimeout(res, 7000));
  }

  throw new Error("❌ Timeout: no se recibió el token en tiempo");
}

async function marcarEnBuk(user, sentido) {
  console.log(`🔐 Iniciando proceso de marcaje para ${user.nombre} - Sentido: ${sentido}`);

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath || "/usr/bin/chromium-browser",
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
  });

  const page = await browser.newPage();

  try {
    console.log("🌐 Navegando al login de Buk...");
    await page.goto(user.urlLogin, { waitUntil: "networkidle2" });

    console.log("✍️ Eliminando atributo readonly del email...");
    await page.evaluate(() => {
      const emailInput = document.getElementById("user_email");
      if (emailInput) emailInput.removeAttribute("readonly");
    });

    console.log("📧 Escribiendo el email...");
    await page.type("#user_email", user.email, { delay: 50 });

    console.log("🤖 Resolviendo reCAPTCHA invisible...");
    const sitekey = "6LcBFccUAAAAAEu8QCjJSKoHpPrMwKLMMivaviuN";
    const captchaToken = await resolverRecaptcha("2842b7d3146716ce0d46766d145d14d6", sitekey, user.urlLogin);

    // Inyectar el token en el formulario y hacer submit
    await page.evaluate(token => {
      const textarea = document.createElement("textarea");
      textarea.id = "g-recaptcha-response";
      textarea.name = "g-recaptcha-response";
      textarea.style = "display: none";
      textarea.value = token;
      document.body.appendChild(textarea);

      const form = document.querySelector("form");
      if (form) form.submit();
    }, captchaToken);

    console.log("⏳ Esperando campo de contraseña...");
    await page.waitForSelector("#user_password", { visible: true, timeout: 15000 });

    await page.type("#user_password", user.password, { delay: 50 });

    console.log("🔓 Iniciando sesión...");
    await Promise.all([
      page.click("input[type='submit']"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    console.log("📄 Navegando al portal del colaborador...");
    await page.goto(user.urlPortal, { waitUntil: "networkidle2" });

    console.log(`🖱️ Buscando botón con texto "${sentido}"...`);
    const encontrado = await page.evaluate(({ sentido, lat, lng }) => {
      const botones = Array.from(document.querySelectorAll("button.btn-asistencia"));
      const target = botones.find(boton => {
        const span = boton.querySelector("span.btn-label");
        return span && span.innerText.trim().toUpperCase() === sentido;
      });

      if (target) {
        const url = `/employee_portal/web_marking/marcaje?sentido=${sentido}&latitude=${lat}&longitude=${lng}`;
        target.setAttribute("ic-post-to", url);
        target.setAttribute("ic-src", url);
        target.click();
        return true;
      }

      return false;
    }, { sentido, lat: user.latitud, lng: user.longitud });

    if (!encontrado) {
      throw new Error(`No se encontró el botón de ${sentido}`);
    }

    console.log("⏳ Esperando confirmación...");
    await page.waitForTimeout(3000);

    console.log(`✅ Marcaje completado para ${user.nombre} - ${sentido}`);
  } catch (error) {
    const mensaje = `❌ Error al marcar ${sentido} para ${user.nombre}: ${error.message}`;
    console.error(mensaje);

    try {
      const screenshotPath = `/tmp/error-${user.nombre}-${sentido}.png`;
      await page.screenshot({ path: screenshotPath });

      const { notifyTelegram } = require("./notifyTelegram");
      await notifyTelegram(user, mensaje, screenshotPath);
    } catch (notifyError) {
      console.error("❌ Falló el envío a Telegram:", notifyError.message);
    }

    throw error;
  } finally {
    console.log("🧹 Cerrando navegador...");
    await browser.close();
  }
}

module.exports = { marcarEnBuk };