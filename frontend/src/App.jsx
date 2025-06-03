import * as React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import { store } from './store';
import { Provider } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import Users from './pages/Users';
import Bookings from './pages/Bookings';
import RootRedirect from './components/RootRedirect';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt';
import Restaurant from './pages/Restaurant';

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
        <CssBaseline enableColorScheme/>
        <Provider store={store}>
          <div className='app'>
            <main>
              <Routes>
                {/* Root route redirect */}
                <Route path="/" element={<RootRedirect />} />
                <Route path="/home" element={<RootRedirect />} />

                {/* Public routes */}
                <Route path='/login' element={<Login />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path='/admin' element={<Admin />} />
                  <Route path='/users' element={<Users />} />
                  <Route path='/bookings' element={<Bookings />} />
                  <Route path='/restaurant' element={<Restaurant />} />
                </Route>

                {/* Catch all route - redirect to root */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Provider>
      </LocalizationProvider>
    </>
  )
}

export default App
