import ts from "typescript";
// import * as faker from "faker";
type Node = ts.Node & { _declarationBrand: any };

export function getFileSchema(filePath: string): any {
  const schema: any = {};
  const program = ts.createProgram([filePath], {
    noEmit: true
  });

  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) {
    return schema;
  }

  const checker = program.getTypeChecker();
  // for (const sourceFile of program.getSourceFiles()) {
  ts.forEachChild(sourceFile, visit);
  // }
  return schema;

  function visit(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
      node.getChildren(sourceFile).map(visit);
    }

    const symbol: ts.Symbol | undefined = checker.getSymbolAtLocation(node);
    // if (!symbol || !isNodeExported(node as Node)) return;
    if (!symbol) return;
    // console.log(symbol.getName());
    // const exported = symbol.getJsDocTags().find((x: any) => x.name === "export");

    let details;
    if (ts.isClassDeclaration(node) && node.name) {
      // This is a top level class, get its symbol
      let symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) {
        // output.push(serializeClass(symbol));
        details = serializeClass(symbol);
        schema[details.name] = details;
      }
      // No need to walk any further, class expressions/inner declarations
      // cannot be exported
    } else if (ts.isModuleDeclaration(node)) {
      // This is a namespace, visit its children
      ts.forEachChild(node, visit);
    } else if (symbol.flags === ts.SymbolFlags.Interface) {
      // console.log(symbol);
      details = serializeInterface(node as ts.InterfaceDeclaration, symbol);
      schema[details.name] = details;
    } else {
      details = serializeSymbol(symbol);
      // console.log(symbol);
      schema[details.name] = details;
      return details;
    }

    // if (node.parent && details) {
    //   const parentSymbol: ts.Symbol | undefined = checker.getSymbolAtLocation(
    //     node.parent
    //   );
    //   // const parent = schema[node.parent.name];
    //   // if (Array.isArray(parent.members)) {
    //   //   parent.members.push(details);
    //   // } else {
    //   //   parent.members = [details];
    //   // }
    // }
    // if (!exported || !exported.text) return;
    // data[exported.text] = checker.typeToString(
    //   checker.getTypeOfSymbolAtLocation(symbol, node)
    // );
  }

  function serializeSignature(signature: ts.Signature) {
    return {
      parameters: signature.parameters.map(serializeSymbol),
      returnType: checker.typeToString(signature.getReturnType())
      // documentation: ts.displayPartsToString(signature.getDocumentationComment())
    };
  }

  function serializeClass(symbol: ts.Symbol) {
    let details = serializeSymbol(symbol);

    // Get the construct signatures
    let constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!
    );
    details.constructors = constructorType
      .getConstructSignatures()
      .map(serializeSignature);
    return details;
  }

  function serializeInterface(
    node: ts.InterfaceDeclaration,
    symbol: ts.Symbol
  ): any {
    return {
      name: symbol.getName(),
      type: "interface",
      members: (node.parent as ts.InterfaceDeclaration).members
        .map(childNode => childNode.name)
        .map(childNode => checker.getSymbolAtLocation(childNode as ts.Node))
        .filter(childSymbol => !!childSymbol)
        .map((childSymbol: ts.Symbol | undefined) =>
          serializeSymbol(childSymbol as ts.Symbol)
        )
      // .map(
      //   (childSymbol: ts.Symbol | undefined) =>
      //     childSymbol && childSymbol.name
      // )
    };
  }

  function serializeSymbol(symbol: ts.Symbol): any {
    // console.log(symbol.getName(), symbol.flags, ts.SymbolFlags.Interface);
    return {
      name: symbol.getName(),
      // documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
      )
    };
  }

  function isNodeExported(node: Node): boolean {
    return (
      (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }
}

function schemaToData(schema: any): any {}

export function getData(filePath: string): any {
  return schemaToData(getFileSchema(filePath));
}
