import { Vector2D, vectors } from "./geometry";
import { Position, positions } from "./position";
import { randomInRange, randomInt } from "./random";
import { since } from "./time";

const SULFA_PARTICLE_CLASSNAME = '_sulfa-particle';
const SULFA_PARTICLE_KEYFRAMES = '_sulfa-particle';

export type Range = {
    min: number;
    max: number;
}

export type SulfaOptions = {
    imageUriFormat?: string;
}

export function createSulfa({
    imageUriFormat = '/sulfa/{name}_{variation}.svg',
}: SulfaOptions): Sulfa {
    const sulfa = new Sulfa({
        imageUriFormat,
    });
    document.body.style.position = 'relative !important';
    document.head.insertAdjacentHTML('beforeend', `
        <!-- Styles injected by Sulfa -->
        <style>
            .${SULFA_PARTICLE_CLASSNAME} {
                position: absolute;
                animation: ${SULFA_PARTICLE_KEYFRAMES} 2s ease-in-out infinite alternate-reverse;
                z-index: 1000;
                pointer-events: none;
            }

            @keyframes ${SULFA_PARTICLE_KEYFRAMES} {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        </style>
    `);
    return sulfa;
}

class Sulfa {
    private readonly imageUriFormat: string;

    public constructor({
        imageUriFormat,
    }: Required<SulfaOptions>) {
        this.imageUriFormat = imageUriFormat;
    }

    public getImageUri(particleName: string, particleVariation: number): string {
        return this.imageUriFormat
            .replaceAll(/(\{name\})/g, particleName)
            .replaceAll(/\{variation\}/g, particleVariation.toString());
    }

    public generator({
        name,
        variations = 1,
        sizeRange = { min: 20, max: 30 },
        lifetime = 7500,
        gravity = 200,
        wind = 0,
    }: ParticleGeneratorOptions): ParticleGenerator {
        return new ParticleGenerator(this, { name, variations, sizeRange, lifetime, gravity, wind });
    }
}

export type ParticleGeneratorOptions = {
    name: string;
    variations?: number;
    sizeRange?: Range;
    lifetime?: number;
    gravity?: number;
    wind?: number;
};

class ParticleGenerator {
    private readonly sulfa: Sulfa;
    private readonly name: string;
    private readonly variations: number;
    private readonly sizeRange: Range;
    private readonly lifetime: number;
    private readonly gravity: number;
    private readonly wind: number;

    public constructor(sulfa: Sulfa, {
        name,
        variations,
        sizeRange,
        lifetime,
        gravity,
        wind,
    }: Required<ParticleGeneratorOptions>) {
        this.sulfa = sulfa;
        this.name = name;
        this.variations = variations;
        this.sizeRange = sizeRange;
        this.lifetime = lifetime;
        this.gravity = gravity;
        this.wind = wind;
    }

    public nextVariationUri(): string {
        const variation = this.nextVariation();
        return this.sulfa.getImageUri(this.name, variation);
    }

    public spawn(position: Position | undefined = undefined, force: number = 5): void {
        if (position === undefined) {
            position = positions.random();
        }

        const el = document.createElement("img");
        const size = randomInRange(this.sizeRange);
        const uri = this.nextVariationUri();

        el.classList.add(SULFA_PARTICLE_CLASSNAME);
        el.style.width = `${size}px`;
        el.src = uri;

        const particle = new Particle({
            el,
            force,
            position,
            lifetime: this.lifetime,
            gravity: this.gravity,
            wind: this.wind,
        });

        particle.spawn();
    }

    public splash(at: Position | undefined = undefined, count: number = 5, force: number = 5): void {
        at ??= positions.random();
        for (let i = 0; i < count; i++) {
            this.spawn(at, force);
        }
    }

    private nextVariation(): number {
        return randomInt(this.variations) + 1;
    }
}

export type ParticleOptions = {
    el: HTMLImageElement;
    position?: Position;
    lifetime?: number;
    force?: number;
    gravity: number;
    wind: number;
};

class Particle {
    private spawndate: number | null;
    private lifetime: number;
    private el: HTMLImageElement;
    private position: Position;
    private velocity: Vector2D;
    private gravity: number;
    private wind: number;
    private updatedate: number | undefined;

    public constructor({
        el,
        force,
        lifetime,
        position,
        gravity,
        wind,
    }: Required<ParticleOptions>) {
        this.el = el;
        this.spawndate = null;
        this.lifetime = lifetime;
        this.position = { ...(position ?? positions.random()) };
        this.velocity = vectors.random(force);
        this.gravity = gravity;
        this.wind = wind;
    }

    private isExpired(): boolean {
        if (this.spawndate === null) {
            throw new Error(`The particle is not spawned.`);
        }

        return since(this.spawndate) > this.lifetime;
    }

    private update(): void {
        const now = Date.now();

        this.updatedate ??= now;
        const delta = (now - this.updatedate) / 1000;

        this.velocity.x += this.wind * delta;
        this.velocity.y += this.gravity * delta;

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;

        this.el.style.left = `${this.position.x}px`;
        this.el.style.top = `${this.position.y}px`;

        this.updatedate = now;

        if (this.isExpired()) {
            this.despawn();
        } else {
            window.requestAnimationFrame(() => this.update());
        }
    }

    public spawn(): void {
        this.spawndate = Date.now();
        this.updatedate = this.spawndate;
        requestAnimationFrame(() => this.update());
        document.body.appendChild(this.el);
    }

    private despawn(): void {
        this.el.remove();
    }
}

window.createSulfa = createSulfa;
export default createSulfa;
