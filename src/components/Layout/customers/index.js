import React from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CCol,
  CDataTable,
  CProgress,
  CRow,
  CCallout
} from '@coreui/react'

import usersData from '../../../views/users/UsersData'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const fields = ['#', 'Name', 'Business Name', 'Phone No', 'Email', 'Created At', 'Action']

const Customers = () => {
  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              Customers
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={usersData}
                fields={fields}
                itemsPerPage={5}
                pagination
                scopedSlots={{
                  '#':
                    (item) => (
                      <td>
                        <CBadge color={getBadge(item.id + 1)}>
                          {item.id + 1}
                        </CBadge>
                      </td>
                    ),
                  'Business Name':
                    (item) => (
                      <td>
                        {item.Business_Name}
                      </td>
                    ),
                  'Expiry Date':
                    (item) => (
                      <td>
                        {item.ExpiryDate}
                      </td>
                    ),
                  'Business Name':
                    (item) => (
                      <td>
                        {item.Business_Name}
                      </td>
                    ),
                  'Phone No':
                    (item) => (
                      <td>
                        {item.PhoneNo}
                      </td>
                    ),
                  'Status':
                    (item) => (
                      <td>
                        <CBadge color={getBadge(item.status)}>
                          {item.status}
                        </CBadge>
                      </td>
                    ),
                  'Action':
                    (item) => (
                      <CDropdown className="m-1 d-inline-block">
                        <CDropdownToggle color="secondary">
                          
                        </CDropdownToggle>
                        <CDropdownMenu placement="left">
                          <CDropdownItem >View</CDropdownItem>
                          <CDropdownItem>Delete</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    )


                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Customers
