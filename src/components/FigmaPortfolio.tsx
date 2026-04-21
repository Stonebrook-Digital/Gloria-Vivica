"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { subscribeScrollFrame } from "@/lib/scrollFrame";

const HERO_TITLES = ["Actress", "Performer", "Storyteller"];

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

const WORK_SAMPLE_DESCRIPTION =
  "Brief credits and synopsis go here—logline, director, festival notes, or press lines when you have final copy.";

function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  const navItems = [
    { id: "home", label: "Home" },
    { id: "work", label: "Work" },
    { id: "gallery", label: "Gallery" },
    { id: "about", label: "About" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "work", "gallery", "about"];
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
        <div className="relative flex items-center justify-center gap-8 sm:gap-12 lg:gap-16">
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
              className={`text-sm sm:text-base tracking-wider uppercase transition-all duration-300 relative ${
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
            <h1 className="text-7xl sm:text-8xl lg:text-9xl xl:text-[12rem] tracking-tighter text-[var(--deep-olive)] leading-[0.9] font-['Inter'] mb-6">
              Gloria Vivica
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="h-16 sm:h-20 lg:h-24 flex items-center justify-center"
          >
            {/* Rotating tagline (cycles every few seconds; could add AnimatePresence for a crossfade) */}
            <motion.p
              key={currentIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[var(--terracotta)] font-['Instrument_Serif'] italic tracking-tight"
            >
              {HERO_TITLES[currentIndex]}
            </motion.p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-24 lg:mt-32">
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-6 lg:col-start-4 relative mx-auto w-full max-w-xl z-20"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <img
                src="/uploads/IMG_3464(2).jpg"
                alt="Gloria Vivica"
                className="w-full h-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-[var(--plum-red)]/20 pointer-events-none rounded-3xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="lg:col-span-12 flex flex-col items-center justify-center space-y-8 mt-12 lg:mt-16"
          >
            <p className="text-base sm:text-lg lg:text-xl text-[var(--deep-olive)] leading-relaxed text-center max-w-2xl">
              City, State–based performer specializing in emotionally complex character work across film, television,
              and theater.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Work() {
  const overlapRef = useRef<HTMLDivElement>(null);
  const { titleRef, titleVisible } = useStickyOverlapFade(overlapRef, 40);

  const projects = [
    { title: "Example project one", role: "Lead", type: "Feature film", year: "20XX" },
    { title: "Example project two", role: "Supporting", type: "Limited series", year: "20XX" },
    { title: "Example project three", role: "Series regular", type: "Television", year: "20XX" },
    { title: "Example project four", role: "Guest arc", type: "Television", year: "20XX" },
    { title: "Example project five", role: "Ensemble", type: "Theater", year: "20XX" },
    { title: "Example project six", role: "Principal", type: "Short film", year: "20XX" },
  ];

  const layouts = [
    "lg:ml-0 lg:w-[85%]",
    "lg:ml-auto lg:w-[70%]",
    "lg:mx-auto lg:w-[60%]",
    "lg:ml-auto lg:w-[80%]",
    "lg:ml-0 lg:w-[65%]",
    "lg:mx-auto lg:w-[75%]",
  ];

  const titleColors = [
    "text-[var(--terracotta)]",
    "text-[var(--deep-olive)]",
    "text-[var(--olive-green)]",
    "text-[var(--plum-red)]",
    "text-[var(--terracotta)]",
    "text-[var(--deep-olive)]",
  ];

  const bgColors = [
    "bg-[#e8e4de]",
    "bg-[#e9ddd8]",
    "bg-[#dde3d4]",
    "bg-[#e5d9cc]",
    "bg-[#ebe4dc]",
    "bg-[#dfe5d8]",
  ];

  const titleSizes = [
    "text-5xl sm:text-6xl lg:text-7xl",
    "text-4xl sm:text-5xl lg:text-6xl",
    "text-6xl sm:text-7xl lg:text-8xl",
    "text-5xl sm:text-6xl lg:text-7xl",
    "text-4xl sm:text-5xl lg:text-6xl",
    "text-5xl sm:text-6xl lg:text-7xl",
  ];

  return (
    <section id="work" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div
          ref={titleRef}
          className="sticky top-32 sm:top-36 lg:top-44 z-[2] mb-16 lg:mb-24 transition-opacity duration-300"
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
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-[9rem] 2xl:text-[10rem] tracking-tighter text-[var(--deep-olive)] leading-[0.9] font-['Instrument_Serif'] text-center"
          >
            Selected Work
          </motion.h2>
        </div>

        <div className="space-y-16 lg:space-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              ref={index === 0 ? overlapRef : undefined}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative z-10 w-full ${layouts[index] ?? layouts[0]}`}
            >
              <div
                className={`${bgColors[index] ?? bgColors[0]} p-8 sm:p-10 lg:p-12 rounded-3xl transition-all duration-500 hover:shadow-2xl border border-[var(--deep-olive)]/10`}
              >
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`${titleSizes[index] ?? titleSizes[0]} ${titleColors[index] ?? titleColors[0]} tracking-tighter leading-[0.9] mb-4 lg:mb-6 font-['Instrument_Serif']`}
                    >
                      {project.title}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-xl sm:text-2xl lg:text-3xl text-[var(--deep-olive)] font-['Instrument_Serif'] italic">
                        {project.role}
                      </p>
                      <p className="text-sm sm:text-base text-[var(--deep-olive)]/60 tracking-wider uppercase">
                        {project.type} · City, State · {project.year}
                      </p>
                    </div>
                  </div>
                  <div className="lg:max-w-[40%] lg:text-right">
                    <p className="text-base sm:text-lg text-[var(--deep-olive)]/80 leading-relaxed">
                      {WORK_SAMPLE_DESCRIPTION}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="mt-24 lg:mt-32 text-center text-2xl sm:text-3xl lg:text-4xl text-[var(--terracotta)] font-['Instrument_Serif'] italic"
        >
          Additional credits to be listed here
        </motion.p>
      </div>
    </section>
  );
}

