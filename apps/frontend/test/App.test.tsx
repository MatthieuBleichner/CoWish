import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../src/App';
import i18n from '../src/i18n';
import { cowishTheme } from '../src/theme';

test('exposes the CoWish visual identity through the shared MUI theme', () => {
  assert.equal(cowishTheme.palette.primary.main, '#eb674e');
  assert.equal(cowishTheme.palette.background.default, '#fbf8f1');
  assert.equal(cowishTheme.typography.fontFamily, "'DM Sans', sans-serif");
});

test('introduces CoWish and its three-step journey in English', async () => {
  await i18n.changeLanguage('en');
  const markup = renderToStaticMarkup(<App />);

  assert.match(markup, /Find the choice/);
  assert.match(markup, /Gather ideas/);
  assert.match(markup, /Compare together/);
  assert.match(markup, /Choose with confidence/);
});

test('renders the page in French', async () => {
  await i18n.changeLanguage('fr');
  const markup = renderToStaticMarkup(<App />);

  assert.match(markup, /Trouvez le choix/);
  assert.match(markup, /Rassemblez vos idées/);
  assert.match(markup, /Comparez ensemble/);
  assert.match(markup, /Choisissez sereinement/);
});

test('provides navigation and an accessible language switcher', async () => {
  await i18n.changeLanguage('en');
  const markup = renderToStaticMarkup(<App />);

  assert.match(markup, /href="#how-it-works"/);
  assert.match(markup, /id="how-it-works"/);
  assert.match(markup, /aria-label="Language"/);
  assert.match(markup, /aria-pressed="true"/);
});
