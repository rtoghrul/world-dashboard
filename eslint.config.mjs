import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  globalIgnores(['.next/**', 'node_modules/**', 'next-env.d.ts', 'public/**']),
  ...nextCoreWebVitals,
  {
    rules: {
      // Third-party images are rendered with plain lazy <img>; see next.config.mjs.
      '@next/next/no-img-element': 'off',
      // React Compiler diagnostics (eslint-plugin-react-hooks v7). The compiler is not enabled, and
      // reading localStorage/matchMedia in an effect after mount is the deliberate SSR-safe pattern
      // here, so these stay visible as warnings rather than failing the build.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },
])
