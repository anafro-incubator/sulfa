# ✨ Sulfa

> Wanna particles with physics? Piece of cake.

**Sulfa** is a lightweight JavaScript library for spawning animated particles at any position on the page — complete with gravity, wind, velocity, and lifetime control.

[![npm](https://img.shields.io/npm/v/@sulfajs/sulfajs)](https://www.npmjs.com/package/@sulfajs/sulfajs)
[![license](https://img.shields.io/npm/l/@sulfajs/sulfajs)](./LICENSE)
[![unpkg](https://img.shields.io/badge/unpkg-available-blue)](https://unpkg.com/@sulfajs/sulfajs)

---

## Installation

```bash
npm install @sulfajs/sulfajs
```

Or use it directly via CDN (no build step needed):

```html
<script type="module" src="https://unpkg.com/@sulfajs/sulfajs"></script>
<!-- or -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@sulfajs/sulfajs"></script>
```

---

## Quick Start

```js
import { createSulfa } from '@sulfajs/sulfajs';

const sulfa = createSulfa({
    imageUriFormat: '/particles/{name}_{variation}.svg',
});

const confetti = sulfa.generator({
    name: 'confetti',
    variations: 4,        // looks for confetti_1.svg through confetti_4.svg
    sizeRange: { min: 10, max: 30 },
});

// Spawn a single particle at a random position
confetti.spawn();

// Spawn a burst of 10 particles at a specific point
confetti.splash({ x: 200, y: 400 }, 10, 8);
```

---

## How It Works

Sulfa loads SVG images from a configurable path pattern and spawns them as absolutely-positioned DOM elements. Each particle gets a random velocity, then drifts according to gravity and wind on every frame tick until its lifetime expires — at which point it removes itself cleanly from the DOM.

The image URI is resolved by replacing `{name}` and `{variation}` in the format string you provide:

```
/sulfa/confetti_1.svg   ← variation 1
/sulfa/confetti_2.svg   ← variation 2
...
```

---

## API Reference

### `createSulfa(options)`

Creates and returns a `Sulfa` instance. Also injects the required CSS into the document.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `imageUriFormat` | `string` | `'/sulfa/{name}_{variation}.svg'` | URI pattern for particle images. Use `{name}` and `{variation}` as placeholders. |

---

### `sulfa.generator(options)`

Returns a `ParticleGenerator` configured with the given options.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | required | Base name for the particle image files. |
| `variations` | `number` | required | Number of image variations available (randomly selected per particle). |
| `sizeRange` | `{ min, max }` | required | Random size range in pixels for each particle. |
| `fps` | `number` | `60` | Update rate for physics simulation. |
| `lifetime` | `number` | `5000` | How long each particle lives, in milliseconds. |
| `gravity` | `number` | `0.2` | Downward acceleration applied each frame. |
| `wind` | `number` | `0.05` | Horizontal drift applied each frame. |

---

### `generator.spawn(position?, force?)`

Spawns a single particle.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `position` | `{ x, y }` | random | Spawn coordinates in pixels. |
| `force` | `number` | `5` | Initial velocity magnitude (random direction). |

---

### `generator.splash(at?, count?, force?)`

Spawns multiple particles at once — great for click effects, celebrations, or explosions.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `at` | `{ x, y }` | random | Center of the burst. |
| `count` | `number` | `5` | Number of particles to spawn. |
| `force` | `number` | `5` | Initial velocity magnitude for each particle. |

---

## Examples

### Confetti burst on button click

```js
const sulfa = createSulfa({ imageUriFormat: '/particles/{name}_{variation}.svg' });

const confetti = sulfa.generator({
    name: 'confetti',
    variations: 6,
    sizeRange: { min: 8, max: 24 },
    lifetime: 3000,
    gravity: 0.3,
    wind: 0.02,
});

document.querySelector('#celebrate').addEventListener('click', (e) => {
    confetti.splash({ x: e.clientX, y: e.clientY }, 20, 10);
});
```

### Falling snow effect

```js
const sulfa = createSulfa({ imageUriFormat: '/particles/{name}_{variation}.svg' });

const snow = sulfa.generator({
    name: 'snowflake',
    variations: 3,
    sizeRange: { min: 5, max: 15 },
    lifetime: 8000,
    gravity: 0.05,
    wind: 0.02,
    fps: 30,
});

setInterval(() => snow.spawn(), 200);
```

---

## Browser Support

Sulfa targets Chrome 86+ and any modern browser supporting ES modules, `setInterval`, and CSS animations.

---

## License

MIT © [Anatoly Frolov (anafro)](https://github.com/anafro-incubator)
