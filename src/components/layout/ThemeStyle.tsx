
'use client';

import React from 'react';

/**
 * Client Component để xử lý việc tiêm các biến CSS chủ đề (Theme Variables).
 * Giúp tránh lỗi styled-jsx trong Server Components.
 */
export function ThemeStyle({ primaryColor, borderRadius = '0.75rem' }: { primaryColor: string; borderRadius?: string }) {
  return (
    <style jsx global>{`
      :root {
        --primary: ${primaryColor};
        --radius: ${borderRadius};
      }
    `}</style>
  );
}
