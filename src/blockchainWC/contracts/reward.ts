export const RewardSenderAbi = [
    'function PullPrizeFund (uint256 _amount)',
    'function withdrawRewards ()',
    'function balanceOf (address _user) view returns (uint)',
    'function getUserWinsCount (address _user) view returns (uint)',
    'function getUserWinHistory (address _user) view returns (uint256[] memory)',
    'function getGameCount () view returns (uint)',
    'function getVictoryData (uint _winId) view returns (RewardData memory)'
]