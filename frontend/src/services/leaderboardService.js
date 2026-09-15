class LeaderboardService {

    async getLeaderboard(limit = 50) {

        const response = await fetch(
            `/api/leaderboard/?limit=${limit}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {

            throw new Error(
                "Unable to fetch leaderboard"
            );

        }

        return await response.json();

    }

}


export default new LeaderboardService();
