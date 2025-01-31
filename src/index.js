const puppeteer = require('puppeteer');

const { action, select } = require('./utils/helper.js');

async function main(conf, recipe) {

    console.log(`Config file: ${conf}`);
    console.log(`Following recipe: ${recipe}`);

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        ...(conf.browser || {}),
    })
    const page = await browser.newPage()

    // Set screen size
    await page.setViewport({ width: 1920, height: 1080 });

    let retcode = 0

    // Navigate the page to a URL.
    await page.goto(recipe.url, { waitUntil: 'networkidle0' });

    // Loop over recipe.steps
    for (const step of recipe.steps) {
        console.log(step.name);
        if (!step.ops || step.ops.length === 0) {
          console.log('No operations to perform for this step.');
          continue;
        }
        
        for (const op of step.ops) {
          console.log(op);
          const elem = await select(page, op.type, op.element);
          await action(elem, op.action, op.value);
        }
    }
    
/*
    // Locate the full title with a unique string.
    const textSelector = await page
    .locator('text/Customize and automate')
    .waitHandle();
    const fullTitle = await textSelector?.evaluate(el => el.textContent);

    // Print the full title.
    console.log('The title of this blog post is "%s".', fullTitle);
*/
    try { 
    } catch (error) {
      console.log(error)
      retcode = 255
    } finally {
      
      // Wait for a few seconds before closing the browser
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds

      // Close the browser
      await browser.close()
    }

    process.exit(retcode)
}

module.exports = { main };
