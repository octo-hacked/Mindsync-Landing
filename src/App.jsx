import { useState, useEffect, useRef } from 'react'
import './App.css'

const CONTACT_DETAILS = {
  email: '', // TODO: Add a verified, monitored contact email.
  whatsapp: '', // TODO: Add a verified WhatsApp number in international format.
}

const CONFIG = {
  showEvidenceHeading: false, // TODO: Restore "Evidence before claims" after verified results or study data are available.
}

const PROGRESS_ITEMS = [
  // TODO: Add verified prototype milestones as { id, kind, title, detail }.
  // TODO: Add confirmed mentor/advisor names and roles as { id, kind: 'Mentor / advisor', title, detail }.
  // TODO: Add an approved pilot/institution as { id, kind: 'Pilot / institution', title, detail }.
  // TODO: Add any results with method and date as { id, kind: 'Preliminary', title, detail }.
]

const PROGRESS_STATUS_ITEMS = [
  {
    id: 'prototype',
    title: 'EEG headset design',
    detail: 'Four-channel design render.',
    status: 'in-development',
    statusLabel: 'design stage',
  },
  {
    id: 'classifiers',
    title: 'Signal processing and CNN/RNN classifiers',
    detail: 'Development underway.',
    status: 'in-development',
    statusLabel: 'In development',
  },
  {
    id: 'feasibility-study',
    title: '15-patient feasibility study: feasibility, not clinical efficacy',
    detail: 'Target: Q2 2027.',
    status: 'planned',
    statusLabel: 'Planned',
  },
  {
    id: 'clinical-advisory',
    title: 'Clinical advisory board',
    detail: 'In formation.',
    status: 'in-development',
    statusLabel: 'In development',
  },
]

const TEAM_MEMBERS = [
  { name: 'Hemendra Harsh', role: 'Electronics, design and team lead', photo: '/assets/team/hemendra.webp', initials: 'HH' },
  { name: 'Piyush Bajpai', role: 'Software and AI model training', photo: '/assets/team/piyush.webp', initials: 'PB' },
  { name: 'Clinical advisory', role: 'Board in formation', initials: 'CA' },
]

const PROTOTYPE_DIAGRAM = '/assets/prototype-diagram.webp'

const PIPELINE_STAGES = [
  { title: 'EEG headset', detail: 'Four-channel design render', status: 'design stage' },
  { title: 'Signal processing', detail: 'Signal preparation methods', status: 'In development' },
  { title: 'CNN/RNN classifiers', detail: 'Model development', status: 'In development' },
  { title: 'Structured estimates', detail: 'Stress, focus, and calm', status: 'In development' },
  { title: 'LLM summary', detail: 'Work focuses on structured estimates, not raw EEG', status: 'In development' },
  { title: 'Clinician review', detail: 'For therapist consideration', status: 'Planned' },
]

const PIPELINE_VISUAL_STEPS = [0, 1, 1, 2, 3, 3]

function SectionLabel({ children, align = 'center' }) {
  return <p className={`section__label section__label--${align}`}>{children}</p>
}

function trackEvent(eventName, details = {}) {
  // TODO: Connect consent-aware, privacy-respecting analytics here; never send form fields or EEG data.
  void eventName
  void details
}

function hasProgressContent() {
  return PROGRESS_STATUS_ITEMS.length > 0
    || PROGRESS_ITEMS.some(item => item?.id && item.title && item.detail)
    || TEAM_MEMBERS.some(member => member?.name && member.role)
}

function getUtmAttribution() {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign']
  const params = new URLSearchParams(window.location.search)
  const fromUrl = Object.fromEntries(keys.map(key => [key, params.get(key)]).filter(([, value]) => value))

  try {
    const stored = JSON.parse(sessionStorage.getItem('mindsync_utm') || '{}')
    const previous = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {}
    const attribution = Object.fromEntries(
      keys
        .map(key => [key, fromUrl[key] || previous[key]])
        .filter(([, value]) => typeof value === 'string' && value.length > 0),
    )
    if (Object.keys(fromUrl).length) sessionStorage.setItem('mindsync_utm', JSON.stringify(attribution))
    return attribution
  } catch (error) {
    console.warn('Unable to read or store UTM attribution in session storage.', error)
    return fromUrl
  }
}

