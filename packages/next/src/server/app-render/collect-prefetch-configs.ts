import { getLayoutOrPageModule, type LoaderTree } from '../lib/app-dir-module'

export type PrefetchConfig = 'static' | 'runtime'
export type PrefetchConfigTree = {
  /** The name of the segment */
  name: string
  prefetchConfig: PrefetchConfig | undefined
  slots: { [parallelRouteKey: string]: PrefetchConfigTree }
}

export async function collectPrefetchConfigs(
  loaderTree: LoaderTree
): Promise<PrefetchConfigTree> {
  const [segment, parallelRoutes] = loaderTree

  // Note: a segment might just be a directory and not have a module
  const layoutOrPageMod = await getLayoutOrPageModule(loaderTree)
  const prefetchConfig: PrefetchConfig | undefined =
    layoutOrPageMod.mod?.prefetch

  const childPrefetchConfigs = Object.fromEntries(
    await Promise.all(
      Object.entries(parallelRoutes).map(
        async ([parallelRouteKey, childLoaderTree]) =>
          [
            parallelRouteKey,
            await collectPrefetchConfigs(childLoaderTree),
          ] as const
      )
    )
  )

  return { name: segment, prefetchConfig, slots: childPrefetchConfigs }
}
