<template>
  <div class="flex flex-row w-full h-screen">
    <div class="hidden border-r bg-muted/40 md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <div class="flex justify-between h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
            <!-- Icon <Package2 class="h-6 w-6" /> -->
            <span class="">Sketch Now</span>
          </NuxtLink>
          <!-- <Avatar /> -->
        </div>
        <Navbar />
        <div class="mt-auto p-4">
          <!-- Development Notice -->
          <UCard class="w-60 bg-base-100 shadow-xl border-2">
            <template #header>
              <div class="">Demo v1.0</div>
            </template>
            <div>Collaborate feature in development...</div>
            <template #footer>
              <div class="flex w-full justify-start items-end">
                <h5>Create by Kevin Lim</h5>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup></script>

<style scoped></style>
