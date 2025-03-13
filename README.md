# Puppetchef

A powerful web automation tool that uses Puppeteer to execute automation recipes defined in YAML format.

## Features

- Execute web automation tasks using simple YAML recipes
- Support for various element selection strategies:
  - CSS selectors
  - Wait conditions
  - Polling for text content
- Common web interactions:
  - Clicking elements
  - Filling form fields
- Configurable browser settings
- Debug logging support
- Schema validation for recipes
- Support for both simple and expanded action formats

## Installation

```bash
npm install puppetchef
```

## Usage

### Command Line Interface

```bash
puppetchef -i recipe.yaml [-c config.json] [-d]
```

#### Options

- `-i, --recipe <file>` : Path to the YAML recipe file (required)
- `-c, --conf <file>`   : Path to the JSON configuration file (default: puppetchefrc)
- `-d, --debug`        : Enable debug logging (default: false)

### Configuration File (puppetchefrc)

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

### Recipe File Format

#### Simple Format

```yaml
url: "https://example.com"
name: "Login Test"
steps:
  - name: "Login"
    ops:
      - select: "#username"
        action: { type: "fill_out", value: "testuser" }
      - select: "#password"
        action: { type: "fill_out", value: "password123" }
      - select: "#submit"
        action: "click"
```

#### Expanded Format

```yaml
url: "https://example.com"
name: "Complex Test"
steps:
  - name: "Wait for Page Load"
    ops:
      - select:
          type: "wait"
          element: "5000"
  - name: "Check Status"
    ops:
      - select:
          type: "polling"
          element: "#status"
          value: "Ready"
  - name: "Fill Form"
    ops:
      - select:
          type: "element"
          element: "#username"
          value: ""
        action:
          type: "fill_out"
          value: "testuser"
        required: true
```

### Recipe Schema

#### Steps
- `name`: Name of the step (string)
- `ops`: Array of operations to perform

#### Operations
- `select`: Element selector configuration
  - `type`: Selection strategy ('wait', 'polling', or 'element')
  - `element`: CSS selector or wait time
  - `value`: Additional value (for polling text)
- `action`: Action to perform
  - `type`: Action type ('click' or 'fill_out')
  - `value`: Value for fill_out action
- `required`: Whether the operation is required (boolean, default: true)

## Examples

### Basic Login Test

```yaml
url: "https://example.com"
name: "Login Test"
steps:
  - name: "Login"
    ops:
      - select: "#username"
        action: { type: "fill_out", value: "testuser" }
      - select: "#password"
        action: { type: "fill_out", value: "password123" }
      - select: "#submit"
        action: "click"
```

### Complex Form Submission

```yaml
url: "https://example.com"
name: "Form Test"
steps:
  - name: "Wait for Form"
    ops:
      - select:
          type: "polling"
          element: "#form"
          value: "Ready"
  - name: "Fill Form"
    ops:
      - select: "#name"
        action: { type: "fill_out", value: "John Doe" }
      - select: "#email"
        action: { type: "fill_out", value: "john@example.com" }
      - select: "#submit"
        action: "click"
  - name: "Verify Success"
    ops:
      - select:
          type: "polling"
          element: "#status"
          value: "Success"
```

## Error Handling

- Failed operations with `required: true` will stop the recipe execution
- Debug logging can be enabled with the `-d` flag
- Schema validation ensures recipe format correctness
- Browser console logs are captured during polling operations

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/mdusi/puppetchef.git
cd puppetchef
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm test
```

### Project Structure

```
puppetchef/
├── src/
│   ├── index.js           # Main automation logic
│   └── utils/
│       ├── helper.js      # Helper functions
│       └── recipe.js      # Recipe validation
├── index.js               # CLI entry point
├── package.json
└── README.md
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request