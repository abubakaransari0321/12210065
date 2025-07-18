const axios = require("axios");

async function Log(stack, level, packageName, message) {
  try {
    await axios.post("http://20.244.56.144/evaluation-service/logs", {
      stack,
      level,
      package: packageName,
      message
    });
  } catch (error) {
    console.error("Logging failed", error.message);
  }
}

module.exports = { Log };
