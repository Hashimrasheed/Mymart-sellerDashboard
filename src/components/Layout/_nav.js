import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    badge: {
      color: 'info',
      // text: 'NEW',
    }
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Sellers',
    route: '/sellers',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Manage sellers',
        to: '/sellers',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Register seller',
        to: '/register-seller',
      },
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Customers',
    to: '/customers',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    badge: {
      color: 'info',
      // text: 'NEW',
    }
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Orders',
    to: '/orders',
    icon: 'cil-chart-pie'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Contact Us',
    to: '/Contact-us',
    icon: 'cil-calculator',
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },
]

export default _nav
