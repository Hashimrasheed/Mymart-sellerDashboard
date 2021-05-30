import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {getToken, axios} from '../../../reusable'
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

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const fields = ['#', 'Business Name', 'Email', 'Mobile no', 'Expiry Date', 'Domain', 'Status', 'Action']

const Sellers = () => {
  const admin = getToken()
  const history = useHistory();

  const [sellers, setSellers] = useState([])
  const [total, setTotal] = useState("")
  useEffect(async () => {
    try {
      let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
      }
      let response = await axios
        .get('sellers/listings', { headers })
        .catch(err => {
          console.log(err);
        })
      if (response) {
        if (response?.data?.status_code === 200) {
          console.log("hi", response?.data?.data?.sellers);
          setSellers(response?.data?.data?.sellers)
          setTotal(response?.data?.data?.total)
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [])

  console.log("hiiii", sellers);
  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              Sellers
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={sellers}
                fields={fields}
                itemsPerPage={10}
                pagination
                scopedSlots={{
                  '#':
                    (item, i) => (
                      <td>
                        <CBadge color={i + 1}>
                          {i + 1}
                        </CBadge>
                      </td>
                    ),
                  'Business Name':
                    (item) => (
                      <td>
                        {item.business_name}
                      </td>
                    ),
                  'Email':
                    (item) => (
                      <td>
                        {item.email}
                      </td>
                    ),
                  'Mobile no':
                    (item) => (
                      <td>
                        {item.mobile}
                      </td>
                    ),
                  'Expiry Date':
                    (item) => (
                      <td>
                        {item.expiryDate}
                      </td>
                    ),
                  'Domain':
                    (item) => (
                      <td>
                        {`${item.subDomain}.mymart.com`}
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
                      <td>
                        <CDropdown className="m-1 d-inline-block">
                          <CDropdownToggle color="secondary">
                          </CDropdownToggle>
                          <CDropdownMenu placement="left">
                            <CDropdownItem >Open dashboard</CDropdownItem>
                            <CDropdownItem onClick={() => {
                              history.push(`/seller-details/${item._id}`)
                            }}>Edit</CDropdownItem>
                            <CDropdownItem>Delete</CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </td>
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

export default Sellers