function buildMailto(values = {}, attribution = {}) {
  const body = [
    `Name: ${values.name || ''}`,
    `Email: ${values.email || ''}`,
    `I am a: ${values.role || ''}`,
    `Message: ${values.message || ''}`,
    '',
    `UTM source: ${attribution.utm_source || ''}`,
    `UTM medium: ${attribution.utm_medium || ''}`,
    `UTM campaign: ${attribution.utm_campaign || ''}`,
  ].join('\n')
  const query = new URLSearchParams({ subject: 'MindSync enquiry', body })
  return `mailto:${encodeURIComponent(CONTACT_DETAILS.email)}?${query.toString()}`
}

function TeamAvatar({ member }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="team-card__avatar-row">
      {member.photo && !failed
        ? (
            <img
              className="team-card__avatar"
              src={member.photo}
              alt={`${member.name}, ${member.role}`}
              width="96"
              height="96"
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
            />
          )
        : <div className="team-card__avatar team-card__avatar--fallback" aria-hidden="true">{member.initials}</div>}
    </div>
  )
}
/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const links = [...document.querySelectorAll('#primary-navigation a[href^="#"], .nav__cta[href^="#"]')]
    const sections = links
      .map(link => document.getElementById(link.getAttribute('href').slice(1)))
      .filter(Boolean)
    if (!sections.length) return undefined

    const updateActiveSection = () => {
      const navHeight = document.querySelector('.nav')?.getBoundingClientRect().height ?? 0
      const activeLine = navHeight + 20
      const current = sections.find(section => {
        const bounds = section.getBoundingClientRect()
        return bounds.top <= activeLine && bounds.bottom > activeLine
      })
      setActiveSection(current?.id ?? '')
    }

    let observer
    const observeSections = () => {
      observer?.disconnect()
      const navHeight = document.querySelector('.nav')?.getBoundingClientRect().height ?? 0
      const activeLine = navHeight + 20
      const bottomInset = Math.max(0, window.innerHeight - activeLine - 1)
      observer = new IntersectionObserver(updateActiveSection, {
        rootMargin: `-${activeLine}px 0px -${bottomInset}px 0px`,
      })
      sections.forEach(section => observer.observe(section))
      updateActiveSection()
    }

    observeSections()
    window.addEventListener('resize', observeSections)
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', observeSections)
      window.removeEventListener('scroll', updateActiveSection)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined

    const closeOnEscape = event => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`} aria-label="Primary">
      <div className="nav__brand">MindSync</div>
      <div id="primary-navigation" className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
        <a href="#demo" aria-current={activeSection === 'demo' ? 'true' : undefined} onClick={() => setMenuOpen(false)}>How it works</a>
        <a href="#about" aria-current={activeSection === 'about' ? 'true' : undefined} onClick={() => setMenuOpen(false)}>About</a>
        {hasProgressContent() && <a href="#progress" aria-current={activeSection === 'progress' ? 'true' : undefined} onClick={() => setMenuOpen(false)}>Progress</a>}
        <a href="#future" aria-current={activeSection === 'future' ? 'true' : undefined} onClick={() => setMenuOpen(false)}>Roadmap</a>
        <a href="#safety" aria-current={activeSection === 'safety' ? 'true' : undefined} onClick={() => setMenuOpen(false)}>Safety</a>
        <a href="#pricing" aria-current={activeSection === 'pricing' ? 'true' : undefined} onClick={() => setMenuOpen(false)}>Pricing</a>
      </div>
      <a
        className="nav__cta"
        href="#contact"
        aria-current={activeSection === 'contact' ? 'true' : undefined}
        onClick={() => trackEvent('contact_open')}
      >
        Talk to us
      </a>
      <button
        className="nav__hamburger"
        type="button"
        onClick={() => setMenuOpen(open => !open)}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
      >
        <span /><span /><span />
      </button>
    </nav>
  )
}

/* ─── HERO ─── */
function Hero() {
  const hardwareStatus = PROGRESS_STATUS_ITEMS.find(item => item.id === 'prototype')

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <div className="hero__copy">
          <h1 className="hero__title" id="hero-title">We’re building a wearable EEG and AI workflow for therapist review.</h1>
          <p className="hero__sub">Our work focuses on organizing EEG signals into structured summaries for therapists to consider.</p>
          {hardwareStatus && (
            <p className="hero__status">
              <span className="hero__status-label">{hardwareStatus.statusLabel}</span>
              {hardwareStatus.title}
            </p>
          )}
          <p className="hero__disclaimer">Research prototype. Not a diagnostic tool.</p>
          <div className="hero__actions">
            <a href="#contact" className="btn btn--primary" onClick={() => trackEvent('contact_open')}>Talk to us</a>
            <a href="#demo" className="btn btn--ghost">See how it works</a>
          </div>
        </div>
        <figure className="hero__render-wrap">
          <span className="design-render-badge">Design render</span>
          <img
            src="/assets/prototype-headband.webp"
            alt="Design render of a BioAmp four-channel EEG headband, not a photograph of a working device"
            className="hero__render"
            width="1000"
            height="697"
            fetchPriority="high"
          />
        </figure>
      </div>
    </section>
  )
}

const SUMMARY_TEXT = 'Elevated estimated cognitive load.'

function tracePath(channel, progress, cleaned) {
  const profiles = [
    { amplitude: 7, frequency: 0.15, secondaryAmplitude: 3.2, noise: 0.9 },
    { amplitude: 12, frequency: 0.21, secondaryAmplitude: 2.4, noise: 1.4 },
    { amplitude: 9, frequency: 0.13, secondaryAmplitude: 4, noise: 1.1 },
    { amplitude: 15, frequency: 0.25, secondaryAmplitude: 2.8, noise: 1.6 },
  ]
  const profile = profiles[channel]
  const baseline = 52 + channel * 74
  const points = []
  for (let index = 0; index <= 100; index += 1) {
    const x = 68 + index * 5.55
    const phase = index * profile.frequency + channel * 1.17 + progress * Math.PI * 2
    let wave = Math.sin(phase) * profile.amplitude
      + Math.sin(index * (0.055 + channel * 0.009) + channel) * profile.secondaryAmplitude
    if (!cleaned) {
      wave += Math.sin(index * (0.71 + channel * 0.08) + channel * 3 + progress * 16) * profile.noise
      const spikePosition = (channel * 19 + Math.floor(progress * 100)) % 83 + 8
      const spikeDistance = Math.abs(index - spikePosition)
      if (spikeDistance < 2) wave += (2 - spikeDistance) * (channel % 2 ? -17 : 17)
    } else {
      wave *= 0.72
    }
    points.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${(baseline + wave).toFixed(1)}`)
  }
  return points.join(' ')
}

