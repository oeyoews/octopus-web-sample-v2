export default defineAppConfig({
	ui: {
		tabs: {
			slots: {
				indicator: 'absolute transition-[translate,width] duration-200 rounded-lg !h-1',
			},
		}, card: {
			slots: {
				body: '!p-0',
			},
		}
	}
})
