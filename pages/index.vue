<script setup lang="ts">
    import type { Player } from '~/models/player.model';
    import type { Meta } from "~/models/strapi.model";
    import type { Competition } from "~/models/competition.model";
    import Fuse from 'fuse.js'

    const { find } = useStrapi4()

    const filters = ref<string[]>([])
    const search = ref<string>('')
    const page = ref(1)
    const pageSize = ref(3)

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
                },
            }
        }), {
            watch: [page, filters],
        }
    )

    const { data: searchedPlayers, pending: searchedPlayersPending } = useAsyncData('searchedPlayers',() => find<{
        data: Player[] 
        }>('players', { 
            populate: '*',
            filters: {
                competitions: {
                    name: {
                        $in: filters.value
                    }
                },
            }
        }),  {
            watch: [filters, search],
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
        page.value = 1
        refreshPlayers()
    }

    let fuse: Fuse<Player> | null = null;
    let searchResults = ref<Player[]>([]);

    watch(searchedPlayers, () => {
      if (searchedPlayers.value) {
        fuse = new Fuse(searchedPlayers.value.data, {
          keys: ['name', 'last_name'],
          threshold: 0.3
        });
      }
    });

    const searchPlayers = () => {
      if (fuse) {
        searchResults.value = fuse.search(search.value).map((result: Fuse.FuseResult<Player>) => result.item);
      } else {
        searchResults.value = [];
      }
    }

    const sortDirection = ref('asc'); 

    const sortPlayers = () => {
        if (players.value) {
            players.value.data.sort((a: Player, b: Player) => {
            if (sortDirection.value === 'asc') {
                return a.ranking - b.ranking;
            } else {
                return b.ranking - a.ranking;
            }
            });
        }
    };
    watch(players, () => {
        if (players.value) {
            sortPlayers();
        }
    });
    const toggleSortDirection = () => {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        sortPlayers();
    };
</script>

<template>
    <!-- <pre> {{searchedPlayers}} </pre> -->
    <section class="mt-10 mx-14">
        <div class="flex justify-end gap-6">
            <input class="py-1.5 px-3 border-2 border-[#6d8ed1] rounded-md" type="text" v-model="search" @input="searchPlayers" placeholder="Search players...">
            <template v-if="!search">
                <button @click="toggleSortDirection" class="max-w-[195px] w-full">
                    Trier par rang : {{ sortDirection === 'asc' ? 'Ascendant' : 'Descendant' }}
                </button>
            </template>
        </div>
        <template v-if="!search">
            <div class="flex justify-center"> 
                <template v-if="competitionsPending">
                    <span>Loading filters....</span>
                </template>
                <template v-else>
                    <div class="flex flex-wrap gap-6 my-4">
                        <button v-for="competition in competitions?.data"
                        :key="competition.id"
                        :class="[filters.includes(competition.name) ? 'bg-blue-500 text-white' : 'bg-blue-200']" 
                        @click="addFilter(competition.name)"
                        class="px-3 py-2 border-2 border-blue-200 rounded-md hover:text-white hover:bg-blue-500"
                        >
                            {{ competition.name }}
                        </button>
                    </div>
                </template>
            </div>
            <div class="mt-16 flex flex-col justify-center">
                <template v-if="playersPending">
                    <span class="text-center">Loading players....</span>
                </template>
                <template v-else>
                    <div class="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div v-for="player in (search ? searchResults : players?.data)" :key="player.slug">
                            <a :href="`/players/${player.slug}`">
                                <NuxtImg v-if="player.image" :src="player.image?.url" :alt="player.slug" class="w-full h-48 object-cover" />
                                <img v-else src="/public/assets/background.jpg" alt="illustration" class="w-full h-48 object-cover">
                                <div class="flex justify-between py-6 px-2">
                                    <div> {{player.ranking}}</div>
                                    <h2>{{player.name}} {{player.last_name}}</h2>
                                </div>
                            </a>
                        </div> 
                    </div>
                </template>
                <UPagination v-if="players?.meta && players?.meta.pagination.pageCount > 1" 
                    v-model="page" 
                    :page-count="pageSize" 
                    :total="players?.meta.pagination.total"
                    class="mx-auto my-12"
                /> 
            </div>
        </template>
        <template v-else>
            <div class="mt-16 flex flex-col justify-center">
                <template v-if="searchedPlayersPending">
                    <span class="text-center">Loading players....</span>
                </template>
                <template v-else>
                    <div class="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div v-for="player in (search ? searchResults : searchedPlayers?.data)" :key="player.slug">
                            <a :href="`/players/${player.slug}`">
                                <NuxtImg v-if="player.image" :src="player.image?.url" :alt="player.slug" class="w-full h-48 object-cover" />
                                <img v-else src="/public/assets/background.jpg" alt="illustration" class="w-full h-48 object-cover">
                                <div class="flex justify-between py-6 px-2">
                                    <div> {{player.ranking}}</div>
                                    <h2>{{player.name}} {{player.last_name}}</h2>
                                </div>
                            </a>
                        </div> 
                    </div>
                </template>
            </div>
        </template>
    </section>
</template>

<style scoped>

</style>