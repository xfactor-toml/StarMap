
import { useBattleStore } from '@/stores';
import { BattleActionPayload } from '@/types';

export const levelUpMock = (payload: BattleActionPayload) => {
  const battle = useBattleStore()

  battle.process.setSkill(payload.action, {
    level: 2,
    levelUpAvailable: false,
    cooldown: {
      duration: 3000
    },
  });
}
