interface CSPDirective {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'font-src'?: string[];
  'connect-src'?: string[];
  'frame-src'?: string[];
  'object-src'?: string[];
  'base-uri'?: string[];
  'form-action'?: string[];
  'frame-ancestors'?: string[];
  'report-uri'?: string[];
  'report-to'?: string[];
}

export function buildCSPHeader(directives: CSPDirective): string {
  const parts = Object.entries(directives).map(([directive, sources]) => {
    if (sources && sources.length > 0) {
      return `${directive} ${sources.join(' ')}`;
    }
    return directive;
  });
  return parts.join('; ');
}

export function getNextConfigCSP(): Record<string, string[]> {
  return {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'", "https:"],
    'connect-src': ["'self'", process.env.NEXT_PUBLIC_API_URL || "https://api.mux.protocol"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'report-uri': ['/api/csp-report'],
  };
}

export function validateHeaders(headers: Record<string, string[]>): { valid: boolean; missing: string[] } {
  const required = ['x-content-type-options', 'x-frame-options', 'strict-transport-security'];
  const missing = required.filter((h) => !headers[h]);
  return { valid: missing.length === 0, missing };
}
