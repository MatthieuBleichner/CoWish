const ArrowIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const HeartIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
  </svg>
);

export function App() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en';
  const steps = ['gather', 'compare', 'choose'] as const;

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('metadata.title');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('metadata.description'));
  }, [language, t]);

  const selectLanguage = (nextLanguage: 'en' | 'fr') => {
    void i18n.changeLanguage(nextLanguage);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={t('navigation.home')}>
          <span className="brand-mark">
            <HeartIcon />
          </span>
          CoWish
        </a>
        <div className="header-controls">
          <a className="header-link" href="#how-it-works">
            {t('navigation.howItWorks')}
          </a>
          <div className="language-switcher" aria-label={t('navigation.language')}>
            <button
              type="button"
              className={language === 'en' ? 'active' : undefined}
              aria-pressed={language === 'en'}
              onClick={() => selectLanguage('en')}
            >
              EN<span className="visually-hidden"> — {t('navigation.english')}</span>
            </button>
            <button
              type="button"
              className={language === 'fr' ? 'active' : undefined}
              aria-pressed={language === 'fr'}
              onClick={() => selectLanguage('fr')}
            >
              FR<span className="visually-hidden"> — {t('navigation.french')}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1>
            {t('hero.titleStart')}
            <br />
            {t('hero.titleMiddle')} <em>{t('hero.titleEmphasis')}</em>
          </h1>
          <p className="intro">{t('hero.introduction')}</p>
          <a className="primary-action" href="#how-it-works">
            {t('hero.action')} <ArrowIcon />
          </a>
        </div>

        <div className="hero-art" aria-label={t('hero.illustrationLabel')}>
          <span className="shape shape-one" />
          <span className="shape shape-two" />
          <div className="choice-card card-one">
            <span>{t('hero.alexPick')}</span>
            <strong>{t('hero.cozyCabin')}</strong>
          </div>
          <div className="choice-card card-two">
            <span>{t('hero.samPick')}</span>
            <strong>{t('hero.beachHouse')}</strong>
          </div>
          <div className="favorite-card">
            <HeartIcon />
            <span>{t('hero.groupFavorite')}</span>
            <strong>{t('hero.forestHideaway')}</strong>
            <small>{t('hero.activity')}</small>
          </div>
        </div>
      </section>

      <section className="steps" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow">{t('howItWorks.eyebrow')}</p>
          <h2>{t('howItWorks.title')}</h2>
        </div>
        <div className="step-grid">
          {steps.map((step, index) => (
            <article key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{t(`howItWorks.steps.${step}.title`)}</h3>
              <p>{t(`howItWorks.steps.${step}.description`)}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <a className="brand" href="#top">
          <span className="brand-mark">
            <HeartIcon />
          </span>
          CoWish
        </a>
        <p>{t('footer.tagline')}</p>
      </footer>
    </main>
  );
}
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
