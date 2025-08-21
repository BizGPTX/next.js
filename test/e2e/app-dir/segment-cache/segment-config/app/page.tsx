import { LinkAccordion } from '../components/link-accordion'

export default function Page() {
  return (
    <main>
      <ul>
        <li>
          <LinkAccordion href="/prefetch-static">
            /prefetch-static
          </LinkAccordion>
        </li>
        <li>
          <LinkAccordion href="/prefetch-runtime">
            /prefetch-runtime
          </LinkAccordion>
        </li>
      </ul>
    </main>
  )
}
