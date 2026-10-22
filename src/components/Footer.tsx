import { ArrowUp } from 'lucide-react'
import { profile } from '../data/profile.ts'
import './footer.css'

/** Site footer, rendered after <main> so it is the page's contentinfo landmark. */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-copy">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="footer-note">
          <span>Built with React, Motion &amp; Vite</span>
          <span className="footer-dot" aria-hidden="true">
            ·
          </span>
          <span>live data from the Apify API</span>
        </p>
        <a className="footer-top-link" href="#top">
          Back to top
          <span className="footer-top-icon" aria-hidden="true">
            <ArrowUp size={15} />
            <ArrowUp size={15} />
          </span>
        </a>
      </div>
    </footer>
  )
}
