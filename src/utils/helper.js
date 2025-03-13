async function select (page, elType, elValue, elArg) {
    switch (elType) {
        case 'wait': {
            const waitTime = parseInt(elValue, 10);
            return await new Promise(r => setTimeout(r, waitTime));
        }
        case 'polling': {
            // Listen for console messages from the browser
            page.on('console', msg => console.log('Browser log:', msg.text()));
            
            return await page.waitForFunction(
                (selector, text) => {
                    console.log(`Checking selector: ${selector} for text: ${text}`);
                    const element = document.querySelector(selector);
                    if (!element) {
                        console.log(`Element not found: ${selector}`);
                        return false;
                    }
                    const hasText = element.innerText.includes(text);
                    console.log(`Text "${text}" ${hasText ? 'found' : 'not found'} in element`);
                    return hasText;
                },
                { polling: 1000 },  // Poll every second for better logging visibility
                elValue,
                elArg
            );
        }
        case 'element':
          return await page.locator(elValue);
        default:
          throw new Error(`Unsupported element type: ${elType}`);
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