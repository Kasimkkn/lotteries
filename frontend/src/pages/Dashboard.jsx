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
import UsersCard from '../partials/dashboard/UsersCard';
import UsersTable from '../partials/dashboard/UsersTable';

function Dashboard() {
  return (
    <AdminLayout>
      {/* Dashboard actions */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">

        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Filter button */}
          <FilterButton align="right" />
          {/* Datepicker built with React Day Picker */}
          <Datepicker align="right" />
          {/* Add view button */}
          <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
            <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
            <span className="max-xs:sr-only">Add View</span>
          </button>
        </div>

      </div>
      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
        <UsersCard title={'Total Users'} totalusers={10} />
        {/* Line chart (Acme Advanced) */}
        <DashboardCard02 />
        {/* Line chart (Acme Professional) */}
        <DashboardCard03 />
        {/* Bar chart (Direct vs Indirect) */}
        <DashboardCard04 />
        {/* Line chart (Real Time Value) */}
        <DashboardCard05 />
        {/* Doughnut chart (Top Countries) */}
        <DashboardCard06 />
        {/* Table (Top Channels) */}
        <DashboardCard07 />
        {/* Line chart (Sales Over Time) */}
        <DashboardCard08 />
        {/* Stacked bar chart (Sales VS Refunds) */}
        <DashboardCard09 />
        {/* Card (Customers) */}
        <UsersTable />
        {/* Card (Reasons for Refunds) */}
        <DashboardCard11 />
        {/* Card (Recent Activity) */}
        <DashboardCard12 />
        {/* Card (Income/Expenses) */}
        <DashboardCard13 />

      </div>

    </AdminLayout>
  );
}

export default Dashboard;