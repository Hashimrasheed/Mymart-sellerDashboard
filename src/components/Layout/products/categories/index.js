import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { getToken, axios } from '../../../../reusable'
import { Image, Edit, Trash } from "react-feather";
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

const fields = ['#', 'Image', 'Name', 'Products', 'Order No', 'Display Home', 'Status', 'Edit', 'Delete']

const Categories = () => {
    const admin = getToken()
    let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }
    const [categories, setCategories] = useState([])
    const [total, setTotal] = useState("")
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [categoryAdded, setCategoryAdded] = useState('')
    const [deleteCategoryId, setDeleteCategoryId] = useState("")
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [editCategory, setEditCategory] = useState(false)
    const [errors, setErrors] = useState({
        cat_nameError: false,
        cat_name: '',
    })
    const [category, setCategory] = useState({
        cat_name: '',
        status: false,
        display_home: false,
        order_no: '',
        image: '',
        image_url: '',
        _id: ''
    })
    const inputFile = useRef(null)

    const setCategoryData = (name: string, value: any) => {
        if (name === "status") {
            value = JSON.parse(value)
        }
        setCategory(prev => {
            return {
                ...prev,
                [name]: value
            }
        });
    };

    useEffect(() => {
        try {
            axios.get('category/', { headers })
                .then((response) => {
                    console.log("zzz", response);
                    if (response) {
                        if (response?.data?.status_code === 200) {
                            setCategories(response?.data?.data?.category)
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
    }, [categoryAdded])

    const openFileInput = async () => {
        await inputFile.current.click();
    };

    const handleImageUpload = (e) => {
        setCategoryData("image_url", null)
        setCategoryData("image", e.target.files[0])
    }

    const handleValidation = () => {
        let formIsValid = true;
        let errors = {};

        if (!category.cat_name || category.cat_name == '') {
            formIsValid = false;
            errors["cat_name"] = 'This field is required';
            errors["cat_nameError"] = true;
        }
        console.log(errors);
        setErrors(errors);
        return formIsValid;
    }

    const saveCategory = async () => {
        setLoading(true);
        if (handleValidation() == true) {
            try {
                let formData = new FormData()
                formData.append('image', category.image);
                formData.append("cat_name", category.cat_name);
                formData.append("display_home", category.display_home);
                formData.append("order_no", category.order_no);
                formData.append("status", category.status);
                axios.post('category/add_category/', formData, { headers })
                    .then(res => {
                        setCategory({
                            cat_name: '',
                            display_home: false,
                            order_no: '',
                            status: false,
                            image: '',
                            image_url: '',
                            _id: ''
                        })
                        setLoading(false);
                        setModal(false)
                        setCategoryAdded(res?.data?.data?.category?.result?.cat_name)
                    }).catch(e => {
                        if (e.errors) {
                            setLoading(false);
                            setErrors(e.errors)
                        }
                    })
            } catch (e) {
                setLoading(false);
                console.log(e)
            }
        } else {
            setLoading(false);
        }
    }

    const updateCategory = async () => {
        setLoading(true);
        if (handleValidation() == true) {
            try {
                let formData = new FormData()
                formData.append('image', category.image);
                formData.append("cat_name", category.cat_name);
                formData.append("display_home", category.display_home);
                formData.append("order_no", category.order_no);
                formData.append("status", category.status);
                formData.append("_id", category._id);
                axios.put(`category/update_category/${category._id}`, formData, { headers })
                    .then(res => {
                        setCategory({
                            cat_name: '',
                            display_home: false,
                            order_no: '',
                            status: false,
                            image: '',
                            image_url: '',
                            _id: ''
                        })
                        setLoading(false);
                        setModal(false)
                        setCategoryAdded(res?.data?.data?.category?.cat_name)
                    }).catch(e => {
                        if (e.errors) {
                            setLoading(false);
                            setErrors(e.errors)
                        }
                    })
            } catch (e) {
                setLoading(false);
                console.log(e)
            }
        } else {
            setLoading(false);
        }
    }

    const openEditPage = (_id, image_url, cat_name, order_no, display_home, status) => {
        setModal(!modal);
        setEditCategory(true)
        setCategory({
            cat_name: cat_name,
            display_home: display_home,
            order_no: order_no,
            status: status,
            image: '',
            image_url: image_url,
            _id: _id
        })
    }

    const deleteCategory = async (_id) => {
        setLoading(true);
        try {
            axios.delete(`category/delete_category/${_id}`, { headers })
                .then(res => {
                    setLoading(false);
                    setDeleteConfirm(false)
                    setCategoryAdded(_id)
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
                                <strong>Categories</strong>
                                <CButton color="info" style={{ float: "right" }} onClick={() => setModal(!modal)}>
                                    Add Category
                                </CButton>
                            </CRow>
                        </CCardHeader>
                        <CCardHeader style={{ padding: "0.25rem" }}>
                            <CFormGroup  >
                                <CCol md="6" >
                                    <CInputGroup>
                                        <CInput id="input1-group2" name="input1-group2" placeholder="Category Name" />
                                        <CInputGroupAppend>
                                            <CButton type="button" color="success"><CIcon name="cil-magnifying-glass" /> Search</CButton>
                                        </CInputGroupAppend>
                                    </CInputGroup>
                                </CCol>
                            </CFormGroup>
                        </CCardHeader>
                        <CCardBody >
                            <CDataTable
                                items={categories}
                                fields={fields}
                                responsive={true}
                                outlined
                                itemsPerPage={10}
                                pagination
                                activePage
                                hover
                                underTableSlot={`Total: ${total}`}
                                itemsPerPageSelect={{ label: 'Categories per page:', values: [5, 10, 20, 50, 100] }}
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
                                                {item.cat_name}
                                            </td>
                                        ),
                                    'Products':
                                        (item) => (
                                            <td>
                                                {item.product_count}
                                            </td>
                                        ),
                                    'Order No':
                                        (item) => (
                                            <td>
                                                {item.order_no}
                                            </td>
                                        ),
                                    'Display Home':
                                        (item) => (
                                            <td>
                                                {item.display_home ? "Show": "Hide"}
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
                                    'Edit':
                                        (item) => (
                                            <td>
                                                <Edit color="gray" style={{ cursor: 'pointer' }} onClick={() => {
                                                    openEditPage(item._id, item.image_url, item.cat_name, item.order_no, item.display_home, item.status)
                                                }} size={20}
                                                />
                                            </td>
                                        ),
                                    'Delete':
                                        (item) => (
                                            <td>
                                                <Trash color="red" style={{ cursor: 'pointer' }} onClick={() => {
                                                    return setDeleteConfirm(!deleteConfirm), setDeleteCategoryId(item._id)
                                                }} size={20}
                                                />
                                            </td>
                                        )
                                }}
                            />
                        </CCardBody>
                    </CCard>

                    <CModal
                        show={modal}
                        style={{ top: "5rem" }}
                        onClose={() => {
                            return (

                                setModal(!modal),
                                editCategory ? setEditCategory(false) : null
                                )
                        }}
                        color="info"
                    >
                        <CModalHeader closeButton>
                            <CModalTitle>{editCategory ? "Edit Category" : "Add Category"}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <div style={{ "margin-left": "35%" }}>
                                {console.log("category", category)}
                                {
                                    category.image || category.image_url ? <div>
                                        <img style={{ width: "6rem" }} src={category.image_url ? category.image_url : category.image ? URL.createObjectURL(category.image) : ""} alt="category img" />
                                    </div>
                                        : null
                                }
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <CLabel htmlFor="name">Category Image</CLabel>
                                        <Image onClick={e => {
                                            openFileInput()
                                        }} color="blue" style={{ cursor: 'pointer' }} size={20}
                                        />
                                        <input type='file' onChange={handleImageUpload} accept="jpg png jpeg" id='file' ref={inputFile} style={{ display: 'none' }} /> 
                                    </CCol>
                                </CFormGroup>
                            </div>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="name">Category Name</CLabel>
                                    <CInput
                                        type="text"
                                        id="text-input"
                                        error={errors.cat_name}
                                        value={category.cat_name}
                                        onChange={e => setCategoryData("cat_name", e.target.value)}
                                        placeholder="Category name"
                                        autoComplete="text-input"
                                    />
                                    {errors.cat_nameError ? <CFormText className="help-block" value={errors.cat_name}>Category name is required</CFormText> : null}
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="name">Order Number</CLabel>
                                    <CInput
                                        type="number"
                                        id="text-input"
                                        value={category.order_no}
                                        onChange={e => setCategoryData("order_no", e.target.value)}
                                        placeholder="Category order number"
                                        autoComplete="text-input"
                                    />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="name">Display Home</CLabel>
                                    <CSelect
                                        type="text"
                                        value={category.display_home}
                                        onChange={e => setCategoryData("display_home", e.target.value)}
                                        id="select"
                                    >
                                        <option value={true}>Show</option>
                                        <option value={false}>Hide</option>
                                    </CSelect>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="name">Status</CLabel>
                                    <CSelect
                                        name="status"
                                        type="text"
                                        value={category.status}
                                        onChange={e => setCategoryData("status", e.target.value)}
                                        id="select"
                                    >
                                        <option value={true}>Active</option>
                                        <option value={false}>Inactive</option>
                                    </CSelect>
                                </CCol>
                            </CFormGroup>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => {
                                return(
                                    setModal(!modal),
                                    editCategory ? setEditCategory(false) : null
                                    )
                            }}>Cancel</CButton>
                            {
                                editCategory ?
                                    <CButton
                                        color="danger"
                                        onClick={e => {
                                            e.preventDefault();
                                            updateCategory();
                                        }}
                                    >{loading ? "Updating Category" : "Update Category"}</CButton>
                                    :
                                    <CButton
                                        color="danger"
                                        onClick={e => {
                                            e.preventDefault();
                                            saveCategory();
                                        }}
                                    >{loading ? "Saving Category" : "Add Category"}</CButton>
                            }
                        </CModalFooter>
                    </CModal>

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
                            Do you want to delete this Category
                        </CModalBody>
                        <CModalFooter >
                            <CButton style={{ "margin-right": "2rem" }} color="secondary" onClick={() => setDeleteConfirm(!deleteConfirm)}>Cancel</CButton>
                            <CButton color="danger" onClick={() => deleteCategory(deleteCategoryId)}>Delete</CButton>{' '}
                        </CModalFooter>
                    </CModal>
                </CCol>
            </CRow>
        </>
    )
}

export default Categories
