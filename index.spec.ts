import * as DataFromTypes from "./index";
import * as path from "path";

describe("primitives generator", () => {
  test("should generate schema", () => {
    const file = path.resolve(__dirname, "test-file.ts");
    const schema = DataFromTypes.getFileSchema(file);
    expect(schema).toEqual({
      Person: {
        name: "Person",
        type: "interface",
        members: [
          {
            name: "name",
            type: "string"
          }
        ]
      }
    });
  });

  // test("should generate all the primitives", () => {
  //   const file = path.resolve(__dirname, "test-file.ts");
  //   const generatedData = DataFromTypes.getFileSchema(file);
  //   expect(generatedData).toEqual({
  //     a: "string"
  //   });
  // });
});

// file location, Interface (optional - generate for all exported interfaces), extra meta data (generate using default metadata)
