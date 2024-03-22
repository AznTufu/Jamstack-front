<script lang="ts" setup>
    import type { Player } from '~/models/player.model';

    const { findOne } = useStrapi4()
    const route = useRoute()

    const { data: player, pending } = useAsyncData('player',
        () => findOne<{ data: Player }>(`players/${route.params.slug}`)
    )
</script>

<template>
    <!-- <pre> {{ player.data }} </pre> -->
    <section class="flex justify-center">
        <div class="flex flex-col justify-center items-center py-6 px-2 max-w-[600px] gap-6">
            <NuxtImg v-if="player?.data.image" :src="player?.data.image?.url" :alt="player?.data.slug" class="w-full object-cover" />
            <img v-else src="/public/assets/background.jpg" alt="illustration" class="h-full object-cover">
            <div class="flex flex-col gap-2 w-full">
                <div class="flex justify-between w-full">
                    <h2>{{player?.data.name}} {{player?.data.last_name}}</h2>
                    <div>Rang: {{player?.data.ranking}}</div>
                </div>
                <div class="flex flex-wrap gap-3">
                    <span v-if="player?.data.competitions && player.data.competitions.length >= 1">Compétition:</span>
                    <span v-else>Aucune compétition:</span>
                    <div v-for="(competition, index) in player?.data.competitions" :key="index">
                        <div v-if="competition">
                            {{ competition.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
