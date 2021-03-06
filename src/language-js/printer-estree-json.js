"use strict";

const docBuilders = require("../doc/doc-builders");

const concat = docBuilders.concat;
const hardline = docBuilders.hardline;
const indent = docBuilders.indent;
const join = docBuilders.join;

function genericPrint(path, options, print) {
  const node = path.getValue();
  switch (node.type) {
    case "ArrayExpression":
      return node.elements.length === 0
        ? "[]"
        : concat([
            "[",
            indent(
              concat([
                hardline,
                join(concat([",", hardline]), path.map(print, "elements"))
              ])
            ),
            hardline,
            "]"
          ]);
    case "ObjectExpression":
      return node.properties.length === 0
        ? "{}"
        : concat([
            "{",
            indent(
              concat([
                hardline,
                join(concat([",", hardline]), path.map(print, "properties"))
              ])
            ),
            hardline,
            "}"
          ]);
    case "ObjectProperty":
      return concat([path.call(print, "key"), ": ", path.call(print, "value")]);
    case "UnaryExpression":
      return concat([
        node.operator === "+" ? "" : node.operator,
        path.call(print, "argument")
      ]);
    case "NullLiteral":
      return "null";
    case "BooleanLiteral":
      return node.value ? "true" : "false";
    case "StringLiteral":
    case "NumericLiteral":
      return JSON.stringify(node.value);
    case "Identifier":
      return JSON.stringify(node.name);
  }
}

function clean(node, newNode /*, parent*/) {
  delete newNode.start;
  delete newNode.end;
  delete newNode.extra;

  if (node.type === "Identifier") {
    return { type: "StringLiteral", value: node.name };
  }
  if (node.type === "UnaryExpression" && node.operator === "+") {
    return newNode.argument;
  }
}

module.exports = {
  print: genericPrint,
  massageAstNode: clean
};
