<template>
  <div class="fixed left-[50%] right-[50%] top-10 z-10">
    <ul class="flex flex-row items-center justify-center space-x-5">
      <li><UButton color="white" variant="outline" :class="{ 'p-2': true, 'bg-green-500': selectedTool === 'pointer' }" @click="$emit('handleSelectTool', 'pointer')">Pointer</UButton></li>
      <li><UButton color="white" variant="outline" :class="{ 'p-2': true, 'bg-green-500': selectedTool === 'line' }" @click="$emit('handleSelectTool', 'line')">Line</UButton></li>
      <li><UButton color="white" variant="outline" :class="{ 'p-2': true, 'bg-green-500': selectedTool === 'rect' }" @click="$emit('handleSelectTool', 'rect')">Rect</UButton></li>
      <li><UButton color="white" variant="outline" :class="{ 'p-2': true, 'bg-green-500': selectedTool === 'circle' }" @click="$emit('handleSelectTool', 'circle')">Circle</UButton></li>

      <!-- <li><UButton color="white" variant="outline" :class="{ 'p-2': true, 'bg-green-500': selectedTool === 'rect' }" @click="$emit('handleSelectTool', 'rect')">Rect</UButton></li> -->
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps({
  selectedTool: String,
});
</script>

<style scoped></style>
