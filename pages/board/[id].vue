<template>
  <div class="flex w-full gap-4 p-4 lg:gap-6 lg:p-6">
    <ClientOnly fallback-tag="span" fallback="Loading">
      <WhiteBoard :boardRoomId="route.params.id" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import WhiteBoard from '~/components/WhiteBoard.vue';
const route = useRoute();
definePageMeta({
  layout: 'dashboard',
});
</script>
