<template>
  <div class="flex w-full gap-4 p-4 lg:gap-6 lg:p-6">
    <MyBoard />
  </div>
</template>

<script>
import MyBoard from '~/components/MyBoard.vue';

definePageMeta({
  layout: 'dashboard',
});
</script>
