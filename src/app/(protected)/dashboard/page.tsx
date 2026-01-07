import { PERMISSIONS } from '@/lib/auth/constants/permissions';
import { PermissionGuard } from '../../components/auth/auth-guard';

export default async function DashboardPage() {
  // const dashboardData = await apiClient.get('/dashboard');

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p className='text-gray-600 mt-2'>
            Welcome back! Here&apos;s what&apos;s happening.
          </p>
        </div>

        <PermissionGuard
          permission={PERMISSIONS.ANALYTICS.EXPORT}
          fallback={null}
        >
          <button className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
            Export Report
          </button>
        </PermissionGuard>
      </div>

      <div>Dashboard States</div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <PermissionGuard permission={PERMISSIONS.ORDER.VIEW}>
          <div>Recent Orders</div>
        </PermissionGuard>

        <PermissionGuard permission={PERMISSIONS.USER.VIEW}>
          <div>Recent Users</div>
        </PermissionGuard>
      </div>

      {/* admin-only section */}
      <PermissionGuard role='admin' fallback={null}>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-blue-900 mb-4'>
            Admin Insights
          </h2>
          <p className='text-blue-700'>
            This section is only visible to administrators.
          </p>
        </div>
      </PermissionGuard>
    </div>
  );
}
