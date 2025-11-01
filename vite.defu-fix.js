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
          import defuDefault, { createDefu } from 'defu'
          
          // defu v6 exports defu as default, but some packages expect named export
          export const defu = defuDefault
          export default defuDefault
          export { createDefu }
          
          // Provide defuFn using createDefu (was removed in v6)
          export const defuFn = createDefu((utils, ...args) => {
            return utils.fn(...args)
          })
        `
      }
      return null
    },
    transform(code, id) {
      let modified = false
      let updatedCode = code
      
      // Transform node_modules files that import from 'defu'
      if (id.includes('node_modules') && updatedCode.includes('from \'defu\'')) {
        // Fix: import { defu } from 'defu' -> import { defu } from 'defu-compat'
        if (updatedCode.includes('import { defu } from \'defu\'')) {
          updatedCode = updatedCode.replace(
            /import\s+{\s*defu\s*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defu } from 'defu-compat'`
            }
          )
        }
        
        // Fix: import defu, { ... } from 'defu' (already correct, but ensure compatibility)
        if (updatedCode.includes('import defu') && updatedCode.includes('from \'defu\'')) {
          // Check if it's using default import correctly
          // This should work as-is, but we'll check for any named defu imports
        }
        
        // Fix imports with defuFn
        if (updatedCode.includes('defuFn')) {
          // Handle: import { defuFn } from 'defu'
          updatedCode = updatedCode.replace(
            /import\s+{\s*defuFn\s*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defuFn } from 'defu-compat'`
            }
          )
          
          // Handle: import { defu, defuFn } from 'defu'
          updatedCode = updatedCode.replace(
            /import\s+{\s*defu[,\s]*defuFn[^}]*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defu, defuFn } from 'defu-compat'`
            }
          )
          
          // Handle: import defu, { defuFn } from 'defu'
          updatedCode = updatedCode.replace(
            /import\s+defu[,\s]*{\s*defuFn[^}]*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defu, defuFn } from 'defu-compat'`
            }
          )
          
          // Handle: import { ...defuFn... } from 'defu'
          updatedCode = updatedCode.replace(
            /import\s+{\s*([^}]*defuFn[^}]*)\s*}\s+from\s+['"]defu['"]/g,
            (match, imports) => {
              modified = true
              // Check if defu is also in the imports
              if (imports.includes('defu') && !imports.includes('defu,')) {
                return `import { ${imports} } from 'defu-compat'`
              }
              return `import { ${imports} } from 'defu-compat'`
            }
          )
        }
      }
      
      // Also transform .nuxt files
      if (id.includes('.nuxt') && updatedCode.includes('from \'defu\'')) {
        // Fix named import of defu
        if (updatedCode.includes('import { defu } from \'defu\'')) {
          updatedCode = updatedCode.replace(
            /import\s+{\s*defu\s*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defu } from 'defu-compat'`
            }
          )
        }
        
        // Fix defuFn imports in .nuxt files
        if (updatedCode.includes('defuFn')) {
          updatedCode = updatedCode.replace(
            /import\s+{\s*defuFn\s*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defuFn } from 'defu-compat'`
            }
          )
          updatedCode = updatedCode.replace(
            /import\s+{\s*defu[,\s]*defuFn[^}]*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defu, defuFn } from 'defu-compat'`
            }
          )
          updatedCode = updatedCode.replace(
            /import\s+defu[,\s]*{\s*defuFn[^}]*}\s+from\s+['"]defu['"]/g,
            () => {
              modified = true
              return `import { defu, defuFn } from 'defu-compat'`
            }
          )
        }
      }
      
      return modified ? { code: updatedCode } : null
    }
  }
}
