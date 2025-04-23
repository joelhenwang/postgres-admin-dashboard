import * as React from 'react'
import { Route, Routes} from 'react-router-dom'
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Home from './pages/Home';
import { store } from './store';
import { Provider } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import Users from './pages/Users';
import Bookings from './pages/Bookings';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt';
function App() {

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
        <CssBaseline enableColorScheme/>
        <Provider store={store}>
          <div className='app' >
            <main>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route path='/admin' element={<Admin />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route path='/users' element={<Users />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route path='/bookings' element={<Bookings />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Provider>
      </LocalizationProvider>
    </>
    )
}

export default App
