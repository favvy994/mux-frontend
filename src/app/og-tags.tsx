'use client';

import { Metadata } from 'next';

export function generateOGTags(title: string, description: string, image?: string): Metadata {
  return {
    openGraph: {
      title,
      description,
      type: 'website',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: 'Mux Protocol',
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function validateManifest(memory: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!memory.name) errors.push('name is required');
  if (!memory.short_name) errors.push('short_name is required');
  if (!memory.start_url) errors.push('start_url is required');
  if (memory.display && !['standalone', 'fullscreen', 'minimal-ui', 'browser'].includes(memory.display as string)) {
    errors.push('display must be one of: standalone, fullscreen, minimal-ui, browser');
  }
  return { valid: errors.length === 0, errors };
}
