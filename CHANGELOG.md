# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.4] - 2025-04-27

### Added
- **Logger Methods**: Enhanced logger functionality to dynamically print all available methods for debugging purposes.

### Fixed
- **Logger Error Handling**: Resolved an issue where `logger.error` was not recognized as a function in certain scenarios.
- **Plugin Execution**: Improved error handling during plugin execution to ensure proper logging and variable registration.

## [3.2.3] - 2025-04-14

### Fixed
- Handled return code from main function.

## [3.2.2] - 2025-04-14

### Changed
- **Return Code**: Returned code from main function.

## [3.2.1] - 2025-04-12

### Changed
- **Common Logger**: Improved logging module with additional logging levels.

## [3.2.0] - 2025-04-09

### Added
- **Common Logger**: Logging is now its own module controlled by environment variables.

### Removed
- **Verbose Option**: Removed the `verbose` option from command line.

## [3.1.0] - 2025-04-08

### Added
- **Common Plugins**: Added built-in common plugins and the ability to refer to them with commands.
- **Common Commands**: Introduced common commands for easier automation.

### Changed
- **Schema Update**: Moved to an Ansible-like schema for better structure and flexibility.
- **Tasks Over Steps**: Replaced `steps` with `tasks` in the recipe schema for improved clarity and functionality.

### Removed
- **Helper Module**: Removed the `helper` module as part of the refactoring.

### Documentation
- Updated documentation to reflect the new schema and task-based structure.
- Cleaned up and improved inline documentation for recipes and commands.

## [3.0.0] - 2025-04-02

### Added
- **Syntax Check**: Replaced `dry-run` mode with `syntax-check` for validating recipes.

### Changed
- **Schema Update**: Moved to an Ansible-like schema for better structure and flexibility.
- **Tasks Over Steps**: Replaced `steps` with `tasks` in the recipe schema for improved clarity and functionality.

### Removed
- **Helper Module**: Removed the `helper` module as part of the refactoring.

### Documentation
- Updated documentation to reflect the new schema and task-based structure.
- Cleaned up and improved inline documentation for recipes and commands.

## [2.0.0] - 2025-03-20

### Added
- Support for puppeteer-extra with user preferences plugin
- New configuration schema for better browser control
- Timeout options for all operations
- Dry-run mode for recipe validation
- Support for custom plugins via `--extra` option
- Improved command line interface with better argument handling

### Changed
- Refactored action handling to pass page as argument
- Changed debug option to verbose for better clarity
- Updated recipe schema for better structure
- Improved documentation and README
- Enhanced error handling and logging

### Fixed
- Removed unnecessary await statements
- Fixed browser console logging
- Improved error handling in recipe execution

### Documentation
- Added comprehensive API documentation
- Updated README with new features and examples
- Added more example recipes
- Improved command line usage documentation

## [1.0.0] - 2025-01-23

### Added
- Initial release
- Basic recipe schema support
- Command line interface with recipe and config options
- Support for select and action operations
- Wait, polling, and element handling functionality
- Error handling for required operations

