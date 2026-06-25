/** Structured résumé — swap `documentSrc` when the client PDF/image is ready. */
export const resume = {
  name: 'Gloria Vivica Benavides',
  stats: "5'6/155/brown/brown · AEA",
  management: {
    name: 'Gregg Baker Management',
    phone: '(310) 456-4156',
    email: 'gregg@gb-management.com',
  },
  /** Set to `/uploads/your-resume.pdf` or a PNG scan when provided. */
  documentSrc: null as string | null,
  stage: [
    { production: 'Real Women Have Curves', role: 'Pancha', company: 'Alley Theatre' },
    { production: 'The Tempest', role: 'Caliban', company: 'Trinity Repertory Theatre' },
    {
      production: 'Somewhere Over the Border',
      role: 'Antonia/Leona',
      company: "People's Light Theatre Co.",
    },
    { production: 'Wetbrain', role: 'Angelina (Cover)', company: 'Playwrights Horizons' },
    {
      production: 'Somewhere Over the Border',
      role: 'Antonia/Leona',
      company: 'Pittsburgh City Theatre',
    },
    { production: 'American Mariachi', role: 'Soyla Reyna', company: 'Cleveland Playhouse' },
    { production: 'American Mariachi', role: 'Soyla Reyna', company: 'Alabama Shakespeare' },
    { production: 'Somewhere Over the Border', role: 'Antonia/Leona', company: 'Geva Theatre Center' },
    { production: 'Somewhere Over the Border', role: 'Antonia/Leona', company: 'Syracuse Stage' },
    { production: 'American Mariachi', role: 'Soyla Reyna', company: 'Goodman Theatre' },
    { production: 'Dracula', role: 'Van Helsing', company: 'Theatre Three' },
    { production: 'Real Women Have Curves', role: 'Pancha', company: 'Dallas Theater Center' },
    { production: 'White Rabbit, Red Rabbit', role: 'Actor', company: 'Dallas Theater Center' },
    { production: 'Romeo and Juliet', role: 'Nurse/Tybalt', company: 'Stage West' },
  ],
  voiceOver: [
    { production: 'One Piece', role: 'Princess Scarlett', company: 'Crunchyroll Entertainment' },
    { production: 'Fairy Gone', role: 'Elanoa Need', company: 'Crunchyroll Entertainment' },
    { production: 'Radiant', role: 'Librarian', company: 'Crunchyroll Entertainment' },
    { production: 'Fruits Basket', role: 'Teacher', company: 'Crunchyroll Entertainment' },
  ],
  filmTelevision: [
    { production: 'Dollar General', role: 'Supporting', company: 'Buffalo Casting' },
    {
      production: 'Shakespeare and the Suffragists',
      role: 'Supporting',
      company: 'Jenni Stewart, Dir.',
    },
    { production: 'Romeo and Juliet', role: 'Supporting', company: 'Marco Salinas, Dir.' },
    { production: 'Final Dress', role: 'Supporting', company: 'Christie Vela, Dir.' },
  ],
  education: [
    'BFA Theatre — University of North Texas',
    'Michael Chekhov Acting — Theatre Three — Gail Cronauer',
    'Acting — Dallas Theater Center — Jenny Ledel',
  ],
  specialSkills:
    'Improv, conversational Spanish (native accent), gaming, fishing, kickboxing, boxing, experience with rifles, beginner clarinet, and beginner piano.',
} as const
