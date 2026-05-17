import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { profile } from './data/profile';
import { translations } from './i18n/translations';
import './styles/base.css';

const LangContext = createContext();
const useLang = () => useContext(LangContext);

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useFadingTitle(titles, interval = 3500) {
  const [idx, setIdx] = useState(0);
  const [hidden, setHidden] = useState(false);
  const tid = useRef(null);
  useEffect(() => {
    const timer = setInterval(() => {
      setHidden(true);
      tid.current = setTimeout(() => {
        setIdx(i => (i + 1) % titles.length);
        setHidden(false);
      }, 450);
    }, interval);
    return () => { clearInterval(timer); clearTimeout(tid.current); };
  }, [titles, interval]);
  return { title: titles[idx], hidden };
}

function Navbar({ lang, setLang }) {
  const t = translations[lang].nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const links = [
    { href: '#about',    label: t.about },
    { href: '#skills',   label: t.skills },
    { href: '#parcours', label: t.parcours },
    { href: '#contact',  label: t.contact },
  ];
  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <a href="#hero" className="nav__logo" aria-label="Accueil">{profile.name.initials}</a>
      <ul className={`nav__links${open ? ' nav__links--open' : ''}`}>
        {links.map(l => (
          <li key={l.href}><a href={l.href} onClick={() => setOpen(false)}>{l.label}</a></li>
        ))}
      </ul>
      <div className="nav__controls">
        <button className="lang-btn" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} aria-label="Changer de langue">
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
        <button className="burger" onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  const { lang } = useLang();
  const t = translations[lang].hero;
  const { title, hidden } = useFadingTitle(profile.headline[lang]);
  return (
    <section id="hero" className="hero">
      <div className="hero__watermark" aria-hidden="true">{profile.name.initials[0]}</div>
      <div className="hero__inner">
        <p className="hero__kicker">{t.greeting}</p>
        <h1 className="hero__name">{profile.name.full}</h1>
        <p className={`hero__subtitle${hidden ? ' hero__subtitle--hidden' : ''}`}>{title}</p>
        <p className="hero__location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {profile.location[lang]}
        </p>
        <div className="hero__ctas">
          <a href={`${import.meta.env.BASE_URL}${profile.cvPath}`} download className="btn btn--primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {t.cv}
          </a>
          <a href="#contact" className="btn btn--ghost">{t.contact}</a>
        </div>
      </div>
      <div className="hero__stats">
        {profile.stats[lang].map((s, i) => (
          <div key={i} className="hero__stat">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const ICON_PATHS = {
  mail:      <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  phone:     <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>,
  pin:       <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  linkedin:  <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
  whatsapp:  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>,
};

function ContactRow({ icon, label, value, href }) {
  const content = (
    <>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        {ICON_PATHS[icon]}
      </svg>
      <div>
        <span className="contact-row__label">{label}</span>
        <span className="contact-row__value">{value}</span>
      </div>
    </>
  );
  return (
    <li className="contact-row">
      {href
        ? <a href={href} target="_blank" rel="noreferrer" className="contact-link">{content}</a>
        : content}
    </li>
  );
}

function About() {
  const { lang } = useLang();
  const t = translations[lang].about;
  const [ref, visible] = useReveal();
  return (
    <section id="about" className="section section--light">
      <div className={`container reveal${visible ? ' reveal--in' : ''}`} ref={ref}>
        <SectionLabel label={t.label} title={t.title} />
        <div className="about__grid">
          <p className="about__bio">{profile.about[lang]}</p>
          <ul className="about__contacts">
            <ContactRow icon="mail"      label="Email"       value={profile.email}          href={`mailto:${profile.email}`} />
            <ContactRow icon="phone"     label={t.phone}     value={profile.phone}          href={`tel:${profile.phone}`} />
            <ContactRow icon="pin"       label={t.location}  value={profile.location[lang]} href={null} />
            {profile.linkedin && (
              <ContactRow icon="linkedin" label="LinkedIn"   value={`linkedin.com/in/${profile.name.slug}`} href={profile.linkedin} />
            )}
            {profile.whatsapp && (
              <ContactRow icon="whatsapp" label={t.whatsapp} value={profile.phone}          href={profile.whatsapp} />
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const { lang } = useLang();
  const t = translations[lang].skills;
  const [ref, visible] = useReveal();
  return (
    <section id="skills" className="section">
      <div className={`container reveal${visible ? ' reveal--in' : ''}`} ref={ref}>
        <SectionLabel label={t.label} title={t.title} />
        <div className="skills__grid">
          {profile.skills[lang].map((cat, i) => (
            <div key={i} className="skills__cat-block">
              <h3 className="skills__cat-title">{cat.category}</h3>
              <ul className="skills__list">
                {cat.items.map((sk, j) => (
                  <li key={j} className="skill-item">
                    <span className="skill-item__name">{sk.name}</span>
                    <Dots level={sk.level} visible={visible} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <h3 className="skills__lang-title">{t.languages}</h3>
        <ul className="langs__list">
          {profile.languages[lang].map((l, i) => (
            <li key={i} className="lang-item">
              <span className="lang-item__name">{l.name}</span>
              <span className="lang-item__level">{l.level}</span>
              <div className="lang-bar" role="progressbar" aria-valuenow={l.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${l.name} — ${l.level}`}>
                <div className="lang-bar__fill" style={{ width: visible ? `${l.pct}%` : '0%' }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Parcours() {
  const { lang } = useLang();
  const t = translations[lang].parcours;
  const [ref, visible] = useReveal();
  return (
    <section id="parcours" className="section section--light">
      <div className={`container reveal${visible ? ' reveal--in' : ''}`} ref={ref}>
        <SectionLabel label={t.label} title={t.title} />
        <div className="parcours__grid">
          <div className="parcours__col">
            <h3 className="parcours__col-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              {t.exp}
            </h3>
            <div className="timeline">
              {profile.experience.map((exp, i) => (
                <article key={i} className="timeline__entry">
                  <div className="timeline__marker" />
                  <div className="timeline__card">
                    <time className="timeline__period">{exp.period}</time>
                    <h4 className="timeline__role">{exp.title[lang]}</h4>
                    <p className="timeline__org">{exp.company}<span className="timeline__type"> · {exp.type[lang]}</span></p>
                    {exp.progression && <p className="timeline__progression">{exp.progression[lang]}</p>}
                    <ul className="timeline__bullets">
                      {exp.bullets[lang].map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="parcours__col">
            <h3 className="parcours__col-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              {t.edu}
            </h3>
            <div className="timeline">
              {profile.education.map((edu, i) => (
                <article key={i} className="timeline__entry">
                  <div className="timeline__marker" />
                  <div className="timeline__card">
                    <time className="timeline__period">{edu.year}</time>
                    <h4 className="timeline__role">{edu.degree[lang]}</h4>
                    <p className="timeline__org">{edu.school} — {edu.location}</p>
                    {edu.detail && <p className="timeline__detail">{edu.detail[lang]}</p>}
                  </div>
                </article>
              ))}
              {profile.certifications.map((cert, i) => (
                <article key={`cert-${i}`} className="timeline__entry">
                  <div className="timeline__marker" style={{ background: cert.color, boxShadow: `0 0 0 2px ${cert.color}` }} />
                  <div className="timeline__card" style={{ borderLeftColor: cert.color }}>
                    <time className="timeline__period" style={{ color: cert.color }}>{cert.year}</time>
                    <h4 className="timeline__role">
                      {cert.title}
                      {cert.status === 'in_progress' && (
                        <span className="badge--progress">{t.in_progress}</span>
                      )}
                    </h4>
                    <p className="timeline__org">{cert.org}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { lang } = useLang();
  const t = translations[lang].contact;
  const [ref, visible] = useReveal();
  return (
    <section id="contact" className="section">
      <div className={`container reveal${visible ? ' reveal--in' : ''}`} ref={ref}>
        <SectionLabel label={t.label} title={t.title} />
        <div className="contact__body">
          <p className="contact__intro">{t.intro}</p>
          <div className="contact__links">
            <a href={`mailto:${profile.email}`} className="contact__cta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              {profile.email}
            </a>
            <a href={`tel:${profile.phone}`} className="contact__cta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {profile.phone}
            </a>
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact__cta">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn — {profile.name.full}
              </a>
            )}
            {profile.whatsapp && (
              <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="contact__cta">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                {t.whatsapp} — {profile.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { lang } = useLang();
  const t = translations[lang].footer;
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">{profile.name.initials}</span>
        <p className="footer__text">{t.credit} · {new Date().getFullYear()}</p>
        <a href="#hero" className="footer__top" aria-label={t.back_top}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </a>
      </div>
    </footer>
  );
}

function SectionLabel({ label, title }) {
  return (
    <header className="section-label">
      <span className="section-label__tag">{label}</span>
      <h2 className="section-label__title">{title}</h2>
    </header>
  );
}

function Dots({ level, visible, max = 5 }) {
  return (
    <span className="skill-dots" aria-label={`Niveau ${level} sur ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`dot${visible && i < level ? ' dot--filled' : ''}`} />
      ))}
    </span>
  );
}

export default function App() {
  const [lang, setLang] = useState('fr');
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return (
    <LangContext.Provider value={{ lang }}>
      <Navbar lang={lang} setLang={setLang} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Parcours />
        <Contact />
      </main>
      <Footer />
    </LangContext.Provider>
  );
}
