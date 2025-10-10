<template>
  <div class="neo-bg">
    <UContainer class="relative z-10 py-4 gap-2 flex flex-col min-h-screen">

      <!-- heading -->
      <header class="mb-8 text-center select-none">
        <div class="inline-flex items-center justify-center">
          <UIcon name="i-lucide-cpu" class="i-lucide-cpu size-6 mr-3 text-cyan-400 animate-pulse"></UIcon>
          <h1
            class="neo-glow text-3xl md:text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">

            数据引接功能面板
          </h1>
          <UIcon name="i-lucide-cpu" class="i-lucide-cpu size-6 ml-3 text-cyan-400 animate-pulse"></UIcon>
        </div>
        <div
          class="h-0.5 w-48 mx-auto mt-4 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent blur-[1px]">
        </div>
      </header>

      <!-- tabs -->
      <u-tabs :items variant="link" orientation="horizontal"> </u-tabs>
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1"> -->
      <div>
        <!-- <UTooltip text="Open on GitHub">
          <UButton icon="i-lucide-wifi" label="Show toast" color="primary" variant="outline" @click="showToast" />
        </UTooltip> -->
      </div>

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
</style>