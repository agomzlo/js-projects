import animations from '@agomzlo11/tailwindcss-animations'
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [animations],
	safelist: [
		'border-red-500',
		'border-black-500',
		'border-blue-500',
	]
}
