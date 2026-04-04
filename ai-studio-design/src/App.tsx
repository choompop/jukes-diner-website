import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Book from './pages/Book';
import FindUs from './pages/FindUs';
import Merch from './pages/Merch';
import Apply from './pages/Apply';
import Login from './pages/Login';

// Dashboard Pages
import CommandCenter from './pages/dashboard/CommandCenter';
import BrainDump from './pages/dashboard/BrainDump';
import Onboarding from './pages/dashboard/Onboarding';
import TrainingCenter from './pages/dashboard/TrainingCenter';
import Operations from './pages/dashboard/Operations';
import Bookings from './pages/dashboard/Bookings';
import MenuManagement from './pages/dashboard/MenuManagement';
import Financials from './pages/dashboard/Financials';
import Marketing from './pages/dashboard/Marketing';
import Resources from './pages/dashboard/Resources';
import Support from './pages/dashboard/Support';
import DriveViewer from './pages/dashboard/DriveViewer';
import NotionPipeline from './pages/dashboard/NotionPipeline';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order" element={<Order />} />
            <Route path="/book" element={<Book />} />
            <Route path="/find-us" element={<FindUs />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CommandCenter />} />
            <Route path="brain-dump" element={<BrainDump />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="training" element={<TrainingCenter />} />
            <Route path="operations" element={<Operations />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="menu-mgmt" element={<MenuManagement />} />
            <Route path="financials" element={<Financials />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="resources" element={<Resources />} />
            <Route path="support" element={<Support />} />
            <Route path="drive" element={<DriveViewer />} />
            <Route path="pipeline" element={<NotionPipeline />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
