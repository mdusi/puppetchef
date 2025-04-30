const { main } = require("../src/index.js");

jest.setTimeout(10000);

describe("Integration Test", () => {
  it("should execute the program with a real recipe", async () => {
    const conf = {
      headless: true,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      args: [
        "--no-sandbox",
        "--in-process-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
      ],
    };

    const recipe = {
      name: "Example",
      url: "https://mdusi.github.io/puppetchef",
      tasks: [
        {
          name: "Go To Examples",
          steps: [
            {
              "puppetchef.builtin.common": {
                command: "click",
                selector:
                  'xpath///*[@id="__consent"]/aside/form/div[2]/button[1]',
              },
              ignore_errors: false,
            },
            {
              "puppetchef.builtin.common": {
                command: "click",
                selector: "xpath//html/body/header/nav[2]/div/ul/li[2]/a",
              },
              ignore_errors: false,
            },
            {
              "puppetchef.builtin.common": {
                command: "select",
                timeout: 3000,
                selector:
                  "xpath///html/body/div[4]/main/div/div[3]/article/div[4]/table/tbody/tr[2]/td[2]",
              },
              register: "recipe",
              ignore_errors: false,
            },
            {
              "puppetchef.builtin.common": {
                command: "debug",
                format:
                  "Here is an exmaple recipe\n-----\n{{{ recipe }}}\n-----",
              },
              ignore_errors: false,
            },
          ],
        },
      ],
    };

    const plugins = {
      "puppetchef.builtin.common": require("../builtin/common.js"),
    };

    const result = await main(conf, recipe, plugins);

    // Verify the program exits with a success code
    expect(result).toBe(0);
  });
});
