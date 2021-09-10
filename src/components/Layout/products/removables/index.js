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

const fields = ['#', 'Name', 'Edit', 'Delete']

const Removables = () => {
    const admin = getToken()
    let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }
    const [removables, setRemovables] = useState([])
    const [total, setTotal] = useState("")
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [removableAdded, setRemovableAdded] = useState('')
    const [deleteRemovableId, setDeleteRemovableId] = useState("")
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [editRemovable, setEditRemovable] = useState(false)
    const [errors, setErrors] = useState({
        nameError: false,
        name: '',
    })
    const [removable, setRemovable] = useState({
        name: '',
        _id: ''
    })

    const setRemovableData = (name: string, value: any) => {
        setRemovable(prev => {
            return {
                ...prev,
                [name]: value
            }
        });
    };

    useEffect(() => {
        try {
            axios.get('removable/', { headers })
                .then((response) => {
                    console.log("zzz", response);
                    if (response) {
                        if (response?.data?.status_code === 200) {
                            setRemovables(response?.data?.data?.removable)
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
    }, [removableAdded])

    const handleValidation = () => {
        let formIsValid = true;
        let errors = {};
        if (!removable.name || removable.name == '') {
            formIsValid = false;
            errors["name"] = 'This field is required';
            errors["nameError"] = true;
        }
        console.log(errors);
        setErrors(errors);
        return formIsValid;
    }

    const saveRemovable = async () => {
        setLoading(true);
        if (handleValidation() == true) {
            try {
                axios.post('removable/add_removable/', removable, { headers })
                    .then(res => {
                        setRemovable({
                            name: '',
                            _id: ''
                        })
                        setLoading(false);
                        setModal(false)
                        setRemovableAdded(res?.data?.data?.removable?.name)
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

    const updateRemovable = async () => {
        setLoading(true);
        if (handleValidation() == true) {
            try {
                axios.put(`removable/update_removable/${removable._id}`, removable, { headers })
                    .then(res => {
                        setRemovable({
                            name: '',
                            _id: ''
                        })
                        setLoading(false);
                        setModal(false)
                        setRemovableAdded(res?.data?.data?.removable?.name)
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
        setEditRemovable(true)
        setRemovable({
            name: name,
            _id: _id
        })
    }

    const deleteRemovable = async (_id) => {
        setLoading(true);
        try {
            axios.delete(`removable/delete_removable/${_id}`, { headers })
                .then(res => {
                    setLoading(false);
                    setDeleteConfirm(false)
                    setRemovableAdded(_id)
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
                                <strong>Removables</strong>
                                <CButton color="info" style={{ float: "right" }} onClick={() => setModal(!modal)}>
                                    Add Removable
                                </CButton>
                            </CRow>
                        </CCardHeader>
                        <CCardHeader style={{ padding: "0.25rem" }}>
                            <CFormGroup  >
                                <CCol md="6" >
                                    <CInputGroup>
                                        <CInput id="input1-group2" name="input1-group2" placeholder="Removable Name" />
                                        <CInputGroupAppend>
                                            <CButton type="button" color="success"><CIcon name="cil-magnifying-glass" /> Search</CButton>
                                        </CInputGroupAppend>
                                    </CInputGroup>
                                </CCol>
                            </CFormGroup>
                        </CCardHeader>
                        <CCardBody >
                            <CDataTable
                                items={removables}
                                fields={fields}
                                responsive={true}
                                outlined
                                itemsPerPage={10}
                                pagination
                                activePage
                                hover
                                underTableSlot={`Total: ${total}`}
                                itemsPerPageSelect={{ label: 'Removables per page:', values: [5, 10, 20, 50, 100] }}
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
                                                <Trash color="red" style={{ cursor: 'pointer' }} onClick={() => (
                                                    setDeleteConfirm(!deleteConfirm), setDeleteRemovableId(item._id)
                                                )} size={20}
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
                        onClose={() => (
                            setModal(!modal),
                            editRemovable ? setEditRemovable(false) : null
                        )}
                        color="info"
                    >
                        <CModalHeader closeButton>
                            <CModalTitle>{editRemovable ? "Edit Removable" : "Add Removable"}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CFormGroup row>
                                <CCol xs="12" md="12">
                                    <CLabel htmlFor="name">Removable Name</CLabel>
                                    <CInput
                                        type="text"
                                        id="text-input"
                                        error={errors.name}
                                        value={removable.name}
                                        onChange={e => setRemovableData("name", e.target.value)}
                                        placeholder="Removable name"
                                        autoComplete="text-input"
                                    />
                                    {errors.nameError ? <CFormText className="help-block" value={errors.name}>Removable name is required</CFormText> : null}
                                </CCol>
                            </CFormGroup>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => (
                                setModal(!modal),
                                editRemovable ? setEditRemovable(false) : null
                            )}>Cancel</CButton>
                            {
                                editRemovable ?
                                    <CButton
                                        color="danger"
                                        onClick={e => {
                                            e.preventDefault();
                                            updateRemovable();
                                        }}
                                    >{loading ? "Updating Removable" : "Update Removable"}</CButton>
                                    :
                                    <CButton
                                        color="danger"
                                        onClick={e => {
                                            e.preventDefault();
                                            saveRemovable();
                                        }}
                                    >{loading ? "Saving Removable" : "Add Removable"}</CButton>
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
                            Do you want to delete this Removable
                        </CModalBody>
                        <CModalFooter >
                            <CButton style={{ "margin-right": "2rem" }} color="secondary" onClick={() => setDeleteConfirm(!deleteConfirm)}>Cancel</CButton>
                            <CButton color="danger" onClick={() => deleteRemovable(deleteRemovableId)}>Delete</CButton>{' '}
                        </CModalFooter>
                    </CModal>
                </CCol>
            </CRow>
        </>
    )
}

export default Removables
