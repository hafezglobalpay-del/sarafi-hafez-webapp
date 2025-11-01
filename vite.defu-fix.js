// Vite plugin to fix defu compatibility issues with defu v6
// defu v6 exports defu as default only, but many packages expect named export
export default function defuFix() {
  return {
    name: 'defu-fix',
    enforce: 'pre',
    resolveId(id) {
      if (id === 'defu-compat') {
        return id
      }
      return null
    },
    load(id) {
      if (id === 'defu-compat') {
        // Provide compatibility exports for defu v6
        return `
          import defuDefault from 'defu'
          
          // defu v6 exports defu as default, but some packages expect named export
          export const defu = defuDefault
          export default defuDefault
          
          // Provide createDefu - creates a custom defu function with custom merger logic
          export function createDefu(customizer) {
            return function(...args) {
              return args.reduce((acc, curr) => {
                if (!curr || typeof curr !== 'object') return acc
                const keys = Object.keys(curr)
                for (const key of keys) {
                  const currVal = curr[key]
                  const accVal = acc[key]
                  
                  // Use customizer if provided
                  if (customizer && typeof customizer === 'function') {
                    const result = customizer(acc, key, currVal)
                    if (result !== undefined) {
                      acc[key] = result
                      continue
                    }
                  }
                  
                  // If current value is a function, execute it
                  if (typeof currVal === 'function') {
                    acc[key] = currVal(accVal, acc, key)
                  } else if (currVal && typeof currVal === 'object' && !Array.isArray(currVal) && accVal && typeof accVal === 'object' && !Array.isArray(accVal)) {
                    // Deep merge objects - recursively call createDefu result
                    acc[key] = createDefu(customizer)(accVal, currVal)
                  } else if (currVal !== undefined) {
                    acc[key] = currVal
                  }
                }
                return acc
              }, {})
            }
          }
          
          // Provide defuFn - recreate the functionality that was removed in v6
          // defuFn was a function that merged objects, with functions being executed
          export function defuFn(...args) {
            return args.reduce((acc, curr) => {
              if (!curr || typeof curr !== 'object') return acc
              const keys = Object.keys(curr)
              for (const key of keys) {
                const currVal = curr[key]
                const accVal = acc[key]
                
                // If current value is a function, execute it with accumulated value
                if (typeof currVal === 'function') {
                  acc[key] = currVal(accVal, acc, key)
                } else if (currVal && typeof currVal === 'object' && !Array.isArray(currVal) && accVal && typeof accVal === 'object' && !Array.isArray(accVal)) {
                  // Deep merge objects
                  acc[key] = defuFn(accVal, currVal)
                } else if (currVal !== undefined) {
                  acc[key] = currVal
                }
              }
              return acc
            }, {})
          }
        `
      }
      return null
    },
    transform(code, id) {
      let modified = false
      let updatedCode = code
      
      // Transform ALL files that import defu with named imports
      // Handle both single and double quotes, and any file location (including virtual modules)
      // Virtual modules can have ids like "virtual:#nitro-internal-virtual/app-config"
      if (updatedCode.includes('from') && (updatedCode.includes('\'defu\'') || updatedCode.includes('"defu"'))) {
        // Fix: import { createDefu } from 'defu' or "defu" -> import { createDefu } from 'defu-compat'
        updatedCode = updatedCode.replace(
          /import\s+{\s*createDefu\s*}\s+from\s+['"]defu['"]/g,
          () => {
            modified = true
            return `import { createDefu } from 'defu-compat'`
          }
        )
        
        // Fix: import { defu } from 'defu' or "defu" -> import { defu } from 'defu-compat'
        updatedCode = updatedCode.replace(
          /import\s+{\s*defu\s*}\s+from\s+['"]defu['"]/g,
          () => {
            modified = true
            return `import { defu } from 'defu-compat'`
          }
        )
        
        // Fix: import { createDefu, defu } or { defu, createDefu } from 'defu' or "defu"
        updatedCode = updatedCode.replace(
          /import\s+{\s*createDefu[,\s]*defu[^}]*}\s+from\s+['"]defu['"]/g,
          () => {
            modified = true
            return `import { createDefu, defu } from 'defu-compat'`
          }
        )
        updatedCode = updatedCode.replace(
          /import\s+{\s*defu[,\s]*createDefu[^}]*}\s+from\s+['"]defu['"]/g,
          () => {
            modified = true
            return `import { defu, createDefu } from 'defu-compat'`
          }
        )
        
        // Fix imports with defuFn (handle both single and double quotes)
        if (updatedCode.includes('defuFn')) {
          // Handle: import { defuFn } from 'defu' or "defu"
          updatedCode = updatedCode.replace(
            /import\s+{\s*defuFn\s*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defuFn } from 'defu-compat'`
            }
          )
          
          // Handle: import { defu, defuFn } from 'defu' or "defu"
          updatedCode = updatedCode.replace(
            /import\s+{\s*defu[,\s]*defuFn[^}]*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defu, defuFn } from 'defu-compat'`
            }
          )
          
          // Handle: import defu, { defuFn } from 'defu' or "defu"
          updatedCode = updatedCode.replace(
            /import\s+defu[,\s]*{\s*defuFn[^}]*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defu, defuFn } from 'defu-compat'`
            }
          )
          
          // Handle: import { ...defuFn... } from 'defu' or "defu"
          updatedCode = updatedCode.replace(
            /import\s+{\s*([^}]*defuFn[^}]*)\s*}\s+from\s+['"]defu['"]/g,
            (match, imports) => {
              modified = true
              // Check if defu is also in the imports
              const needsDefu = !imports.includes('defu')
              const cleanImports = imports.trim()
              return needsDefu 
                ? `import { defu, ${cleanImports} } from 'defu-compat'`
                : `import { ${cleanImports} } from 'defu-compat'`
            }
          )
        }
      }
      
      return modified ? { code: updatedCode } : null
    }
  }
}
