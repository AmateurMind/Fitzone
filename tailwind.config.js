/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#14B8A6', // Teal 500
                    dark: '#0D9488',
                    light: '#2DD4BF',
                },
                secondary: {
                    DEFAULT: '#F97316', // Orange 500
                    dark: '#EA580C',
                },
                accent: {
                    purple: '#A855F7',
                    pink: '#EC4899',
                    blue: '#3B82F6',
                },
                background: {
                    DEFAULT: '#000000', // Pure Black
                    card: '#1C1C1E',    // Dark Gray Card
                    header: '#000000',
                },
                neon: {
                    red: '#FA114F',
                    green: '#A4FF00',
                    blue: '#00DBFF',
                    yellow: '#FACC15'
                }
            },
            borderRadius: {
                '3xl': '24px',
                '4xl': '32px',
            },
            fontFamily: {
                // Headings + Numbers → Satoshi (Medium / Semibold)
                // Body + Labels → Satoshi (Regular)
                'satoshi': ['Satoshi-Regular', 'system-ui', 'sans-serif'],
                'satoshi-medium': ['Satoshi-Medium', 'system-ui', 'sans-serif'],
                'satoshi-bold': ['Satoshi-Bold', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
