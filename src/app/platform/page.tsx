// app/platform/page.tsx
export default function DashboardPage() {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p>Welcome to your dashboard! Here’s a quick glance at your stats.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
            <ul className="list-disc list-inside">
              <li>Logged in</li>
              <li>Updated profile</li>
              <li>Completed a course</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Create New
            </button>
          </div>
        </div>
      </div>
    );
  }
  