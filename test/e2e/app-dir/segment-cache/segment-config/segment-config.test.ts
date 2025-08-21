import { nextTestSetup } from 'e2e-utils'
import {
  createRequestTracker,
  RequestTracker,
} from '../../../../lib/e2e-utils/request-tracker'

describe('export const prefetch = ...', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })
  if (isNextDev) {
    it('disabled in development', () => {})
    return
  }

  // TODO: these tests aren't very good, but since the client-side part isn't implmented yet,
  // asserting on what the tree prefetch response contains is the best we can do.
  // They should be replaced with `act()` tests when the client-side changes are made.

  async function captureTreePrefetchResponse(
    requestTracker: RequestTracker,
    action: () => Promise<void>
  ): Promise<string> {
    const [, response] = await requestTracker.captureResponse(action, {
      async request(req) {
        const headers = req.headers()
        return headers['next-router-segment-prefetch'] === '/_tree'
      },
    })
    return response.text()
  }

  it('does not mark for segments with prefetch: "static" as runtime-prefetchable', async () => {
    const browser = await next.browser('/')
    const requestTracker = createRequestTracker(browser)

    // Reveal the link to trigger a runtime prefetch for one value of the dynamic param
    const response = await captureTreePrefetchResponse(
      requestTracker,
      async () => {
        const linkToggle = await browser.elementByCss(
          `input[data-link-accordion="/prefetch-static"]`
        )
        await linkToggle.click()
      }
    )

    // check the `tree` field
    // We cannot parse the response directly, because it's RSC, not JSON,
    // but the field we're checking is essentially JSON
    expect(response).toContain(
      JSON.stringify({
        name: '',
        paramType: null,
        paramKey: '',
        runtime: false,
        slots: {
          children: {
            name: 'prefetch-static',
            paramType: null,
            paramKey: 'prefetch-static',
            runtime: false,
            slots: {
              children: {
                name: '__PAGE__',
                paramType: null,
                paramKey: '__PAGE__',
                runtime: false, // <-----------------
                slots: null,
                isRootLayout: false,
              },
            },
            isRootLayout: false,
          },
        },
        isRootLayout: true,
      })
    )
  })

  it('marks segments with prefetch: "runtime" as runtime-prefetchable', async () => {
    const browser = await next.browser('/')
    const requestTracker = createRequestTracker(browser)

    // Reveal the link to trigger a runtime prefetch for one value of the dynamic param
    const response = await captureTreePrefetchResponse(
      requestTracker,
      async () => {
        const linkToggle = await browser.elementByCss(
          `input[data-link-accordion="/prefetch-runtime"]`
        )
        await linkToggle.click()
      }
    )

    // check the `tree` field
    // We cannot parse the response directly, because it's RSC, not JSON,
    // but the field we're checking is essentially JSON
    expect(response).toContain(
      JSON.stringify({
        name: '',
        paramType: null,
        paramKey: '',
        runtime: false,
        slots: {
          children: {
            name: 'prefetch-runtime',
            paramType: null,
            paramKey: 'prefetch-runtime',
            runtime: false,
            slots: {
              children: {
                name: '__PAGE__',
                paramType: null,
                paramKey: '__PAGE__',
                runtime: true, // <-----------------
                slots: null,
                isRootLayout: false,
              },
            },
            isRootLayout: false,
          },
        },
        isRootLayout: true,
      })
    )
  })
})
