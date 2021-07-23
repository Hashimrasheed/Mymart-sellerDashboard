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
    CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const fields = ['#', 'Option', 'Option Types', 'Created At', 'Edit', 'Delete']

const OptionValues = () => {
    const admin = getToken()
    let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }
    const [optionValues, setOptionValues] = useState([])
    const [optionTypes, setOptionTypes] = useState([])
    const [total, setTotal] = useState("")
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [optionValueAdded, setOptionValueAdded] = useState('')
    const [deleteOptionValueId, setDeleteOptionValueId] = useState("")
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [editOptionValue, setEditOptionValue] = useState(false)
    const [errors, setErrors] = useState({
        nameError: false,
        name: '',
        typeError: false,
        type: '',
    })
    const [optionValue, setOptionValue] = useState({
        optionValue: '',
        optionType: '',
        optionTypeId: '',
        _id: ''
    })

    const setOptionValueData = (name: string, value: any) => {
        setOptionValue(prev => {
            return {
                ...prev,
                [name]: value
            }
        });
    };

    useEffect(() => {
        try {
            axios.get('optionValue/getAllOptions/', { headers })
                .then((response) => {
                    console.log("zzz", response);
                    if (response) {
                        if (response?.data?.status_code === 200) {
                            setOptionValues(response?.data?.data?.OptionValue)
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
    }, [optionValueAdded])

    const handleValidation = () => {
        let formIsValid = true;
        let errors = {};

        if (!optionValue.optionValue || optionValue.optionValue == '') {
            formIsValid = false;
            errors["name"] = 'This field is required';
            errors["nameError"] = true;
        }
        if (!optionValue.optionTypeId || optionValue.optionTypeId == '') {
            formIsValid = false;
            errors["type"] = 'This field is required';
            errors["typeError"] = true;
        }
        console.log(errors);
        setErrors(errors);
        return formIsValid;
    }
    const fetchOptionTypes = async () => {
        setModal(!modal)
        try {
            axios.get('optionType/getAllOptionsType/', { headers })
                .then((response) => {
                    console.log("zzz", response);
                    if (response) {
                        if (response?.data?.status_code === 200) {
                            setOptionTypes(response?.data?.data?.optionsType)
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        } catch (e) {
            console.log(e);
        }
    }

    const saveOptionValue = async () => {
        setLoading(true);
        if (handleValidation()) {
            try {
                let data = {
                    type: optionValue.optionTypeId,
                    name: optionValue.optionValue,
                }
                axios.post('optionValue/addOptions/', data, { headers })
                    .then(res => {
                        setOptionValue({
                            optionValue: '',
                            optionType: '',
                            optionTypeId: '',
                            _id: ''
                        })
                        setLoading(false);
                        setModal(false)
                        setOptionValueAdded(res?.data?.data?.name)
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

    const updateOptionValue = async () => {
        setLoading(true);
        if (handleValidation() == true) {
            try {
                let data = {
                    type: optionValue.optionTypeId,
                    name: optionValue.optionValue,
                    _id: optionValue._id
                }
                axios.put(`optionValue/editOption/${optionValue._id}`, data, { headers })
                    .then(res => {
                        setOptionValue({
                            optionValue: '',
                            optionType: '',
                            optionTypeId: '',
                            _id: ''
                        })
                        setLoading(false);
                        setModal(false)
                        setOptionValueAdded(new Date())
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

    const openEditPage = (_id, optionValue, optionTypeId, optionType) => {
        fetchOptionTypes()
        setEditOptionValue(true)
        setOptionValue({
            optionValue: optionValue,
            optionType: optionType,
            optionTypeId: optionTypeId,
            _id: _id
        })
    }

    const deleteOptionValue = async (_id) => {
        setLoading(true);
        try {
            axios.delete(`optionValue/deleteOption/${_id}`, { headers })
                .then(res => {
                    setLoading(false);
                    setDeleteConfirm(false)
                    setOptionValueAdded(_id)
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
                                <strong>Option Values</strong>
                                <CButton color="info" style={{ float: "right" }} onClick={fetchOptionTypes}>
                                    Add Option Values
                                </CButton>
                            </CRow>
                        </CCardHeader>
                        <CCardHeader style={{ padding: "0.25rem" }}>
                            <CFormGroup  >
                                <CCol md="6" >
                                    <CInputGroup>
                                        <CInput id="input1-group2" name="input1-group2" placeholder="Option Value Name" />
                                        <CInputGroupAppend>
                                            <CButton type="button" color="success"><CIcon name="cil-magnifying-glass" /> Search</CButton>
                                        </CInputGroupAppend>
                                    </CInputGroup>
                                </CCol>
                            </CFormGroup>
                        </CCardHeader>
                        <CCardBody >
                            <CDataTable
                                items={optionValues}
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
                                    'Option':
                                        (item) => (
                                            <td>
                                                {item.name}
                                            </td>
                                        ),
                                    'Option Types':
                                        (item) => (
                                            <td>
                                                {item?.type?.name}
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
                                                    openEditPage(item._id, item.name, item?.type?._id, item?.type?.name)
                                                }} size={20}
                                                />
                                            </td>
                                        ),
                                    'Delete':
                                        (item) => (
                                            <td>
                                                <Trash color="red" style={{ cursor: 'pointer' }} onClick={() => {
                                                    setDeleteConfirm(!deleteConfirm), setDeleteOptionValueId(item._id)
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
                            setModal(!modal);
                            editOptionValue ? setEditOptionValue(false) : null
                        }}
                        color="info"
                    >
                        <CModalHeader closeButton>
                            <CModalTitle>{editOptionValue ? "Edit Option Value" : "Add Option Value"}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="name">Option Type</CLabel>
                                    <CSelect
                                        type="text"
                                        value={optionValue.optionTypeId}
                                        onChange={e => setOptionValueData("optionTypeId", e.target.value)}
                                        id="select"
                                    >
                                        {
                                            optionTypes ?
                                                optionTypes.map((type) => {
                                                    return <option value={type._id}>{type.name}</option>
                                                })
                                                : null
                                        }
                                    </CSelect>
                                    {errors.typeError ? <CFormText className="help-block" value={errors.type}>Option Type is required</CFormText> : null}
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="name">Option Value Name</CLabel>
                                    <CInput
                                        type="text"
                                        id="text-input"
                                        error={errors.name}
                                        value={optionValue.optionValue}
                                        onChange={e => setOptionValueData("optionValue", e.target.value)}
                                        placeholder="Option Value name"
                                        autoComplete="text-input"
                                    />
                                    {errors.nameError ? <CFormText className="help-block" value={errors.name}>Option Value name is required</CFormText> : null}
                                </CCol>
                            </CFormGroup>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => {
                                setModal(!modal);
                                editOptionValue ? setEditOptionValue(false) : null
                            }}>Cancel</CButton>
                            {
                                editOptionValue ?
                                    <CButton
                                        color="danger"
                                        onClick={e => {
                                            e.preventDefault();
                                            updateOptionValue();
                                        }}
                                    >{loading ? "Updating Option" : "Update Option"}</CButton>
                                    :
                                    <CButton
                                        color="danger"
                                        onClick={e => {
                                            e.preventDefault();
                                            saveOptionValue();
                                        }}
                                    >{loading ? "Saving Option" : "Add Option"}</CButton>
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
                            Do you want to delete this Option Value
                        </CModalBody>
                        <CModalFooter >
                            <CButton style={{ "margin-right": "2rem" }} color="secondary" onClick={() => setDeleteConfirm(!deleteConfirm)}>Cancel</CButton>
                            <CButton color="danger" onClick={() => deleteOptionValue(deleteOptionValueId)}>Delete</CButton>{' '}
                        </CModalFooter>
                    </CModal>
                </CCol>
            </CRow>
        </>
    )
}

export default OptionValues
