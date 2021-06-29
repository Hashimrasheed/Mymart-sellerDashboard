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
    name: 'Products',
    route: '/products',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Brands',
        to: '/brands',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Categories',
        to: '/categories',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Options',
        to: '/options',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Option Values',
        to: '/option-values',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Add Ons Types',
        to: '/add-ons-types',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Add Ons Values',
        to: '/add-ons-values',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Removables',
        to: '/removables',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Product Management',
        to: '/products',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Orders',
    route: '/orders',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Order Management',
        to: '/orders',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Delivered Orders',
        to: '/delivered-orders',
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
    name: 'Contact Us',
    to: '/Contact-us',
    icon: 'cil-calculator',
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'My Store',
    route: '/settings',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Store Settings',
        to: '/settings',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Banners',
        to: '/banners',
      },
    ],
  },
]

export default _nav
