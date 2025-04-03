module.exports = {
    click: async (page, data = {}) => {
        page.on('console', msg => console.log('Browser log:', msg.text()));
        console.log(data)
        const elem = await page.locator(data.selector).setTimeout(data.timeout || 30000);
        await elem.click();
    }
}