function WorkflowStep({ step, progress, reducedMotion }) {
  if (step < 2) {
    const cleaned = step === 1
    return (
      <div className={`workflow__signals ${cleaned ? 'workflow__signals--processed' : ''}`}>
        <svg
          className="workflow__traces"
          viewBox="0 0 640 320"
          role="img"
          aria-label="Illustrative simulation of four EEG-like signal traces; these are not real recordings"
        >
          {[0, 1, 2, 3].map(channel => (
            <g key={channel}>
              <text x="8" y={57 + channel * 74}>CH{channel + 1}</text>
              <path d={tracePath(channel, reducedMotion ? 0 : progress, cleaned)} />
            </g>
          ))}
        </svg>
        {cleaned && (
          <div className="workflow__bands" aria-hidden="true">
            {[['Delta', 68], ['Theta', 48], ['Alpha', 76], ['Beta', 57]].map(([name, value]) => (
              <div className="workflow__band" key={name}>
                <span>{name}</span>
                <div className="workflow__band-track">
                  <span style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (step === 2) {
    const estimates = [['Stress', 68], ['Focus', 54], ['Calm', 42]]
    return (
      <div className="workflow__estimates">
        <span className="workflow__pill">Illustrative estimate</span>
        {estimates.map(([label, value]) => (
          <div className="workflow__estimate" key={label}>
            <span>{label}</span>
            <div className="workflow__meter" aria-hidden="true">
              <span style={{ width: `${value * (reducedMotion ? 1 : progress)}%` }} />
            </div>
            <span>{Math.round(value * (reducedMotion ? 1 : progress))}%</span>
          </div>
        ))}
      </div>
    )
  }

  const visibleLength = reducedMotion ? SUMMARY_TEXT.length : Math.ceil(SUMMARY_TEXT.length * progress)
  return (
    <div className="workflow__summary">
      <p>
        {SUMMARY_TEXT.slice(0, visibleLength)}
        {!reducedMotion && <span className="workflow__cursor" aria-hidden="true" />}
      </p>
      <span className="workflow__pill">Example output · for therapist review</span>
    </div>
  )
}

function WorkflowWalkthrough() {
  const [activeStage, setActiveStage] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [inViewport, setInViewport] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [canPauseForInteraction, setCanPauseForInteraction] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const [isHovered, setIsHovered] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const panelRef = useRef(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      setInViewport(entry.isIntersecting)
    })
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    const updatePointer = () => setCanPauseForInteraction(pointerQuery.matches)
    const updateVisibility = () => setTabVisible(!document.hidden)
    mediaQuery.addEventListener('change', updatePreference)
    pointerQuery.addEventListener('change', updatePointer)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      mediaQuery.removeEventListener('change', updatePreference)
      pointerQuery.removeEventListener('change', updatePointer)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  const pauseForInteraction = canPauseForInteraction && (isHovered || hasFocus)
  const animationAllowed = inViewport && tabVisible && !reducedMotion && !pauseForInteraction

  useEffect(() => {
    if (!animationAllowed) return undefined

    let frame = 0
    let lastUpdate = 0
    const startTime = performance.now() - progressRef.current * 4000

    const animate = now => {
      const progress = Math.min((now - startTime) / 4000, 1)
      progressRef.current = progress
      if (now - lastUpdate >= 50 || progress === 1) {
        setAnimationProgress(progress)
        lastUpdate = now
      }

      if (progress === 1) {
        if (animationAllowed) {
          progressRef.current = 0
          setAnimationProgress(0)
          setActiveStage(current => (current + 1) % PIPELINE_STAGES.length)
        }
        return
      }
      frame = window.requestAnimationFrame(animate)
    }

    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [activeStage, animationAllowed])

  function selectStage(stage) {
    progressRef.current = 0
    setAnimationProgress(0)
    setActiveStage(stage)
  }

  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false)
  }

  return (
    <section className="section demo" id="demo" aria-labelledby="demo-title">
      <div className="container">
        <SectionLabel>THE WORKFLOW</SectionLabel>
        <h2 className="section__title section__title--center" id="demo-title">How it works</h2>
        <figure
          className="demo__figure"
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onFocusCapture={() => setHasFocus(true)}
          onBlurCapture={handleBlur}
        >
          <div
            className="workflow__panel"
            id="workflow-panel"
            ref={panelRef}
            role="region"
            aria-label="Interactive illustrative MindSync workflow simulation"
            aria-describedby="workflow-description"
          >
            <span className="workflow__badge">Illustrative simulation. Not real recordings or patient data.</span>
            <div
              className="workflow__stage"
              id="workflow-step-panel"
            >
              <WorkflowStep
                step={PIPELINE_VISUAL_STEPS[activeStage]}
                progress={animationProgress}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>
          <span className="visually-hidden" id="workflow-description">
            The six pipeline controls select the matching workflow stage. Capture and signal processing show simulated EEG-like traces; classifiers reuse the processed-trace view with frequency-band bars; structured estimates show illustrative meters; the LLM summary and clinician review show example text. All visuals are illustrative, with no real EEG recordings or patient data.
          </span>
          <span className="visually-hidden" id="workflow-step-announcement" aria-live="polite" aria-atomic="true">
            Stage {activeStage + 1} of {PIPELINE_STAGES.length}: {PIPELINE_STAGES[activeStage].title}
          </span>
          <figcaption className="demo__caption">
            Illustrative simulation across the six workflow stages. Select a stage below to explore its representation.
          </figcaption>
        </figure>
        <ol className="pipeline" aria-label="MindSync EEG-to-clinician review pipeline">
          {PIPELINE_STAGES.map((stage, index) => (
            <li className="pipeline__item" key={stage.title}>
              <button
                className="pipeline__stage"
                id={`pipeline-control-${index}`}
                type="button"
                aria-pressed={activeStage === index}
                aria-controls="workflow-step-panel"
                onClick={() => selectStage(index)}
              >
                <span className="pipeline__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="pipeline__stage-title">{stage.title}</span>
                <span className="pipeline__stage-detail">{stage.detail}</span>
                <span className={`pipeline__tag pipeline__tag--${stage.status.toLowerCase().replaceAll(' ', '-')}`}>
                  {stage.status}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ─── ABOUT ─── */
function About() {
  const cards = [
    {
      n: '01',
      t: 'A complex clinical picture',
      d: 'Therapists combine patient-reported experiences, observation, and clinical expertise. MindSync is exploring whether EEG-derived signals can provide an additional perspective.',
    },
    {
      n: '02',
      t: 'Signals need context',
      d: 'Brain-signal measurements do not explain patient experience on their own. Any estimates need careful interpretation by a trained clinician.',
    },
    {
      n: '03',
      t: 'Tools should support care',
      d: 'New technology should fit into a trusted therapeutic relationship and support clinician-led care.',
    },
  ]

  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionLabel>ABOUT MINDSYNC & THE PROBLEM</SectionLabel>
        <h2 className="section__title section__title--center">
          A clearer, data-informed view between sessions
        </h2>
        <p className="about__intro">
          MindSync is developing an EEG-based decision-support workflow that organizes brain-signal data for therapist review, aiming to complement—not replace—a clinician's conversation, assessment, and professional judgment.
        </p>
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
          <div className="solution__label">WHAT WE'RE EXPLORING</div>
          <p className="solution__text">
            We are exploring how wearable EEG and software could organize brain-signal data into structured estimates and therapist-readable summaries.
          </p>
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
        <SectionLabel>PROPOSED PILOT PRICING</SectionLabel>
        <h2 className="section__title section__title--center">
          Proposed pilot pricing
        </h2>
        <div className="pricing__grid">
          <article className="pricing-card pricing-card--featured">
            <span className="pricing-card__eyebrow">PROPOSED CLINIC PACKAGE</span>
            <span className="progress-status-pill progress-status-pill--planned">Planned</span>
            <h3>MindSync clinical solution</h3>
            <p className="pricing-card__price">₹80,000 <span>one-time</span></p>
            <ul>
              <li>One MindSync EEG headset</li>
              <li>Logistics and setup</li>
              <li>Clinical onboarding and doctor training</li>
              <li>One-year premium app subscription with dashboard and planned AI summaries</li>
            </ul>
          </article>
          <article className="pricing-card">
            <span className="pricing-card__eyebrow">PROPOSED RENEWAL</span>
            <span className="progress-status-pill progress-status-pill--planned">Planned</span>
            <h3>Software subscription</h3>
            <p className="pricing-card__price">₹12,000 <span>per year</span></p>
            <ul>
              <li>Continued dashboard access</li>
              <li>Updated models as they are developed and validated</li>
              <li>Planned clinical summaries for therapist review</li>
            </ul>
          </article>
          <article className="pricing-card pricing-card--future">
            <span className="pricing-card__eyebrow">FUTURE · NOT AVAILABLE</span>
            <h3>Consumer version</h3>
            <p className="pricing-card__price">₹80,000 <span>headset</span></p>
            <p className="pricing-card__detail">Plus a ₹1,000/month subscription.</p>
            <p className="pricing-card__note">Subject to validation and applicable requirements.</p>
          </article>
        </div>
        <p className="pricing__note">
          Illustrative figures for a potential clinic pilot; all figures are proposed, subject to change, and not yet available. No product or pilot package is currently available.
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
        <SectionLabel>SAFETY & PRIVACY</SectionLabel>
        <h2 className="section__title section__title--center">
          Careful by design, validation first
        </h2>
        <div className="safety__grid">
          <article className="safety-card">
            <span className="safety-card__eyebrow">INTENDED INITIAL POSITIONING</span>
            <h3>Wellness and decision support</h3>
            <p>
              MindSync is being developed to organize information that may
              support a therapist's review and professional judgment.
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
            <span className="safety-card__eyebrow">PRIVACY · IN DEVELOPMENT</span>
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

/* ─── PROGRESS & PROOF ─── */
function ProgressProof() {
  const items = PROGRESS_ITEMS.filter(item => item?.id && item.title && item.detail)
  const members = TEAM_MEMBERS.filter(member => member?.name && member.role)
  const hasOtherItems = PROGRESS_STATUS_ITEMS.length > 0 || items.length > 0 || members.length > 0

  if (!hasOtherItems) return null

  return (
    <section className="section progress" id="progress" aria-labelledby="progress-title">
      <div className="container">
        <SectionLabel>PROGRESS</SectionLabel>
        <h2 className="section__title section__title--center" id="progress-title">
          {CONFIG.showEvidenceHeading ? 'Evidence before claims' : 'Where we are today'}
        </h2>
        {hasOtherItems && (
          <div className="progress__grid">
            <PrototypeDiagram />
            <ul className="progress-status-list" aria-label="MindSync progress status">
              {PROGRESS_STATUS_ITEMS.map(item => (
                <li className="progress-status-card" key={item.id}>
                  <div className="progress-status-card__heading">
                    <h3>{item.title}</h3>
                    <span className={`progress-status-pill progress-status-pill--${item.status}`}>
                      {item.statusLabel}
                    </span>
                  </div>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {items.length > 0 && (
          <div className="progress__items">
            {items.map(item => (
              <article className="progress-card" key={item.id}>
                <span className="progress-card__kind">{item.kind}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                {item.kind === 'Preliminary' && <span className="progress-card__preliminary">Preliminary</span>}
              </article>
            ))}
          </div>
        )}
        {members.length > 0 && (
          <div className="team">
            <h3 className="team__title">Team</h3>
            <div className="team__grid">
              {members.map(member => (
                <article className="team-card" key={member.name}>
                  <TeamAvatar member={member} />
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function PrototypeDiagram() {
  const [failed, setFailed] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!dialogOpen) return undefined

    const dialog = dialogRef.current
    if (!dialog) return undefined

    const previousOverflow = document.body.style.overflow
    const handleClose = () => {
      setDialogOpen(false)
      window.requestAnimationFrame(() => triggerRef.current?.focus())
    }
    const handleCancel = event => {
      event.preventDefault()
      dialog.close()
    }
    const handleKeydown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        dialog.close()
      }
    }
    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('cancel', handleCancel)
    dialog.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
    dialog.showModal()

    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('cancel', handleCancel)
      dialog.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [dialogOpen])

  if (failed) return null

  return (
    <>
      <figure className="progress-card progress-card--image">
        <span className="design-render-badge">Design render</span>
        <button
          className="progress-card__image-trigger"
          type="button"
          aria-label="Enlarge proposed electrode layout image"
          aria-haspopup="dialog"
          ref={triggerRef}
          onClick={() => setDialogOpen(true)}
        >
          <img
            src={PROTOTYPE_DIAGRAM}
            alt="Proposed electrode layout with FP1, FP2, mastoid references, and GND"
            width="1176"
            height="633"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        </button>
        <figcaption>Design render: proposed electrode layout (FP1, FP2, mastoid references, GND).</figcaption>
      </figure>
      <dialog
        className="progress-image-dialog"
        ref={dialogRef}
        aria-label="Enlarged proposed electrode layout"
        onClose={() => {
          if (dialogOpen) setDialogOpen(false)
        }}
      >
        <span className="design-render-badge">Design render</span>
        <button
          className="progress-image-dialog__close"
          type="button"
          aria-label="Close enlarged electrode layout"
          onClick={() => dialogRef.current?.close()}
        >
          Close
        </button>
        <img
          src={PROTOTYPE_DIAGRAM}
          alt="Proposed electrode layout with FP1, FP2, mastoid references, and GND"
          width="1176"
          height="633"
        />
      </dialog>
    </>
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
        <SectionLabel>ROADMAP</SectionLabel>
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

function Contact() {
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const formData = new FormData(form)
    if (formData.get('website')) {
      setStatus({ type: 'success', message: 'Thanks for getting in touch.' })
      return
    }

    const values = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      role: String(formData.get('role') || ''),
      message: String(formData.get('message') || ''),
    }
    const attribution = getUtmAttribution()
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim()

    if (!endpoint) {
      window.location.href = buildMailto(values, attribution)
      setStatus({ type: 'info', message: 'Your email app should open with your message. Send it there to complete your enquiry.' })
      trackEvent('contact_form_mailto')
      return
    }

    setSending(true)
    setStatus({ type: 'loading', message: 'Sending your message…' })
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, ...attribution }),
      })
      if (!response.ok) throw new Error(`Contact endpoint returned ${response.status}`)
      setStatus({ type: 'success', message: 'Thanks. Your message has been sent.' })
      form.reset()
      trackEvent('contact_form_submitted')
    } catch (error) {
      console.error('Unable to submit the MindSync contact form.', error)
      setStatus({ type: 'error', message: 'We could not send your message. Please try again or use the email link.' })
    } finally {
      setSending(false)
    }
  }

  const whatsappNumber = CONTACT_DETAILS.whatsapp.replace(/\D/g, '')
  const directEmail = buildMailto()

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact__layout">
        <div className="contact__intro">
          <SectionLabel align="left">CONTACT</SectionLabel>
          <h2 className="section__title" id="contact-title">Talk to us</h2>
          <p>Share a little about yourself and what you would like to explore with MindSync.</p>
          <div className="contact__links">
            <a className="btn btn--dark" href={directEmail}>Email us</a>
            {whatsappNumber && (
              <a className="btn btn--outline-dark" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            )}
          </div>
        </div>
        <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__grid">
            <div className="form-field">
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" autoComplete="name" required />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="form-field">
              <label htmlFor="contact-role">I am a</label>
              <select id="contact-role" name="role" required defaultValue="">
                <option value="" disabled hidden>Select one</option>
                <option>Clinician</option>
                <option>Investor</option>
                <option>Researcher</option>
                <option>Student/Peer</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-field form-field--full">
              <label htmlFor="contact-message">Message <span>(optional)</span></label>
              <textarea id="contact-message" name="message" rows="4" />
            </div>
          </div>
          <div className="contact-form__honeypot" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input id="contact-website" name="website" tabIndex="-1" autoComplete="off" />
          </div>
          <div className="contact-form__actions">
            <button className="btn btn--dark" type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send enquiry'}
            </button>
            <p className={`contact-form__status contact-form__status--${status.type}`} role="status" aria-live="polite">
              {status.type === 'error' && <span className="contact-form__status-icon" aria-hidden="true">!</span>}
              {status.message}
            </p>
          </div>
        </form>
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
        <p className="footer__disclaimer">MindSync is an early-stage research prototype. It is not a diagnostic tool.</p>
        <p className="footer__tagline">
          Bridging minds and science.
        </p>
      </div>
    </footer>
  )
}

/* ─── ROOT ─── */
export default function App() {
  useEffect(() => {
    getUtmAttribution()
  }, [])

  return (
    <div className="app">
      <Nav />
      <main>
        <Hero />
        <WorkflowWalkthrough />
        <About />
        <ProgressProof />
        <Future />
        <Safety />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}