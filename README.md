# Puppetchef

A powerful web automation tool that uses Puppeteer to execute web automation recipes defined in YAML format.

## Features

- **YAML-based Recipe Definition**: Write your web automation steps in a simple, readable YAML format
- **Schema Validation**: Built-in validation for recipe structure and operations
- **Plugin System**: Extend functionality with custom plugins
- **Configuration Management**: Flexible configuration through JSON files
- **Verbose Logging**: Detailed execution logs for debugging
- **Error Handling**: Graceful error handling with configurable retry options

## Installation

```bash
npm install puppetchef
```

## Usage

```bash
puppetchef -i recipe.yaml [options]
```

### Command Line Options

- `-i, --recipe <file>`: Recipe file in YAML format (required)
- `-c, --conf <file>`: Configuration file (default: puppetchefrc)
- `-v, --verbose`: Enable verbose logging
- `-e, --extra <file>`: Path to plugins file

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
steps:
  - name: "Login"
    ops:
      - select: "#username"
        action: 
          type: "fill_out"
          value: "testuser"
      - select: "#password"
        action: 
          type: "fill_out"
          value: "password123"
      - select: "#submit"
        action: "click"
```

### Variables in Recipes

You can use variables in your recipes:

```yaml
variables:
  user_data:
    name: John
    age: 30

steps:
  - name: "Fill Form"
    ops:
      - select: "#username"
        action: 
          type: "fill_out"
          value: ${variables.user_data.name}
```

### Plugins

Create custom plugins to extend functionality:

```javascript
// plugins.js
module.exports = {
  customAction: async (page, element, params) => {
    // Custom automation logic
    await element.evaluate((el) => el.style.display = 'none');
  }
};
```

Use plugins in your recipe:

```yaml
steps:
  - name: "Custom Action"
    ops:
      - select: "#target"
        action: 
          type: "customAction"
          plugin: true
```

## Development

### Project Structure

```
puppetchef/
├── src/
│   ├── index.js           # Main automation logic
│   └── utils/
│       ├── helper.js      # Helper functions
│       └── recipe.js      # Recipe parsing and validation
├── index.js              # CLI entry point
└── package.json
```

### Running Tests

```bash
npm test
```

## License

MIT