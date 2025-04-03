module.exports = {
    select: async (page, data = {}) => {
        page.on('console', msg => console.log('Browser log:', msg.text()));
        console.log(data)
        await page.locator(data.selector).setTimeout(data.timeout || 30000);
    }
}