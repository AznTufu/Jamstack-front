<script setup lang="ts">
    const { find } = useStrapi()

    const { data, pending, error } = await useAsyncData('players', async () => {
        return await find('players', {populate: '*'})
    })
</script>

<template>
    <h1>hello world</h1>
    <pre> {{data}} </pre>
</template>

<style scoped>

</style>