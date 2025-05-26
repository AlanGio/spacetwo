/**
 * Convert a display name to a URL-safe slug
 * Example: "Nike Space" -> "nike-space"
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

/**
 * Convert a URL slug back to a display name
 * Example: "nike-space" -> "Nike Space"
 */
export function fromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Get the original project name from available projects using slug
 */
export function getProjectNameFromSlug(slug: string, availableProjects: string[]): string {
  const normalizedSlug = slug.toLowerCase()

  // Find the project that matches the slug
  const matchingProject = availableProjects.find((project) => toSlug(project) === normalizedSlug)

  return matchingProject || fromSlug(slug)
}
