import { useMyFetch } from './fetch'


export const useCommonApi = (type: IEventType) =>
	useMyFetch('/api/kafka/clients/process-excel', {
		method: 'POST',
		body: JSON.stringify({
			clientId: type,
		}),
	})

export const useStopCommonApi = (type: IEventType) =>
	useMyFetch(`/api/kafka/clients/${type}/stop`, {
		method: 'POST',
	})