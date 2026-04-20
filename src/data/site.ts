/** Editorial mock site — swap copy and `contactEmail` for production. */
export const site = {
  name: 'Gloria',
  /** Full line shown in hero / footer row (all caps in UI). */
  formalName: 'Gloria Laurent',
  /** Large footer mark, spaced like “A . D”. */
  initialsMark: 'G . L',
  logoMark: 'G.L',
  productionLine: 'Film & theatre',
  locationLine: 'Los Angeles, California',
  contactEmail: 'hello@example.com',
  /** Primary hero portrait (`public/` path). */
  headshotHero: '/uploads/Resized_GloriaBenavides_EMW_24-00060.jpeg',
  bio: [
    'Gloria works in film and theatre with a bias toward intimate stories, sharp rhythm in the cut, and characters who refuse to explain themselves too neatly.',
    'Select bookings and collaborations by inquiry. Representation and materials available on request.',
  ],
  social: [
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'Insta', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
  /** Mock contact sheet for /contact — replace with real details later. */
  contact: {
    headline: 'Get in touch',
    blurb:
      'For bookings, press kits, and general inquiries. Replies are usually within a few business days.',
    email: 'hello@example.com',
    phone: '+1 (323) 555-0148',
    rep: {
      name: 'Northline Talent',
      email: 'gloria@northlinetalent.example',
      phone: '+1 (310) 555-0192',
    },
    mailing: ['Studio Mailroom', '4000 Sunset Blvd, Unit 12', 'Los Angeles, CA 90028'],
    hours: 'Mon–Thu, 10am–4pm PT (by appointment)',
  },
} as const
