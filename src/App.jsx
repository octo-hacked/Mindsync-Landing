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
        <a href="#headset" onClick={() => setMenuOpen(false)}>Product</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        <a href="#safety" onClick={() => setMenuOpen(false)}>Safety</a>
        <a href="#games" onClick={() => setMenuOpen(false)}>Exercises</a>
        <a href="#future" onClick={() => setMenuOpen(false)}>Roadmap</a>
      </div>
      <a className="nav__cta" href="#pricing">View Pricing</a>
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
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero__overlay" />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">
          EEG-informed insights<br />for personal wellbeing<br />
          and <em>clinician-guided care</em>
        </h1>
        <p className="hero__sub">We are exploring EEG-informed tools for personal wellbeing and therapist review. The technology is in development and is not a diagnostic tool.</p>
        <div className="hero__actions">
          <a href="#about" className="btn btn--primary">Our Approach</a>
          <a href="#pricing" className="btn btn--ghost">Clinic Pricing</a>
        </div>
      </div>
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span>SCROLL</span>
      </div>
    </section>
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
                MindSync is developing an EEG-based decision-support workflow for therapists. Our current work explores how brain-signal data can be processed into structured information for clinician review.
              </p>
              <p className="about__para">
                The goal is to complement a clinician's expertise, not replace
                conversation, assessment, or professional judgment. The
                prototype and its potential clinical usefulness are still in
                research and validation.
              </p>
            </div>
          </div>

          {/* RIGHT: Visual Column (Redesigned) */}
          <div className="about__right">
             <div className="about__image-wrap">
                <div className="about__image-inner">
                   <img src="/icon.png" alt="" />
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
      t: 'A Complex Clinical Picture',
      d: 'Therapists combine patient-reported experiences, observation, and clinical expertise. MindSync is exploring whether EEG-derived signals can provide an additional perspective.',
    },
    {
      n: '02',
      t: 'Signals Need Context',
      d: 'Brain-signal measurements do not explain patient experience on their own. Any estimates need careful interpretation by a trained clinician.',
    },
    {
      n: '03',
      t: 'Tools Should Support Care',
      d: 'New technology should fit into a trusted therapeutic relationship and support clinician-led care—not make decisions or diagnoses for people.',
    },
  ]

  return (
    <section className="section problem" id="problem">
      <div className="container">
        <Shuffle {...LABEL_SHUFFLE} text="THE PROBLEM" className="section__label" textAlign="center" />
        <h2 className="section__title section__title--center">
          Exploring another perspective on mental wellness
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
            We are developing a wearable EEG and software workflow to turn
            recorded signals into structured estimates and therapist-readable
            summaries. This is an early research effort: outputs are not
            validated diagnoses and are intended for clinician review only.
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
            alt="Illustrative image of a person wearing an EEG headset; this is not the MindSync prototype"
            className="headset__img"
          />
          <div className="headset__img-badge">
            ILLUSTRATIVE EEG IMAGE
          </div>
        </div>
        <div className="headset__content">
          <Shuffle {...LABEL_SHUFFLE} text="THE DEVICE" className="section__label" textAlign="left" />
          <h2 className="section__title">
            From EEG signals<br />to therapist review
          </h2>
          <p>
            Our current proof of concept uses a 4-channel EEG setup. The proposed
            workflow combines signal processing and machine-learning
            classifiers to estimate states such as stress, focus, and calm.
            Those estimates are not yet validated.
          </p>
          <ul className="headset__features">
            {[
              'Current R&D prototype: 4-channel EEG',
              'Signal processing and CNN/RNN classifiers in development',
              'Planned structured estimates: stress, focus, and calm',
              'LLM summaries use structured estimates, not raw EEG',
              'For therapist review; not a diagnosis',
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

/* ─── PRICING ─── */
function Pricing() {
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <Shuffle {...LABEL_SHUFFLE} text="CLINICS FIRST" className="section__label" textAlign="center" />
        <h2 className="section__title section__title--center">
          Proposed clinic pricing
        </h2>
        <p className="section__sub">
          A clinic-led model, with the consumer version planned only after
          clinical validation.
        </p>
        <div className="pricing__grid">
          <article className="pricing-card pricing-card--featured">
            <span className="pricing-card__eyebrow">YEAR 1 · CLINICAL PACKAGE</span>
            <h3>MindSync Clinical Solution</h3>
            <p className="pricing-card__price">₹80,000 <span>one-time</span></p>
            <ul>
              <li>One MindSync EEG headset</li>
              <li>Logistics and setup</li>
              <li>Clinical onboarding and doctor training</li>
              <li>One-year premium app subscription with dashboard and planned AI summaries</li>
            </ul>
          </article>
          <article className="pricing-card">
            <span className="pricing-card__eyebrow">YEAR 2+ · PLANNED RENEWAL</span>
            <h3>Software subscription</h3>
            <p className="pricing-card__price">₹12,000 <span>per year</span></p>
            <ul>
              <li>Continued dashboard access</li>
              <li>Updated models as they are developed and validated</li>
              <li>Planned clinical summaries for therapist review</li>
            </ul>
          </article>
          <article className="pricing-card pricing-card--future">
            <span className="pricing-card__eyebrow">FUTURE · AFTER VALIDATION</span>
            <h3>Planned consumer version</h3>
            <p className="pricing-card__price">₹80,000 <span>headset</span></p>
            <p className="pricing-card__detail">Plus a planned ₹1,000/month subscription.</p>
            <p className="pricing-card__note">Not currently available. Planned only after clinical validation.</p>
          </article>
        </div>
        <p className="pricing__note">
          Pricing is proposed in the pitch deck and may change. The consumer
          version is a future plan, not an available product.
        </p>
      </div>
    </section>
  )
}

/* ─── REGULATORY & PRIVACY ─── */
function Safety() {
  return (
    <section className="section safety" id="safety">
      <div className="container">
        <Shuffle {...LABEL_SHUFFLE} text="SAFETY & PRIVACY" className="section__label" textAlign="center" />
        <h2 className="section__title section__title--center">
          Careful by design, validation first
        </h2>
        <div className="safety__grid">
          <article className="safety-card">
            <span className="safety-card__eyebrow">INTENDED INITIAL POSITIONING</span>
            <h3>Wellness and decision support</h3>
            <p>
              MindSync is being developed to provide information that may
              support a therapist's review. It is not intended to diagnose a
              condition or replace professional judgment.
            </p>
          </article>
          <article className="safety-card">
            <span className="safety-card__eyebrow">REGULATORY PATHWAY · PLANNED</span>
            <h3>Evidence before clinical claims</h3>
            <p>
              After feasibility work, the team plans to pursue applicable
              CDSCO (India) and FDA (US) clearances for specific clinical
              claims. No such clearance is claimed here.
            </p>
          </article>
          <article className="safety-card">
            <span className="safety-card__eyebrow">PRIVACY APPROACH · IN DEVELOPMENT</span>
            <h3>Consent and data protection</h3>
            <p>
              The deck describes a DPDP Act-aligned approach: explicit consent
              for active sessions, encryption across device and cloud, and
              consented, anonymized data for model improvement. These
              safeguards must be implemented and verified before being
              represented as operational.
            </p>
          </article>
        </div>
        <p className="safety__disclaimer">
          EEG state estimates and summaries are in development and require
          validation. They are not diagnoses or a substitute for clinical care.
        </p>
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
      year: 'Q4 2026',
      title: 'Prototype refinement',
      desc: 'Refine the EEG proof of concept and build a minimum viable therapist dashboard.',
    },
    {
      year: 'Q2 2027',
      title: 'Feasibility study',
      desc: 'Plan a 15-patient feasibility study and initial model training. This study is intended to assess feasibility, not clinical efficacy.',
    },
    {
      year: 'Q4 2027',
      title: 'Clinic pilot packages',
      desc: 'Prepare clinic pilot packages, subject to feasibility results and applicable ethics and regulatory requirements.',
    },
    {
      year: '2028',
      title: 'Consumer version',
      desc: 'Explore a consumer version after validation, with dry-electrode research continuing. Availability depends on evidence and applicable requirements.',
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
          © 2026 MindSync Technologies Pvt. Ltd. · All rights reserved.
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
      <Pricing />
      <Safety />
      <Games />
      <Future />
      <Footer />
    </div>
  )
}