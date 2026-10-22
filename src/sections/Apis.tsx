/* Placeholder — replaced by the section build. */
import type { ApifyStoreState } from '../hooks/useApifyStore.ts'

export function Apis({ store }: { store: ApifyStoreState }) {
  return <section id="apis" className="section"><div className="container"><h2 className="section-title">APIs ({store.actors.length})</h2></div></section>
}
