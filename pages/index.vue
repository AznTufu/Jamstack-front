<script setup lang="ts">
    import type { Player } from '~/models/player.model';
    import type { Meta } from "~/models/strapi.model";
    import type { Competition } from "~/models/competition.model";

    const { find } = useStrapi4()

    const filters = ref<string[]>([])

    const page = ref(1)
    const pageSize = ref(2)

    const { data: players, pending: playersPending, error: playersError, refresh: refreshPlayers } = useAsyncData('players', () => find<{ 
        data: Player[],
        meta: Meta
        }>('players', { 
            populate: '*',
            pagination: {
                page: page.value,
                pageSize: pageSize.value
            },
            filters: {
                competitions: {
                    name: {
                        $in: filters.value
                    }
                }
            }
        }), {
            watch: [page, filters],
        }
    )

    const { data: competitions, pending: competitionsPending } = useAsyncData('competitions',
        () => find<{ data: Competition[] }>('competitions')
    )

    const addFilter = (filter: string) => {
        if(!filters.value.includes(filter)) {
            filters.value.push(filter)
        } else {
            filters.value = filters.value.filter(f => f !== filter)
        }
        refreshPlayers()
    }
</script>

<template>
    <h1>hello world</h1>
    <!-- <pre> {{players}} </pre> -->

    <template v-if="competitionsPending">
        <span>Loading filters....</span>
    </template>
    <template v-else>
        <div class="my-4">
            <h3>Compétitions</h3>
            <button v-for="competition in competitions?.data"
            :key="competition.id"
            :class="[filters.includes(competition.name) ? 'bg-gray-200' : 'bg-white']" 
            @click="addFilter(competition.name)">
                {{ competition.name }}
            </button>
        </div>
    </template>

    <template v-if="playersPending">
        <span>Loading players....</span>
    </template>
    <template v-else>
        <div class="my-4">
            <div v-for="player in players?.data" :key="player.slug">
                <a :href="`/players/${player.slug}`" class="underline">
                    <h2>{{player.name}} {{player.last_name}}</h2>
                </a>
            </div>
            <UPagination v-if="players?.meta && players?.meta.pagination.pagecount > 1" 
                        v-model="page" 
                        :page-count="players?.meta.pagination.pagecount" 
                        :total="players?.Meta.pagination.total"
                        class="mx-auto mt-8"
            />
        </div>
    </template>
</template>

<style scoped>

</style>