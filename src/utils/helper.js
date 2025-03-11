async function select (page, elType, elValue, elArg) {
    switch (elType) {
        case 'wait': {
            const waitTime = parseInt(elValue, 10);
            return await new Promise(r => setTimeout(r, waitTime));
        }
        case 'polling':
            return await page.waitForFunction(
                (selector, text) => {
                    return document.querySelector(selector).innerText.includes(text);
                },
                {},
                elValue, elArg
            );
        default:
            return await page.locator(elValue);
            // throw new Error(`Unsupported element type: ${elType}`);
    }
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