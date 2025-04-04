# Puppetchef

A powerful web automation tool that uses Puppeteer to execute web automation recipes defined in YAML format.

## Features

- **YAML-based Recipe Definition**: Write your web automation tasks in a simple, readable YAML format.
- **Schema Validation**: Built-in validation for recipe structure and operations.
- **Plugin System**: Extend functionality with custom plugins.
- **Configuration Management**: Flexible configuration through JSON files.
- **Verbose Logging**: Detailed execution logs for debugging.
- **Syntax Check Mode**: Validate recipes without executing them.
- **Common Plugins and Commands**: Built-in plugins and commands for easier automation.

## Installation

```bash
npm install puppetchef
```

## Usage

```bash
puppetchef <recipe> [options]
```

### Command Line Options

- `<recipe>`: Recipe file in YAML format (required).
- `-c, --conf <file>`: Configuration file (default: `puppetchefrc`).
- `-v, --verbose`: Enable verbose logging (default: `false`).
- `--syntax-check`: Validate recipe only, without executing (default: `false`).

### Examples

```bash
# Basic usage with a recipe file
puppetchef recipe.yaml

# With configuration file and verbose logging
puppetchef recipe.yaml -c config.json -v

# Validate recipe without executing
puppetchef recipe.yaml --syntax-check
```

### Configuration File (puppetchefrc)

Create a JSON configuration file to customize browser behavior:

```json
{
  "browser": {
    "headless": false,
    "defaultViewport": {
      "width": 1920,
      "height": 1080
    }
  }
}
```

### Recipe Format

```yaml
url: "https://example.com"
name: "Login Test"
tasks:
  - name: "Login"
    steps:
      - puppetchef.builtin.common:
          command: "fill_out"
          selector: "#username"
          data: "testuser"
      - puppetchef.builtin.common:
          command: "fill_out"
          selector: "#password"
          data: "password123"
      - puppetchef.builtin.common:
          command: "click"
          selector: "#submit"
```

### Plugins

Create custom plugins to extend functionality:

```javascript
// plugin.js
module.exports = {
  customAction: async (page, data = {}) => {
    // Custom automation logic
    await page.locator(data.selector);

    // If you need to return values for later use
    return { x: 20, y: "msg"};
  }
};
```

Use plugins in your recipe (plugin below is expected in ./plugins/plugin.js):

```yaml
name: Example Recipe
url: https://example.com/demo-url
tasks:
  - name: "Custom Action"
    steps:
      - puppetchef.plugins.plugin:
          command: "customAction"
          selector: "#username"
        # Make the return value of customAction available to the following steps
        register: ret
      - puppetchef.builtin.common:
          command: debug
          data: "{{ ret.y }}"
          format: "Debugging: %s"
        # Conditionals for when to execute this step
        when: ret.x > 0
```

## Development

### Project Structure

```
puppetchef/
├── src/
│   ├── index.js    # Main automation logic
│   └── recipe.js   # Recipe parsing and validation
├── builtin/
│   ├── common.js   # Utility functions
├── index.js        # CLI entry point
└── package.json
```

### Running Tests

```bash
npm test
```

## License

MIT
