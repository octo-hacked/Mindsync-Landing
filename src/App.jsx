import { useState, useEffect, useRef } from 'react'
import './App.css'

const CONTACT_DETAILS = {
  email: '', // TODO: Add a verified, monitored contact email.
  whatsapp: '', // TODO: Add a verified WhatsApp number in international format.
}

const CONFIG = {
  demo: {
    video: '', // TODO: Set a reviewed video path and provide its poster to replace the walkthrough.
    poster: '/assets/demo-poster.webp',
  },
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
    title: '4-channel EEG R&D prototype',
    detail: 'Four-channel proof of concept.',
    status: 'current',
    statusLabel: 'Current',
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
  // TODO: Add approved headshots at these paths; initials appear until each image loads.
  { name: 'Hemendra Harsh', role: 'Electronics, design and team lead', photo: '/assets/team/hemendra.webp', initials: 'HH' },
  { name: 'Piyush Bajpai', role: 'Software and AI model training', photo: '/assets/team/piyush.webp', initials: 'PB' },
  { name: 'Clinical Advisory', role: 'Advisory board in formation', initials: 'CA' },
]

const PROTOTYPE_DIAGRAM = '/assets/prototype-diagram.webp'

const PIPELINE_STAGES = [
  // TODO: Confirm which pipeline stages qualify as working prototypes before launch.
  { title: 'EEG headset', detail: '4-channel prototype', inDevelopment: false, workingPrototype: true },
  { title: 'Signal processing', detail: 'Recorded signal preparation', inDevelopment: true },
  { title: 'CNN/RNN classifiers', detail: 'Model development', inDevelopment: true },
  { title: 'Structured estimates', detail: 'Stress, focus, and calm', inDevelopment: true },
  { title: 'LLM summary', detail: 'Uses structured estimates, not raw EEG', inDevelopment: true },
  { title: 'Clinician review', detail: 'For therapist consideration', inDevelopment: false },
]

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
    `Organisation: ${values.organisation || ''}`,
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

function EEGWaveform() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let isVisible = false
    let frame = 0
    let lastDraw = 0
    let width = 0
    let height = 0
    let pixelRatio = 1
    canvas.style.color = 'var(--accent-on-dark)'
    const traceColor = getComputedStyle(canvas).color

    const draw = time => {
      context.clearRect(0, 0, width, height)
      for (let trace = 0; trace < 4; trace += 1) {
        const baseline = height * (0.32 + trace * 0.12)
        const amplitude = height * 0.025
        const phase = reducedMotion.matches ? 0 : time * 0.00045 + trace * 1.15
        context.beginPath()
        context.lineWidth = 1
        context.strokeStyle = traceColor
        for (let x = 0; x <= width; x += 5) {
          const wave = Math.sin(x * 0.012 + phase) + Math.sin(x * 0.004 - phase * 0.55) * 0.25
          const y = baseline + wave * amplitude
          if (x === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.globalAlpha = 0.25 + trace * 0.006
        context.stroke()
        context.globalAlpha = 1
      }
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.max(1, Math.round(width * pixelRatio))
      canvas.height = Math.max(1, Math.round(height * pixelRatio))
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      draw(0)
    }

    const animate = time => {
      if (!isVisible || reducedMotion.matches || document.hidden) return
      if (time - lastDraw >= 40) {
        draw(time)
        lastDraw = time
      }
      frame = window.requestAnimationFrame(animate)
    }

    const refreshAnimation = () => {
      window.cancelAnimationFrame(frame)
      draw(0)
      if (isVisible && !reducedMotion.matches && !document.hidden) {
        frame = window.requestAnimationFrame(animate)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      refreshAnimation()
    })
    observer.observe(canvas)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', refreshAnimation)
    reducedMotion.addEventListener('change', refreshAnimation)
    resize()

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', refreshAnimation)
      reducedMotion.removeEventListener('change', refreshAnimation)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__waveform" aria-hidden="true" />
}

function OptionalImage({ src, modernSrc, alt, className = '', width, height }) {
  const [failed, setFailed] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  if (failed || !src) return null

  return (
    <picture>
      {modernSrc && !useFallback && <source srcSet={modernSrc} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (modernSrc && !useFallback) setUseFallback(true)
          else setFailed(true)
        }}
      />
    </picture>
  )
}

