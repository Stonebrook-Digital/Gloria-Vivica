/** All raster assets live under `public/uploads/`. */
export type PortfolioPhoto = {
  id: string
  src: string
  w: number
  h: number
  label: string
}

/** Spaces URL-encoded for reliable static delivery. */
const studioHeadshotApr2026 =
  '/uploads/WhatsApp%20Image%202026-04-20%20at%2011.42.32%20PM.jpeg' as const

export const portfolioPhotos: readonly PortfolioPhoto[] = [
  {
    id: 'emw-24',
    src: '/uploads/Resized_GloriaBenavides_EMW_24-00060.jpeg',
    w: 1750,
    h: 2334,
    label: 'Headshot',
  },
  {
    id: 'still-04',
    src: '/uploads/gloria-benavides-4.jpeg',
    w: 4000,
    h: 5000,
    label: 'Still',
  },
  {
    id: 'facetune-0825',
    src: '/uploads/Facetune_20-08-2025-01-19-02(1).jpg',
    w: 4000,
    h: 6000,
    label: 'Facetune portrait',
  },
  {
    id: 'studio-headshot-2026-04',
    src: studioHeadshotApr2026,
    w: 1286,
    h: 1600,
    label: 'Studio headshot',
  },
]

/** /works grid: wider shots first so the page does not open on a tight face crop. */
export const workGalleryPhotos: readonly PortfolioPhoto[] = [
  portfolioPhotos[3],
  portfolioPhotos[1],
  portfolioPhotos[2],
  portfolioPhotos[0],
]

export function portfolioPhotoAt(index: number): PortfolioPhoto {
  return portfolioPhotos[index % portfolioPhotos.length]
}

export type ThumbCell = { id: string; src: string; w: number; h: number }

export const gallerySquares: readonly ThumbCell[] = Array.from({ length: 26 }, (_, i) => {
  const p = portfolioPhotoAt(i)
  return {
    id: `${p.id}-grid-${i}`,
    src: p.src,
    w: 640,
    h: 640,
  }
})

const [primary, editorial] = portfolioPhotos

export const heroPortrait = {
  src: primary.src,
  w: 520,
  h: Math.round((520 * primary.h) / primary.w),
}

export const heroRunway = {
  src: editorial.src,
  w: 960,
  h: Math.round((960 * editorial.h) / editorial.w),
}

export const aboutPortrait = {
  src: primary.src,
  w: 720,
  h: Math.round((720 * primary.h) / primary.w),
}
