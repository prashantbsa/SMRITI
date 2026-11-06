class StatisticsService {
    async getStatistics(source = "ALL") {
        const url =
            `/api/statistics/?source=${encodeURIComponent(source)}`;

        const response = await fetch(url, {
            credentials: "include"
        });

        if (!response.ok) {
            let message = "Unable to load statistics.";

            try {
                const errorData = await response.json();
                message =
                    errorData.detail || message;
            } catch {
                // Keep the default message if the response
                // is not JSON.
            }

            throw new Error(message);
        }

        return response.json();
    }
}

export default new StatisticsService();
