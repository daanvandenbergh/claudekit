/**
 * scribekit-readme-hero :: hero settings (this project's brand)
 * Seeded from scribekit's hero.settings.template.js. Only `brand.eyebrow` is set to this
 * project; the gradient palette is kept at scribekit's DEFAULT colours (as requested).
 */

// Default scribekit palette - kept as-is (default gradient colours).
const c = {
    pink: "255, 194, 224",
    lilac: "201, 184, 255",
    peach: "255, 214, 168",
    blue: "184, 224, 255",
    violet: "143, 107, 255",
    violetMid: "107, 75, 214",
    violetDeep: "74, 47, 174",
};

const rgb = (t) => `rgb(${t})`;
const fade = (t) => `rgba(${t}, 0)`;

export const brand = {
    font: { family: "Space Grotesk", url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" },
    badge: "◆",
    accent: "107, 75, 214",
    eyebrow: "CLAUDEKIT",
};

export const gradients = [
    {
        name: "radial-mesh",
        css: [
            `radial-gradient(120% 120% at 12% 8%, ${rgb(c.pink)} 0%, ${fade(c.pink)} 46%)`,
            `radial-gradient(90% 90% at 88% -6%, ${rgb(c.lilac)} 0%, ${fade(c.lilac)} 42%)`,
            `radial-gradient(120% 120% at 96% 96%, ${rgb(c.peach)} 0%, ${fade(c.peach)} 46%)`,
            `radial-gradient(120% 120% at 4% 104%, ${rgb(c.blue)} 0%, ${fade(c.blue)} 48%)`,
            `linear-gradient(135deg, ${rgb(c.violet)} 0%, ${rgb(c.violetMid)} 60%, ${rgb(c.violetDeep)} 100%)`,
        ].join(", "),
    },
    {
        name: "diagonal-ribbon",
        css: `linear-gradient(118deg, ${rgb(c.violetDeep)} 0%, ${rgb(c.violetMid)} 14%, ${rgb(c.violet)} 28%, ${rgb(c.lilac)} 46%, ${rgb(c.pink)} 64%, ${rgb(c.peach)} 82%, ${rgb(c.blue)} 100%)`,
    },
    {
        name: "aurora-glow",
        css: [
            `radial-gradient(120% 100% at 50% -18%, ${rgb(c.lilac)} 0%, ${fade(c.lilac)} 55%)`,
            `radial-gradient(100% 90% at 92% 112%, ${rgb(c.pink)} 0%, ${fade(c.pink)} 52%)`,
            `radial-gradient(90% 90% at 8% 104%, ${rgb(c.blue)} 0%, ${fade(c.blue)} 48%)`,
            `linear-gradient(160deg, ${rgb(c.violet)} 0%, ${rgb(c.violetMid)} 55%, ${rgb(c.violetDeep)} 100%)`,
        ].join(", "),
    },
    {
        name: "soft-sweep",
        css: `linear-gradient(140deg, ${rgb(c.violetDeep)} 0%, ${rgb(c.violet)} 30%, ${rgb(c.lilac)} 56%, ${rgb(c.pink)} 80%, ${rgb(c.peach)} 100%)`,
    },
    {
        name: "horizon-glow",
        css: [
            `radial-gradient(130% 90% at 100% 100%, ${rgb(c.peach)} 0%, ${fade(c.peach)} 40%)`,
            `radial-gradient(120% 100% at 100% 100%, ${rgb(c.pink)} 0%, ${fade(c.pink)} 55%)`,
            `radial-gradient(110% 90% at 0% 0%, ${rgb(c.blue)} 0%, ${fade(c.blue)} 46%)`,
            `linear-gradient(120deg, ${rgb(c.violetMid)} 0%, ${rgb(c.violet)} 45%, ${rgb(c.lilac)} 100%)`,
        ].join(", "),
    },
    {
        name: "veil",
        css: [
            `radial-gradient(120% 100% at 8% 10%, ${rgb(c.blue)} 0%, ${fade(c.blue)} 44%)`,
            `radial-gradient(120% 110% at 100% 30%, ${rgb(c.pink)} 0%, ${fade(c.pink)} 50%)`,
            `radial-gradient(110% 100% at 55% 115%, ${rgb(c.peach)} 0%, ${fade(c.peach)} 48%)`,
            `linear-gradient(125deg, ${rgb(c.violet)} 0%, ${rgb(c.violetMid)} 55%, ${rgb(c.violetDeep)} 100%)`,
        ].join(", "),
    },
];
