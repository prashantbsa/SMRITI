class EventService {

    async getAllEvents() {

        const response = await fetch(
            "/api/weather-events/?limit=10000",
            {
                credentials: "include"
            }
        );

        if (!response.ok) {

            throw new Error(
                "Unable to fetch weather events"
            );

        }

        const data =
            await response.json();

        return data.events || [];
    }

}

export default new EventService();
