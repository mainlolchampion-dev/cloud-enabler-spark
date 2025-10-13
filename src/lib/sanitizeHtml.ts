import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Only allows safe HTML tags and attributes
 */
export const sanitizeHtml = (dirty: string | undefined): string => {
  if (!dirty) return '';
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    ALLOW_DATA_ATTR: false,
  });
};
