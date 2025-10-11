<template>
  <div class="neo-bg">
    <UContainer class="relative z-10 py-4 gap-2 flex flex-col min-h-screen">

      <!-- heading -->
      <header class="mb-8 text-center select-none">
        <div class="inline-flex items-center justify-center">
          <UIcon name="i-lucide-cpu" class="i-lucide-cpu size-6 mr-3 text-cyan-400 rotating-icon"></UIcon>
          <h1
            class="neo-glow text-3xl md:text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">

            数据引接功能面板
          </h1>
          <UIcon name="i-lucide-cpu" class="i-lucide-cpu size-6 ml-3 text-cyan-400"></UIcon>
        </div>
        <div
          class="flowing-line h-0.5 w-48 mx-auto mt-4 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent blur-[1px]">
        </div>
      </header>

      <!-- tabs -->
      <u-tabs :items variant="link" orientation="horizontal"> </u-tabs>
      <USeparator color="neutral" />
      <div class="debug-actions flex gap-2">
      </div>
      <!-- console terminal -->
      <UCard class="absolute bottom-8 left-0 right-0">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UButton icon="i-lucide-square-terminal" variant="ghost">
                日志面板
              </UButton>
            </div>
            <div class="flex items-center gap-2">
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
                  <UInput placeholder="WebSocket URL" class="w-full" v-model="wsUrl" :ui="{ trailing: 'pr-0.5' }">
                    <template v-if="wsUrl?.length" #trailing>
                      <UTooltip text="Copy to clipboard" :content="{ side: 'right' }">
                        <UButton :color="copied ? 'success' : 'neutral'" variant="link" size="sm"
                          :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'" aria-label="Copy to clipboard"
                          @click="copy(wsUrl)" />
                      </UTooltip>
                    </template>
                  </UInput>
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
            <div v-for="(log, index) in cacheDebugLogs.map(parseLog)" :key="index" class="log-item log-success">
              <!-- :class="{
              'log-success': log.includes('✅'),
              'log-cache': log.includes('🎯'),
              'log-error': log.includes('❌')
            }" -->
              <div class="font-bold text-cyan-400 italic mr-2">
                [{{ moment(log.timestamp).format('YYYY-MM-DD HH:mm:ss') }}]
              </div>
              {{ log.data }}
            </div>
          </div>
        </div>
        <!-- <div class="debug-actions">
          <ElButton size="small" @click="cacheDebugLogs = []">清空日志</ElButton>
        </div> -->
      </UCard>
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1"> -->
      <!-- <div> -->
      <!-- <UTooltip text="Open on GitHub">
          <UButton icon="i-lucide-wifi" label="Show toast" color="primary" variant="outline" @click="showToast" />
        </UTooltip> -->
      <!-- </div> -->

      <!-- <div>
        <UModal title="Modal with title">
          <UButton icon="i-lucide-circle-question-mark" color="info" variant="ghost" />
          <template #body>
            your content here
          </template>
</UModal>
</div> -->

      <!-- 其余网格单元为空，占位使用，可按需替换为真实卡片/组件 -->
      <!-- </div> -->
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  import { useWebSocket, useLocalStorage, useClipboard } from '@vueuse/core'
  import moment from 'moment';
  const wsUrl = useLocalStorage('backendUrl', 'ws://192.168.75.61:8080/ws/logs');
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
    return JSON.parse(log);
  }

  const logsContainer = ref<HTMLElement>()
  const cacheDebugLogs = ref<string[]>([]);
  const isLogVisible = ref(false);

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
  const items = [
    {
      label: '中断、外推功能',
      icon: 'i-lucide-zap',
      slot: 'account'
    },
    {
      label: '平滑功能',
      icon: 'i-lucide-sliders',
      slot: 'password'
    },
    {
      label: '融合功能',
      icon: 'i-lucide-layers',
      slot: 'account'
    },
    {
      label: '时空统一功能',
      icon: 'i-lucide-clock',
      slot: 'account'
    },
  ]
  const toast = useToast()

  function showToast() {
    toast.add({
      title: 'Uh oh! Something went wrong.',
      duration: 1500,
      description: 'There was a problem with your request.',
      icon: 'i-lucide-wifi',
      progress: false,
      color: 'primary'
    })
  }
</script>

<style scoped lang="css">
  .neo-bg {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(1200px 600px at 80% -10%, rgba(34, 211, 238, 0.14), transparent 60%),
      /* cyan-400 */
      radial-gradient(800px 400px at -10% 20%, rgba(59, 130, 246, 0.12), transparent 60%),
      /* blue-500 */
      linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
  }

  .neo-bg::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04)) 0 0/100% 1px no-repeat,
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent 40px),
      repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent 40px);
    mask: radial-gradient(circle at 50% 20%, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 1) 70%);
    pointer-events: none;
  }

  .neo-glow {
    position: relative;
    text-shadow: 0 0 18px rgba(34, 211, 238, 0.35), 0 0 36px rgba(99, 102, 241, 0.25);
  }

  .flowing-line {
    position: relative;
    overflow: hidden;
  }

  .flowing-line::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.6), transparent);
    animation: lineFlow 2s ease-in-out infinite;
  }

  @keyframes lineFlow {
    0% {
      left: -100%;
    }

    50% {
      left: 100%;
    }

    100% {
      left: 100%;
    }
  }

  .logs-container {
    height: 25vh;
    overflow-y: auto;
    /* border: 1px solid rgba(156, 163, 175, 0.2); */
    /* border-radius: 8px; */
    /* padding: 12px; */
    /* background: rgba(0, 0, 0, 0.05); */
    /* 自定义滚动条样式 */
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.4) transparent;

    /* Webkit浏览器滚动条样式 */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(156, 163, 175, 0.4);
      border-radius: 3px;
      transition: background 0.2s ease;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(156, 163, 175, 0.6);
    }

    .empty-logs {
      padding: 20px;
      text-align: center;
    }

    .log-list {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .log-item {
        padding: 6px 8px;
        font-size: 12px;
        line-height: 1.4;
        border-left: 3px solid;
        border-radius: 4px;

        &.log-success {
          background: rgb(103 194 58 / 10%);
          border-left-color: rgb(103 194 58);
        }

        &.log-cache {
          background: rgb(64 158 255 / 10%);
          border-left-color: rgb(64 158 255);
        }

        &.log-error {
          background: rgb(245 108 108 / 10%);
          border-left-color: rgb(245 108 108);
        }
      }
    }
  }

</style>