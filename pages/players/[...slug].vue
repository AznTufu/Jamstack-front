<script lang="ts" setup>
    import type { Player } from '~/models/player.model';

    const { findOne } = useStrapi4()
    const route = useRoute()

    const { data: player, pending } = useAsyncData('player',
        () => findOne<{ data: Player }>(`players/${route.params.slug}`)
    )
</script>

<template>
    <pre> {{ player.data }} </pre>
</template>
