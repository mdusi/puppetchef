const { logger } = require("../src/logger.js");

const locator = async (page, data = {}) => {
  return await page.locator(data.selector).setTimeout(data.timeout || 30000);
};

module.exports = {
  select: async (page, data = {}) => {
    // page.on('console', msg => console.log('Browser log:', msg.text()));
    // console.log(data)
    const elem = await locator(page, data);
    try {
      return await elem.map((e) => e.innerText).wait();
    } catch (error) {
      logger.error("Error while processing elements (ignoring):", error);
    }
  },

  click: async (page, data = {}) => {
    const elem = await locator(page, data);
    await elem.click();
  },

  fill_out: async (page, data = {}) => {
    const elem = await locator(page, data);
    await elem.fill(data.data);
  },

  wait: async (page, data = {}) => {
    const waitTime = parseInt(data.value, 10);
    await new Promise((r) => setTimeout(r, waitTime));
  },

  pollingFor: async (page, data = {}) => {
    logger.debug(`Polling for ${data.selector} to contain ${data.text}`);
    return await page.waitForFunction(
      (data) => {
        const element = document.querySelector(data.selector);
        return element ? element.innerText.includes(data.text) : false;
      },
      { polling: 1000 }, // Poll every second for better logging visibility
      data,
    );
  },

  debug: async (page, data = {}) => console.log(data.format),
};
