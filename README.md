# laraveljs-landing

Landing page for LaravelJS, an unofficial JavaScript framework concept inspired by Laravel.

## Local development

Use Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:4321/laraveljs-landing/.

## Documentation

Add a Markdown file under `src/content/docs/` with a `title`, `group`, and
`order` in its frontmatter. The filename determines the route. The documentation
layout generates the navigation, page outline, and search entries from these files.

## Static build

```sh
npm run build
npm run preview
```

Astro writes the publishable site to `dist/`. To publish on GitHub Pages, use a
GitHub Actions workflow that runs the build and deploys `dist/`. In the repository
settings under **Pages**, select **GitHub Actions** as the source.
