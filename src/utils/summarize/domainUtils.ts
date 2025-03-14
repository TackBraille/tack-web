
// Helper function to extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, ''); // Remove www. if present
  } catch {
    return url;
  }
};
