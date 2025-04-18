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
function App() {

  return (
    <>
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
            </Routes>
          </main>
        </div>
      </Provider>
    </>
    )
}

export default App
