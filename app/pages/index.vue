<template>
  <div class="neo-bg">
    <UContainer class="relative z-10 py-4 gap-2 flex flex-col min-h-screen">
      <!-- heading -->
      <Header />
      <!-- tabs -->
      <UCard class="p-4 pb-8">
        <u-tabs :items="items" variant="link" orientation="horizontal">
          <!-- <div class="mb-2"> -->
          <template #interrupt-client="{ item }">
            <!-- 1 -->
            <div class="flex gap-2 mt-4 justify-center">
              <UButton color="success" icon="i-lucide-play" size="lg" variant="outline"
                @click="() => handleBreak(item.slot)">
                开始发送数据
              </UButton>
              <UButton icon="i-lucide-pause" color="error" variant="outline" @click="handleStop">模拟中断
              </UButton>
            </div>
          </template>
          <template #scattered-data-client="{ item }">
            <!-- 2 -->
            <div class="flex gap-2 mt-4 justify-center">
              <UButton color="info" icon="i-lucide-play" size="lg" variant="outline"
                @click="() => handleBreak(item.slot)">
                开始发送数据 </UButton>
              <UButton icon="i-lucide-pause" color="error" variant="outline" @click="handleStop">数据平滑处理
              </UButton>
            </div>
          </template>
          <template #multi-source-client="{ item }">
            <!-- 3 -->
            <div class="flex gap-2 mt-4 justify-center">
              <UButton color="error" icon="i-lucide-play" size="lg" variant="outline" @click="handleBreak(item.slot)">
                开始发送数据 </UButton>
              <UButton icon="i-lucide-pause" color="error" variant="outline" @click="handleStop">数据融合处理
              </UButton>
            </div>
          </template>
          <template #time-space-client="{ item }">
            <!-- 4 -->
            <div class="flex gap-2 mt-4 justify-center">
              <UButton color="warning" icon="i-lucide-play" size="lg" variant="outline"
                @click="() => handleBreak(item.slot)">
                开始发送数据
              </UButton>
              <UButton icon="i-lucide-pause" color="error" variant="outline" @click="handleStop">时空数据标准化
              </UButton>
            </div>
          </template>
          <!-- </div> -->
        </u-tabs>
      </UCard>
      <!-- <USeparator color="neutral" /> -->
      <!-- console terminal -->
      <!-- <UCard class="absolute bottom-8 left-0 right-0"> -->
      <UCard class="mt-4">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UButton icon="i-lucide-square-terminal" variant="ghost">
                日志面板
              </UButton>
            </div>
            <div class="flex items-center gap-2">
              <UTooltip text="清空日志" v-if="isLogVisible && cacheDebugLogs.length > 0">
                <UButton color="error" icon="i-lucide-x" variant="ghost" @click="clearLogList" />
              </UTooltip>
              <UTooltip text="显示/隐藏日志">
                <UButton color="info" :icon="isLogVisible ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  variant="ghost" @click="toggleLogVisibility" />
              </UTooltip>
              <UModal title="系统配置">
                <UTooltip text="系统配置">
                  <UButton icon="i-lucide-settings" color='success' variant="ghost">
                  </UButton>
                </UTooltip>
                <template #body>
                  <div class="space-y-2">
                    <div class="flex gap-0">
                      <UInput placeholder="WebSocket地址 (例如: 192.168.1.1:8080 或 ws://192.168.1.1:8080)"
                        class="flex-1 rounded-r-none" v-model="baseUrl" :ui="{ trailing: 'pr-0.5' }"
                        :color="isValidUrl ? 'primary' : 'error'" :variant="isValidUrl ? 'outline' : 'outline'">
                        <template v-if="baseUrl?.length" #trailing>
                          <UTooltip text="Copy to clipboard" :content="{ side: 'right' }">
                            <UButton :color="copied ? 'success' : 'neutral'" variant="link" size="sm"
                              :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'" aria-label="Copy to clipboard"
                              @click="copy(fullWsUrl)" />
                          </UTooltip>
                        </template>
                      </UInput>
                      <UInput :model-value="pathUrl"
                        class="flex-shrink-0 rounded-l-none border-l-0 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        disabled readonly />
                    </div>
                    <div v-if="!isValidUrl && urlError" class="text-red-500 text-sm flex items-center gap-1">
                      <UIcon name="i-lucide-alert-circle" class="size-4" />
                      {{ urlError }}
                    </div>
                    <div v-if="isValidUrl && baseUrl" class="text-green-500 text-sm flex items-center gap-1">
                      <UIcon name="i-lucide-check-circle" class="size-4" />
                      格式正确
                    </div>
                  </div>
                </template>
              </UModal>
            </div>
          </div>
        </template>
        <div v-if="isLogVisible" class="logs-container p-4" ref="logsContainer">
          <div v-if="cacheDebugLogs.length === 0" class="empty-logs">
            <!-- nothing ... -->
            暂无日志
          </div>
          <div v-else class="log-list">
            <div v-for="(log, index) in cacheDebugLogs.map(parseLog)" :key="index" class="log-item log-success" :class="{
              'log-success': log.message.startsWith('中断'),
              'log-cache': log.message.startsWith('散值'),
              'log-error': log.message.startsWith('多数据'),
              'log-warning': log.message.startsWith('时空')
            }">
              <div class="mr-2 font-bold mb-1" :class="{
                'text-green-500/80': log.message.startsWith('中断'),
                'text-cyan-500/80': log.message.startsWith('散值'),
                'text-red-500/80': log.message.startsWith('多数据'),
                'text-yellow-500/80': log.message.startsWith('时空')
              }">
                [{{ log.timestamp }}] {{ log.message }}
              </div>
              {{ JSON.stringify(log.data) }}
            </div>
          </div>
        </div>
        <!-- <div class="debug-actions">
          <ElButton size="small" @click="cacheDebugLogs = []">清空日志</ElButton>
        </div> -->
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  import { useWebSocket, useSessionStorage, useClipboard } from '@vueuse/core'
  import moment from 'moment';
  const config = useRuntimeConfig()
  const wsUrl = useSessionStorage('backendUrl', config.public.wsURL + '/ws/logs');
  import { useCommonApi, useStopAllCommonApi } from '~/api'

  function handleBreak(type: any) {
    useCommonApi(type).then((res: any) => {
      console.log(res.data.value)
      showToast(type)
    })
  }

  function handleStop() {
    useStopAllCommonApi().then((res: any) => {
      console.log(res.data.value)
      showToast("", '事件停止通知', 'error')
    })
  }

  function clearLogList() {
    cacheDebugLogs.value = [];
    showToast('日志已清空', '日志通知')
  }

  // Split URL into base (IP:PORT) and path parts
  const baseUrl = ref('')
  const pathUrl = '/ws/logs'
  const isValidUrl = ref(true)
  const urlError = ref('')

  import { validateIpPort } from '~/utils'
  // Extract base URL from full URL
  const extractBaseUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return `${urlObj.protocol}//${urlObj.host}`
    } catch {
      return 'http://localhost:8080'
    }
  }

  // Initialize baseUrl from stored wsUrl
  baseUrl.value = extractBaseUrl(wsUrl.value || '')

  // Computed property to reconstruct full WebSocket URL
  const fullWsUrl = computed(() => {
    // 如果baseUrl没有协议前缀，添加ws://
    if (baseUrl.value && !baseUrl.value.startsWith('ws') && !baseUrl.value.startsWith('http')) {
      return `ws://${baseUrl.value}${pathUrl}`
    }
    // 如果baseUrl有http前缀，转换为ws前缀
    if (baseUrl.value && baseUrl.value.startsWith('http://')) {
      return baseUrl.value.replace('http://', 'ws://') + pathUrl
    }
    if (baseUrl.value && baseUrl.value.startsWith('https://')) {
      return baseUrl.value.replace('https://', 'wss://') + pathUrl
    }
    return `${baseUrl.value}${pathUrl}`
  })

  // Watch for changes in baseUrl and update wsUrl
  watch(baseUrl, (newBaseUrl) => {
    const validation = validateIpPort(newBaseUrl || '')
    isValidUrl.value = validation.isValid
    urlError.value = validation.error

    if (validation.isValid) {
      // 如果baseUrl没有协议前缀，添加ws://
      if (newBaseUrl && !newBaseUrl.startsWith('ws') && !newBaseUrl.startsWith('http')) {
        wsUrl.value = `ws://${newBaseUrl}${pathUrl}`
      } else if (newBaseUrl && newBaseUrl.startsWith('http://')) {
        wsUrl.value = newBaseUrl.replace('http://', 'ws://') + pathUrl
      } else if (newBaseUrl && newBaseUrl.startsWith('https://')) {
        wsUrl.value = newBaseUrl.replace('https://', 'wss://') + pathUrl
      } else {
        wsUrl.value = `${newBaseUrl}${pathUrl}`
      }
    }
  })
  const { copy, copied } = useClipboard()
  const { status, data, close } = useWebSocket(wsUrl, {
    heartbeat: false,
    autoReconnect: {
      retries: 1,
      delay: 1000,
      onFailed() {
        console.warn('Failed to connect WebSocket after 1 retries')
      },
    },
  })

  function parseLog(log: string): Log {
    return JSON.parse(log, (key, value) => {
      if (key === 'timestamp') {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
      return value
    });
  }

  const logsContainer = ref<HTMLElement>()
  const cacheDebugLogs = ref<string[]>([]);
  const isLogVisible = ref(true);

  // 切换日志显示/隐藏
  const toggleLogVisibility = () => {
    isLogVisible.value = !isLogVisible.value;
  }

  // 自动滚动到底部的函数
  const scrollToBottom = () => {
    nextTick(() => {
      if (logsContainer.value) {
        logsContainer.value.scrollTop = logsContainer.value.scrollHeight
      }
    })
  }

  watch(data, (newData) => {
    // console.log(JSON.parse(newData).data);
    // cacheDebugLogs.value = [...cacheDebugLogs.value, newData]
    cacheDebugLogs.value.push(newData);
    // 新日志添加后自动滚动到底部
    scrollToBottom()
  });
  const items = [{
    label: '1. 中断、外推功能',
    icon: 'i-lucide-zap',
    slot: 'interrupt-client'
  },
  {
    label: '2. 平滑功能',
    icon: 'i-lucide-sliders',
    slot: "scattered-data-client"
  },
  {
    label: '3. 融合功能',
    icon: 'i-lucide-layers',
    slot: 'multi-source-client'
  },
  {
    label: '4. 时空统一功能',
    icon: 'i-lucide-clock',
    slot: 'time-space-client'
  },
  ]
  const toast = useToast();

  function showToast(message: string, title = '事件通知', color: any = "primary") {
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

<style scoped lang="css">
  @import './index.css';
</style>