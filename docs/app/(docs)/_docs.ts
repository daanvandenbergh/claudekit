// app/(docs)/_docs.ts - the single configured Docs instance the routes read from.
import { Docs } from "@daanvandenbergh/scribekit";

export const docs = new Docs({
    contentDir: "./content", // folder of <slug>/en.mdx pages, resolved against the app root (process.cwd())
    basePath: "/", // the site IS the docs: pages serve at /<slug>, not /docs/<slug>. Keep in step with the route group.
    siteUrl: "https://daanvandenbergh.github.io/claudekit", // GitHub Pages project-site origin
    brandName: "Claudekit",
    // The site description: the index hero's subtitle AND the SEO meta description, so keep it one
    // sentence and under ~160 characters.
    description:
        "Reusable Claude Code skills and CLAUDE.md rules, installed as an npm package - symlink a skill, @-import a rule, and they auto-update with the package.",
    // Tab and group order for a stable sidebar. Fill from the corpus front-matter (`tab` / `group`).
    tabs: ["Guide", "Reference"],
    groups: ["Start", "Skills", "Rules"],
});
