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

const steps = [
  ['01', 'Gather ideas', 'Save all the options your group is considering in one shared place.'],
  ['02', 'Compare together', 'Keep prices, useful details, and everyone’s thoughts side by side.'],
  ['03', 'Choose with confidence', 'Turn scattered opinions into a decision everyone understands.']
];

export function App() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="CoWish home">
          <span className="brand-mark">
            <HeartIcon />
          </span>
          CoWish
        </a>
        <a className="header-link" href="#how-it-works">
          How it works
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Shared choices, made simpler</p>
          <h1>
            Find the choice
            <br />
            everyone <em>loves.</em>
          </h1>
          <p className="intro">
            Bring your favorite options together, compare what matters, and make decisions as a
            group—without losing ideas in the chat.
          </p>
          <a className="primary-action" href="#how-it-works">
            Discover CoWish <ArrowIcon />
          </a>
        </div>

        <div className="hero-art" aria-label="Three people choosing their shared favorite">
          <span className="shape shape-one" />
          <span className="shape shape-two" />
          <div className="choice-card card-one">
            <span>Alex’s pick</span>
            <strong>Cozy cabin</strong>
          </div>
          <div className="choice-card card-two">
            <span>Sam’s pick</span>
            <strong>Beach house</strong>
          </div>
          <div className="favorite-card">
            <HeartIcon />
            <span>Group favorite</span>
            <strong>Forest hideaway</strong>
            <small>3 votes · 4 comments</small>
          </div>
        </div>
      </section>

      <section className="steps" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>One place for the whole decision.</h2>
        </div>
        <div className="step-grid">
          {steps.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
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
        <p>Better choices, made together.</p>
      </footer>
    </main>
  );
}