function Gallery() {
  const overlapRef = useRef<HTMLDivElement>(null);
  /** Lead must stay below the real title→content gap or the heading stays opacity:0 forever. */
  const { titleRef, titleVisible } = useStickyOverlapFade(overlapRef, 48);

  const images = [
    { src: "/uploads/gloria-benavides-4.jpeg", alt: "Portrait 1" },
    { src: "/uploads/Resized_GloriaBenavides_EMW_24-00060.jpeg", alt: "Portrait 2" },
    { src: "/uploads/IMG_3411.JPG", alt: "Portrait 3" },
    { src: "/uploads/Facetune_20-08-2025-01-19-02(1).jpg", alt: "Portrait 4" },
  ];

  return (
    <section id="gallery" className="relative w-full bg-transparent py-24 sm:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Short padding runway limits sticky travel without a huge empty gap above the grid. */}
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
              Gallery
            </motion.h2>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {images.map((image, idx) => (
            <motion.div
              key={image.src}
              ref={idx === 0 ? overlapRef : undefined}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={`relative z-10 ${idx % 2 === 0 ? "col-span-12 lg:col-span-7" : "col-span-12 lg:col-span-5 lg:mt-20"}`}
            >
              <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-3xl">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const overlapRef = useRef<HTMLDivElement>(null);
  /** ~40px lead: larger values exceeded the layout gap and hid “About” whenever this section was on screen. */
  const { titleRef, titleVisible } = useStickyOverlapFade(overlapRef, 40);

  return (
    <section id="about" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12">
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
              About
            </motion.h2>
          </div>
        </div>

        <div ref={overlapRef} className="relative z-10 space-y-12 lg:space-y-16">
          <div className="space-y-8 text-xl sm:text-2xl lg:text-3xl text-[var(--deep-olive)] leading-relaxed max-w-4xl mx-auto text-center font-['Inter'] font-normal">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some", margin: "0px 0px -200px 0px" }}
              transition={{ duration: 0.75, delay: 0.05 }}
            >
              Gloria Vivica is a City, State–based actress with a passion for authentic storytelling and emotionally
              complex character work. With years of experience across film, television, and theater, she brings depth
              and nuance to every role.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some", margin: "0px 0px -200px 0px" }}
              transition={{ duration: 0.75, delay: 0.12 }}
            >
              Her training emphasizes emotional truth and meticulous preparation. She continues to seek diverse roles
              that stretch her range across stage and screen.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some", margin: "0px 0px -180px 0px" }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pt-12 lg:pt-16 border-t border-[var(--deep-olive)]/28 max-w-5xl mx-auto"
          >
            {[
              { label: "Based in", value: "City, State" },
              { label: "Experience", value: "10+ years" },
              { label: "Training", value: "Studio / program" },
              { label: "Focus", value: "Film & TV" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-['Syne'] font-bold text-xs sm:text-sm tracking-[0.22em] uppercase text-[var(--plum-red)] mb-3 sm:mb-4 leading-snug">
                  {item.label}
                </p>
                <p className="font-['Instrument_Serif'] text-xl sm:text-2xl lg:text-[1.65rem] text-[var(--deep-olive)] leading-snug tracking-tight">
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some", margin: "0px 0px -200px 0px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative pt-12 lg:pt-20 max-w-4xl mx-auto"
          >
            <h3 className="text-center text-3xl sm:text-4xl lg:text-5xl text-[var(--plum-red)] font-['Instrument_Serif'] italic mb-12 sm:mb-14">
              Let&apos;s collaborate
            </h3>

            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-y-0 md:items-end text-[var(--deep-olive)]">
              <div className="md:col-span-5 md:col-start-1 text-left md:text-right md:pr-8 md:border-r md:border-[var(--plum-red)]/15">
                <p className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[var(--plum-red)]/90 mb-2">Email</p>
                <a
                  href="mailto:hello@example.com"
                  className="text-lg sm:text-xl font-light tracking-tight text-[var(--deep-olive)] underline decoration-[var(--plum-red)]/30 underline-offset-[6px] hover:opacity-80 break-all"
                >
                  hello@example.com
                </a>
              </div>

              <div className="hidden md:flex md:col-span-2 items-center justify-center pb-2">
                <span className="text-[var(--plum-red)]/40 text-2xl leading-none select-none" aria-hidden>
                  ·
                </span>
              </div>

              <div className="md:col-span-5 md:col-start-8 text-left md:pl-4">
                <p className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[var(--plum-red)]/90 mb-2">Phone</p>
                <a href="tel:+10000000000" className="text-lg sm:text-xl font-light tracking-tight hover:opacity-80">
                  (000) 000-0000
                </a>
              </div>

              <div className="md:col-span-10 md:col-start-2 mt-2 md:mt-14 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-8 px-6 py-6 rounded-2xl bg-[var(--plum-red)]/[0.06] border border-[var(--plum-red)]/15">
                <p className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[var(--plum-red)] shrink-0">
                  Representation
                </p>
                <p className="text-base sm:text-lg text-[var(--deep-olive)]/90 leading-snug text-center sm:text-left">
                  <span className="font-medium text-[var(--deep-olive)]">Agency name</span>
                  <span className="mx-2 text-[var(--deep-olive)]/35 hidden sm:inline">—</span>
                  <span className="block sm:inline mt-1 sm:mt-0">City, State</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative w-full bg-[var(--deep-olive)] text-[var(--cream)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-14 min-h-[520px] sm:min-h-[560px] flex flex-col justify-between">
        <div className="grid grid-cols-3 items-start text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[var(--cream)]/80">
          <a href="mailto:hello@example.com" className="justify-self-start hover:text-[var(--cream)] transition-colors">
            Email
          </a>
          <span className="justify-self-center text-center">Gloria Vivica</span>
          <div className="justify-self-end text-right">
            <p>Film & Theater</p>
            <p className="mt-2 text-[var(--cream)]/60">City, State</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[11px] sm:text-xs tracking-[0.32em] uppercase text-[var(--cream)]/70 mb-8">Portfolio</p>
          <p className="text-[100px] sm:text-[140px] lg:text-[170px] font-['Inter'] font-light tracking-[0.18em] leading-none">
            G . V
          </p>
        </div>

        <div className="grid grid-cols-2 items-end text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[var(--cream)]/80">
          <a href="#" className="justify-self-start hover:text-[var(--cream)] transition-colors">
            IMDb
          </a>
          <a href="#" className="justify-self-end hover:text-[var(--cream)] transition-colors">
            LinkedIn
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-[var(--primary)]">
            Gloria Vivica
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
        <Gallery />
        <About />
      </main>
      <Footer />
    </div>
  );
}
