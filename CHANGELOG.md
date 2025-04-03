# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-04-02

### Added
- **Common Plugins**: Added built-in common plugins and the ability to refer to them with commands.
- **Common Commands**: Introduced common commands for easier automation.
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

[3.0.0]: https://github.com/edi/puppetchef/releases/tag/v3.0.0
[2.0.0]: https://github.com/edi/puppetchef/releases/tag/v2.0.0
[1.0.0]: https://github.com/edi/puppetchef/releases/tag/v1.0.0