export const updateRanking = (players) => {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    return sortedPlayers.map((player, index) => ({
        ...player,
        rank: index + 1
    }));
};