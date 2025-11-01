// Vite plugin to fix defuFn compatibility issue
export default function defuFix() {
  return {
    name: 'defu-fn-fix',
    enforce: 'pre',
    resolveId(id) {
      if (id === 'defu-fn-compat') {
        return id
      }
      return null
    },
    load(id) {
      if (id === 'defu-fn-compat') {
        return `
          import defu, { createDefu } from 'defu'
          export const defuFn = createDefu((utils, ...args) => {
            return utils.fn(...args)
          })
          export { defu, createDefu }
        `
      }
      return null
    },
    transform(code, id) {
      // Transform .nuxt files that import defuFn from 'defu'
      if (id.includes('.nuxt') && code.includes('defuFn') && code.includes('from \'defu\'')) {
        // Replace imports that include defuFn
        const updated = code.replace(
          /import\s+([^}]*{\s*)defuFn([^}]*}\s*)\s+from\s+['"]defu['"]/g,
          (match, before, after) => {
            // Import defuFn from our compat module instead
            const otherImports = before.trim() + after.trim()
            return `import ${otherImports} from 'defu'\nimport { defuFn } from 'defu-fn-compat'`
          }
        ).replace(
          /import\s+defu[,\s]*{\s*defuFn[^}]*}\s+from\s+['"]defu['"]/g,
          `import defu from 'defu'\nimport { defuFn } from 'defu-fn-compat'`
        )
        return updated !== code ? { code: updated } : null
      }
      return null
    }
  }
}

