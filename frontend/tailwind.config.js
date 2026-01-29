/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // User Requested Colors
                navy: {
                    50: '#e6e8eb',
                    100: '#c1c6ce',
                    200: '#9ba4b1',
                    300: '#768294',
                    400: '#516077',
                    500: '#2c3e5a',
                    600: '#0b1f3a', // Primary Navy
                    700: '#09192e',
                    800: '#061323',
                    900: '#040d17',
                },
                sky: {
                    50: '#edf6fb',
                    100: '#d3e9f6',
                    200: '#b8dbf0',
                    300: '#9ecdeb',
                    400: '#83bfe5',
                    500: '#69b1e0',
                    600: '#4da8da', // Primary Sky Blue
                    700: '#3e86ae',
                    800: '#2e6583',
                    900: '#1f4357',
                },
                // Mapping to semantic names
                primary: {
                    DEFAULT: '#4da8da', // Sky Blue for actions
                    foreground: '#ffffff',
                    ...{
                        50: '#edf6fb',
                        100: '#d3e9f6',
                        500: '#69b1e0',
                        600: '#4da8da',
                        700: '#3e86ae',
                    }
                },
                secondary: {
                    DEFAULT: '#0b1f3a', // Navy Blue for structure
                    foreground: '#ffffff',
                    50: '#e6e8eb',
                    100: '#c1c6ce',
                    200: '#9ba4b1',
                    300: '#768294',
                    400: '#516077',
                    500: '#2c3e5a',
                    600: '#0b1f3a',
                    700: '#09192e',
                    800: '#061323',
                    900: '#040d17',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
