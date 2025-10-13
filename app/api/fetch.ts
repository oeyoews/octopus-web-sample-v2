import { createFetch } from "@vueuse/core"
const config = useRuntimeConfig()

const getBaseUrl = () => {
	const backendUrl = sessionStorage.getItem('backendUrl')
	if (backendUrl) {
		return new URL(backendUrl.replace('ws', "http")).origin
	}
	return config.public.baseURL
}

export const useMyFetch = createFetch({
	baseUrl: getBaseUrl(),
	fetchOptions: {
		headers: {
			'Content-Type': 'application/json',
		}
	},
})