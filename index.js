const { createLogger, format, transports } = require("winston");
const axios = require("axios");

const cookie = process.env.SMART_FUEL_OIL_COOKIE;

if (!cookie) {
  console.log("ERROR: $SMART_FUEL_OIL_COOKIE is not set");
  process.exit(1);
}

const datadogApiKey = process.env.DATADOG_API_KEY;

if (!datadogApiKey) {
  console.log("ERROR: $DATADOG_API_KEY is not set");
  process.exit(1);
}

const logger = createLogger({
  level: "debug",
  exitOnError: false,
  format: format.json(),
  defaultMeta: { service: "nestlogger" },
  transports: [
    new transports.Http({
      host: "http-intake.logs.datadoghq.com",
      path: `/api/v2/logs?dd-api-key=${datadogApiKey}&ddsource=nodejs&service=nestlogger`,
      ssl: true,
      handleExceptions: true,
      handleRejections: true,
      level: "info",
    }),
    new transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

function handleResponse(json) {
  console.log("got response: ", json);
  const tank = json.tanks[0];
  const sensor = tank.sensors[0];
  logger.info({
    tank: tank.tank_id,
    sensor: sensor.sensor_id,
    gallons: sensor.l_gallons,
    readingDate: sensor.l_read,
  });
}

const req = {
  method: "POST",
  timeout: 30_000,
  url: "https://app.smartoilgauge.com/ajax/main_ajax.php",
  data: "action=get_tanks_list&tank_id=0",
  headers: {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    cookie: cookie,
    Referer: "https://app.smartoilgauge.com/",
    "sec-ch-ua":
      '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
  },
};

axios(req)
  .then((result) => {
    if (result.status == 200 && result.data.result != "error") {
      handleResponse(result.data);
    } else {
      console.error("Failed", result.status, result.statusText, result.data);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
