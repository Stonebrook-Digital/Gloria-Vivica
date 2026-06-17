/** Editorial mock site — swap copy and `contactEmail` for production. */
export const site = {
  name: 'Gloria',
  /** Full line shown in hero / footer row (all caps in UI). */
  formalName: 'Gloria Vivica Benavides',
  /** Large footer mark, spaced like “A . D”. */
  initialsMark: 'G . V',
  logoMark: 'G.V',
  productionLine: 'Film & theatre',
  locationLine: 'Chicago, Illinois',
  contactEmail: 'gregg@gb-management.com',
  /** Primary hero portrait (`public/` path). */
  headshotHero: '/uploads/WhatsApp%20Image%202026-04-20%20at%2011.42.32%20PM.jpeg',
  bio: [
    'Gloria works in film and theatre with a bias toward intimate stories, sharp rhythm in the cut, and characters who refuse to explain themselves too neatly.',
    'Select bookings and collaborations by inquiry. Representation and materials available on request.',
  ],
  social: [
    { label: 'Email', href: 'mailto:gregg@gb-management.com' },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/gloriavivica?igsh=MWh3ZjE4NXF6bzl5bA%3D%3D&utm_source=qr',
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/share/1BgDdx11Ek/?mibextid=wwXIfr',
    },
    {
      label: 'IMDb',
      href: 'https://www.imdb.com/name/nm10921109/?ref_=ext_shr_lnk',
    },
  ],
  /** Mock contact sheet for /contact — replace with real details later. */
  contact: {
    headline: 'Get in touch',
    blurb:
      'For bookings, press kits, and general inquiries. Replies are usually within a few business days.',
    email: 'gregg@gb-management.com',
    phone: '(310) 456-4156',
    rep: {
      name: 'Gregg Baker Management',
      email: 'gregg@gb-management.com',
      phone: '(310) 456-4156',
    },
    mailing: ['Studio Mailroom', '4000 Sunset Blvd, Unit 12', 'Los Angeles, CA 90028'],
    hours: 'Mon–Thu, 10am–4pm PT (by appointment)',
  },
} as const
