import path from 'node:path'
import { createRequire } from 'node:module'
import { type Plugin, mergeConfig } from 'vite'

export interface ExternalOptions {
  exclude?: string[]
  include?: string[]
}

/**
 * Automatically externalize dependencies and peerDepencencies
 */
export function externalizeDepsAndPeerPlugin(options: ExternalOptions = {}): Plugin | null {
  const { exclude = [], include = [] } = options

  const packagePath = path.resolve(process.cwd(), 'package.json')
  const require = createRequire(import.meta.url)
  const pkg = require(packagePath)
  let deps = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.peerDependencies || {}))

  if (include.length) {
    deps = deps.concat(include.filter((dep) => dep.trim() !== ''))
  }

  if (exclude.length) {
    deps = deps.filter((dep) => !exclude.includes(dep))
  }

  deps = [...new Set(deps)]

  return {
    name: 'vite:externalize-deps',
    enforce: 'pre',
    config(config): void {
      const defaultConfig = {
        build: {
          rollupOptions: {
            external: deps.length > 0 ? [...deps, new RegExp(`^(${deps.join('|')})/.+`)] : []
          }
        }
      }
      const buildConfig = mergeConfig(defaultConfig.build, config.build || {})
      config.build = buildConfig
    }
  }
}
