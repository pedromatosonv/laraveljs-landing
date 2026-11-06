export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const docsRoot = base + '/docs/';

const modules = import.meta.glob('./docs/*.md', { eager: true });

export async function documentationPages() {
  const pages = await Promise.all(Object.entries(modules).map(async ([path, entry]) => {
    const slug = path.split('/').at(-1).replace(/\.md$/, '');
    return {
      ...entry.frontmatter,
      Content: entry.Content,
      slug,
      href: slug === 'installation' ? docsRoot : docsRoot + slug + '/',
      headings: (await entry.getHeadings()).filter(({ depth }) => depth === 2 || depth === 3),
    };
  }));
  return pages.sort((first, second) => first.order - second.order);
}
