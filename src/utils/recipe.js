/**
 * Recipe validation and transformation module
 * 
 * This module provides functionality to validate and transform web automation recipes
 * using JSON Schema validation (via Ajv). It handles both simple string formats and
 * expanded object formats for actions and selectors.
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
 * Schema for defining actions in a recipe
 * Supports both string format (e.g., "click") and object format (e.g., { type: "click", value: "" })
 * @type {Object}
 */
const actionSchema = {
    $id: 'actionSchema',
    toAction: true,
    type: ["string", "object"],
    properties: {
        type: { type: "string" },
        data: { type: 'object', default: {} }
    },
    required: ["type", "data"],
    default: {
        type: '',
        data: {}
    }
};


/**
 * Schema for defining element selectors in a recipe
 * Supports both string format (e.g., "#button") and object format (e.g., { type: "element", element: "#button" })
 * @type {Object}
 */
const selectSchema = {
    $id: 'selectSchema',
    toSelect: true,
    type: ["string", "object"],
    properties: {
        type: {
            type: 'string',
            default: 'element'
        },
        element: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            timeout: { type: 'number', default: 30000 }
          },
          default: { timeout: 30000 },
          required: ['timeout']
        }
    },
    required: ['type', 'element', 'data']
};

/**
 * Schema for defining operations in a recipe
 * Each operation consists of a selector and an action to perform
 * @type {Object}
 */
const opSchema = {
  $id: 'opSchema',
  type: 'object',
  properties: {
    select: selectSchema,
    action: actionSchema,
    required: {
      type: 'boolean',
      default: true
    }
  },
  required: ['select', 'action']
};

/**
 * Schema for defining steps in a recipe
 * Each step has a name and a list of operations to perform
 * @type {Object}
 */
const stepSchema = {
  $id: 'stepSchema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    ops: { 
      type: 'array', 
      items: opSchema,
      default: []
    }
  },
  required: ['name', 'ops']
};

/**
 * Schema for the complete recipe
 * Contains the target URL, recipe name, and list of steps
 * @type {Object}
 */
const recipeSchema = {
  type: 'object',
  properties: {
    url: { type: 'string' },
    name: { type: 'string'},
    steps: {
      type: 'array',
      items: stepSchema
    }
  },
  required: ['url', 'name', 'steps']
};

/**
 * Custom keyword for transforming string actions into object format
 * Example: "click" -> { type: "click", value: "" }
 */
ajv.addKeyword({
    keyword: "toAction",
    type: "string",
    compile: () => (data, dataPath) => {
      if (typeof data === "string")
        dataPath.parentData[dataPath.parentDataProperty] = { type: data, value: "" };
      return true;
    }
  }
);

/**
 * Custom keyword for transforming string selectors into object format
 * Example: "#button" -> { type: "element", element: "#button", value: "" }
 */
ajv.addKeyword({
    keyword: "toSelect",
    type: "string",
    compile: () => (data, dataPath) => {
      if (typeof data === "string")
        dataPath.parentData[dataPath.parentDataProperty] = { type: "element", element: data, data: { timeout: 30000 } };
      return true;
    }
  }
);

// Add schemas to ajv
ajv.addSchema(selectSchema);
ajv.addSchema(actionSchema);
ajv.addSchema(opSchema);
ajv.addSchema(stepSchema);

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
 * @param {Array<Object>} recipe.steps - Array of steps to execute
 * @param {string} recipe.steps[].name - Name of the step
 * @param {Array<Object>} recipe.steps[].ops - Operations to perform
 * @param {Object} recipe.steps[].ops[].select - Element selector configuration
 * @param {Object} recipe.steps[].ops[].action - Action to perform
 * @param {boolean} [recipe.steps[].ops[].required=true] - Whether the operation is required
 * @param {boolean} [debug=false] - Whether to enable debug logging
 * @returns {Object} The validated and transformed recipe
 * @throws {Error} If the recipe format is invalid
 * 
 * @example
 * // Simple format
 * const recipe = {
 *   url: "https://example.com",
 *   name: "Test Recipe",
 *   steps: [{
 *     name: "Click Button",
 *     ops: [{
 *       select: "#submit",
 *       action: "click"
 *     }]
 *   }]
 * };
 * 
 * // Expanded format
 * const recipe = {
 *   url: "https://example.com",
 *   name: "Test Recipe",
 *   steps: [{
 *     name: "Fill Form",
 *     ops: [{
 *       select: {
 *         type: "element",
 *         element: "#username",
 *         value: ""
 *       },
 *       action: {
 *         type: "fill_out",
 *         value: "testuser"
 *       }
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

module.exports = { parseRecipeWithSchema };