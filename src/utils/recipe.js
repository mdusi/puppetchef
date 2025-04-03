/**
 * Recipe validation and transformation module
 * 
 * This module provides functionality to validate and transform web automation recipes
 * using JSON Schema validation (via Ajv). It ensures that recipes conform to a predefined
 * schema and handles transformations of simple formats into expanded object formats.
 * 
 * @module recipe
 */

const Ajv = require('ajv');

const ajv = new Ajv({
  useDefaults: true,
  removeAdditional: true,
  allowUnionTypes: true
});

/**
 * Schema for defining steps in a recipe
 * Each step consists of a command to perform
 * @type {Object}
 */
const stepSchema = {
  $id: 'stepSchema',
  type: 'object',
  properties: {
    register: {
      type: 'string',
      default: undefined
    },
    ignore_errors: {
      type: 'boolean',
      default: false
    },
    when: {
      type: 'string',
      default: undefined
    },
  },
  patternProperties: {
    "^puppetchef.*$": { 
      type: 'object',
      properties: {
        command: { type: 'string' }
      },
      required: ['command']
    }
  },
  additionalProperties: false,
  required: ['ignore_errors']
};

const stepReservedKeys = Object.keys(stepSchema.properties);

/**
 * Schema for defining tasks in a recipe
 * Each task has a name and a list of steps to perform
 * @type {Object}
 */
const taskSchema = {
  $id: 'taskSchema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    steps: { 
      type: 'array', 
      items: stepSchema,
      default: []
    }
  },
  required: ['name', 'steps']
};

/**
 * Schema for the complete recipe
 * Contains the target URL, recipe name, and list of tasks
 * @type {Object}
 */
const recipeSchema = {
  type: 'object',
  properties: {
    url: { type: 'string' },
    name: { type: 'string'},
    tasks: {
      type: 'array',
      items: taskSchema
    }
  },
  required: ['url', 'name', 'tasks']
};

// Add schemas to ajv
ajv.addSchema(stepSchema);
ajv.addSchema(taskSchema);

// Create a validator function
const validateRecipe = ajv.compile(recipeSchema);

/**
 * Validates and transforms a recipe according to the schema
 * 
 * This function takes a recipe object and validates it against the defined schema.
 * It also handles transformations of simple string formats into their expanded object formats.
 * 
 * @param {Object} recipe - The recipe to validate and transform
 * @param {string} recipe.url - The target URL to navigate to
 * @param {string} recipe.name - The name of the recipe
 * @param {Array<Object>} recipe.tasks - Array of tasks to execute
 * @param {string} recipe.tasks[].name - Name of the task
 * @param {Array<Object>} recipe.tasks[].steps - Steps to perform
 * @param {Object} recipe.tasks[].steps[].select - Element selector configuration
 * @param {Object} recipe.tasks[].steps[].action - Action to perform
 * @param {boolean} [recipe.tasks[].steps[].required=true] - Whether the step is required
 * @param {boolean} [debug=false] - Whether to enable debug logging
 * @returns {Object} The validated and transformed recipe
 * @throws {Error} If the recipe format is invalid
 * 
 * @example
 * // Basic recipe example
 * const recipe = {
 *   url: "https://example.com",
 *   name: "Test Recipe",
 *   tasks: [{
 *     name: "Click Button",
 *     steps: [{
 *       puppetchef.builtin.common: {
 *         command: click,
 *         selector: '#button'
 *       },
 *       ignore_errors: true
 *     }]
 *   }]
 * };
 */
function parseRecipeWithSchema(recipe, debug = false) {
  if (debug)
    console.log('Debug: Parsing recipe:', JSON.stringify(recipe, null, 2));

  const valid = validateRecipe(recipe);
  
  if (!valid) {
    const errors = validateRecipe.errors.map(err => 
      `${err.instancePath} ${err.message}`
    ).join('; ');
    throw new Error(`Invalid recipe format: ${errors}`);
  }

  if (debug)
    console.log('Debug: Transformed recipe:', JSON.stringify(recipe, null, 2));

  return recipe;
}

module.exports = { parseRecipeWithSchema, stepReservedKeys };