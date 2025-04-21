// Jest environment setup
/* eslint-env jest */

const { parseRecipeWithSchema, stepReservedKeys } = require("../src/recipe.js");

describe("Recipe Validation and Transformation", () => {
  describe("parseRecipeWithSchema", () => {
    it("should validate and return a valid recipe", () => {
      const validRecipe = {
        url: "https://example.com",
        name: "Test Recipe",
        tasks: [
          {
            name: "Task 1",
            steps: [
              {
                "puppetchef.builtin.common": {
                  command: "click",
                  selector: "#button",
                },
                ignore_errors: false,
              },
            ],
          },
        ],
      };

      expect(() => parseRecipeWithSchema(validRecipe)).not.toThrow();
      const result = parseRecipeWithSchema(validRecipe);
      expect(result).toEqual(validRecipe);
    });

    it("should throw an error for an invalid recipe", () => {
      const invalidRecipe = {
        url: "https://example.com",
        name: "Test Recipe",
        tasks: [
          {
            name: "Task 1",
            steps: [
              {
                // Missing required "command" property
                "puppetchef.builtin.common": {
                  selector: "#button",
                },
                ignore_errors: false,
              },
            ],
          },
        ],
      };

      expect(() => parseRecipeWithSchema(invalidRecipe)).toThrow(
        /Invalid recipe format/,
      );
    });

    it("should throw an error if required fields are missing", () => {
      const invalidRecipe = {
        name: "Test Recipe",
        tasks: [], // Missing "url" field
      };

      expect(() => parseRecipeWithSchema(invalidRecipe)).toThrow(
        /Invalid recipe format/,
      );
    });
  });

  describe("stepReservedKeys", () => {
    it("should contain the reserved keys from the step schema", () => {
      const expectedKeys = ["register", "ignore_errors", "when"];
      expect(stepReservedKeys).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});
