# Favicon Maker

Favicon Maker is a small web app for quickly creating favicons without dealing
with manual resizing, export tooling, or asset packaging. You can design an
icon, adjust the text, colors, border, and shape, then export a ready-to-use
favicon bundle in a few clicks.

Live site: [favicon.roark.at](https://favicon.roark.at)

The project is built to simplify favicon creation for small websites, landing
pages, and quick prototypes where you want a branded icon fast.

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Radix UI](https://www.radix-ui.com/) for slider and label primitives
- [Jotai](https://jotai.org/) for lightweight state management
- [Bun](https://bun.sh/) for package management and scripts

## Development

```bash
bun install
bun run dev
bun run lint
bun run build
bun run preview
```

`bun run dev` starts the app on port `4388`.

`bun run build` creates the static export in `out/`, and `bun run preview`
serves that exported app locally.
