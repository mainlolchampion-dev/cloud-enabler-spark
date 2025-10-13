import { sanitizeHtml } from "@/lib/sanitizeHtml";

interface SanitizedHtmlProps {
  html: string | undefined;
  className?: string;
}

/**
 * Component that safely renders HTML content with XSS protection
 */
export function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
  const sanitized = sanitizeHtml(html);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
