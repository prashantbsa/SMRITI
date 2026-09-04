class EventService {

    async getAllEvents() {

        const response = await fetch(
            "http://192.168.12.160:8000/weather-events/?limit=10000"
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
