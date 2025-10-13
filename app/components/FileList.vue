<template>
	<div class="file-list-container">
		<!-- 文件列表 -->
		<UCard v-if="files.length > 0" class="mb-2 p-2">
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
						<UIcon name="i-lucide-folder-closed" class="size-5 text-yellow-500" />
						已上传的文件
					</h3>
				</div>
			</template>
			<!-- 文件列表内容 -->
			<div v-for="file in files" :key="file.id"
				class="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
				<!-- left -->
				<div class="flex items-center gap-3 ml-4">
					<UIcon mode="svg" name="i-lucide-file-text" class="size-5 text-cyan-500" />
					<div>
						<p class="font-medium text-gray-900 dark:text-gray-100">{{ file.name }}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ formatFileSize(file.size) }} • {{ formatDate(file.uploadTime) }}
						</p>
					</div>
				</div>
				<!-- right -->
				<div class="flex items-center gap-2">
					<!-- <UTooltip text="下载文件">
						<UButton icon="i-lucide-download" color="primary" variant="ghost" size="sm"
							@click="downloadFile(file)" />
					</UTooltip> -->
					<!-- <UTooltip text="删除文件">
						<UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="sm"
							@click="deleteFile(file.id)" />
					</UTooltip> -->
				</div>
			</div>
		</UCard>

		<!-- 空状态 -->
		<div v-else class="text-center py-8">
			<UIcon name="i-lucide-file-text" class="size-16 text-gray-300 dark:text-gray-600 mb-4" />
			<p class="text-gray-500 dark:text-gray-400">暂无文件</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	import moment from 'moment';
	interface FileItem {
		id: string
		name: string
		size: number
		uploadTime: Date
		content?: string
	}

	interface Props {
		tabType: string
	}

	const props = defineProps<Props>()

	const files = ref<FileItem[]>([])

	// 初始化文件列表 - 直接使用模拟数据
	onMounted(() => {
		files.value = getMockFiles(props.tabType)
	})

	// 根据tab类型获取模拟文件
	const getMockFiles = (tabType: string): FileItem[] => {
		const baseFiles = []

		// 为不同的tab添加特定的文件
		if (tabType === 'interrupt-client') {
			baseFiles.push({
				id: `${tabType}_3`,
				name: '中断样本数据.txt',
				size: 1536,
				uploadTime: new Date('2025-10-13T14:20:00')
			})
		} else if (tabType === 'scattered-data-client') {
			baseFiles.push({
				id: `${tabType}_3`,
				name: '分散数据样本.txt',
				size: 3072,
				uploadTime: new Date('2025-10-13T15:10:00')
			})
		} else if (tabType === 'multi-source-client') {
			baseFiles.push({
				id: `${tabType}_1`,
				name: '多源数据文件1.txt',
				size: 2048,
				uploadTime: new Date('2025-10-13T14:30:00')
			})
			baseFiles.push({
				id: `${tabType}_2`,
				name: '多源数据文件2.txt',
				size: 3072,
				uploadTime: new Date('2025-10-13T15:15:00')
			})
			baseFiles.push({
				id: `${tabType}_3`,
				name: '多源数据文件3.txt',
				size: 4096,
				uploadTime: new Date('2025-10-13T16:30:00')
			})
			baseFiles.push({
				id: `${tabType}_4`,
				name: '多源数据文件4.txt',
				size: 5120,
				uploadTime: new Date('2025-10-13T17:45:00')
			})
		} else if (tabType === 'time-space-client') {
			baseFiles.push({
				id: `${tabType}_3`,
				name: '时空数据样本1.txt',
				size: 2560,
				uploadTime: new Date('2025-10-13T17:45:00')
			})
			baseFiles.push({
				id: `${tabType}_3`,
				name: '时空数据样本2.txt',
				size: 2560,
				uploadTime: new Date('2025-10-13T17:45:00')
			})
		}

		return baseFiles
	}

	// 下载文件
	const downloadFile = (file: FileItem) => {
		// 创建模拟文件内容
		const content = `这是 ${file.name} 的模拟内容\n\n文件ID: ${file.id}\n文件大小: ${formatFileSize(file.size)}\n上传时间: ${formatDate(file.uploadTime)}\n\n这是一个模拟的.txt文件内容。`

		const blob = new Blob([content], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = file.name
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
		showToast('文件下载成功', '下载通知', 'success')
	}

	// 删除文件
	// const deleteFile = (fileId: string) => {
	// 	files.value = files.value.filter(file => file.id !== fileId)
	// 	showToast('文件删除成功', '删除通知', 'success')
	// }

	// 格式化文件大小
	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	// 格式化日期
	const formatDate = (date: Date): string => {
		return moment(date).format('YYYY-MM-DD HH:mm:ss')
	}

	// 显示提示消息
	const toast = useToast()
	const showToast = (message: string, title = '通知', color: any = "primary") => {
		toast.add({
			title,
			duration: 3000,
			description: message,
			icon: 'i-lucide-bell',
			progress: false,
			color
		})
	}
</script>
