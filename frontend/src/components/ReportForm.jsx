import React, { useState } from 'react';
import { generateReport } from '../services/api';

const ReportForm = ({ setError }) => {
    const [loading, setLoading] = useState(false);
    const [reportForm, setReportForm] = useState({
        fromDate: '',
        toDate: ''
    });

    const handleReportGeneration = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await generateReport(
                new Date(reportForm.fromDate).toISOString(),
                new Date(reportForm.toDate).toISOString()
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleReportGeneration}>
            <div>
                <label htmlFor="fromDate">From Date:</label>
                <input
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    value={reportForm.fromDate}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="toDate">To Date:</label>
                <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    value={reportForm.toDate}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
            </button>
        </form>
    );
};

export default ReportForm;