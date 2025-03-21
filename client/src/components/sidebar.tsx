import {
    AppstoreOutlined,
    TableOutlined,
    ScheduleOutlined,
    ClockCircleOutlined,
    PlusOutlined,
    CalendarOutlined,
    UnorderedListOutlined,
    UserAddOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Layout, Image, Menu } from 'antd'
import { useAuth } from '../hooks'
import { useNavigate } from 'react-router-dom'

const { Sider } = Layout

// Déclaration du type MenuItemsType
type MenuItemsType = {
    key: string
    icon?: React.ReactNode // Les icônes sont des composants React
    label?: string // label est une chaîne de caractères
    children?: MenuItemsType[] // children peut être une liste d'éléments de type MenuItemsType
}

// Déclaration du tableau menu avec un type explicite
const menuItems: MenuItemsType[] = [
    { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    {
        key: 'attendance',
        icon: <TableOutlined />,
        label: 'Emargements',
        children: [
            {
                key: 'dailyAttendance',
                icon: <ClockCircleOutlined />, // Pour représenter la ponctualité ou les activités quotidiennes
                label: 'Quotidien',
            },
            {
                key: 'totalHoursPerWeek',
                icon: <ScheduleOutlined />, // Pour indiquer un planning ou un résumé hebdomadaire
                label: 'Hebdomadaire',
            },
            {
                key: 'totalHoursPerRange',
                icon: <CalendarOutlined />, // Pour représenter une vue analytique par intervalle
                label: 'Par date ',
            },
        ],
    },
    {
        key: 'student',
        label: 'Student',
        icon: <UserOutlined />,
        children: [
            {
                key: 'studentList',
                label: 'Liste des étudiants',
                icon: <UnorderedListOutlined />,
            },
            {
                key: 'addStudent',
                label: 'Enregistrer un étudiant',
                icon: <PlusOutlined />,
            },
        ],
    },
]

const menuItemsAdmin: MenuItemsType[] = [
    {
        key: 'dashboard',
        icon: <AppstoreOutlined />,
        label: 'Dashboard',
    },
    {
        key: 'createUser',
        icon: <UserAddOutlined />,
        label: 'Créer un utilisateur',
    },
    {
        key: 'userList',
        icon: <UnorderedListOutlined />,
        label: 'Liste des utilisateurs',
    },
]

export const Sidebar = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const onMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case 'dashboard':
                if (user?.permissions === 'Administrator') {
                    navigate('/admin')
                } else {
                    navigate('/')
                }
                break
            case 'dailyAttendance':
                navigate('/attendance/daily')
                break
            case 'totalHoursPerWeek':
                navigate('/attendance/weekly')
                break
            case 'totalHoursPerRange':
                navigate('/attendance/range')
                break
            case 'studentList':
                navigate('/students')
                break
            case 'addStudent':
                navigate('/add-student')
                break
            case 'createUser':
                navigate('/admin/create-user')
                break
            case 'userList':
                navigate('/admin/users')
                break
            default:
                break
        }
    }
    return (
        <Sider
            width={250}
            className="bg-white text-black flex flex-col h-screen fixed left-0 top-0 z-50"
        >
            <div className="logo text-black mb-6 text-center p-5">
                <Image width={200} src="/logo_cc_nemours.jpg" preview={false} />
            </div>
            <Menu
                mode="inline"
                items={
                    user?.permissions === 'Administrator'
                        ? menuItemsAdmin
                        : menuItems
                }
                onClick={onMenuClick}
                className="bg-white"
            />
        </Sider>
    )
}
