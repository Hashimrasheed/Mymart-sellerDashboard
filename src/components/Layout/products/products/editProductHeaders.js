import { CCard, CCardHeader, CCol, CNav, CNavItem, CNavLink, CRow } from '@coreui/react'
import React from 'react'

function editProductHeaders(props) {
    return (
        <div>
            <CRow>
                <CCol xs="12" md="12">
                    <CCard >
                        <CCardHeader className="tab-nav">
                            <CNav variant="pills">
                                <CNavItem>
                                    <CNavLink to={`/edit-products/${props.productId}`}>General</CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink to={`/products-model/${props.productId}`}>Model</CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink to={`/products-links/${props.productId}`}>Links</CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink to={`/products-image/${props.productId}`}>Image</CNavLink>
                                </CNavItem>
                            </CNav>
                        </CCardHeader>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )
}

export default editProductHeaders
