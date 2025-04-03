module.exports = {
    wait: async (page, data = {}) => {
        page.on('console', msg => console.log('Browser log:', msg.text()));
        console.log(data)
        const waitTime = parseInt(data.value, 10);
        await new Promise(r => setTimeout(r, waitTime));
    }
}
