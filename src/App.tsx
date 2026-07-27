import { useRef } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { capabilities, experience } from './content'

const EMAIL = 'mohamed.senator@icloud.com'
const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'

type StyledSegment = {
  text: string
  className?: string
}

function WordsPullUp({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()
  const words = text.split(' ')

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, index) => (
        <span className="overflow-hidden" key={`${word}-${index}`}>
          <motion.span
            className="inline-block"
            initial={reduceMotion ? false : { y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : undefined}
            transition={{
              duration: 0.65,
              delay: reduceMotion ? 0 : index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {index < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function WordsPullUpMultiStyle({
  segments,
  className = '',
}: {
  segments: StyledSegment[]
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()
  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word) => ({
      word,
      className: segment.className ?? '',
    })),
  )

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map(({ word, className: wordClassName }, index) => (
        <span className="overflow-hidden" key={`${word}-${index}`}>
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={reduceMotion ? false : { y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : undefined}
            transition={{
              duration: 0.65,
              delay: reduceMotion ? 0 : index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {index < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function AnimatedLetter({
  character,
  index,
  total,
  progress,
}: {
  character: string
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const reduceMotion = useReducedMotion()
  const position = index / total
  const opacity = useTransform(
    progress,
    [Math.max(0, position - 0.1), Math.min(1, position + 0.05)],
    [0.2, 1],
  )

  return (
    <motion.span style={{ opacity: reduceMotion ? 1 : opacity }}>
      {character}
    </motion.span>
  )
}

function App() {
  const aboutTextRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const cardsInView = useInView(cardsRef, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({
    target: aboutTextRef,
    offset: ['start 0.8', 'end 0.2'],
  })
  const aboutText =
    'Across more than four years in enterprise, manufacturing, and government environments, I have supported infrastructure serving up to 4,000+ users while developing PowerShell health checks, audits, dashboards, and operational reporting.'

  return (
    <main className="bg-black text-[#E1E0CC]">
      <section
        className="h-screen min-h-[680px] p-3 sm:p-4 md:p-6"
        aria-labelledby="hero-title"
      >
        <div className="video-fallback relative h-full overflow-hidden rounded-2xl md:rounded-[2rem]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            tabIndex={-1}
          />
          <div
            className="noise-overlay pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/85"
            aria-hidden="true"
          />

          <header className="absolute left-1/2 top-0 z-20 max-w-[calc(100%-1rem)] -translate-x-1/2 rounded-b-2xl bg-black px-3 py-2 sm:px-5 md:rounded-b-3xl md:px-8">
            <nav
              className="hide-scrollbar flex items-center gap-3 overflow-x-auto whitespace-nowrap text-[9px] sm:gap-6 sm:text-xs md:gap-10 md:text-sm"
              aria-label="Primary navigation"
            >
              <a className="text-[#E1E0CC]/80 transition-colors hover:text-[#E1E0CC]" href="#about">
                About
              </a>
              <a className="text-[#E1E0CC]/80 transition-colors hover:text-[#E1E0CC]" href="#capabilities">
                Capabilities
              </a>
              <a className="text-[#E1E0CC]/80 transition-colors hover:text-[#E1E0CC]" href="#experience">
                Experience
              </a>
              <a
                className="text-[#E1E0CC]/80 transition-colors hover:text-[#E1E0CC]"
                href="https://linkedin.com/in/mohamedsenator"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a className="text-[#E1E0CC]/80 transition-colors hover:text-[#E1E0CC]" href="#contact">
                Contact
              </a>
            </nav>
          </header>

          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-5 sm:px-6 sm:pb-7 md:px-8 lg:px-10 lg:pb-9">
            <motion.p
              className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80 sm:text-xs"
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Systems Administrator &amp; Cloud Engineer
            </motion.p>

            <h1 id="hero-title" className="mb-5 font-normal leading-[0.78] tracking-[-0.075em]">
              <WordsPullUp
                text="Mohamed"
                className="text-[20vw] sm:text-[17vw] lg:text-[15vw] 2xl:text-[14vw]"
              />
              <span className="block">
                <WordsPullUp
                  text="Senator"
                  className="text-[20vw] sm:text-[17vw] lg:text-[15vw] 2xl:text-[14vw]"
                />
              </span>
            </h1>

            <div className="grid gap-5 md:grid-cols-12 md:items-end">
              <motion.div
                className="md:col-span-7"
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: reduceMotion ? 0 : 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="max-w-xl text-xs leading-snug text-primary/75 sm:text-sm md:text-base">
                  I keep enterprise infrastructure available and turn recurring
                  operations into documented PowerShell and cloud workflows.
                </p>
                <p className="mt-3 text-[9px] uppercase tracking-[0.14em] text-primary/55 sm:text-[10px]">
                  Algiers, Algeria · 4+ years · Google Cloud ACE
                </p>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-2 md:col-span-5 md:justify-end"
                initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: reduceMotion ? 0 : 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <a
                  className="group inline-flex items-center gap-2 rounded-full bg-primary py-1.5 pl-4 pr-1.5 text-xs font-bold text-black transition-all hover:gap-3 sm:text-sm"
                  href="#experience"
                >
                  View experience
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-primary transition-transform group-hover:scale-110">
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-black/20 px-4 py-2 text-xs font-bold text-primary backdrop-blur transition-colors hover:border-primary sm:text-sm"
                  href="/Mohamed_Senator_CV_2026.pdf"
                >
                  Download CV
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="px-3 py-20 sm:px-4 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#101010] px-5 py-20 text-center sm:px-8 md:px-14 md:py-28">
          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
            Infrastructure, operations, automation
          </p>
          <h2 className="mx-auto max-w-5xl text-3xl font-normal leading-[0.98] tracking-[-0.045em] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            <WordsPullUpMultiStyle
              className="justify-center"
              segments={[
                { text: 'I build reliable Windows infrastructure and' },
                {
                  text: 'automate the work',
                  className: 'font-serif italic text-primary',
                },
                { text: 'that should not stay manual.' },
              ]}
            />
          </h2>
          <p
            ref={aboutTextRef}
            className="mx-auto mt-12 max-w-3xl text-xs leading-relaxed text-primary sm:text-sm md:mt-16 md:text-base md:leading-relaxed"
          >
            {Array.from(aboutText).map((character, index) => (
              <AnimatedLetter
                character={character}
                index={index}
                total={aboutText.length}
                progress={scrollYProgress}
                key={`${character}-${index}`}
              />
            ))}
          </p>
        </div>
      </section>

      <section
        id="capabilities"
        className="relative overflow-hidden px-3 py-20 sm:px-4 md:px-6 md:py-28"
      >
        <div
          className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[96rem]">
          <h2 className="mb-12 max-w-4xl text-xl font-normal leading-tight tracking-[-0.03em] sm:text-2xl md:text-3xl lg:text-4xl">
            <WordsPullUpMultiStyle
              segments={[
                {
                  text: 'Operational discipline for systems that must stay available.',
                },
                {
                  text: 'Built on infrastructure. Extended through automation and cloud.',
                  className: 'text-gray-500',
                },
              ]}
            />
          </h2>

          <div
            ref={cardsRef}
            className="grid gap-3 md:grid-cols-2 lg:h-[500px] lg:grid-cols-4 lg:gap-1"
          >
            {capabilities.map((capability, index) => (
              <motion.article
                className="card-video-fallback relative flex min-h-[390px] overflow-hidden rounded-2xl p-5 sm:p-6 lg:min-h-0"
                initial={reduceMotion ? false : { scale: 0.95, opacity: 0 }}
                animate={
                  cardsInView ? { scale: 1, opacity: 1 } : undefined
                }
                transition={{
                  duration: 0.7,
                  delay: reduceMotion ? 0 : index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                key={capability.number}
              >
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  src={capability.image}
                  alt=""
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/95"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex w-full flex-col">
                  <span className="text-[10px] font-bold tracking-[0.16em] text-primary/60">
                    {capability.number}
                  </span>
                  <div className="mt-auto">
                    <h3 className="text-xl font-normal tracking-[-0.03em] text-[#E1E0CC] sm:text-2xl">
                      {capability.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-gray-400">
                      {capability.description}
                    </p>
                    <ul className="mt-6 space-y-3 border-t border-white/10 pt-5">
                      {capability.items.map((item) => (
                        <li
                          className="flex items-start gap-2 text-[11px] leading-snug text-gray-300"
                          key={item}
                        >
                          <Check
                            className="mt-0.5 shrink-0 text-primary"
                            size={13}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div id="experience" className="scroll-mt-20 pt-24 md:pt-32">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                  Experience
                </p>
                <h2 className="mt-3 text-3xl font-normal tracking-[-0.045em] sm:text-4xl md:text-5xl">
                  Built in live environments.
                </h2>
              </div>
              <span className="hidden text-[10px] uppercase tracking-[0.14em] text-gray-500 sm:block">
                2021 — Present
              </span>
            </div>

            <ol className="border-t border-white/15">
              {experience.map((item) => (
                <li
                  className="grid gap-3 border-b border-white/15 py-7 md:grid-cols-[12rem_1fr] md:gap-10 md:py-8"
                  key={`${item.company}-${item.dates}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
                    {item.dates}
                  </p>
                  <div className="grid gap-4 lg:grid-cols-[minmax(15rem,0.8fr)_1.2fr] lg:gap-10">
                    <div>
                      <h3 className="text-base font-normal text-[#E1E0CC] sm:text-lg">
                        {item.role}
                      </h3>
                      <p className="mt-1 text-xs font-bold text-primary/75">
                        {item.company} · {item.location}
                      </p>
                    </div>
                    <p className="max-w-2xl text-xs leading-relaxed text-gray-400 sm:text-sm">
                      {item.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <footer id="contact" className="px-3 pb-3 pt-20 sm:px-4 md:px-6 md:pt-28">
        <div className="overflow-hidden rounded-3xl bg-primary px-5 py-9 text-black sm:px-8 md:px-12 md:py-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em]">
            Open to systems and cloud opportunities
          </p>
          <a
            className="mt-8 inline-flex max-w-full items-center gap-2 text-[clamp(1.35rem,4.7vw,4.5rem)] font-normal leading-none tracking-[-0.055em] hover:underline"
            href={`mailto:${EMAIL}`}
          >
            <span className="break-all">{EMAIL}</span>
            <ArrowUpRight
              className="hidden shrink-0 sm:block"
              size={42}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </a>

          <div className="mt-12 flex flex-col gap-5 border-t border-black/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold">
              <a
                className="inline-flex items-center gap-1 hover:underline"
                href="https://linkedin.com/in/mohamedsenator"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <a
                className="inline-flex items-center gap-1 hover:underline"
                href="https://github.com/s3nafps"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <a
                className="inline-flex items-center gap-1 hover:underline"
                href="/Mohamed_Senator_CV_2026.pdf"
              >
                Download CV <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-black/60">
              Algiers, Algeria · © 2026
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
