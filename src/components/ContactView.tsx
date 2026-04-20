import Link from 'next/link'
import { site } from '@/data/site'

const { contact } = site

export function ContactView() {
  return (
    <div className="page-contact">
      <div className="page-contact-blobs" aria-hidden>
        <span className="contact-blob contact-blob--plum" />
        <span className="contact-blob contact-blob--olive" />
        <span className="contact-blob contact-blob--tan" />
      </div>

      <div className="page-contact-inner">
        <header className="contact-header">
          <div className="contact-header-copy">
            <p className="contact-eyebrow">Contact</p>
            <h1 className="contact-title">{contact.headline}</h1>
            <p className="contact-lede">{contact.blurb}</p>
          </div>
        </header>

        <div className="contact-panel">
          <section className="contact-block" aria-labelledby="contact-direct">
            <h2 id="contact-direct" className="contact-block-title">
              Direct
            </h2>
            <ul className="contact-list">
              <li>
                <span className="contact-label">Email</span>
                <a className="contact-value" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
              <li>
                <span className="contact-label">Phone</span>
                <a className="contact-value" href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>
                  {contact.phone}
                </a>
              </li>
            </ul>
          </section>

          <section className="contact-block" aria-labelledby="contact-rep">
            <h2 id="contact-rep" className="contact-block-title">
              Representation
            </h2>
            <ul className="contact-list">
              <li>
                <span className="contact-label">Agency</span>
                <span className="contact-value contact-value--plain">{contact.rep.name}</span>
              </li>
              <li>
                <span className="contact-label">Desk</span>
                <a className="contact-value" href={`mailto:${contact.rep.email}`}>
                  {contact.rep.email}
                </a>
              </li>
              <li>
                <span className="contact-label">Phone</span>
                <a
                  className="contact-value"
                  href={`tel:${contact.rep.phone.replace(/[^\d+]/g, '')}`}
                >
                  {contact.rep.phone}
                </a>
              </li>
            </ul>
          </section>

          <section className="contact-block" aria-labelledby="contact-mail">
            <h2 id="contact-mail" className="contact-block-title">
              Mailing
            </h2>
            <address className="contact-address">
              {contact.mailing.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </section>

          <section className="contact-block contact-block--hours" aria-labelledby="contact-hours">
            <h2 id="contact-hours" className="contact-block-title">
              Hours
            </h2>
            <p className="contact-hours-text">{contact.hours}</p>
          </section>

          <div className="contact-social-row">
            {site.social.map((item) => (
              <Link key={item.label} href={item.href} className="contact-pill">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
