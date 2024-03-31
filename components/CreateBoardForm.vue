<template>
  <UCard>
    <template #header>
      <div class="text-center font-bold">Create New Board</div>
    </template>
    <div class="p-10">
      <UForm :validate="validate" :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
        <UFormGroup label="New Board Name" name="boardName">
          <UInput v-model="state.boardName" />
        </UFormGroup>
        <UButton type="submit" @click="$emit('handleCloseForm')"> Confirm </UButton>
      </UForm>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent, FormError } from '#ui/types';

const toast = useToast();
const schema = z.object({
  boardName: z.string().min(5),
});
type Schema = z.output<typeof schema>;
const state = reactive({
  boardName: undefined,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.boardName) errors.push({ path: 'boardName', message: 'Required' });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  const payload = JSON.stringify({
    name: event.data.boardName,
  });

  const { error } = await useFetch('http://localhost:5000/api/boardRoom', {
    method: 'post',
    body: payload,
  });
  if (!error) {
    toast.add({ title: `${event.data.boardName} created` });
    await refreshNuxtData();
  }
}
</script>

<style scoped></style>
