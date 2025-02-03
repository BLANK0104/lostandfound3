import React from 'react';

const ReportForm = ({ reportForm, setReportForm, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto px-4 sm:px-0">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
      <input
        type="date"
        value={reportForm.fromDate}
        onChange={(e) => setReportForm({...reportForm, fromDate: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
      <input
        type="date"
        value={reportForm.toDate}
        onChange={(e) => setReportForm({...reportForm, toDate: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
    </div>
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-500 text-white p-2 rounded text-sm sm:text-base hover:bg-blue-600 disabled:bg-gray-400"
    >
      {loading ? 'Generating Report...' : 'Generate Report'}
    </button>
  </form>
);

export default ReportForm;