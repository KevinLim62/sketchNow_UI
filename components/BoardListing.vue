<template>
  <div>
    <NuxtLink :to="`/board/${board.ID}`">
      <UCard class="hover:scale-105 transition-all">
        <template #header>
          {{ board.Name }}
        </template>
        <div class="h-36"></div>
      </UCard>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
type BoardRoomProps = {
  ID: String;
  Name: String;
};

const { board } = defineProps(['board']);
</script>

<style scoped></style>
