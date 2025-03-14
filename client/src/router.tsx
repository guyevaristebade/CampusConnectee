import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import {
    ArrivalPage,
    Login,
    MaintenancePage,
    NotAuthorizedPage,
    Unknown,
    DailyAttendancePage,
    TotalHourPerWeekPage,
    DashBoardLayout,
    AdminstratorLayout,
} from './pages'
import { Main } from './components'
import { DeparturePage, DashboardHome } from './pages'
import { PublicRoute } from './components/public-route'
import { PrivateRoute } from './components/private-route'
import { StudentListPage } from './pages/StudentListPage'
import { AddStudentPage } from './pages/AddStudentPage'
import { AttendanceHourPerRangePage } from './pages/AttendanceHourPerRangePage'
import { CreateUserPage } from './pages/CreateUserPage'
import { UserListPage } from './pages/UserListPage'

export const router = createBrowserRouter([
    {
        element: <Main />,
        children: [
            {
                path: 'arrival',
                element: <ArrivalPage />,
            },
            {
                path: 'departure',
                element: <DeparturePage />,
            },
            {
                path: 'login',
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                ),
            },
        ],
    },
    {
        element: (
            <PrivateRoute>
                <DashBoardLayout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                // path: '/',
                element: <DashboardHome />,
            },
            {
                path: 'attendance/daily',
                element: <DailyAttendancePage />,
            },
            {
                path: 'attendance/weekly',
                element: <TotalHourPerWeekPage />,
            },
            {
                path: 'attendance/range',
                element: <AttendanceHourPerRangePage />,
            },
            {
                path: 'students',
                element: <StudentListPage />,
            },
            {
                path: 'add-student',
                element: <AddStudentPage />,
            },
        ],
    },
    {
        element: (
            <PrivateRoute>
                <AdminstratorLayout />
            </PrivateRoute>
        ),
        children: [
            {
                path: 'admin',
                element: <DashboardHome />,
            },
            {
                path: 'admin/create-user',
                element: <CreateUserPage />,
            },
            {
                path: 'admin/users',
                element: <UserListPage />,
            },
        ],
    },
    {
        path: '/not-authorized',
        element: <NotAuthorizedPage />,
    },
    // {
    //     path: '/maintenance',
    //     element: <MaintenancePage />,
    // },
    {
        path: '/*',
        element: <Unknown />,
    },
])
