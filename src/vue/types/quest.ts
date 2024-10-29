export type  RewardType = {
    isReceived: boolean,
    isMissed: boolean,
    isRewardDay: boolean,
    day: string,
    bonusCount: number, 
}

export type QuestItemType = {
    name: string,
    totalBonusDay: number,
    currentBonusDay: number,
    isWaiting: boolean,
    waitingTime: number,
    rewardsList: RewardType[], 
}