import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import { store } from "./store"
import { LandingPage } from "./pages/landing/page"
import { LoginPage } from "./pages/login/page"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import { DashboardPage } from "./pages/dashboard/page"
import { FacilityPage } from "./pages/facility/page"
import { SensorPage } from "./pages/sensor/page"
import { UsersPage } from "./pages/users/page"
import { MapPage } from "./pages/map/page"
import { FacilitiesPage } from "./pages/facilities/page"
import { useAuth } from "./hooks/useAuth"
import { ReactNode } from "react"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!user || user.role !== "Admin") {
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="facilities" element={<FacilitiesPage />} />
        <Route path="users" element={
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        } />
        <Route path="facilities/:facilityId" element={<FacilityPage />} />
        <Route path="facilities/:facilityId/sensors/:sensorId" element={<SensorPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App
