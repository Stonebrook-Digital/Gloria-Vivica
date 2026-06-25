"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { subscribeScrollFrame } from "@/lib/scrollFrame";
import { resume } from "@/data/resume";
import { headshotPhotos } from "@/data/portfolioPhotos";

const HERO_TITLES = ["Actor", "Comedian", "Storyteller"];
const HERO_BIO =
  "Queer Mexican-American actor based in Chicago with nationwide credits in stage, voice-over, and film.";

/**
 * Sticky section title fades out before content meets it: visibility uses
 * `overlap.top > title.bottom + fadeLeadPx` so the title hides while there is still
 * a gap (avoids one frame of text showing through + slow opacity overlap).
 * Keep `fadeLeadPx` smaller than the real title→overlap vertical gap in layout, or
 * the title wrapper stays at opacity 0 for the whole section.
 */
function useStickyOverlapFade(
  overlapRef: RefObject<HTMLElement | null>,
  fadeLeadPx: number = 40,
) {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(true);

  useEffect(() => {
    const tick = () => {
      const overlap = overlapRef.current;
      const title = titleRef.current;
      if (!overlap || !title) return;
      const oRect = overlap.getBoundingClientRect();
      const tRect = title.getBoundingClientRect();
      setTitleVisible(oRect.top > tRect.bottom + fadeLeadPx);
    };
    return subscribeScrollFrame(tick);
  }, [overlapRef, fadeLeadPx]);

  return { titleRef, titleVisible };
}

const NEWS_FEATURE_IMAGE = {
  src: "/uploads/Screenshot%20from%202026-06-10%2012-40-34.png",
  alt: "Gloria Vivica Benavides on stage as Pancha with Houston Chronicle review",
  caption: "Houston Chronicle review of Real Women Have Curves at the Alley Theatre",
};

type NewsClipStyle = "headline" | "editorial" | "accent" | "feature";

type NewsClip = {
  quote: string;
  source?: string;
  style: NewsClipStyle;
  align: "left" | "center" | "right";
};

const NEWS_CLIPS: NewsClip[] = [
  {
    quote:
      "Standouts include Gloria Vivica Benavides, who brings sophisticated senses of timing and subtle gesture to Caliban.",
    source: "Broadway World Review for The Tempest at Trinity Repertory Theatre",
    style: "editorial",
    align: "left",
  },
  {
    quote: "…a scene-stealing Gloria Vivica Benavides…",
    source: "Chicago Sun Times on American Mariachi at Goodman Theatre",
    style: "headline",
    align: "center",
  },
  {
    quote:
      "…all wonderful, especially Benavides who steals every scene she's in as a sexy-and-I-know-it hairdresser…",
    source: "Dallas Morning News on American Mariachi at Dallas Theater Center",
    style: "accent",
    align: "right",
  },
  {
    quote:
      "The latter, Gloria Vivica Benavides, is hilarious in that role and as Antonia, a well-meaning neighbor who ignites Reina's dreams of escaping to America.",
    source: "Onstage Pittsburgh on Somewhere Over the Border at Pittsburgh City Theatre",
    style: "editorial",
    align: "left",
  },
  {
    quote:
      "…every time Gloria Benavides opens her mouth to sing, this massive rafter-shaking roar comes forth that leaves the audience breathless.",
    source: "Broadway World",
    style: "feature",
    align: "center",
  },
  {
    quote:
      "Benavides is a breakout star of the show, even playing the comic relief. She portrays two characters who are polar opposites from one another, but you'll want more of both.",
    source: "Broadway World",
    style: "feature",
    align: "left",
  },
];

type UpcomingProject = {
  role: string;
  title: string;
  playwright: string;
  description: string;
  href: string;
};

const UPCOMING_PROJECTS: UpcomingProject[] = [
  {
    role: "Lil Nana",
    title: "miss EMERICA",
    playwright: "Yona Moises Olivarez",
    description:
      "A new work in development at Baltimore Center Stage for their inaugural Trans History Project.",
    href: "https://www.centerstage.org/education/trans-history-project/",
  },
  {
    role: "Ida Navarro",
    title: "Untitled Navarro Sister's Play",
    playwright: "Sandra Delagado",
    description: "A new musical in development at Cleveland Playhouse.",
    href: "https://www.clevelandplayhouse.com/shows/2025/the-untitled-navarro-sisters-play",
  },
];

