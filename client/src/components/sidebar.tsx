import {
  AppstoreOutlined,
  TableOutlined,
  ScheduleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { PiStudentDuotone, PiListBulletsBold } from 'react-icons/pi'
import { TfiPlus } from 'react-icons/tfi'
import { Layout, Image, Menu } from 'antd'
import { useAuth } from '../hooks'

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
    icon: <PiStudentDuotone />,
    children: [
      {
        key: 'studentList',
        label: 'Liste des étudiants',
        icon: <PiListBulletsBold />,
      },
      {
        key: 'addStudent',
        label: 'Enregistrer un étudiant',
        icon: <TfiPlus />,
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
    icon: <PlusOutlined />,
    label: 'Créer un utilisateur',
  },
  {
    key: 'userList',
    icon: <PiListBulletsBold />,
    label: 'Liste des utilisateurs',
  },
]

interface SidebarProps {
  selectedMenuKey: string
  onMenuClick: (item: any) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedMenuKey,
  onMenuClick,
}) => {
  const { user } = useAuth()
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
        selectedKeys={[selectedMenuKey]}
        onClick={onMenuClick}
        items={
          user?.permissions === 'Administrator' ? menuItemsAdmin : menuItems
        }
        className="bg-red-600 text-white"
      />
    </Sider>
  )
}
