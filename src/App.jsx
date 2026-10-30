import { useState, useEffect, useRef } from 'react'
import './App.css'
import Shuffle from './Shuffle'

/* ─── shared Shuffle props for every section label ─── */
const LABEL_SHUFFLE = {
  tag: 'div',
  shuffleDirection: 'up',
  duration: 0.4,
  stagger: 0.025,
  ease: 'power3.out',
  threshold: 0.15,
  rootMargin: '-60px',
  triggerOnce: true,
  triggerOnHover: true,
  shuffleTimes: 2,
  animationMode: 'evenodd',
}

/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__brand">MindSync</div>
      <div className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#problem" onClick={() => setMenuOpen(false)}>Problem</a>
        <a href="#headset" onClick={() => setMenuOpen(false)}>Headset</a>
        <a href="#games" onClick={() => setMenuOpen(false)}>Exercises</a>
        <a href="#future" onClick={() => setMenuOpen(false)}>Roadmap</a>
      </div>
      <button className="nav__cta">Get Early Access</button>
      <button className="nav__hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
        <span /><span /><span />
      </button>
    </nav>
  )
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__video-wrap">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero__video"
          poster="/hero-poster.jpg"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero__overlay" />
      </div>
      <div className="hero__content">
        <span className="hero__eyebrow">NEUROTECHNOLOGY · MENTAL WELLNESS</span>
        <h1 className="hero__title">
          Observe and deal<br />with your mind<br />
          <em>with MindSync</em>
        </h1>
        <p className="hero__sub">Real-time neural intelligence for the modern therapy room.</p>
        <div className="hero__actions">
          <a href="#about" className="btn btn--primary">Discover More</a>
          <a href="#headset" className="btn btn--ghost">View Headset</a>
        </div>
      </div>
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span>SCROLL</span>
      </div>
    </section>
  )
}

/* ─── EEG HEADSET WATERMARK SVG ─── */
function EEGWatermark() {
  return (
    <svg
      className="about__watermark"
      viewBox="0 0 520 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Head outline */}
      <ellipse cx="260" cy="175" rx="118" ry="138" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" />
      {/* Crown arc of headset band */}
      <path d="M152 148 C152 70 368 70 368 148" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Left arm of headset */}
      <path d="M152 148 L142 188 Q139 210 148 222" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Right arm */}
      <path d="M368 148 L378 188 Q381 210 372 222" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Left ear cup */}
      <rect x="128" y="215" width="36" height="52" rx="14" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="146" cy="241" r="10" stroke="currentColor" strokeWidth="1.2" />
      {/* Right ear cup */}
      <rect x="356" y="215" width="36" height="52" rx="14" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="374" cy="241" r="10" stroke="currentColor" strokeWidth="1.2" />
      {/* EEG electrode dots across band */}
      {[190, 222, 260, 298, 330].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={i === 2 ? 68 : i === 1 || i === 3 ? 76 : 90} r="5" stroke="currentColor" strokeWidth="1.4" />
          <line
            x1={cx} y1={i === 2 ? 73 : i === 1 || i === 3 ? 81 : 95}
            x2={cx} y2={i === 2 ? 90 : i === 1 || i === 3 ? 96 : 108}
            stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"
          />
        </g>
      ))}
      {/* Forehead electrode strip */}
      <path d="M198 170 Q260 158 322 170" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
      {[215, 240, 260, 280, 305].map((cx, i) => (
        <circle key={`fe-${i}`} cx={cx} cy={i === 2 ? 160 : i === 1 || i === 3 ? 163 : 167} r="3.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
      ))}
      {/* EEG wave lines inside head */}
      <path d="M186 230 L200 230 L206 214 L214 248 L220 224 L228 236 L234 230 L248 230"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M272 230 L286 230 L292 214 L300 248 L306 224 L314 236 L320 230 L334 230"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      {/* Centre divider line */}
      <line x1="260" y1="214" x2="260" y2="248" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
      {/* Subtle signal arcs */}
      <path d="M230 290 Q260 278 290 290" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
      <path d="M210 305 Q260 290 310 305" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  )
}

