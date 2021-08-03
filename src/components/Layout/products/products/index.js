import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { getToken, axios } from '../../../../reusable'
import { Edit, Trash } from "react-feather";
import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CFormGroup,
    CInputGroup,
    CInput,
    CInputGroupAppend,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CFormText,
    CLabel,
    CModalFooter,
    CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const getBadge = status => {
    switch (status) {
        case true: return 'success'
        case false: return 'secondary'
    }
}

const fields = ['#', 'Image', 'Name', 'Category', 'Brand', 'Price', 'Display Home', 'Status', 'Order', 'Action']

const AllProducts = () => {
    const history = useHistory();
    const admin = getToken()
    let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }
    const [products, setProducts] = useState([])
    const [total, setTotal] = useState("")
    const [loading, setLoading] = useState(false);
    const [callAgainApi, setCallAgainApi] = useState('')
    const [deleteProductId, setDeleteProductId] = useState("")
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    useEffect(() => {
        try {
            axios.get('product/', { headers })
                .then((response) => {
                    console.log("zzz", response);
                    if (response) {
                        if (response?.data?.status_code === 200) {
                            setProducts(response?.data?.data?.product)
                            setTotal(response?.data?.data?.total)
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                })

        } catch (e) {
            console.log(e);
        }
    }, [callAgainApi])

    const deleteProduct = async (_id) => {
        setLoading(true);
        try {
            axios.delete(`category/delete_category/${_id}`, { headers })
                .then(res => {
                    setLoading(false);
                    setDeleteConfirm(false)
                    setCallAgainApi(_id)
                }).catch(e => {
                    if (e.errors) {
                        setLoading(false);
                        console.log(e.errors);
                    }
                })
        } catch (e) {
            setLoading(false);
            console.log(e)
        }
    }
    return (
        <>
            <CRow>
                <CCol>
                    <CCard style={{ minHeight: "80vh" }}>
                        <CCardHeader style={{ border: "0px" }}>
                            <CRow style={{ display: "contents" }}>
                                <strong>Product</strong>
                                <CButton color="info" style={{ float: "right" }} onClick={() => { history.push("/add-products") }}>
                                    Add Product
                                </CButton>
                            </CRow>
                        </CCardHeader>
                        <CCardHeader style={{ padding: "0.25rem" }}>
                            <CFormGroup  >
                                <CCol md="6" >
                                    <CInputGroup>
                                        <CInput id="input1-group2" name="input1-group2" placeholder="Search" />
                                        <CInputGroupAppend>
                                            <CButton type="button" color="success"><CIcon name="cil-magnifying-glass" /> </CButton>
                                        </CInputGroupAppend>
                                    </CInputGroup>
                                </CCol>
                            </CFormGroup>
                        </CCardHeader>
                        <CCardBody >
                            <CDataTable
                                items={products}
                                fields={fields}
                                responsive={true}
                                outlined
                                itemsPerPage={10}
                                pagination
                                activePage
                                hover
                                underTableSlot={`Total: ${total}`}
                                itemsPerPageSelect={{ label: 'Products per page:', values: [5, 10, 20, 50, 100] }}
                                scopedSlots={{
                                    '#':
                                        (item, i) => (
                                            <td>
                                                <CBadge color={i + 1}>
                                                    {i + 1}
                                                </CBadge>
                                            </td>
                                        ),
                                    'Image':
                                        (item) => (
                                            <td>
                                                <img width="30px" src={item.image_url} alt="img" />
                                            </td>
                                        ),
                                    'Name':
                                        (item) => (
                                            <td>
                                                {item.product_name}
                                            </td>
                                        ),
                                    'Category':
                                        (item) => (
                                            <td>
                                                {item.product_count}
                                            </td>
                                        ),
                                    'Brand':
                                        (item) => (
                                            <td>
                                                {item.order_no}
                                            </td>
                                        ),
                                    'Price':
                                        (item) => (
                                            <td>
                                                {item.order_no}
                                            </td>
                                        ),
                                    'Display Home':
                                        (item) => (
                                            <td>
                                                {item.display_home ? "Show" : "Hide"}
                                            </td>
                                        ),
                                    'Status':
                                        (item) => (
                                            <td>
                                                <CBadge color={getBadge(item.status)}>
                                                    {item.status ? "Active" : "Inactive"}
                                                </CBadge>
                                            </td>
                                        ),
                                    'Order':
                                        (item) => (
                                            <td>
                                                {item.order_no}
                                            </td>
                                        ),
                                    'Action':
                                        (item) => (

                                            <td>
                                                <Edit color="gray" style={{ cursor: 'pointer' }} onClick={() => { history.push(`/edit-products/${item._id}`) }} size={20}
                                                />
                                                <Trash color="red" style={{ cursor: 'pointer' }} onClick={() => {
                                                    setDeleteConfirm(!deleteConfirm), setDeleteProductId(item._id)
                                                }} size={20}
                                                />
                                            </td>
                                        )
                                }}
                            />
                        </CCardBody>
                    </CCard>

                    <CModal
                        show={deleteConfirm}
                        style={{ top: "10rem" }}
                        onClose={() => setDeleteConfirm(!deleteConfirm)}
                        size="sm"
                    >
                        <CModalHeader closeButton>
                            <CModalTitle>Are you sure ?</CModalTitle>
                        </CModalHeader>


                        <CModalBody>
                            Do you want to delete this Product
                        </CModalBody>
                        <CModalFooter >
                            <CButton style={{ "margin-right": "2rem" }} color="secondary" onClick={() => setDeleteConfirm(!deleteConfirm)}>Cancel</CButton>
                            <CButton color="danger" onClick={() => deleteProduct(deleteProductId)}>{loading ? "Deleting" : "Delete"}</CButton>{' '}
                        </CModalFooter>
                    </CModal>
                </CCol>
            </CRow>
        </>
    )
}

export default AllProducts