module.exports = {
    select: async (page, data = {}) => {
        page.on('console', msg => console.log('Browser log:', msg.text()));
        console.log(data)
        await page.locator(data.selector).setTimeout(data.timeout || 30000);
    },

    click: async (page, data = {}) => {
        page.on('console', msg => console.log('Browser log:', msg.text()));
        console.log(data)
        const elem = await page.locator(data.selector).setTimeout(data.timeout || 30000);
        await elem.click();
    },

    fill_out: async (page, data = {}) => {
        page.on('console', msg => console.log('Browser log:', msg.text()));
        console.log(data)
        const elem = await page.locator(data.selector).setTimeout(data.timeout || 30000);
        await elem.fill(data.data);
    },

    wait: async (page, data = {}) => {
        page.on('console', msg => console.log('Browser log:', msg.text()));
        console.log(data)
        const waitTime = parseInt(data.value, 10);
        await new Promise(r => setTimeout(r, waitTime));
    },

    pollingFor: async (page, data = {}) => {
        // Listen for console messages from the browser
        page.on('console', msg => console.log('Browser log:', msg.text()));
        return await page.waitForFunction(
            data => {
                console.log(`Checking selector: ${data.selector} for text: ${data.text}`);
                const element = document.querySelector(data.selector);
                return element ? element.innerText.includes(data.text) : false;
            },
            { polling: 1000 },  // Poll every second for better logging visibility
            data
        );
    }
}
