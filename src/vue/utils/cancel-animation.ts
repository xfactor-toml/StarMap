import { default as anime } from 'animejs';

export const cancelAnimation = (animation: anime.AnimeInstance) => {
  const activeInstances = anime.running;
  const index = activeInstances.indexOf(animation);

  activeInstances.splice(index, 1);
}
