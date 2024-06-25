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
        green: '#00bca1',
        orange: '#f98125',
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