const MEDIA_REELS = [
  {
    id: "comedy-reel",
    label: "Funny",
    src: "/uploads/Comedy%20Reel.mov",
  },
  {
    id: "dramatic-reel",
    label: "Not Funny",
    src: "/uploads/Dramatic.mov",
  },
] as const;

function NewspaperIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 5h16v14H4z" />
      <path d="M7 9h10M7 12h10M7 15h6" />
      <path d="M4 5l2-2h12l2 2" />
    </svg>
  );
}

function newsClipTypography(style: NewsClipStyle): string {
  switch (style) {
    case "headline":
      return "text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-[var(--terracotta)] font-['Instrument_Serif'] italic leading-[1.12] tracking-tight";
    case "editorial":
      return "text-lg sm:text-xl lg:text-2xl text-[var(--deep-olive)]/85 font-['Inter'] font-normal leading-[1.65] tracking-normal";
    case "accent":
      return "text-2xl sm:text-3xl lg:text-4xl text-[var(--plum-red)]/90 font-['Syne'] font-medium leading-snug tracking-tight";
    case "feature":
      return "text-xl sm:text-2xl md:text-[1.75rem] text-[var(--deep-olive)]/80 font-['Cormorant_Garamond'] font-light leading-[1.5] tracking-[0.01em]";
  }
}

function newsClipAlign(align: NewsClip["align"]): string {
  switch (align) {
    case "left":
      return "text-left ml-0 mr-auto max-w-3xl";
    case "right":
      return "text-right ml-auto mr-0 max-w-3xl";
    case "center":
      return "text-center mx-auto max-w-4xl";
  }
}

