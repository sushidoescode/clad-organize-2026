// One-shot SFX generator for Shot Coverage Compass — calm, editorial UI palette.
const fs = require('fs');
const path = require('path');

// Requires the ls-clad plugin's build-sfx synthesis engine (not bundled here).
// Set BUILD_SFX_ENGINE to your local <ls-clad>/skills/build-sfx/tools directory.
const ENGINE = process.env.BUILD_SFX_ENGINE;
if (!ENGINE) { throw new Error('Set BUILD_SFX_ENGINE to the ls-clad build-sfx tools dir'); }
const audio = require(ENGINE);
const p = audio.sfx_presets;

const PROJECT_ASSETS_SFX = process.env.SFX_OUT || path.join(__dirname, '..', 'Assets', 'GeneratedSFX');
fs.mkdirSync(PROJECT_ASSETS_SFX, { recursive: true });

function writeWav(buf, name) {
  audio.mix_bus.masterChain(buf, { normalize: 'peak' });
  audio.WavBuilder.write(buf, path.join(PROJECT_ASSETS_SFX, name));
  console.log('wrote', name);
}

// 1. sector_tick — soft warm low click for a sector turning green.
{
  const b = p.uiClick({ character: 'soft', pitch: -3 });
  const out = audio.mix_bus.applyFx(b, { lpf: 3200, hpf: 120, gain: 0.8 });
  audio.fadeOut(out, 0.005);
  writeWav(out, 'sector_tick.wav');
}

// 2. complete_chime — gentle two-note rising bell (C5 → F5), small room, not game-y.
{
  const a = audio.synth_voices.bell(72, 0.55, 100, 220);
  const b = audio.synth_voices.bell(77, 0.6, 95, 220);
  const out = new Float32Array(Math.floor(0.85 * audio.SAMPLE_RATE));
  audio.addInto(out, a, 0, 0.6);
  audio.addInto(out, b, Math.floor(0.14 * audio.SAMPLE_RATE), 0.55);
  const fx = audio.mix_bus.applyFx(out, { hpf: 160, reverb: 'smallRoom', gain: 0.7 });
  audio.fadeOut(fx, 0.01);
  writeWav(fx, 'complete_chime.wav');
}

// 3. line_warning — muted low double-buzz, cautionary not alarming.
{
  const b = p.uiError({ pitch: -5 });
  const out = audio.mix_bus.applyFx(b, { lpf: 950, hpf: 90, gain: 0.55 });
  audio.fadeOut(out, 0.008);
  writeWav(out, 'line_warning.wav');
}

// 4. reset_whoosh — soft airy downward whoosh, things settling back.
{
  const b = p.whoosh({ duration: 0.45, direction: 'down', size: 0.6 });
  const out = audio.mix_bus.applyFx(b, { hpf: 180, lpf: 6500, gain: 0.65 });
  writeWav(out, 'reset_whoosh.wav');
}

console.log('done');
