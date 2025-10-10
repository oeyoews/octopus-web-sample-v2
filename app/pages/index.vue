<template>
  <div class="">
    <UContainer class="py-4 mb-16 gap-2 ">
      <u-tabs :items variant="link" orientation="horizontal"> </u-tabs>
      <UTooltip text="Open on GitHub">
        <UButton icon="i-lucide-wifi" label="Show toast" color="primary" variant="outline" @click="showToast" />
      </UTooltip>

      <UModal title="Modal with title">
        <UButton icon="i-lucide-circle-question-mark" color="info" variant="ghost" />
        <template #body>
          your content here
        </template>
      </UModal>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  const items = [
    {
      label: '中断、外推功能',
      icon: 'i-lucide-user',
      slot: 'account'
    },
    {
      label: '平滑功能',
      icon: 'i-lucide-lock',
      slot: 'password'
    },
    {
      label: '融合功能',
      icon: 'i-lucide-user',
      slot: 'account'
    },
    {
      label: '时空统一功能',
      icon: 'i-lucide-user',
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
      color: 'success'
    })
  }
</script>
