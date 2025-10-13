import { useMyFetch } from './fetch'


export const useCommonApi = (type: IEventType) =>
	useMyFetch('/api/kafka/clients/process-excel', {
		method: 'POST',
		body: JSON.stringify({
			clientId: type,
		}),
	})

// deprecated
export const useStopCommonApi = (type: IEventType) =>
	useMyFetch(`/api/kafka/clients/${type}/stop`, {
		method: 'POST',
	})

export const useStopAllCommonApi = () =>
	useMyFetch(`/api/kafka/clients/stopAll`, {
		method: 'POST',
	})

export const useOutPushStartCommonApi = (number: any) =>
	useMyFetch(`/extrapolate/extrapolateSwitch`, {
		method: 'POST',
		body: JSON.stringify({
			order: number,
			predictMethod: 1
		})
	})