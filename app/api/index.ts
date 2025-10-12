import { useMyFetch } from './fetch'


export const useCommonApi = (type: IEventType) =>
	useMyFetch('/api/kafka/clients/process-excel', {
		method: 'POST',
		body: JSON.stringify({
			clientId: type,
		}),
	})