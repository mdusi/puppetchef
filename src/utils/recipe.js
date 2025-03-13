const Ajv = require('ajv');
const ajv = new Ajv({
  useDefaults: true,
  removeAdditional: true
});


// Define the schema for actions
const actionSchema = {
    $id: 'actionSchema',
    toAction: true,
    type: ["string", "object"],
    properties: {
        type: { 
            type: "string",
            enum: ['click', 'fill_out', '']
        },
        value: { type: "string" }
    },
    required: ["type", "value"],
    default: {
        type: '',
        value: ''
    }
};

const selectSchema = {
    $id: 'selectSchema',
    toSelect: true,
    type: ["string", "object"],
    properties: {
        type: {
            type: 'string',
            enum: ['wait', 'polling', 'element'],
            default: 'element'
        },
        element: { type: 'string' },
        value: { type: 'string', default: '' }
    },
    required: ['type', 'element', 'value']
};

// Define the schema for operations
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

ajv.addKeyword({
    keyword: "toSelect",
    type: "string",
    compile: () => (data, dataPath) => {
      if (typeof data === "string")
        dataPath.parentData[dataPath.parentDataProperty] = { type: "element", element: data, value: "" };
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
 * @param {Object} recipe - The recipe to validate
 * @param {boolean} debug - Whether to enable debug logging
 * @returns {Object} The validated and transformed recipe
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