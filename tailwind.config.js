import aspectRatio from '@tailwindcss/aspect-ratio';
import flowbite from 'flowbite/plugin';
/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		colors: {
			white: '#ffffff',
			'bg-secondary': '#151212',
			primary: {
				25: '#B2E4FC',
				50: '#9FDDFB',
				100: '#8CD6FA',
				200: '#79CFF9',
				300: '#65C9F9',
				400: '#3FBBF7',
				500: '#3296C6',
				600: '#2C83AD',
				700: '#267094',
				800: '#205E7C',
				900: '#13384A'
			},
			background: {
				200: '#82889C',
				300: '#58607B',
				600: '#1C2236'
			},
			grey: {
				25: '#FCFCFD',
				300: '#D0D5DD',
				700: '#344054',
				800: '#1D2939'
			}
		},
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				roboto: ['Roboto Slab', 'serif']
			}
		}
	},
	plugins: [aspectRatio, flowbite]
};
