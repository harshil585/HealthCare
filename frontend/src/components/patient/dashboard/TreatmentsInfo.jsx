import { mockTreatments } from '../../../mockData/patientDashboardData';

const TreatmentsInfo = () => (
  <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
    <div className="p-6 border-b border-slate-100 dark:border-slate-700/50">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white">Treatments & Procedures</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Explore the range of treatments available across our network
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="text-left py-3 px-5 font-semibold">Condition</th>
            <th className="text-left py-3 px-5 font-semibold">Treatment / Surgery</th>
            <th className="text-left py-3 px-5 font-semibold hidden md:table-cell">Description</th>
          </tr>
        </thead>
        <tbody>
          {mockTreatments.map((t, i) => (
            <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="py-3.5 px-5 font-medium text-slate-700 dark:text-slate-200">{t.condition}</td>
              <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">{t.treatment}</td>
              <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 hidden md:table-cell">{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TreatmentsInfo;
