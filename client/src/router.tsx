import React from 'react'
import { Route, Routes } from 'react-router-dom'
import {
  ArrivalPage,
  Login,
  MaintenancePage,
  NotAuthorizedPage,
  DashBoard,
  Unknown,
  Adminstrator,
} from './pages'
import { Main } from './components'
import { DeparturePage } from './pages'
import { PublicRoute } from './components/public-route'
import { PrivateRoute } from './components/private-route'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<Main />}>
        <Route path="arrival" element={<ArrivalPage />} />
        <Route path="departure" element={<DeparturePage />} />
        <Route path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
      </Route>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashBoard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Adminstrator />
          </PrivateRoute>
        }
      />
      <Route path="/not-authorized" element={<NotAuthorizedPage />} />
      <Route path="maintenance" element={<MaintenancePage />} />
      <Route path="*" element={<Unknown />} />
    </Routes>
  )
}
