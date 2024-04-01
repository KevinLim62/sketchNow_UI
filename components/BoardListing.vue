<template>
  <div>
    <NuxtLink v-on:click.native="checkUserExist(board.ID)">
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
const router = useRouter();
const toast = useToast();
const checkUserExist = (boardId: string) => {
  const userSession = localStorage.getItem('userSession');
  console.log(userSession);
  if (userSession && JSON.parse(userSession)['name'] !== undefined) {
    router.push(`/board/${boardId}`);
  } else {
    toast.add({ title: 'You have to create a user name first' });
    return;
  }
};
</script>

<style scoped></style>
