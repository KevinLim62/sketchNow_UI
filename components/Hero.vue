<template>
  <div class="flex min-h-screen items-center justify-center">
    <UCard class="bg-base-200 flex items-center justify-center shadow-none ring-0">
      <div class="text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Hello there</h1>
          <p class="py-6">Welcome to sketch now, Here you can share your ideas in this virtual collaborative whiteboard</p>
          <UButton color="primary" variant="link">
            <NuxtLink to="/board"> Get Started </NuxtLink>
          </UButton>
        </div>
      </div>
    </UCard>
    <iframe width="500" height="500" src="https://lottie.host/embed/4dbb9617-0899-4312-80d8-e9ab7c46e1c4/G6miOXLNtX.json"></iframe>
  </div>
</template>

<script setup></script>

<style scoped></style>
