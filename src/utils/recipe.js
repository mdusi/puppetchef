const Ajv = require('ajv');
const ajv = new Ajv({
  useDefaults: true  // This enables automatic default value assignment
});

/*
const opSchema = {
  $id: 'opSchema',
  type: 'object',
  properties: {
    type: { 
      type: 'string',
      enum: ['wait', 'polling', 'element'],
      default: 'element'  // Most common type
    },
    element: { type: 'string' },
    action: { 
      type: 'string',
      enum: ['fill_out', 'click', ''],
      default: ''
    },
    value: { type: 'string' },
    arg: { type: 'string' },
    required: { 
      type: 'boolean',
      default: true
    }
  },
  required: ['type', 'element', 'action'],
  additionalProperties: false
};
*/

const opSchema = {
  $id: 'opSchema',
  type: 'object',
  properties: {
    type: { 
      type: 'string',
      enum: ['wait', 'polling', 'element'],
      default: 'element'  // Most common type
    },
    element: { type: 'string' },
    action: { 
      type: 'string',
      enum: ['fill_out', 'click', ''],
      default: ''
    },
    value: { type: 'string' },
    arg: { type: 'string' },
    required: { 
      type: 'boolean',
      default: true
    }
  },
  required: ['type', 'element', 'action'],
  additionalProperties: false
};

const stepSchema = {
  $id: 'stepSchema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    ops: { 
      type: 'array', 
      items: { $ref: 'opSchema' },
      default: []
    }
  },
  required: ['name', 'ops']
};

const recipeSchema = {
  $id: 'recipeSchema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    url: { type: 'string' },
    steps: { 
      type: 'array', 
      items: { $ref: 'stepSchema' },
      default: []
    }
  },
  required: ['name', 'url', 'steps']
};

// Add schemas to ajv
ajv.addSchema(opSchema);
ajv.addSchema(stepSchema);

// Create a validator function
const validateRecipe = ajv.compile(recipeSchema);

/**
 * Validates and parses an automation recipe against the predefined schema
 * @param {Object} recipe - The recipe object to validate
 * @returns {Object} The validated recipe object
 * @throws {Error} If the recipe doesn't match the schema
 */
function parseRecipeWithSchema(recipe) {
  console.log('Before validation:', JSON.stringify(recipe, null, 2));
  
  const valid = validateRecipe(recipe);
  
  if (!valid) {
    const errors = validateRecipe.errors.map(err => 
      `${err.instancePath} ${err.message}`
    ).join('; ');
    throw new Error(`Invalid recipe format: ${errors}`);
  }
  
  console.log('After validation (with defaults):', JSON.stringify(recipe, null, 2));
  return recipe;
}

module.exports = { parseRecipeWithSchema };