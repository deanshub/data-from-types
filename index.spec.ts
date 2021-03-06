import * as DataFromTypes from "./index";
import * as path from "path";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHavePropertyOfType(name: string, type: string): R;
    }
  }
}

describe("primitives generator", () => {
  test("should generate schema", () => {
    const file = path.resolve(__dirname, "test-file.ts");
    const schema = DataFromTypes.getFileSchema(file);
    expect(schema).toEqual({
      type: "root",
      Person: {
        name: "Person",
        type: "interface",
        members: [
          {
            name: "firstName",
            type: "string"
          },
          {
            name: "lastName",
            type: "string"
          },
          {
            name: "age",
            type: "number"
          }
        ]
      }
    });
  });

  test("should generate all the primitives", () => {
    const file = path.resolve(__dirname, "test-file.ts");
    const generatedData = DataFromTypes.getData(file);
    expect(generatedData).toHaveProperty("Person");
    expect(generatedData.Person).toHavePropertyOfType("firstName", "string");
    expect(generatedData.Person).toHavePropertyOfType("lastName", "string");
    expect(generatedData.Person).toHavePropertyOfType("age", "number");
  });
});

// file location, Interface (optional - generate for all exported interfaces), extra meta data (generate using default metadata)
