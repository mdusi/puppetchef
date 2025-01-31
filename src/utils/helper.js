async function select (page, elType, elValue) {
    if (elType == 'xpath')
        return await page.locator(`xpath/${elValue}`);
    // return await page.waitForSelector(`::-p-xpath(${elValue})`);
}

async function action (elem, elAction, elValue) {
    switch (elAction) {
        case 'fill_out':
            await elem.fill(elValue);
            break;
        case 'click':
            await elem.click();
            break;
        default:
            break;
    }   
}

module.exports = { select, action };