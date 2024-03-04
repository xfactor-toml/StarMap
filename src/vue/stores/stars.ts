import { LEVELS } from '@/constants';
import { Star } from '@/models';
import { useClient, useWallet } from '@/services';
import { GuiLevel } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useStarsStore = defineStore('stars', () => {
  const client = useClient()
  const wallet = useWallet()

  const stars = ref<Star[]>([])
  const levelsFilter = ref<number[]>(LEVELS.map(({ value }) => value))
  const availableFilterLevels = ref<GuiLevel[]>([...LEVELS].reverse())

  const filteredByLevels = computed(() => {
    return stars.value.filter(star => levelsFilter.value.includes(star.params.level));
  })

  const fetchStars = async () => {
    stars.value = (await wallet.provider.getStars()).map(star => new Star(star));
  }

  const addStar = (star: Star) => {
    if (!exist(star.id)) {
      stars.value.push(star);
    }
  }

  const updateStar = (updatedStar: Star) => {
    stars.value = stars.value.map(star => (star.id === updatedStar.id ? updatedStar : star));
  }

  const getById = (starId: number) => {
    return stars.value.find(star => star.id === starId);
  }

  const exist = (starId: number) => {
    return stars.value.some(star => star.id === starId);
  }

  const setLevelsFilter = (levels: number[]) => {
    levelsFilter.value = levels;
    client.updateStarLevelFilter(levelsFilter.value);
  }

  return {
    availableFilterLevels,
    filteredByLevels,
    levelsFilter,
    stars,
    fetchStars,
    addStar,
    updateStar,
    getById,
    exist,
    setLevelsFilter,
  }
});
