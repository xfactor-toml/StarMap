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
      if (!this.exist(star.id)) {
        this.stars.push(star);
      }
    },
    updateStar(updatedStar: Star) {
      this.stars = this.stars.map(star => (star.id === updatedStar.id ? updatedStar : star));
    },
    getById(starId: number) {
      return this.stars.find(star => star.id === starId);
    },
    exist(starId: number) {
      return this.stars.some(star => star.id === starId);
    },
    setLevelsFilter(levels: number[]) {
      this.levelsFilter = levels;
      this.client.updateStarLevelFilter(this.levelsFilter);
    }
  },
  getters: {
    filteredByLevels() {
      return this.stars.filter(star => this.levelsFilter.includes(star.params.level));
    }
  }
});
