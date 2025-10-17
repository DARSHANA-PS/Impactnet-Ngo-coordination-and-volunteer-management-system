import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';

// Import Auth Components
import AuthGateway from './components/auth/AuthGateway';
import VolunteerAuth from './components/auth/VolunteerAuth';
import NgoAuth from './components/auth/NgoAuth';
import DonorAuth from './components/auth/DonorAuth';

// Import Integrated Dashboard Components
import VolunteerDashboardIntegrated from './components/volunteer/VolunteerDashboardIntegrated';
import NgoDashboardIntegrated from './components/ngo/NgoDashboardIntegrated';
import DonorDashboardIntegrated from './components/donor/DonorDashboardIntegrated';
import AdminAuth from './components/auth/AdminAuth';
import AdminDashboard from './components/admin/AdminDashboard';
// Layout wrapper component
function Layout({ children }) {
const location = useLocation();

// Check if current path is a dashboard route
const isDashboardRoute = location.pathname.includes('/dashboard');

return (
<div className="App">
{/* Only show Navbar and Footer on non-dashboard routes */}
{!isDashboardRoute && <Navbar />}
{children}
{!isDashboardRoute && <Footer />}
</div>
);
}

function App() {
useEffect(() => {
AOS.init({
duration: 1000,
once: true,
easing: 'ease-out-cubic',
disable: 'mobile',
offset: 100,
});
}, []);

return (
<Router>
<Layout>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/signup" element={<AuthGateway type="signup" />} />
<Route path="/login" element={<AuthGateway type="login" />} />
<Route path="/auth/volunteer" element={<VolunteerAuth />} />
<Route path="/auth/ngo" element={<NgoAuth />} />
<Route path="/auth/donor" element={<DonorAuth />} />
<Route path="/auth/admin" element={<AdminAuth />} />
<Route path="/admin/login" element={<AdminAuth />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
{/* Updated Dashboard Routes to use Integrated Components */}
<Route path="/volunteer/dashboard" element={<VolunteerDashboardIntegrated />} />
<Route path="/ngo/dashboard" element={<NgoDashboardIntegrated />} />
<Route path="/donor/dashboard" element={<DonorDashboardIntegrated />} />
</Routes>
</Layout>
</Router>
);
}

export default App;