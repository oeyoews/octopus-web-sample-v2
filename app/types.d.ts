interface Log {
	timestamp: string;
	data: string;
	message: string
}

type IEventType =
	'interrupt-client' | 'scattered-data-client' | 'multi-source-client' | 'time-space-client'

// interface ITabItem {
// 	label: string
// 	icon: string
// 	slot: IEventType
// }