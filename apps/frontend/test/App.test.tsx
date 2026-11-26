import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../src/App';

test('introduces CoWish and its three-step journey', () => {
  const markup = renderToStaticMarkup(<App />);

  assert.match(markup, /Find the choice/);
  assert.match(markup, /Gather ideas/);
  assert.match(markup, /Compare together/);
  assert.match(markup, /Choose with confidence/);
});

test('provides navigation to the how-it-works section', () => {
  const markup = renderToStaticMarkup(<App />);

  assert.match(markup, /href="#how-it-works"/);
  assert.match(markup, /id="how-it-works"/);
});
