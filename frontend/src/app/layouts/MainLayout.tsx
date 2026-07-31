import { useState } from 'react'
import { Outlet } from 'react-router'

// import Sidebar from '@/shared/ui/layout/Sidebar'
import Sidebar from '@/shared/ui/layout/Sidebar'
import Topbar from '@/shared/ui/layout/Topbar'
// import Breadcrumbs from '../../shared/ui/navigation/Breadcrumbs'

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-text-primary lg:pl-72">

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-col bg-page">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 bg-page px-6 py-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            {/* <Breadcrumbs items={[{ label: 'Dashboard' }]} /> */}

            <Outlet />
          </div>
        </main>
      </div>
    </div>

  )
}

export default MainLayout