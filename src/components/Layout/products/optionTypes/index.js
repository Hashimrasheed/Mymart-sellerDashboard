import React, { useEffect, useRef, useState } from 'react'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const fields = ['#', 'Name', 'Created At', 'Edit', 'Delete']

const OptionTypes = () => {
    const admin = getToken()
    let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }
    const [optionTypes, setOptionTypes] = useState([])
    const [total, setTotal] = useState("")
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [optionTypeAdded, setOptionTypeAdded] = useState('')
    const [deleteOptionTypeId, setDeleteOptionTypeId] = useState("")
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [editOptionType, setEditOptionType] = useState(false)
    const [errors, setErrors] = useState({
        nameError: false,
        name: '',
    })
    const [optionType, setOptionType] = useState({
        name: '',
        _id: ''
    })

    const setOptionTypeData = (name: string, value: any) => {
        setOptionType(prev => {
            return {
                ...prev,
                [name]: value
            }
        });
    };

    useEffect(() => {
        try {
            axios.get('optionType/getAllOptionsType/', { headers })
                .then((response) => {
                    console.log("zzz", response);
                    if (response) {
                        if (response?.data?.status_code === 200) {
                            setOptionTypes(response?.data?.data?.optionsType)
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
    }, [optionTypeAdded])

    const handleValidation = () => {
        let formIsValid = true;
        let errors = {};

        if (!optionType.name || optionType.name == '') {
            formIsValid = false;
            errors["name"] = 'This field is required';
            errors["nameError"] = true;
        }
        console.log(errors);
        setErrors(errors);
        return formIsValid;
    }

    const saveOptionType = async () => {
        setLoading(true);
        if (handleValidation() == true) {
            try {
                axios.post('optionType/addOptionType/', optionType, { headers })
                    .then(res => {
                        setOptionType({
                            name: '',
                            _id: ''
                        })
                        setLoading(false);
                        setModal(false)
                        setOptionTypeAdded(res?.data?.data?.name)
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

    const updateOptionType = async () => {
        setLoading(true);
        if (handleValidation() == true) {
            try {
                axios.put(`optionType/editOptionType/${optionType._id}`, optionType, { headers })
                    .then(res => {
                        setOptionType({
                            name: '',
                            _id: ''
                        })
                        setLoading(false);
                        setModal(false)
                        setOptionTypeAdded(res?.data?.data?.name)
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

    const openEditPage = (_id, name) => {
        setModal(!modal);
        setEditOptionType(true)
        setOptionType({
            name: name,
            _id: _id
        })
    }

    const deleteOptionType = async (_id) => {
        setLoading(true);
        try {
            axios.delete(`optionType/deleteOptionType/${_id}`, { headers })
                .then(res => {
                    setLoading(false);
                    setDeleteConfirm(false)
                    setOptionTypeAdded(_id)
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
                                <strong>Option Types</strong>
                                <CButton color="info" style={{ float: "right" }} onClick={() => setModal(!modal)}>
                                    Add Option Types
                                </CButton>
                            </CRow>
                        </CCardHeader>
                        <CCardHeader style={{ padding: "0.25rem" }}>
                            <CFormGroup  >
                                <CCol md="6" >
                                    <CInputGroup>
                                        <CInput id="input1-group2" name="input1-group2" placeholder="Option Type Name" />
                                        <CInputGroupAppend>
                                            <CButton type="button" color="success"><CIcon name="cil-magnifying-glass" /> Search</CButton>
                                        </CInputGroupAppend>
                                    </CInputGroup>
                                </CCol>
                            </CFormGroup>
                        </CCardHeader>
                        <CCardBody >
                            <CDataTable
                                items={optionTypes}
                                fields={fields}
                                responsive={true}
                                outlined
                                itemsPerPage={10}
                                pagination
                                activePage
                                hover
                                underTableSlot={`Total: ${total}`}
                                itemsPerPageSelect={{ label: 'Options per page:', values: [5, 10, 20, 50, 100] }}
                                scopedSlots={{
                                    '#':
                                        (item, i) => (
                                            <td>
                                                <CBadge color={i + 1}>
                                                    {i + 1}
                                                </CBadge>
                                            </td>
                                        ),
                                    'Name':
                                        (item) => (
                                            <td>
                                                {item.name}
                                            </td>
                                        ),
                                    'Created At':
                                        (item) => (
                                            <td>
                                                {item.createdAt}
                                            </td>
                                        ),
                                    'Edit':
                                        (item) => (
                                            <td>
                                                <Edit color="gray" style={{ cursor: 'pointer' }} onClick={() => {
                                                    openEditPage(item._id, item.name)
                                                }} size={20}
                                                />
                                            </td>
                                        ),
                                    'Delete':
                                        (item) => (
                                            <td>
                                                <Trash color="red" style={{ cursor: 'pointer' }} onClick={() => {
                                                   return setDeleteConfirm(!deleteConfirm), setDeleteOptionTypeId(item._id)
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
                                editOptionType ? setEditOptionType(false) : null
                                )
                        }}
                        color="info"
                    >
                        <CModalHeader closeButton>
                            <CModalTitle>{editOptionType ? "Edit Option Type" : "Add Option Type"}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="name">Option Type Name</CLabel>
                                    <CInput
                                        type="text"
                                        id="text-input"
                                        error={errors.name}
                                        value={optionType.name}
                                        onChange={e => setOptionTypeData("name", e.target.value)}
                                        placeholder="Option type name"
                                        autoComplete="text-input"
                                    />
                                    {errors.nameError ? <CFormText className="help-block" value={errors.name}>Option type name is required</CFormText> : null}
                                </CCol>
                            </CFormGroup>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => {
                                return (
                                    setModal(!modal),
                                    editOptionType ? setEditOptionType(false) : null
                                    )
                            }}>Cancel</CButton>
                            {
                                editOptionType ?
                                    <CButton
                                        color="danger"
                                        onClick={e => {
                                            e.preventDefault();
                                            updateOptionType();
                                        }}
                                    >{loading ? "Updating Option Type" : "Update Option Type"}</CButton>
                                    :
                                    <CButton
                                        color="danger"
                                        onClick={e => {
                                            e.preventDefault();
                                            saveOptionType();
                                        }}
                                    >{loading ? "Saving Option Type" : "Add Option Type"}</CButton>
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
                            Do you want to delete this Option type
                        </CModalBody>
                        <CModalFooter >
                            <CButton style={{ "margin-right": "2rem" }} color="secondary" onClick={() => setDeleteConfirm(!deleteConfirm)}>Cancel</CButton>
                            <CButton color="danger" onClick={() => deleteOptionType(deleteOptionTypeId)}>Delete</CButton>{' '}
                        </CModalFooter>
                    </CModal>
                </CCol>
            </CRow>
        </>
    )
}

export default OptionTypes
