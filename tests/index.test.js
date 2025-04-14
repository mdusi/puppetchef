const puppeteer = require('puppeteer-extra');
const { main } = require('../src/index.js');
const { logger } = require('../src/logger.js');

// Mock Puppeteer
jest.mock('puppeteer-extra', () => ({
  launch: jest.fn(() => ({
    newPage: jest.fn(() => ({
      goto: jest.fn(),
    })),
    close: jest.fn(),
  })),
}));

// Mock logger
jest.mock('../src/logger.js', () => ({
  logger: {
    debug: jest.fn(),
  },
}));

describe('Main Function', () => {
  let mockPlugins;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock plugins
    mockPlugins = {
      'puppetchef.builtin.common': {
        click: jest.fn(async () => 'clicked'),
        fill_out: jest.fn(async () => 'filled'),
      },
    };
  });

  it('should execute tasks and steps successfully', async () => {
    const conf = { headless: true };
    const recipe = {
      url: 'https://example.com',
      name: 'Test Recipe',
      tasks: [
        {
          name: 'Task 1',
          steps: [
            {
              'puppetchef.builtin.common': {
                command: 'click',
                selector: '#button',
              },
              register: 'result',
              ignore_errors: false,
              when: 'true',
            },
          ],
        },
      ],
    };

    const result = await main(conf, recipe, mockPlugins);

    // Verify Puppeteer interactions
    expect(puppeteer.launch).toHaveBeenCalledWith({ headless: true });
    
    // Verify logger calls
    expect(logger.debug).toHaveBeenCalledWith('Executing task: Task 1');
    expect(logger.debug).toHaveBeenCalledWith('Registering variable result with value "clicked"');
    expect(mockPlugins['puppetchef.builtin.common'].click).toHaveBeenCalledWith(expect.anything(), {
      command: 'click',
      selector: '#button',
    });
    expect(result).toBe(0);
  });

  it('should not execute task due to condition not met', async () => {
    const conf = { headless: true };
    const recipe = {
      url: 'https://example.com',
      name: 'Test Recipe',
      tasks: [
        {
          name: 'Task 1',
          steps: [
            {
              'puppetchef.builtin.common': {
                command: 'click',
                selector: '#button',
              },
              ignore_errors: false,
              when: 'false',
            },
          ],
        },
      ],
    };

    const result = await main(conf, recipe, mockPlugins);

    // Verify Puppeteer interactions
    expect(puppeteer.launch).toHaveBeenCalledWith({ headless: true });
    
    // Verify logger calls
    expect(logger.debug).toHaveBeenCalledWith('Executing task: Task 1');
    expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Condition not met'));
    expect(result).toBe(0);
  });

  it('should skip tasks with no steps', async () => {
    const conf = {};
    const recipe = {
      url: 'https://example.com',
      name: 'Test Recipe',
      tasks: [
        {
          name: 'Empty Task',
          steps: [],
        },
      ],
    };

    await main(conf, recipe, mockPlugins);

    // Verify logger call for skipping task
    expect(logger.debug).toHaveBeenCalledWith('No steps to perform for this task.');
  });

  it('should handle errors and continue if ignore_errors is true', async () => {
    const conf = {};
    const recipe = {
      url: 'https://example.com',
      name: 'Test Recipe',
      tasks: [
        {
          name: 'Task with Error',
          steps: [
            {
              'puppetchef.builtin.common': {
                command: 'nonexistent',
              },
              ignore_errors: true,
            },
          ],
        },
      ],
    };

    await main(conf, recipe, mockPlugins);

    // Verify logger call for ignoring error
    expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Ignoring error:'));
  });

  it('should stop execution on error if ignore_errors is false', async () => {
    const conf = {};
    const recipe = {
      url: 'https://example.com',
      name: 'Test Recipe',
      tasks: [
        {
          name: 'Task with Error',
          steps: [
            {
              'puppetchef.builtin.common': {
                command: 'nonexistent',
              },
              ignore_errors: false,
            },
          ],
        },
      ],
    };

    const result = await main(conf, recipe, mockPlugins);
    expect(result).toBe(255);

    // Verify logger call for error
    expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining('Error executing plugin'));
  });
});