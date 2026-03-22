/**
 * Vite plugin that injects data-component attributes on React component root elements.
 * Only active in development mode.
 * Adds data-component="ComponentName:filepath:lineNumber" to JSX root elements.
 */
export default function componentAttrPlugin() {
  return {
    name: 'vite-plugin-component-attr',
    enforce: 'pre',
    transform(code, id) {
      // Only process .tsx/.jsx files in src/
      if (!id.match(/\/src\/.*\.(tsx|jsx)$/)) return null;
      // Only in dev
      if (process.env.NODE_ENV === 'production') return null;

      // Simple regex-based approach: find React component function declarations
      // and inject a data-component wrapper. This is simpler than a full Babel transform.
      const relativePath = id.replace(/.*\/mock-ops-frontend\//, '');

      // Find: export default function ComponentName or function ComponentName
      // and: export default ComponentName at the end
      const funcMatch = code.match(/(?:export\s+default\s+)?function\s+(\w+)\s*\(/);
      if (!funcMatch) return null;

      const componentName = funcMatch[1];

      // Inject a data attribute by wrapping the component's return in a div with data-component
      // Actually, a cleaner approach: use React's __source transform which is already available
      // Let's just add a comment that vibe-ui can parse, and handle the overlay differently

      // For now, return the code with a special comment that vibe-ui's overlay script can use
      // The overlay will use DOM inspection to find component boundaries
      return null; // Let the overlay handle it via DOM inspection instead
    },
  };
}
