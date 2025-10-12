import { createFetch } from "@vueuse/core"
const config = useRuntimeConfig()

export const useMyFetch = createFetch({
	baseUrl: config.public.baseURL,
	fetchOptions: {
		headers: {
			'Content-Type': 'application/json',
		}
	},
})