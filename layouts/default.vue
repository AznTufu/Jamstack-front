<script setup lang="ts">

</script>
<template>
    <main class="main">
        <header class="flex justify-between bg-blue-200 px-8 py-4">
            <div>   
                <a :href="`/`" class="text-[18px] decoration-none">
                  Home
                </a>
            </div>
            <div/>
        </header>
        <slot />
    </main>
</template>

<style>

</style>