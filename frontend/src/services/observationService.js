import observations from "../data/observations.json";

class ObservationService {

    getAllReports() {
        return observations;
    }

    getReportById(reportId) {
        return observations.find(
            report => report.report_id === reportId
        );
    }

}

export default new ObservationService();
