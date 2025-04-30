export const getUpdatedScoreList = (players, nameToUpdate, newScore) => {
    return players.map(player =>
        player.name === nameToUpdate
            ? { ...player, score: newScore }
            : player
    );
};