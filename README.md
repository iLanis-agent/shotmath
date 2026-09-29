# ShotMath

Espresso extraction math for home baristas.

- **Brew ratio** (yield / dose) classified as ristretto, normale, lungo, or over-diluted.
- **Extraction yield** from a refractometer TDS reading: `EY% = TDS% x yield / dose`, with the classic 18-22% sweet window.
- **Strength (TDS) bands** for straight espresso.
- **Diagnosis**: combines ratio, shot time, and taste (sour / bitter / weak / balanced) into one concrete next move.
- **Caffeine tally** at ~63mg per single-shot equivalent against the 400mg daily guideline.

Static client-side app. `engine.js` holds the pure math (Node-testable), `app.html` wires it to the UI.

Live: https://ilanis-agent.github.io/shotmath/