function TeamAvatar({ member }) {
  const [failed, setFailed] = useState(false)

  if (!member.photo || failed) {
    return <div className="team-card__initials" aria-hidden="true">{member.initials}</div>
  }

  return (
    <img
      className="team-card__photo"
      src={member.photo}
      alt={`${member.name}, ${member.role}`}
      width="800"
      height="600"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
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

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__brand">MindSync</div>
      <div id="primary-navigation" className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
        <a href="#demo" aria-current={activeSection === 'demo' ? 'true' : undefined} onClick={() => setMenuOpen(false)}>Workflow</a>
        <a href="#about" aria-current={activeSection === 'about' ? 'true' : undefined} onClick={() => setMenuOpen(false)}>About</a>
        <a href="#headset" aria-current={activeSection === 'headset' ? 'true' : undefined} onClick={() => setMenuOpen(false)}>Pipeline</a>
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
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero__background">
        <EEGWaveform />
      </div>
      <div className="hero__content">
        <h1 className="hero__title" id="hero-title">EEG insights, reviewed by clinicians.</h1>
        <p className="hero__sub">A wearable EEG and AI workflow for personal wellbeing and clinician-guided care.</p>
        <p className="hero__disclaimer">Research prototype. Not a diagnostic tool.</p>
        <div className="hero__actions">
          <a href="#contact" className="btn btn--primary" onClick={() => trackEvent('contact_open')}>Talk to us</a>
          <a href="#demo" className="btn btn--ghost">See how it works</a>
        </div>
      </div>
    </section>
  )
}

const WORKFLOW_STEPS = ['Capture', 'Process', 'Estimate', 'Summarize']
const SUMMARY_TEXT = 'Elevated estimated cognitive load.'

