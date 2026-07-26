import { useState } from 'react'
import { Outlet } from 'react-router'

// import Sidebar from '@/shared/ui/layout/Sidebar'
import Sidebar from '@/shared/ui/layout/Sidebar'
import Topbar from '@/shared/ui/layout/Topbar'
// import Breadcrumbs from '../../shared/ui/navigation/Breadcrumbs'

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col bg-page">
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 bg-page px-6 py-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
              {/* <Breadcrumbs items={[{ label: 'Dashboard' }]} /> */}

              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout