import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import {
    ArrivalPage,
    Login,
    NotAuthorizedPage,
    Unknown,
    DailyAttendancePage,
    TotalHourPerWeekPage,
    DeparturePage,
    AddStudentPage,
    StudentListPage,
    AttendanceHourPerRangePage,
    CreateUserPage,
    UserListPage,
    DashboardHome,
} from './pages'
import { RootLayout } from './components'
import {
    PublicRoute,
    PrivateRoute,
    DashBoardLayout,
    AdminstratorLayout,
} from './components'

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
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
