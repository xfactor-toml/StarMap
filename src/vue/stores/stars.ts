import { LEVELS } from '@/constants';
import { Star } from '@/models';
import { GuiLevel } from '@/types';
import { defineStore } from 'pinia';

type StarsStoreState = {
  stars: Star[];
  availableFilterLevels: GuiLevel[];
  levelsFilter: number[];
};

export const useStarsStore = defineStore('stars', {
  state: (): StarsStoreState => {
    return {
      stars: [],
      levelsFilter: LEVELS.map(({ value }) => value),
      availableFilterLevels: [...LEVELS].reverse()
    };
  },
  actions: {
    async fetchStars() {
      this.stars = (await this.wallet.getStars()).map(star => new Star(star));
    },
    addStar(star: Star) {
      this.stars.push(star);
    },
    getById(starId: number) {
      return this.stars.find(star => star.id === starId);
    },
    setLevelsFilter(levels: number[]) {
      this.levelsFilter = levels;
      this.client.updateStarLevelFilter(this.selectedLevels);
    }
  },
  getters: {
    filteredByLevels() {
      return this.stars.filter(star => this.levelsFilter.includes(star.params.level));
    }
  }
});
