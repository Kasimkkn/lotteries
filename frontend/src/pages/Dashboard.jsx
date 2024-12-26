import React from 'react';

import AdminLayout from '../components/AdminLayout/AdminLayout';
import Datepicker from '../components/Datepicker';
import FilterButton from '../components/DropdownFilter';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
import DashboardCard12 from '../partials/dashboard/DashboardCard12';
import DashboardCard13 from '../partials/dashboard/DashboardCard13';
import WidgetCard from '../partials/dashboard/WidgetCard';

function Dashboard() {
  return (
    <AdminLayout>
      <div className="grid grid-cols-12 gap-6">
        <WidgetCard title={'Total Users'} totalusers={10} />
        <WidgetCard title={'Total Lotteries'} totalusers={20} />
        <WidgetCard title={'Total Tickets'} totalusers={100} />
        {/* Bar chart (Direct vs Indirect) */}
        <DashboardCard04 />
        {/* Line chart (Real Time Value) */}
        <DashboardCard05 />
        {/* Doughnut chart (Top Countries) */}
        <DashboardCard06 />
        {/* Table (Top Channels) */}
        <DashboardCard07 />
        {/* Card (Recent Activity) */}
        <DashboardCard12 />
        {/* Card (Income/Expenses) */}
        <DashboardCard13 />

      </div>

    </AdminLayout>
  );
}

export default Dashboard;