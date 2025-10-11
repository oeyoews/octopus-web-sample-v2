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
      <hr class="my-4">
      <h3 class="text-lg font-bold">日志</h3>
      <div class="debug-actions flex gap-2 my-2">
        <UButton @click="cacheDebugLogs = []" color="error" variant="outline" icon="i-lucide-x">清空日志</UButton>
        <UButton @click="cacheDebugLogs = defaultDebugLogs" color="info" variant="outline"
          icon="i-lucide-square-terminal">开启日志</UButton>
      </div>
      <div class="debug-info">
        <div class="logs-container">
          <div v-if="cacheDebugLogs.length === 0" class="empty-logs">
            nothing ...
          </div>
          <div v-else class="log-list">
            <div v-for="(log, index) in cacheDebugLogs" :key="index" class="log-item log-success">
              <!-- :class="{
              'log-success': log.includes('✅'),
              'log-cache': log.includes('🎯'),
              'log-error': log.includes('❌')
            }" -->
              {{ log }}
            </div>
          </div>
        </div>
        <!-- <div class="debug-actions">
          <ElButton size="small" @click="cacheDebugLogs = []">清空日志</ElButton>
        </div> -->
      </div>
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
  import { useWebSocket } from '@vueuse/core'
  const wsUrl = 'ws://192.168.75.61:8080/ws/logs'
  const { status, data, close } = useWebSocket(wsUrl, {
    heartbeat: true,
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        alert('Failed to connect WebSocket after 3 retries')
      },
    },
  })

  watch(data, (newData) => {
    console.log(newData, status);
    cacheDebugLogs.value = [...cacheDebugLogs.value, newData]
  });
  const defaultDebugLogs = [
    '✅ 缓存已更新',
    '🎯 缓存命中',
    '❌ 缓存失败'
  ]
  const cacheDebugLogs = ref<string[]>(defaultDebugLogs);
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

<style scoped>
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
    max-height: 200px;
    overflow-y: auto;

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
        background: var(--el-bg-color-page);
        border-left: 3px solid var(--el-border-color);
        border-radius: 4px;

        &.log-success {
          background: rgb(103 194 58 / 10%);
          border-left-color: var(--el-color-success);
        }

        &.log-cache {
          background: rgb(64 158 255 / 10%);
          border-left-color: var(--el-color-primary);
        }

        &.log-error {
          background: rgb(245 108 108 / 10%);
          border-left-color: var(--el-color-danger);
        }
      }
    }
  }

</style>