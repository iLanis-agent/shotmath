// ShotMath engine - espresso extraction math. Pure functions, no DOM.
(function (root) {
  'use strict';

  // Brew ratio = beverage mass / dry dose.
  function brewRatio(doseG, yieldG) {
    if (doseG <= 0) throw new Error('dose must be positive');
    return yieldG / doseG;
  }

  // Ratio classification bands.
  function ratioClass(ratio) {
    if (ratio < 1.0) return 'under-extracted concentrate - did the shot stall?';
    if (ratio < 1.5) return 'ristretto';
    if (ratio < 2.5) return 'normale';
    if (ratio < 4.0) return 'lungo';
    return 'over-diluted - this is coffee-flavored water';
  }

  // Extraction yield % = TDS(%) * yield(g) / dose(g). Needs a refractometer reading.
  function extractionYield(tdsPct, yieldG, doseG) {
    if (doseG <= 0) throw new Error('dose must be positive');
    return tdsPct * yieldG / doseG;
  }

  // EY bands (espresso): 18-22 is the classic sweet window.
  function eyBand(ey) {
    if (ey < 16) return 'way under - sour and salty, grind finer';
    if (ey < 18) return 'under-extracted - sweetness left in the puck';
    if (ey <= 22) return 'sweet window - balanced extraction';
    if (ey <= 24) return 'pushing over - dry edges appearing';
    return 'over-extracted - bitter and ashy, grind coarser';
  }

  // Strength (TDS) bands for straight espresso.
  function strengthBand(tds) {
    if (tds < 6) return 'thin - watery body';
    if (tds < 7.5) return 'light - filter-like espresso';
    if (tds <= 12) return 'classic espresso strength';
    if (tds <= 14) return 'heavy - syrupy and intense';
    return 'muddy - likely channeling or a stalled shot';
  }

  // Shot diagnosis from ratio + time + taste. Returns advice string.
  function diagnose(ratio, timeSec, taste) {
    var fast = timeSec < 20, slow = timeSec > 35;
    if (taste === 'sour') {
      if (fast) return 'Sour and fast: under-extracted. Grind finer to slow the flow, or pull a longer ratio.';
      if (slow) return 'Sour but slow: likely channeling. Check distribution and tamp level before touching the grind.';
      return 'Sour at normal speed: under-extracted. Grind a touch finer or raise dose 0.5g.';
    }
    if (taste === 'bitter') {
      if (slow) return 'Bitter and slow: over-extracted. Grind coarser to speed the flow, or shorten the ratio.';
      if (fast) return 'Bitter but fast: uneven extraction (channeling). Improve puck prep before changing grind.';
      return 'Bitter at normal speed: over-extracted. Grind a touch coarser or drop water temperature 2C.';
    }
    if (taste === 'weak') {
      if (ratio > 2.5) return 'Weak with a long ratio: pull shorter - cut the yield, not the dose.';
      return 'Weak at a normal ratio: raise the dose or grind finer for more strength.';
    }
    // balanced
    if (fast) return 'Tastes balanced but ran fast: you may be leaving sweetness behind. Try 2-3 clicks finer.';
    if (slow) return 'Tastes balanced but ran slow: fine if the cup is good, but watch for astringency.';
    return 'Balanced in the window: log this recipe and stop touching things.';
  }

  // Caffeine tally: shots * ~63mg per single-shot equivalent. doubles = 2.
  function caffeineMg(singleShotEquivs) {
    return singleShotEquivs * 63;
  }
  function caffeineBand(mg) {
    if (mg <= 0) return 'no caffeine yet';
    if (mg < 200) return 'well under the 400mg daily guideline';
    if (mg <= 400) return 'within the 400mg daily guideline';
    return 'over the 400mg daily guideline - switch to decaf';
  }

  // Milk drink water/milk targets by style for a cup size (ml). Returns milk ml.
  function milkFor(style, cupMl, espressoMl) {
    var rest = Math.max(0, cupMl - espressoMl);
    var ratios = { cortado: 1.0, flatwhite: 2.0, cappuccino: 2.5, latte: 4.0 };
    var m = ratios[style];
    if (!m) throw new Error('unknown style');
    // milk volume as ratio of espresso volume, capped at what the cup holds
    return Math.min(rest, espressoMl * m);
  }

  var api = {
    brewRatio: brewRatio,
    ratioClass: ratioClass,
    extractionYield: extractionYield,
    eyBand: eyBand,
    strengthBand: strengthBand,
    diagnose: diagnose,
    caffeineMg: caffeineMg,
    caffeineBand: caffeineBand,
    milkFor: milkFor
  };
  root.ShotMath = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
