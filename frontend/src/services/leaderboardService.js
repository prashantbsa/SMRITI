class LeaderboardService {

    async getLeaderboard(limit = 50) {

        const response = await fetch(
            `http://192.168.12.160:8000/leaderboard/?limit=${limit}`
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
