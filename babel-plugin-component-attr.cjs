/**
 * Babel plugin that adds data-component="ComponentName:file:line" to the root JSX element
 * of every React component. Works with @vitejs/plugin-react's babel config.
 */
module.exports = function ({ types: t }) {
  return {
    visitor: {
      // Match function declarations and arrow functions that return JSX
      'FunctionDeclaration|ArrowFunctionExpression|FunctionExpression'(path, state) {
        // Get the component name
        let name = null;

        if (path.isFunctionDeclaration() && path.node.id) {
          name = path.node.id.name;
        } else if (path.parentPath.isVariableDeclarator()) {
          name = path.parentPath.node.id?.name;
        } else if (path.parentPath.isExportDefaultDeclaration() && path.isFunctionDeclaration()) {
          name = path.node.id?.name;
        }

        // Only process PascalCase names (React components)
        if (!name || !/^[A-Z]/.test(name)) return;

        // Get file path relative to project
        const filename = state.filename || '';
        const relativePath = filename.replace(/.*\/mock-ops-frontend\//, '');

        // Find the first JSX return statement
        path.traverse({
          ReturnStatement(returnPath) {
            const arg = returnPath.node.argument;
            if (!arg) return;

            // Check if it returns JSX
            if (t.isJSXElement(arg) || t.isJSXFragment(arg)) {
              const element = t.isJSXFragment(arg) ? null : arg;
              if (!element) return; // Can't add attrs to fragments

              // Check if data-component already exists
              const existing = element.openingElement.attributes.find(
                a => t.isJSXAttribute(a) && a.name?.name === 'data-component'
              );
              if (existing) return;

              // Add data-component attribute
              const line = returnPath.node.loc?.start?.line || 0;
              const attrValue = `${name}:${relativePath}:${line}`;
              element.openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('data-component'),
                  t.stringLiteral(attrValue)
                )
              );

              returnPath.stop(); // Only first return
            }
          },
        });
      },
    },
  };
};
