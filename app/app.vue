<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const isLoading = ref(true)
  const loadingProgress = ref(0)

  onMounted(() => {
    // 模拟加载过程
    const interval = setInterval(() => {
      loadingProgress.value += Math.random() * 15
      if (loadingProgress.value >= 100) {
        loadingProgress.value = 100
        clearInterval(interval)
        // 延迟一点时间再隐藏loading
        setTimeout(() => {
          isLoading.value = false
        }, 500)
      }
    }, 100)
  })
</script>

<template>
  <UApp>
    <!-- 科技感Loading组件 -->
    <TechLoading :is-loading="isLoading" :progress="loadingProgress" />

    <!-- 主要内容 -->
    <NuxtPage />
  </UApp>
</template>
