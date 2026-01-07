import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CMS - Coaching Management System',
    short_name: 'CMS',
    description:
      'Coaching Management System is a comprehensive web application designed to streamline the operations of coaching centers. It offers features such as student enrollment, course management, attendance tracking, fee management, and performance analytics, all aimed at enhancing the efficiency and effectiveness of coaching institutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172b',
    icons: [
      {
        src: '/logo.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/logo.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
