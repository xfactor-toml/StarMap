export type BonusType = {
    isBonusDay: boolean,
    isRewardDay: boolean,
    bonusCount: number,
}
export type  RewardType = {
    isReceived: boolean,
    isMissed: boolean,
    isRewardDay: boolean,
    day: string,
    bonusCount: number, 
}

export type QuestItemType = {
    name: string,
    rarity: string,
    content: string,
    totalBonusDay: number,
    currentBonusDay: number,
    isWaiting: boolean,
    waitingTime: number,
    rewardsList: RewardType[], 
}