function tracePath(channel, progress, cleaned) {
  const baseline = 52 + channel * 74
  const points = []
  for (let index = 0; index <= 100; index += 1) {
    const x = 68 + index * 5.55
    const phase = index * 0.19 + channel * 1.17 + progress * Math.PI * 2
    let wave = Math.sin(phase) * 9 + Math.sin(index * 0.067 + channel) * 4
    if (!cleaned) {
      wave += Math.sin(index * 1.7 + channel * 3 + progress * 16) * 1.8
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
        <svg className="workflow__traces" viewBox="0 0 640 320" aria-hidden="true">
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
        <span className="workflow__pill">Unvalidated</span>
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
      <span className="workflow__pill">Example output · for therapist review · not a diagnosis</span>
    </div>
  )
}

function WorkflowWalkthrough() {
  const [activeStep, setActiveStep] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [inViewport, setInViewport] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [isHovered, setIsHovered] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [manualPause, setManualPause] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
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
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    const updateVisibility = () => setTabVisible(!document.hidden)
    mediaQuery.addEventListener('change', updatePreference)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      mediaQuery.removeEventListener('change', updatePreference)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  const animationAllowed = inViewport && tabVisible && !reducedMotion && !isHovered && !hasFocus && !videoLoaded
  const autoplayAllowed = animationAllowed && !manualPause

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
        if (autoplayAllowed) {
          progressRef.current = 0
          setAnimationProgress(0)
          setActiveStep(current => (current + 1) % WORKFLOW_STEPS.length)
        }
        return
      }
      frame = window.requestAnimationFrame(animate)
    }

    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [activeStep, animationAllowed, autoplayAllowed])

  function selectStep(step) {
    progressRef.current = 1
    setAnimationProgress(1)
    setActiveStep(step)
    setManualPause(true)
  }

  function handlePointerDown(event) {
    if (event.pointerType === 'touch') setManualPause(true)
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
          onPointerDown={handlePointerDown}
          onFocusCapture={() => setHasFocus(true)}
          onBlurCapture={handleBlur}
        >
          <div
            className="workflow__panel"
            id="workflow-panel"
            ref={panelRef}
            role="region"
            aria-label={videoLoaded ? 'MindSync workflow demonstration video' : 'Interactive illustrative MindSync workflow simulation'}
            aria-describedby="workflow-description"
          >
            {!videoLoaded && (
              <>
                <span className="workflow__badge">Illustrative simulation. Not real recordings or patient data.</span>
                <div
                  className="workflow__stage"
                  id="workflow-step-panel"
                  role="tabpanel"
                  aria-labelledby={`workflow-tab-${activeStep + 1}`}
                >
                  <WorkflowStep step={activeStep} progress={animationProgress} reducedMotion={reducedMotion} />
                </div>
              </>
            )}
            {CONFIG.demo.video && inViewport && !videoFailed && (
              <video
                className={`workflow__video ${videoLoaded ? 'workflow__video--ready' : ''}`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={CONFIG.demo.poster}
                width="1280"
                height="720"
                aria-label="MindSync workflow demonstration video"
                onCanPlay={() => setVideoLoaded(true)}
                onError={() => {
                  setVideoFailed(true)
                  setVideoLoaded(false)
                }}
                src={CONFIG.demo.video}
              />
            )}
          </div>
          {!videoLoaded && (
            <>
              <div className="workflow__controls">
                <div className="workflow__tabs" role="tablist" aria-label="Workflow steps">
                  {WORKFLOW_STEPS.map((label, index) => (
                    <button
                      className="workflow__tab"
                      id={`workflow-tab-${index + 1}`}
                      type="button"
                      role="tab"
                      aria-selected={activeStep === index}
                      aria-controls="workflow-step-panel"
                      tabIndex={activeStep === index ? 0 : -1}
                      key={label}
                      onClick={() => selectStep(index)}
                      onKeyDown={event => {
                        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                          event.preventDefault()
                          const direction = event.key === 'ArrowRight' ? 1 : -1
                          const nextStep = (index + direction + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length
                          selectStep(nextStep)
                          document.getElementById(`workflow-tab-${nextStep + 1}`)?.focus()
                        }
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="workflow__navigation">
                  <button type="button" onClick={() => selectStep((activeStep + WORKFLOW_STEPS.length - 1) % WORKFLOW_STEPS.length)}>
                    Previous step
                  </button>
                  <button type="button" onClick={() => selectStep((activeStep + 1) % WORKFLOW_STEPS.length)}>
                    Next step
                  </button>
                </div>
              </div>
            </>
          )}
          <span className="visually-hidden" id="workflow-description">
            {videoLoaded
              ? 'Workflow demonstration video. The walkthrough uses simulated signals and is not clinical evidence.'
              : 'Capture shows four simulated EEG traces with occasional signal artifacts. Process shows cleaned traces and illustrative delta, theta, alpha and beta band-power bars. Estimate shows unvalidated illustrative Stress, Focus and Calm meters. Summarize types “Elevated estimated cognitive load.” and labels it as an example output for therapist review, not a diagnosis.'}
          </span>
          <span className="visually-hidden" id="workflow-step-announcement" aria-live="polite" aria-atomic="true">
            Step {activeStep + 1} of {WORKFLOW_STEPS.length}: {WORKFLOW_STEPS[activeStep]}
          </span>
          <figcaption className="demo__caption">
            Walkthrough of the planned pipeline using simulated signals. See the roadmap for what is built and what is in development.
          </figcaption>
        </figure>
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
          <div className="about__left">
            <SectionLabel align="left">ABOUT MINDSYNC</SectionLabel>
            <h2 className="section__title">
              Giving therapists a clearer, data-informed view between sessions.
            </h2>
            <div className="about__rule" />
            <div className="about__content">
              <p className="about__para">
                MindSync is developing an EEG-based decision-support workflow that organizes brain-signal data for therapist review.
              </p>
              <p className="about__para">
                The aim is to complement a clinician's expertise, not replace conversation, assessment, or professional judgment.
              </p>
            </div>
          </div>
          <div className="about__right">
            <div className="about__image-wrap">
              <div className="about__image-inner">
                <OptionalImage
                  src="/removebglogo.png"
                  alt="MindSync brain logo"
                  className="about__logo-icon"
                  width="101"
                  height="119"
                />
                <span className="about__logo-name">MindSync</span>
              </div>
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
        <SectionLabel>THE PROBLEM</SectionLabel>
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
            recorded signals into <span className="solution__emphasis">structured estimates</span> and <span className="solution__emphasis">therapist-readable summaries</span>. This is an early research effort: outputs are not
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
  const [prototypeImageFailed, setPrototypeImageFailed] = useState(false)

  return (
    <section className="section headset" id="headset">
      <div className="container">
        <div className="headset__container">
          {!prototypeImageFailed && (
            <figure className="headset__image-wrap">
              {/* TODO: Replace this design render with a photo of the actual prototype. */}
              <span className="design-render-badge">Design render</span>
              <img
                src="/assets/prototype-headband.webp"
                alt="BioAmp EEG headband prototype design render"
                className="headset__img"
                width="1000"
                height="697"
                loading="lazy"
                decoding="async"
                onError={() => setPrototypeImageFailed(true)}
              />
              <figcaption className="headset__image-caption">BioAmp EEG headband: prototype design render.</figcaption>
            </figure>
          )}
          <div className="headset__content">
            <SectionLabel align="left">THE DEVICE</SectionLabel>
            <h2 className="section__title">
              From EEG signals<br />to therapist review
            </h2>
            <p>
              The current proof of concept uses a 4-channel EEG setup. Signal processing and CNN/RNN classifiers are being explored to organize estimates such as stress, focus, and calm for therapist review.
            </p>
          </div>
        </div>
        <ol className="pipeline" aria-label="MindSync EEG-to-clinician review pipeline">
          {PIPELINE_STAGES.map((stage, index) => (
            <li className="pipeline__item" key={stage.title}>
              <div className="pipeline__stage">
                <h3>{stage.title}</h3>
                <p>{stage.detail}</p>
                {stage.inDevelopment && <span className="pipeline__tag">In development</span>}
                {stage.workingPrototype && <span className="pipeline__tag pipeline__tag--working">R&amp;D prototype</span>}
              </div>
              {index < PIPELINE_STAGES.length - 1 && (
                <svg
                  className="pipeline__arrow"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label={`Flow from ${stage.title} to ${PIPELINE_STAGES[index + 1].title}`}
                >
                  <path d="M3 12h17m-6-6 6 6-6 6" />
                </svg>
              )}
            </li>
          ))}
        </ol>
        <p className="headset__note">LLM summaries use structured estimates, not raw EEG.</p>
      </div>
    </section>
  )
}

/* ─── PRICING ─── */
function Pricing() {
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <SectionLabel>CLINICS FIRST</SectionLabel>
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
            <span className="safety-card__eyebrow">Privacy · In development</span>
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
                  <div className="team-card__media">
                    <TeamAvatar member={member} />
                  </div>
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
      organisation: String(formData.get('organisation') || ''),
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
              <label htmlFor="contact-organisation">Organisation</label>
              <input id="contact-organisation" name="organisation" autoComplete="organization" required />
            </div>
            <div className="form-field">
              <label htmlFor="contact-role">I am a...</label>
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

function MobileContactBar() {
  const [contactVisible, setContactVisible] = useState(false)

  useEffect(() => {
    const contact = document.getElementById('contact')
    if (!contact) return undefined

    const observer = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting))
    observer.observe(contact)
    return () => observer.disconnect()
  }, [])

  if (contactVisible) return null
  return (
    <div className="mobile-contact-bar">
      <a href="#contact" onClick={() => trackEvent('contact_open')}>Talk to us</a>
    </div>
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
        <Problem />
        <Headset />
        <ProgressProof />
        <Future />
        <Safety />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  )
}