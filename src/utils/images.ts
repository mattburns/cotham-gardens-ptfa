// Resolve an image path from frontmatter (e.g. "src/assets/images/foo.jpg")
// to its processed ImageMetadata, shared by components and the layout.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/*'
);

export async function resolveImage(
  path?: string
): Promise<ImageMetadata | undefined> {
  if (!path) return undefined;
  const key = path.startsWith('/') ? path : `/${path}`;
  const loader = images[key];
  return loader ? (await loader()).default : undefined;
}
