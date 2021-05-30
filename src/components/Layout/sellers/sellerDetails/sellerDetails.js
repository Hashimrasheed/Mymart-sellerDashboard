import React, { useEffect, useState } from 'react'
import moment from 'moment'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormGroup,
    CInput,
    CLabel,
    CRow,
    CContainer,
    CInputGroup,
    CInputGroupAppend,
    CFormText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { setExpiryDate, setExpiryDateDone } from '../../../../redux/actions/sellerActions'
import { passwordShow, passwordHide } from '../../../../redux/actions/common'
import { getToken, axios } from '../../../../reusable'


const EditSeller = () => {
    const admin = getToken()
    const changeExpiryDate = useSelector((state) => state.sellerData.expiryDateUpdating)
    const showPass = useSelector((state) => state.common.PasswordShowOrHide)
    const dispatch = useDispatch();
    let { sellerId } = useParams()

    let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ any: [] })
    const [pError, setPErrors] = useState({ any: [] })
    const [seller, setSeller] = useState('')
    const [changeP, setChangeP] = useState({
        password: '',
        Cpassword: ''
    })
    const [info, setModal] = useState(false)
    const [params, setParams] = useState({
        expiryDate: ''
    })

    const setParam = (name: string, value: any) => {
        setParams(prev => {
            return {
                ...prev,
                [name]: value
            }
        });
    };
    const setPassword = (name: string, value: any) => {
        setChangeP(prev => {
            return {
                ...prev,
                [name]: value
            }
        });
    };
    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        if (!params.expiryDate) {
            formIsValid = false;
            errors["expiryDate"] = "This field required";
        }
        setErrors(errors);
        return formIsValid;
    }
    const handlePasswordValidation = () => {
        let errors = {};
        let formIsValid = true;
        if (changeP.Cpassword !== changeP.password) {
            formIsValid = false;
            errors["passwordMatch"] = "This field required";
        }
        if (!changeP.password) {
            formIsValid = false;
            errors["password"] = "This field required";
        }
        if (!changeP.Cpassword) {
            formIsValid = false;
            errors["Cpassword"] = "This field required";
        }
        setPErrors(errors);
        return formIsValid;
    }
    const updateExpiryDate = async () => {
        setLoading(true);
        if (handleValidation()) {
            try {
                let response = await axios
                    .put(`sellers/update-expirydate/${sellerId}`, params, { headers })
                    .catch(err => {
                        console.log(err);
                    })
                if (response) {
                    if (response?.data?.status_code === 200) {
                        setSeller({ ...seller, expiryDate: params.expiryDate })
                        dispatch(setExpiryDateDone())
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        setLoading(false);
    };
    
    const updatePassword = async () => {
        setLoading(true);
        if (handlePasswordValidation()) {
            try {
                let response = await axios
                    .post(`sellers/update-password`, {password: changeP.password, seller_id: sellerId}, { headers })
                    .catch(err => {
                        console.log(err);
                    })
                if (response) {
                    if (response?.data?.status_code === 200) {
                        setSeller({ ...seller, password: '' })
                        dispatch(passwordHide())
                        setModal(!info)
                        setPassword("password", '')
                        setPassword("Cpassword", '')
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        setLoading(false);
    };

    const history = useHistory();
    useEffect(async () => {
        try {
            dispatch(setExpiryDateDone())
            let headers = {
                'Accept': 'application/json',
                "Authorization": `Bearer ${admin}`
            }
            let response = await axios
                .get(`sellers/getSeller/${sellerId}`, { headers })
                .catch(err => {
                    console.log(err);
                })
            if (response) {
                if (response?.data?.status_code === 200) {
                    setSeller(response?.data?.data?.sellers)
                }
            }
        } catch (e) {
            console.log(e);
        }
    }, [])

    return (
        <>
            <CCard>
                <CCardHeader>
                    <CRow>
                        <CCol >
                            <CLabel htmlFor="text-input" ><h4 color="info">Seller Information</h4></CLabel>

                        </CCol>
                        <CCol className="ml-auto" xs="3" sm="2" md="1">
                            <CButton
                                block
                                variant="ghost"
                                color="info"
                                onClick={() => {
                                    history.push(`/edit-seller/${sellerId}`)
                                }}
                            >
                                <CIcon name="cil-pencil" />
                            </CButton>
                        </CCol>
                    </CRow>

                </CCardHeader>
                <CCardBody>
                    <CContainer>
                        <CRow>
                            <CCol sm="12" lg="6">
                                <CForm>
                                    <CFormGroup row>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input"><h5>Business Name</h5></CLabel>
                                        </CCol>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input">{seller.business_name}</CLabel>
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input"><h5>Domain</h5></CLabel>
                                        </CCol>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input">{seller.subDomain}.mymart.com</CLabel>
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input"><h5>Expiry Date</h5></CLabel>
                                        </CCol>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input">{moment(seller.expiryDate).format('lll')}</CLabel>
                                        </CCol>
                                        {
                                            changeExpiryDate ?
                                                <>
                                                    <CCol xs="6" md="6">
                                                        <CInput
                                                            type="date"
                                                            id="date-input"
                                                            name="date-input"
                                                            placeholder="date"
                                                            error={errors.expiryDate}
                                                            value={params.expiryDate}
                                                            onChange={e => setParam("expiryDate", e.target.value)}
                                                            autoComplete="date-input"
                                                        />
                                                    </CCol>
                                                    <CButton
                                                        xs="6" md="6"
                                                        color="primary"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            updateExpiryDate();
                                                        }}
                                                    >
                                                        {loading ? 'Updating Expiry Date' : 'Update Expiry Date'}
                                                    </CButton>
                                                </>
                                                :
                                                <CButton
                                                    xs="6" md="6"
                                                    color="warning"
                                                    onClick={() => {
                                                        dispatch(setExpiryDate())
                                                    }}
                                                >
                                                    Change Expiry Date
                                        </CButton>
                                        }

                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input"><h5>Email</h5></CLabel>
                                        </CCol>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input">{seller.email}</CLabel>
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input"><h5>Mobile No</h5></CLabel>
                                        </CCol>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input">{seller.mobile}</CLabel>
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input"><h5>Status</h5></CLabel>
                                        </CCol>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input">{seller.status}</CLabel>
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input"><h5>Created At</h5></CLabel>
                                        </CCol>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="text-input">{moment(seller.createdAt).format('lll')}</CLabel>
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol xs="6" md="6">
                                            <CLabel htmlFor="password-input"><h5>Password</h5></CLabel>
                                        </CCol>
                                        <CButton
                                            xs="6" md="6"
                                            color="danger"
                                            onClick={() => setModal(!info)}
                                        >
                                            Change Password
                                        </CButton>
                                    </CFormGroup>
                                </CForm>
                            </CCol>
                        </CRow>
                    </CContainer>
                </CCardBody>
            </CCard>
            <CModal
                show={info}
                onClose={() => setModal(!info)}
                color="info"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Change password</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormGroup row>
                    <CCol xs="12" md="12">
                    {pError.passwordMatch ? <CFormText className="help-block" value={pError.passwordMatch}>Password is not matching..</CFormText> : null}

                    </CCol>

                        <CCol xs="12" md="12">
                            <CLabel htmlFor="name">Enter Password</CLabel>
                            <CInputGroup>
                                <CInput
                                    type={showPass ? "text" : "password"}
                                    id="text-input"
                                    name="password"
                                    error={pError.password}
                                    value={changeP.password}
                                    onChange={e => setPassword("password", e.target.value)}
                                    placeholder="Password"
                                    autoComplete="text-input"
                                />
                                <CInputGroupAppend>
                                    <CButton
                                        type="button"
                                        onClick={() => {
                                            dispatch(showPass ? passwordHide() : passwordShow())
                                        }}
                                        color="secondary"
                                    >{showPass ? "Hide" : "Show"}</CButton>
                                </CInputGroupAppend>
                            </CInputGroup>
                            {pError.password ? <CFormText className="help-block" value={pError.password}>Please enter password</CFormText> : null}
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol xs="12" md="12">
                            <CLabel htmlFor="name">Confirm Password</CLabel>
                            <CInput
                                type="password"
                                id="text-input"
                                name="Cpassword"
                                error={pError.Cpassword}
                                value={changeP.Cpassword}
                                onChange={e => setPassword("Cpassword", e.target.value)}
                                placeholder="CPassword"
                                autoComplete="text-input"
                            />
                            {pError.Cpassword ? <CFormText className="help-block" value={pError.password}>Please confirm password</CFormText> : null}
                        </CCol>
                    </CFormGroup>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModal(!info)}>Cancel</CButton>
                    <CButton
                        color="danger"
                        onClick={e => {
                            e.preventDefault();
                            updatePassword();
                        }}
                    >{loading ? "Updating password" : "Change password"}</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default EditSeller
