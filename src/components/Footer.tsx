import Link from 'next/link'
import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="editorial-footer" aria-label="Site">
      <div className="editorial-footer-inner">
        <div className="editorial-footer-row editorial-footer-row--lead">
          <div className="editorial-footer-row editorial-footer-row--triple editorial-footer-meta">
            <span>{site.formalName}</span>
            <span>{site.productionLine}</span>
            <span>{site.locationLine}</span>
          </div>
        </div>
        <div className="editorial-footer-row editorial-footer-row--triple">
          {site.social.map((s) => (
            <Link key={s.label} href={s.href}>
              {s.label}
            </Link>
          ))}
        </div>
        <p className="editorial-footer-made">Portfolio</p>
        <p className="editorial-footer-mark" aria-hidden>
          {site.initialsMark}
        </p>
      </div>
    </footer>
  )
}
