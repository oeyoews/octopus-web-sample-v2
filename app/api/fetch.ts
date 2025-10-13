import { createFetch } from "@vueuse/core"
const config = useRuntimeConfig()

const getBaseUrl = () => {
	const backendUrl = sessionStorage.getItem('backendUrl')
	return backendUrl || config.public.baseURL
}

export const useMyFetch = createFetch({
	baseUrl: getBaseUrl(),
	fetchOptions: {
		headers: {
			'Content-Type': 'application/json',
		}
	},
})