function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  const navItems = [
    { id: "home", label: "Home" },
    { id: "work", label: "News" },
    { id: "portfolio", label: "Portfolio" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "work", "media", "portfolio", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;
        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          setActiveSection(section);
          break;
        }
      }
    };

    return subscribeScrollFrame(handleScroll);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const activeElement = navRefs.current[activeSection];
      if (!activeElement) return;
      const { offsetLeft, offsetWidth } = activeElement;
      setIndicatorStyle({ left: offsetLeft + offsetWidth / 2 - 20, width: 40 });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeSection]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="relative flex items-center justify-center gap-4 sm:gap-8 lg:gap-16">
          <motion.div
            className="absolute bottom-0 h-0.5 bg-[var(--plum-red)]/80"
            initial={false}
            animate={indicatorStyle}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          {navItems.map((item) => (
            <a
              key={item.id}
              ref={(el) => {
                navRefs.current[item.id] = el;
              }}
              href={`#${item.id}`}
              className={`text-xs sm:text-sm md:text-base tracking-wider uppercase transition-all duration-300 relative ${
                activeSection === item.id
                  ? "text-[var(--plum-red)]"
                  : "text-[var(--deep-olive)]/50 hover:text-[var(--plum-red)]/90"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_TITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current || !textRef.current) return;
      const imageRect = imageRef.current.getBoundingClientRect();
      const textRect = textRef.current.getBoundingClientRect();
      setTextVisible(!(imageRect.top <= textRect.bottom));
    };

    return subscribeScrollFrame(handleScroll);
  }, []);

  return (
    <div className="relative w-full bg-transparent pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div
          ref={textRef}
          className="sticky top-32 sm:top-36 lg:top-44 mb-12 sm:mb-16 lg:mb-20 transition-opacity duration-300"
          style={{ opacity: textVisible ? 1 : 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem] tracking-tighter text-[var(--deep-olive)] leading-[0.95] font-['Inter'] mb-6">
              Gloria Vivica Benavides
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-6 sm:gap-8"
          >
            <div
              className="relative h-12 sm:h-14 lg:h-16 xl:h-[4.5rem] w-full overflow-hidden"
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence initial={false}>
                <motion.p
                  key={currentIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-x-0 top-0 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[var(--terracotta)] font-['Instrument_Serif'] italic tracking-tight text-center leading-none"
                >
                  {HERO_TITLES[currentIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--deep-olive)] leading-relaxed text-center max-w-2xl px-2">
              {HERO_BIO}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-16 lg:mt-24">
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-6 lg:col-start-4 relative mx-auto w-full max-w-xl z-20"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <img
                src="/uploads/WhatsApp%20Image%202026-04-20%20at%2011.42.32%20PM.jpeg"
                alt="Gloria Vivica Benavides"
                className="w-full h-full object-cover object-[center_35%]"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-[var(--plum-red)]/20 pointer-events-none rounded-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Work() {
  return (
    <section id="work" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-[2] mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[9rem] 2xl:text-[10rem] tracking-tighter text-[var(--deep-olive)] leading-[0.9] font-['Instrument_Serif'] text-center">
            News
          </h2>
        </motion.header>

        <div className="relative z-10 max-w-3xl mx-auto space-y-14 sm:space-y-20 lg:space-y-24">
          <motion.figure
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="w-full"
          >
            <div className="overflow-hidden rounded-2xl border border-[var(--deep-olive)]/10 shadow-md">
              <img
                src={NEWS_FEATURE_IMAGE.src}
                alt={NEWS_FEATURE_IMAGE.alt}
                className="block w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="mt-5 sm:mt-6 text-sm sm:text-base text-[var(--deep-olive)]/55 font-['Inter'] italic text-center leading-relaxed">
              — {NEWS_FEATURE_IMAGE.caption}
            </figcaption>
          </motion.figure>

          <div className="flex items-center gap-4 text-[var(--deep-olive)]/30" aria-hidden>
            <span className="h-px flex-1 bg-current" />
            <NewspaperIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-[var(--plum-red)]/50" />
            <span className="font-['Syne'] text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase text-[var(--deep-olive)]/70">
              Press
            </span>
            <NewspaperIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-[var(--plum-red)]/50" />
            <span className="h-px flex-1 bg-current" />
          </div>

          {NEWS_CLIPS.map((clip, index) => (
            <motion.blockquote
              key={`${clip.quote.slice(0, 24)}-${index}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, delay: index * 0.04 }}
              className={`relative w-full ${newsClipAlign(clip.align)} ${
                index > 0 ? "pt-2 border-t border-[var(--deep-olive)]/[0.08]" : ""
              }`}
            >
              {clip.align === "left" ? (
                <span
                  className="hidden sm:block absolute -left-6 lg:-left-10 top-1 text-[var(--plum-red)]/25 font-['Instrument_Serif'] text-5xl leading-none select-none"
                  aria-hidden
                >
                  &ldquo;
                </span>
              ) : null}
              <p className={newsClipTypography(clip.style)}>&ldquo;{clip.quote}&rdquo;</p>
              {clip.source ? (
                <footer className="mt-4 sm:mt-5 font-['Syne'] text-[10px] sm:text-xs tracking-[0.22em] uppercase text-[var(--deep-olive)]/45">
                  — {clip.source}
                </footer>
              ) : null}
            </motion.blockquote>
          ))}

          <div className="pt-8 sm:pt-12 border-t border-[var(--deep-olive)]/[0.08] space-y-10 sm:space-y-12">
            <div className="flex items-center gap-4 text-[var(--deep-olive)]/30" aria-hidden>
              <span className="h-px flex-1 bg-current" />
              <span className="font-['Syne'] text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase text-[var(--deep-olive)]/70">
                Next up
              </span>
              <span className="h-px flex-1 bg-current" />
            </div>

            <div className="space-y-8 sm:space-y-10">
              {UPCOMING_PROJECTS.map((project, index) => (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.75, delay: index * 0.06 }}
                  className={`space-y-3 ${index > 0 ? "pt-8 sm:pt-10 border-t border-[var(--deep-olive)]/[0.08]" : ""}`}
                >
                  <p className="font-['Syne'] text-[10px] sm:text-xs tracking-[0.22em] uppercase text-[var(--plum-red)]/80">
                    Playing {project.role}
                  </p>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl text-[var(--deep-olive)] font-['Instrument_Serif'] leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--deep-olive)]/55 font-['Inter']">
                    {project.playwright}
                  </p>
                  <p className="text-base sm:text-lg text-[var(--deep-olive)]/80 font-['Inter'] leading-relaxed">
                    {project.description}
                  </p>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-['Syne'] text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[var(--plum-red)] underline decoration-[var(--plum-red)]/30 underline-offset-4 hover:opacity-80 transition-opacity"
                  >
                    Learn more
                  </a>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Media() {
  return (
    <section id="media" className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-[var(--deep-olive)] leading-[0.95] font-['Instrument_Serif'] text-center">
            Media
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {MEDIA_REELS.map((reel, index) => (
            <motion.figure
              key={reel.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
              className="space-y-3"
            >
              <div className="overflow-hidden rounded-2xl border border-[var(--deep-olive)]/10 shadow-md bg-[var(--deep-olive)]/5">
                <video
                  src={reel.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="block w-full aspect-video object-cover bg-black/10"
                >
                  <a href={reel.src}>Download {reel.label}</a>
                </video>
              </div>
              <figcaption className="text-center text-sm sm:text-base text-[var(--deep-olive)]/60 font-['Instrument_Serif'] italic">
                {reel.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const overlapRef = useRef<HTMLDivElement>(null);
  const { titleRef, titleVisible } = useStickyOverlapFade(overlapRef, 48);

  type GalleryImage = { src: string; alt: string; fit?: "cover" | "natural" };

  const featured: { image: GalleryImage; caption: string } = {
    image: {
      src: "/uploads/BE507BCD-108C-4607-A812-D841C08C427C.png",
      alt: "Gloria Vivica Benavides on stage in an orange dress beneath a Garcia neon sign",
      fit: "natural",
    },
    caption: "Gloria as Pancha in Real Women Have Curves at the Alley Theatre",
  };

  const galleryCaptionClass =
    "mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-[var(--plum-red)] font-['Instrument_Serif'] italic text-center leading-relaxed px-2";

  const productionGroups: { images: [GalleryImage, GalleryImage]; caption: string }[] = [
    {
      images: [
        {
          src: "/uploads/Screenshot%20from%202026-06-10%2012-42-11.png",
          alt: "Gloria Vivica Benavides as Caliban in The Tempest, mid-performance",
          fit: "natural",
        },
        {
          src: "/uploads/IMG_1493.JPG",
          alt: "Gloria Vivica Benavides as Caliban in The Tempest, full-length stage portrait",
          fit: "natural",
        },
      ],
      caption: "Gloria as Caliban in The Tempest at Trinity Repertory Company",
    },
    {
      images: [
        {
          src: "/uploads/Screenshot%20from%202026-06-10%2012-41-34.png",
          alt: "Ensemble cast peering through a purple window set piece on stage",
          fit: "natural",
        },
        {
          src: "/uploads/Screenshot%20from%202026-06-10%2012-42-43.png",
          alt: "Ensemble cast in motion during Somewhere Over the Border",
          fit: "natural",
        },
      ],
      caption:
        "Gloria as Antonia in Somewhere Over the Border by Brian Quijada — Syracuse Stage, Geva Theatre, Pittsburgh City Theatre, and People's Light Theatre",
    },
  ];

  const renderImage = (image: GalleryImage, className = "") => (
    <div
      className={`relative overflow-hidden rounded-3xl ${
        image.fit === "natural" ? "" : "aspect-[4/5] lg:aspect-[3/4]"
      } ${className}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        className={image.fit === "natural" ? "block w-full h-auto" : "w-full h-full object-cover"}
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  return (
    <section id="portfolio" className="relative w-full bg-transparent py-24 sm:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="relative mb-10 sm:mb-14 lg:mb-20 pb-6 sm:pb-8 lg:pb-10">
          <div
            ref={titleRef}
            className="sticky top-32 sm:top-36 lg:top-44 z-[2] transition-opacity duration-100 ease-out"
            style={{
              opacity: titleVisible ? 1 : 0,
              pointerEvents: titleVisible ? "auto" : "none",
            }}
          >
            <motion.h2
              initial={{ opacity: 1, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some", margin: "0px 0px -120px 0px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-[9rem] 2xl:text-[10rem] tracking-tight text-[var(--deep-olive)] leading-[0.95] font-['Instrument_Serif'] text-center px-2 sm:whitespace-nowrap"
            >
              Portfolio
            </motion.h2>
          </div>
        </div>

        <div className="relative z-10 space-y-20 sm:space-y-24 lg:space-y-32">
          <div className="space-y-16 sm:space-y-20 lg:space-y-28">
            <motion.figure
              ref={overlapRef}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9 }}
              className="max-w-2xl mx-auto w-full"
            >
              {renderImage(featured.image)}
              <figcaption className={galleryCaptionClass}>{featured.caption}</figcaption>
            </motion.figure>

            {productionGroups.map((group, groupIdx) => (
              <motion.figure
                key={group.caption}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.85, delay: groupIdx * 0.05 }}
                className="max-w-5xl mx-auto w-full"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  {group.images.map((image) => (
                    <div key={image.src}>{renderImage(image)}</div>
                  ))}
                </div>
                <figcaption className={`${galleryCaptionClass} mt-6 sm:mt-8 max-w-3xl mx-auto`}>
                  {group.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-16 lg:space-y-20 pt-8 sm:pt-12 border-t border-[var(--deep-olive)]/15">
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl text-[var(--deep-olive)] font-['Instrument_Serif']">
                Résumé
              </h3>
            </div>

            {resume.documentSrc ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8 }}
                className="overflow-hidden rounded-2xl border border-[var(--deep-olive)]/10 shadow-md bg-white"
              >
                {resume.documentSrc.endsWith(".pdf") ? (
                  <object
                    data={resume.documentSrc}
                    type="application/pdf"
                    className="w-full min-h-[80vh]"
                    aria-label="Gloria Vivica Benavides résumé"
                  >
                    <a href={resume.documentSrc} className="block p-8 text-center text-[var(--plum-red)]">
                      Download résumé (PDF)
                    </a>
                  </object>
                ) : (
                  <img
                    src={resume.documentSrc}
                    alt="Gloria Vivica Benavides résumé"
                    className="block w-full h-auto"
                  />
                )}
              </motion.div>
            ) : null}

            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl border border-[var(--deep-olive)]/10 bg-[var(--warm-cream)]/40 p-8 sm:p-10 lg:p-12 space-y-10"
            >
              <header className="border-b border-[var(--deep-olive)]/15 pb-6 sm:pb-8">
                <h3 className="text-3xl sm:text-4xl text-[var(--deep-olive)] font-['Instrument_Serif'] tracking-tight">
                  {resume.name}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[var(--deep-olive)]/60 font-['Inter']">{resume.stats}</p>
                <p className="mt-4 text-sm text-[var(--deep-olive)]/70 font-['Inter']">
                  {resume.management.name} · {resume.management.phone} ·{" "}
                  <a href={`mailto:${resume.management.email}`} className="underline decoration-[var(--plum-red)]/30">
                    {resume.management.email}
                  </a>
                </p>
              </header>

              <ResumeCreditList title="Stage (selected roles)" credits={resume.stage} />
              <ResumeCreditList title="Voice-Over" credits={resume.voiceOver} />
              <ResumeCreditList title="Film & Television" credits={resume.filmTelevision} />

              <div>
                <h4 className="font-['Syne'] text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[var(--plum-red)] mb-4 sm:mb-5 border-b border-[var(--deep-olive)]/15 pb-2">
                  Education & training
                </h4>
                <ul className="space-y-2 text-sm sm:text-base text-[var(--deep-olive)]/85 font-['Inter'] leading-relaxed">
                  {resume.education.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Syne'] text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[var(--plum-red)] mb-4 sm:mb-5 border-b border-[var(--deep-olive)]/15 pb-2">
                  Special skills
                </h4>
                <p className="text-sm sm:text-base text-[var(--deep-olive)]/85 font-['Inter'] leading-relaxed">
                  {resume.specialSkills}
                </p>
              </div>
            </motion.article>

            <div>
              <h3 className="text-center text-3xl sm:text-4xl lg:text-5xl text-[var(--deep-olive)] font-['Instrument_Serif'] mb-10 sm:mb-12">
                Headshots
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {headshotPhotos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.75, delay: idx * 0.06 }}
                    className="overflow-hidden rounded-2xl border border-[var(--deep-olive)]/10"
                  >
                    <img
                      src={photo.src}
                      alt={`${resume.name} — ${photo.label}`}
                      className="block w-full h-auto object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResumeCreditList({
  title,
  credits,
}: {
  title: string;
  credits: readonly { production: string; role: string; company: string }[];
}) {
  return (
    <div>
      <h4 className="font-['Syne'] text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[var(--plum-red)] mb-4 sm:mb-5 border-b border-[var(--deep-olive)]/15 pb-2">
        {title}
      </h4>
      <ul className="space-y-2.5 sm:space-y-3">
        {credits.map((credit) => (
          <li
            key={`${credit.production}-${credit.role}-${credit.company}`}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)_minmax(0,1fr)] gap-x-4 gap-y-0.5 text-sm sm:text-base text-[var(--deep-olive)]/90 font-['Inter'] leading-snug"
          >
            <span className="font-medium text-[var(--deep-olive)]">{credit.production}</span>
            <span className="text-[var(--deep-olive)]/75">{credit.role}</span>
            <span className="sm:text-right text-[var(--deep-olive)]/60 text-xs sm:text-sm">{credit.company}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Contact() {
  const overlapRef = useRef<HTMLDivElement>(null);
  /** ~40px lead: larger values exceeded the layout gap and hid “Contact” whenever this section was on screen. */
  const { titleRef, titleVisible } = useStickyOverlapFade(overlapRef, 40);

  return (
    <section id="contact" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative mb-10 sm:mb-12 lg:mb-16 pb-6 sm:pb-8 lg:pb-10">
          <div
            ref={titleRef}
            className="sticky top-32 sm:top-36 lg:top-44 z-[2] transition-opacity duration-100 ease-out"
            style={{
              opacity: titleVisible ? 1 : 0,
              pointerEvents: titleVisible ? "auto" : "none",
            }}
          >
            <motion.h2
              initial={{ opacity: 1, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some", margin: "0px 0px -120px 0px" }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-[9rem] 2xl:text-[10rem] tracking-tight text-[var(--deep-olive)] leading-[0.95] font-['Instrument_Serif'] text-center px-2 sm:whitespace-nowrap"
            >
              Contact
            </motion.h2>
          </div>
        </div>

        <motion.div
          ref={overlapRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -200px 0px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative z-10 pt-4 lg:pt-8 max-w-4xl mx-auto"
        >
          <h3 className="text-center text-3xl sm:text-4xl lg:text-5xl text-[var(--plum-red)] font-['Instrument_Serif'] italic mb-10 sm:mb-12">
            Let&apos;s collaborate
          </h3>

          <div className="text-center mb-12 sm:mb-14 pb-10 sm:pb-12 border-b border-[var(--plum-red)]/15">
            <p className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[var(--plum-red)]/90 mb-3">
              Management
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl text-[var(--deep-olive)] font-['Instrument_Serif'] tracking-tight">
              Gregg Baker Management
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 max-w-2xl mx-auto text-[var(--deep-olive)]">
            <div className="text-center md:text-right">
              <p className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[var(--plum-red)]/90 mb-2">Email</p>
              <a
                href="mailto:gregg@gb-management.com"
                className="text-lg sm:text-xl font-light tracking-tight text-[var(--deep-olive)] underline decoration-[var(--plum-red)]/30 underline-offset-[6px] hover:opacity-80 break-all"
              >
                gregg@gb-management.com
              </a>
            </div>

            <div className="text-center md:text-left">
              <p className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[var(--plum-red)]/90 mb-2">Phone</p>
              <a href="tel:+13104564156" className="text-lg sm:text-xl font-light tracking-tight hover:opacity-80">
                (310) 456-4156
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative w-full bg-[var(--deep-olive)] text-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-14 min-h-[520px] sm:min-h-[560px] flex flex-col justify-between">
        <div className="grid grid-cols-3 items-start text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[var(--cream)]/80">
          <a href="mailto:gregg@gb-management.com" className="justify-self-start hover:text-[var(--cream)] transition-colors">
            Email
          </a>
          <span className="justify-self-center text-center">Gloria Vivica</span>
          <div className="justify-self-end text-right">
            <p>Film & Theater</p>
          </div>
        </div>

        <div className="text-center overflow-x-hidden">
          <p className="whitespace-nowrap font-['Inter'] font-light tracking-[0.1em] sm:tracking-[0.18em] leading-none text-[clamp(2.75rem,14vw,6.25rem)] sm:text-[140px] lg:text-[170px]">
            G . V . B
          </p>
        </div>

        <div className="grid grid-cols-3 items-end text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[var(--cream)]/80">
          <a
            href="https://www.instagram.com/gloriavivica?igsh=MWh3ZjE4NXF6bzl5bA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="justify-self-start hover:text-[var(--cream)] transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/share/1BgDdx11Ek/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="justify-self-center hover:text-[var(--cream)] transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://www.imdb.com/name/nm10921109/?ref_=ext_shr_lnk"
            target="_blank"
            rel="noopener noreferrer"
            className="justify-self-end hover:text-[var(--cream)] transition-colors"
          >
            IMDb
          </a>
        </div>
      </div>
    </footer>
  );
}

function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[10000] bg-[var(--cream)] flex items-center justify-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[var(--primary)] text-center px-4">
            Gloria Vivica Benavides
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CursorEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const pending = { x: 0, y: 0 };
    let raf = 0;
    const flush = () => {
      raf = 0;
      setMousePosition({ x: pending.x, y: pending.y });
      setIsVisible(true);
    };
    const handleMouseMove = (e: MouseEvent) => {
      pending.x = e.clientX;
      pending.y = e.clientY;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const handleMouseLeave = () => setIsVisible(false);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12, opacity: isVisible ? 1 : 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
      >
        <div className="w-full h-full rounded-full border border-white" />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4, opacity: isVisible ? 1 : 0 }}
        transition={{ type: "spring", damping: 10, stiffness: 400, mass: 0.2 }}
      >
        <div className="w-full h-full rounded-full bg-white" />
      </motion.div>
    </>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--terracotta)] via-[var(--olive-green)] to-[var(--plum-red)] origin-left z-[60]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.03]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      }}
    />
  );
}

type BlobConfig = {
  size: number;
  left: string;
  top: string;
  gradient: string;
  opacity: number;
  blurClass: string;
  duration: number;
  delay: number;
};

/** Four blobs + lighter blur + CSS keyframes (no Motion): much cheaper than six Motion-driven blur layers. */
const BACKGROUND_BLOBS: BlobConfig[] = [
  {
    size: 820,
    left: "-12%",
    top: "-6%",
    gradient: "radial-gradient(circle, var(--plum-red) 0%, color-mix(in oklab, var(--plum-red) 40%, transparent) 45%, transparent 72%)",
    opacity: 0.28,
    blurClass: "blur-[80px]",
    duration: 28,
    delay: 1,
  },
  {
    size: 680,
    left: "72%",
    top: "-4%",
    gradient: "radial-gradient(circle, var(--olive-green) 0%, color-mix(in oklab, var(--sage) 50%, transparent) 50%, transparent 70%)",
    opacity: 0.24,
    blurClass: "blur-[72px]",
    duration: 26,
    delay: 3,
  },
  {
    size: 900,
    left: "38%",
    top: "48%",
    gradient: "radial-gradient(circle, var(--tan) 0%, var(--terracotta) 35%, transparent 68%)",
    opacity: 0.22,
    blurClass: "blur-[88px]",
    duration: 30,
    delay: 2,
  },
  {
    size: 720,
    left: "8%",
    top: "22%",
    gradient: "radial-gradient(circle, var(--warm-beige) 0%, var(--tan) 42%, transparent 68%)",
    opacity: 0.2,
    blurClass: "blur-[70px]",
    duration: 22,
    delay: 6,
  },
];

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--cream)] via-[var(--warm-cream)] to-[var(--warm-beige)]" />
      <div className="portfolio-bg-blobs absolute inset-0" aria-hidden>
        {BACKGROUND_BLOBS.map((blob, i) => (
          <div
            key={i}
            className={`portfolio-bg-blob portfolio-bg-blob--${i} absolute rounded-full ${blob.blurClass}`}
            style={{
              width: blob.size,
              height: blob.size,
              left: blob.left,
              top: blob.top,
              background: blob.gradient,
              opacity: blob.opacity,
              animationDuration: `${blob.duration}s`,
              animationDelay: `${blob.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function FigmaPortfolio() {
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const id = target.getAttribute("href")?.slice(1);
        const element = id ? document.getElementById(id) : null;
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", handleSmoothScroll);
    return () => document.removeEventListener("click", handleSmoothScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent antialiased cursor-none md:cursor-none">
      <AnimatedBackground />
      <GrainOverlay />
      <PageLoader />
      <CursorEffect />
      <ScrollProgress />
      <Navigation />
      <main>
        <div id="home">
          <Hero />
        </div>
        <Work />
        <Media />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
