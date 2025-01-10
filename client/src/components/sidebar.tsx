import {
  CalendarOutlined,
  AppstoreOutlined,
  TableOutlined,
} from '@ant-design/icons'
import { PiStudentDuotone, PiListBulletsBold } from 'react-icons/pi'
import { TfiPlus } from 'react-icons/tfi'
import { Layout, Image, Menu } from 'antd'

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
        icon: <CalendarOutlined />,
        label: 'Quotidien',
      },
      {
        key: 'totalHoursPerWeek',
        icon: <CalendarOutlined />,
        label: 'Hebdomadaire',
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

interface SidebarProps {
  selectedMenuKey: string
  onMenuClick: (item: any) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedMenuKey,
  onMenuClick,
}) => {
  return (
    <Sider
      width={250}
      className="bg-white text-black flex flex-col min-h-screen"
    >
      <div className="logo text-black mb-6 text-center p-5">
        <Image width={200} src="/logo_cc_nemours.jpg" preview={false} />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedMenuKey]}
        onClick={onMenuClick}
        items={menuItems}
        className="bg-white"
      />
    </Sider>
  )
}
