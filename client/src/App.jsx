import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/Profile";
import JobDetails from "./pages/student/JobDetails";
import Jobs from "./pages/student/Jobs";
import Applications from "./pages/student/Applications.jsx";
import RecruiterApplications from "./pages/recruiter/Applications.jsx";
import Recommendations from "./pages/student/Recommendations";
import Navbar from "./components/navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import RecruiterJobs from "./pages/recruiter/Jobs";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RecruiterProfile from "./pages/RecruiterProfile";
import ApplicationDetails from "./pages/student/ApplicationDetails";
import CandidateProfile from "./pages/recruiter/CandidateProfile";
import Users from "./pages/admin/Users";
import AdminJobs from "./pages/admin/Jobs";
import Notifications from "./pages/Notifications";
import { NotificationProvider } from "./context/NotificationContext";
function App() {
    return (
        <BrowserRouter>
        <NotificationProvider>
            <Navbar />

            <Routes>

                <Route
    path="/student/dashboard"
    element={
        <ProtectedRoute allowedRoles={["student"]}>
            <Dashboard />
        </ProtectedRoute>
    }
/>

                <Route
    path="/student/profile"
    element={
        <ProtectedRoute allowedRoles={["student"]}>
            <Profile />
        </ProtectedRoute>
    }
/>

<Route
    path="/student/jobs"
    element={
        <ProtectedRoute allowedRoles={["student"]}>
            <Jobs />
        </ProtectedRoute>
    }
/>

<Route
    path="/student/jobs/:id"
    element={
        <ProtectedRoute allowedRoles={["student"]}>
            <JobDetails />
        </ProtectedRoute>
    }
/>

<Route
    path="/student/applications"
    element={
        <ProtectedRoute allowedRoles={["student"]}>
            <Applications />
        </ProtectedRoute>
    }
/>

<Route
    path="/student/recommendations"
    element={
        <ProtectedRoute allowedRoles={["student"]}>
            <Recommendations />
        </ProtectedRoute>
    }
/>

<Route
    path="/student/applications/:id"
    element={
        <ProtectedRoute allowedRoles={["student"]}>
            <ApplicationDetails />
        </ProtectedRoute>
    }
/>

                <Route
                    path="/student/jobs/:id"
                    element={<JobDetails />}
                />
                <Route
                    path="/student/jobs"
                    element={<Jobs />}
                />
                <Route
                    path="/student/applications"
                    element={<Applications />}
                />
                <Route
                    path="/recruiter/applications"
                    element={<RecruiterApplications />}
                />
                <Route
                    path="/student/recommendations"
                    element={<Recommendations />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route
    path="/recruiter/dashboard"
    element={
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/jobs"
    element={
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterJobs />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/applications"
    element={
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterApplications />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/candidates/:id"
    element={
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <CandidateProfile />
        </ProtectedRoute>
    }
/>
                <Route
                    path="/recruiter/jobs"
                    element={<RecruiterJobs />}
                />  
                <Route
    path="/admin/dashboard"
    element={
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/users"
    element={
        <ProtectedRoute allowedRoles={["admin"]}>
            <Users />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/profile"
    element={
        <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterProfile />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/jobs"
    element={
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdminJobs />
        </ProtectedRoute>
    }
/>

<Route
    path="/notifications"
    element={
        <ProtectedRoute>
            <Notifications />
        </ProtectedRoute>
    }
/>


                
               

            </Routes>
        </NotificationProvider>

        </BrowserRouter>
    );
}

export default App;

