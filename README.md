# Puppetchef

A powerful web automation tool that uses Puppeteer to execute web automation recipes defined in YAML format.

## Features

- **YAML-based Recipe Definition**: Write your web automation steps in a simple, readable YAML format
- **Schema Validation**: Built-in validation for recipe structure and operations
- **Plugin System**: Extend functionality with custom plugins
- **Configuration Management**: Flexible configuration through JSON files
- **Verbose Logging**: Detailed execution logs for debugging
- **Dry Run Mode**: Validate recipes without executing them

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
- `-v, --verbose`: Enable verbose logging (default: false)
- `-n, --dry-run`: Validate recipe only, don't execute (default: false)
- `-e, --extra <file>`: Path to plugins file

### Examples

```bash
# Basic usage with a recipe file
puppetchef -i recipe.yaml

# With configuration file and verbose logging
puppetchef -i recipe.yaml -c config.json -v

# Validate recipe without executing
puppetchef -i recipe.yaml -n

# With custom plugins
puppetchef -i recipe.yaml -e plugins.js
```

### Configuration File (puppetchefrc)

Create a JSON configuration file to customize browser behavior:

```json
{
  "headless": false,
  "defaultViewport": {
    "width": 1920,
    "height": 1080
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
          data:
            text: "testuser"
      - select: "#password"
        action: 
          type: "fill_out"
          data:
            text: "password123"
      - select: "#submit"
        action: "click"
```

### Variables in Recipes

You can use variables in your recipes:

```yaml
steps:
  - name: "Fill Form"
    ops:
      - select: "#username"
        action: 
          type: "fill_out"
          data:
            name: John
            age: 30
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