/* ─── ABOUT ─── */
function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about__layout">
          
          {/* LEFT: Content Column */}
          <div className="about__left">
            <Shuffle {...LABEL_SHUFFLE} text="ABOUT MINDSYNC" className="section__label" textAlign="left" />
            <h2 className="section__title">
              We are building the future of <br/> 
              <span className="italic">"Mental Healthcare"</span>
            </h2>
            <div className="about__rule" />
            
            <div className="about__content">
              <p className="about__para">
                At MindSync, we leverage modern technology to better understand the human mind and how it works. Our mission is to decode brain activity and transform that data into meaningful insights that can help address the growing global mental health crisis.
              </p>
              <p className="about__para">
                Our mission is to make mental health diagnosis more objective,
                therapy more adaptive, and recovery more measurable. We believe
                that understanding the brain should not be a mystery — but a
                clear, guided process for every clinician.
              </p>
            </div>
          </div>

          {/* RIGHT: Visual Column (Redesigned) */}
          <div className="about__right">
             <div className="about__image-wrap">
                <div className="about__image-inner">
                   <img src="/MindSync Logo.png" alt="" />
                   <div className="about__overlay-text">DECIPHERING THE NEURAL CODE</div>
                </div>
                <div className="about__decorative-box" />
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── PROBLEM ─── */
function Problem() {
  const cards = [
    {
      n: '01',
      t: 'No Objective Measurement',
      d: 'Mental health diagnosis relies almost entirely on subjective self-reporting, leading to misdiagnoses, delayed care, and missed crises.',
    },
    {
      n: '02',
      t: 'Treatment Is Guesswork',
      d: 'Therapists receive no real-time feedback on how interventions affect brain state, making plans slow to adapt and hard to personalise.',
    },
    {
      n: '03',
      t: 'The Stigma Barrier',
      d: 'Patients avoid clinical environments. Without accessible monitoring tools, early deterioration goes unnoticed until a crisis emerges.',
    },
  ]

  return (
    <section className="section problem" id="problem">
      <div className="container">
        <Shuffle {...LABEL_SHUFFLE} text="THE PROBLEM" className="section__label" textAlign="center" />
        <h2 className="section__title section__title--center">
          Mental health care is operating blind
        </h2>
        <div className="problem__grid">
          {cards.map(c => (
            <div key={c.n} className="problem__card">
              <div className="problem__num">{c.n}</div>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
        <div className="solution">
          <div className="solution__label">OUR SOLUTION</div>
          <p className="solution__text">
            MindSync bridges the gap between subjective experience and objective
            data — giving clinicians a real-time neural window into their patients'
            minds through our non-invasive, comfortable headset technology and
            AI-powered analytics platform.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── HEADSET ─── */
function Headset() {
  return (
    <section className="section headset" id="headset">
      <div className="container headset__container">
        <div className="headset__image-wrap">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
            alt="Therapist using MindSync headset to analyse patient brain activity"
            className="headset__img"
          />
          <div className="headset__img-badge">
            MINDSYNC HEADSET V1
          </div>
        </div>
        <div className="headset__content">
          <Shuffle {...LABEL_SHUFFLE} text="THE DEVICE" className="section__label" textAlign="left" />
          <h2 className="section__title">
            Precision neural reading,<br />in a comfortable form
          </h2>
          <p>
            The MindSync Headset is a clinical-grade EEG device designed for
            therapy rooms. It reads brainwave patterns across 16 channels,
            transmitting live data directly to the therapist's dashboard — all
            while the patient sits in comfort.
          </p>
          <ul className="headset__features">
            {[
              '16-channel EEG with medical-grade dry sensors',
              'Real-time neural signal visualisation dashboard',
              'AI-powered cognitive state & stress detection',
              'HIPAA-compliant, end-to-end encrypted pipeline',
              'Wireless, 8-hour continuous battery life',
            ].map(f => (
              <li key={f}>
                <span className="feature__dot" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─── GAMES ─── */
function BreathingGame() {
  const [phase, setPhase] = useState('idle')
  const [timer, setTimer] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  const cycle = [
    { phase: 'inhale',  label: 'INHALE',  duration: 4 },
    { phase: 'hold',    label: 'HOLD',    duration: 4 },
    { phase: 'exhale',  label: 'EXHALE',  duration: 6 },
  ]

  const start = () => {
    let cycleIdx = 0
    let elapsed = 0
    setPhase(cycle[0].phase)
    setTimer(cycle[0].duration)
    setRunning(true)
    intervalRef.current = setInterval(() => {
      elapsed++
      const remaining = cycle[cycleIdx].duration - elapsed
      setTimer(remaining)
      if (remaining <= 0) {
        cycleIdx = (cycleIdx + 1) % cycle.length
        elapsed = 0
        setPhase(cycle[cycleIdx].phase)
        setTimer(cycle[cycleIdx].duration)
      }
    }, 1000)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setPhase('idle')
    setTimer(0)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div className="game-card">
      <div className="game-card__header">
        <h3>Breathing Exercise</h3>
        <p>Regulate your nervous system with guided breathing.</p>
      </div>
      <div className={`breath__circle breath__circle--${phase}`}>
        <div className="breath__inner">
          <span className="breath__phase-label">
            {running ? phase.toUpperCase() : 'READY'}
          </span>
          {running && <span className="breath__timer">{timer}s</span>}
        </div>
        <div className="breath__ring" />
      </div>
      <button
        className="game-btn"
        onClick={running ? stop : start}
      >
        {running ? 'End Session' : 'Begin Session'}
      </button>
    </div>
  )
}

function FocusGame() {
  const [dots, setDots]       = useState([])
  const [score, setScore]     = useState(0)
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [done, setDone]       = useState(false)
  const spawnRef   = useRef(null)
  const countRef   = useRef(null)

  const spawnDot = () => {
    const id = Date.now() + Math.random()
    const x = Math.random() * 80 + 5
    const y = Math.random() * 75 + 5
    setDots(d => [...d, { id, x, y }])
    setTimeout(() => setDots(d => d.filter(dot => dot.id !== id)), 1400)
  }

  const startGame = () => {
    setScore(0); setDots([]); setTimeLeft(30); setDone(false); setRunning(true)
    spawnRef.current = setInterval(spawnDot, 750)
    countRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(spawnRef.current)
          clearInterval(countRef.current)
          setRunning(false); setDots([]); setDone(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => () => {
    clearInterval(spawnRef.current); clearInterval(countRef.current)
  }, [])

  return (
    <div className="game-card">
      <div className="game-card__header">
        <h3>Focus Training</h3>
        <p>Tap the dots before they fade. Train your attention span.</p>
      </div>
      <div className="focus__hud">
        <span>Score <strong>{score}</strong></span>
        {running && <span>Time <strong>{timeLeft}s</strong></span>}
        {done && <span className="focus__done">Session complete!</span>}
      </div>
      <div className={`focus__arena ${running ? 'focus__arena--active' : ''}`}>
        {!running && !done && (
          <span className="focus__idle-msg">Press Start to begin</span>
        )}
        {done && (
          <div className="focus__result">
            <span className="focus__result-score">{score}</span>
            <span className="focus__result-label">dots caught</span>
          </div>
        )}
        {dots.map(dot => (
          <button
            key={dot.id}
            className="focus__dot"
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            onClick={() => { setScore(s => s + 1); setDots(d => d.filter(d2 => d2.id !== dot.id)) }}
          />
        ))}
      </div>
      <button className="game-btn" onClick={startGame} disabled={running}>
        {running ? 'Playing…' : done ? 'Play Again' : 'Start'}
      </button>
    </div>
  )
}

function Games() {
  return (
    <section className="section games" id="games">
      <div className="container">
        <Shuffle {...LABEL_SHUFFLE} text="MIND EXERCISES" className="section__label" textAlign="center" />
        <h2 className="section__title section__title--center">
          Take a moment for your mind
        </h2>
        <p className="section__sub">
          Short, science-backed exercises to reduce stress, sharpen focus,
          and bring you back to the present moment.
        </p>
        <div className="games__grid">
          <BreathingGame />
          <FocusGame />
        </div>
      </div>
    </section>
  )
}

/* ─── FUTURE GOALS ─── */
function Future() {
  const goals = [
    {
      year: '2025',
      title: 'Clinical Expansion',
      desc: 'Partner with 500+ therapy clinics across India, bringing MindSync to underserved mental health infrastructure and tier-2 cities.',
    },
    {
      year: '2026',
      title: 'AI Diagnostic Engine',
      desc: 'Launch our next-generation AI capable of detecting early markers of depression, anxiety disorders, and PTSD directly from neural patterns.',
    },
    {
      year: '2027',
      title: 'Consumer Wellness Band',
      desc: 'Release a consumer version of the MindSync wearable for at-home mental wellness monitoring, integrated with major telehealth platforms.',
    },
    {
      year: '2028',
      title: 'Global Research Network',
      desc: 'Establish an open, anonymised neural dataset to advance global research in cognitive neuroscience and accelerate breakthroughs in mental health.',
    },
  ]

  return (
    <section className="section future" id="future">
      <div className="container">
        <Shuffle {...LABEL_SHUFFLE} text="ROADMAP" className="section__label" textAlign="center" />
        <h2 className="section__title section__title--center">
          Where we are going
        </h2>
        <div className="timeline">
          {goals.map((g, i) => (
            <div key={g.year} className="timeline__item">
              <div className="timeline__year">{g.year}</div>
              <div className="timeline__spine">
                <div className="timeline__dot" />
                {i < goals.length - 1 && <div className="timeline__line" />}
              </div>
              <div className="timeline__content">
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">MindSync</div>
        <p className="footer__copy">
          © 2025 MindSync Technologies Pvt. Ltd. · All rights reserved.
        </p>
        <p className="footer__tagline">
          Bridging minds and science.
        </p>
      </div>
    </footer>
  )
}

/* ─── ROOT ─── */
export default function App() {
  return (
    <div className="app">
      <Nav />
      <Hero />
      <About />
      <Problem />
      <Headset />
      <Games />
      <Future />
      <Footer />
    </div>
  )
}