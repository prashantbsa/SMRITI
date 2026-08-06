class ObservationService {

    async getAllReports() {

        const response = await fetch(
            "http://192.168.12.160:8000/observations/"
        );

        if (!response.ok) {
            throw new Error("Unable to fetch observations");
        }

        const data = await response.json();

        return data.map(item => ({

            report_id: item.id,

            latitude: item.latitude,

            longitude: item.longitude,

 state: item.state,

    district: item.district,

    
            event_code: item.phenomenon,

            event_name: item.phenomenon,

            source: item.source,

            reported_by: item.reporter_id,

            time: item.observation_time,

            verification_status: item.verification_status,

            confidence_score: "N/A",

	    remarks: item.remarks
        }));

    }

}

export default new ObservationService();
