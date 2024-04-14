import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontWeight: {
        inherit: 'inherit',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            'ul, ol': {
              li: {
                p: {
                  margin: 0,
                },
              },
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
