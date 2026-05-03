// @vitest-environment jsdom
// Okolje jsdom simulira brskalnik (localStorage) v Node.js procesu

import { describe, it, expect, beforeEach } from 'vitest';
import { getWatchlist, saveWatchlist } from '../features/watchlist/storage';

describe('Watchlist storage – shranjevanje opazovanega seznama', () => {
  // Pred vsakim testom počistimo localStorage, da testi so neodvisni
  beforeEach(() => {
    localStorage.clear();
  });

  // Ko ni shranjenih podatkov, mora funkcija vrniti prazno polje
  it('vrne prazno polje, ko localStorage nima podatkov', () => {
    const result = getWatchlist();
    expect(result).toEqual([]);
  });

  // Shranjen seznam tiker-jev mora biti natančno vrnjen
  it('shrani in vrne seznam tiker-jev', () => {
    saveWatchlist(['AAPL', 'MSFT', 'TSLA']);
    const result = getWatchlist();
    expect(result).toEqual(['AAPL', 'MSFT', 'TSLA']);
  });

  // Drugi klic saveWatchlist mora prepisati prejšnje podatke
  it('prepiše obstoječ seznam z novim', () => {
    saveWatchlist(['AAPL', 'GOOG']);
    saveWatchlist(['AMZN']);
    expect(getWatchlist()).toEqual(['AMZN']);
  });

  // Shranjevanje praznega polja ne sme povzročiti napake
  it('shrani in vrne prazno polje brez napake', () => {
    saveWatchlist([]);
    expect(getWatchlist()).toEqual([]);
  });

  // Z enim tiker-jem mora seznam imeti točno en element
  it('shrani seznam z enim tiker-jem', () => {
    saveWatchlist(['NVDA']);
    const result = getWatchlist();
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('NVDA');
  });

  // Vrstni red tiker-jev se mora ohraniti po shranjevanju
  it('ohrani vrstni red tiker-jev', () => {
    const tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    saveWatchlist(tickers);
    expect(getWatchlist()).toEqual(tickers);
  });

  // Ticker s posebnimi znaki mora biti pravilno serializiran in deserializiran
  it('pravilno shrani ticker s piko v imenu', () => {
    saveWatchlist(['BRK.B']);
    expect(getWatchlist()[0]).toBe('BRK.B');
  });

  // Večkratno branje brez pisanja mora vračati enako vrednost
  it('večkratno branje vrača enak rezultat', () => {
    saveWatchlist(['SPY', 'QQQ']);
    const prvi = getWatchlist();
    const drugi = getWatchlist();
    expect(prvi).toEqual(drugi);
  });
});
