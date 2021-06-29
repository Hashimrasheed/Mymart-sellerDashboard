import React, { lazy, useEffect } from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import MainChartExample from '../../../views/charts/MainChartExample.js'
import { getToken } from '../../../reusable/user.js'

const WidgetsDropdown = lazy(() => import('../../../views/widgets/WidgetsDropdown.js'))

const Dashboard = () => {
  const admin = getToken()

  useEffect(() => {
     try {
      let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
      }
     } catch (error) {
       console.log(error);
     }
  }, [])

  return (
    <>
      <WidgetsDropdown />
    </>
  )
}

export default Dashboard
