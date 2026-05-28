import adapter from '@sveltejs/adapter-vercel'


//TODO: (rm, if) > runtime, not using vercel
const config = {
  kit: {
    adapter: adapter({
			runtime: 'nodejs22.x'
		}),
  },
}

export default config;