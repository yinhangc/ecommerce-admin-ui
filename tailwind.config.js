import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontWeight: {
        inherit: 'inherit',
      },
      colors: {
        navy: '#11224d',
        blue: '#4747ff',
        green: '#20ad97',
        orange: '#f7824d',
        red: '#ee1720',
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
