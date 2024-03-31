<template>
  <div class="w-full overflow-auto">
    <div class="flex flex-col space-y-5">
      <div class="flex items-center justify-between">
        <UForm :validate="validate" :schema="schema" :state="state" class="flex flex-col items-start justify-start space-y-3" @submit="onSubmit">
          <UFormGroup label="User Name" name="name">
            <UInput v-model="state.userName" :disabled="!!state.userName" />
          </UFormGroup>
          <UButton type="submit" :disabled="!!state.userName"> Confirm </UButton>
        </UForm>
        <div class="flex space-x-3">
          <UButton color="green" variant="outline" label="Open" trailing @click="isOpenCreateBoard = true"><Icon name="material-symbols-light:add-ad-outline-rounded" size="25" color="green" />New board</UButton>

          <UInput icon="i-heroicons-magnifying-glass-20-solid" size="md" color="green" :trailing="false" placeholder="Search..." />
          <UButton color="primary" variant="solid">Invite members</UButton>
        </div>
      </div>
      <div v-if="pending">Loading ...</div>
      <div v-else class="grid grid-cols-4 gap-5">
        <div v-for="board in boardRooms">
          <BoardListing :board="board" />
        </div>
      </div>
    </div>
    <UModal v-model="isOpenCreateBoard">
      <CreateBoardForm v-on:handleCloseForm="isOpenCreateBoard = false" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent, FormError } from '#ui/types';

const isOpenCreateBoard = ref(false);
const toast = useToast();
const { pending, data: boardRooms } = await useFetch('http://localhost:5000/api/boardRoom', {
  method: 'get',
  lazy: true,
});
const userId = useId();
const schema = z.object({
  userName: z.string().min(5),
});
type Schema = z.output<typeof schema>;
const state = reactive({
  userName: undefined,
});
onMounted(() => {
  const userSession = localStorage.getItem('userSession');
  state.userName = userSession ? JSON.parse(userSession)['name'] : undefined;
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.userName) errors.push({ path: 'name', message: 'Required' });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  toast.add({ title: `Welcome, ${event.data.userName}` });
  localStorage.setItem('userSession', JSON.stringify({ id: userId, name: event.data.userName }));
}
</script>

<style scoped></style>
