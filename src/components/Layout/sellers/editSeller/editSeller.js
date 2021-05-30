import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFade,
  CForm,
  CFormGroup,
  CFormText,
  CValidFeedback,
  CInvalidFeedback,
  CTextarea,
  CInput,
  CInputFile,
  CInputCheckbox,
  CInputRadio,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CDropdown,
  CInputGroupText,
  CLabel,
  CSelect,
  CRow,
  CSwitch,
  CContainer,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { setSellerRegister, setSellerregisteringDone } from '../../../../redux/actions/sellerActions'
import { getToken, axios } from '../../../../reusable'


const EditSeller = () => {
  const admin = getToken()
  let headers = {
    'Accept': 'application/json',
    "Authorization": `Bearer ${admin}`
  }
  const sellerRegistered = useSelector((state) => state.sellerData.sellerRegistering)
  const dispatch = useDispatch();
  let { sellerId } = useParams()


  const [seller, setSeller] = useState({
    business_name: '',
    mobile: '',
    email: '',
    status: '',
    verifyStatus: ''
  })
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ any: [] })

  const handleValidation = () => {
    
    let errors = {};
    let formIsValid = true;
    if (!seller.business_name) {
      formIsValid = false;
      errors["business_name"] = "This field required";
    }
    if (!seller.mobile) {
      formIsValid = false;
      errors["mobile"] = "This field required";
    }
    if (!seller.email) {
      formIsValid = false;
      errors["email"] = "This field required";
    }
    if (!seller.status) {
      formIsValid = false;
      errors["status"] = "This field required";
    }
    if (!seller.verifyStatus) {
      formIsValid = false;
      errors["verifyStatus"] = "This field required";
    }
    setErrors(errors);
    console.log('hi', errors);
    return formIsValid;
  }

  const updateSeller = async () => {
    setLoading(true);
    if (handleValidation()) {
      try {
        console.log("seller", seller);
        let response = await axios
          .post('sellers/update-seller-details', seller, { headers })
          .catch(err => {
            console.log(err);
          })
        if (response) {
          if (response?.data?.status_code === 200) {
            dispatch(setSellerRegister())
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    setLoading(false);
  };

  const setParam = (name: string, value: any) => {
    setSeller(prev => {
      return {
        ...prev,
        [name]: value
      }
    });
  };

  const history = useHistory();
  useEffect(async () => {
    try {
      if (sellerRegistered) {
        dispatch(setSellerregisteringDone(true))
        history.push(`/seller-details/${sellerId}`)
      } else {
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
      }
    } catch (e) {
      console.log(e);
    }

  }, [sellerRegistered])

  return (
    <>
      <CRow>
        <CCol xs="12" md="12">
          <CCard >
            <CCardHeader>
              Edit seller
            </CCardHeader>
            <CCardBody>
              <CForm
                // method="post"
                // encType="multipart/form-data"
                className="form-horizontal"
              >
                {/* <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CInput id="text-input" name="text-input" placeholder="Domain Name" />
                    <CFormText>This is a help text</CFormText>
                  </CCol>
                </CFormGroup> */}

                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CLabel htmlFor="name">Business Name</CLabel>
                    <CInput
                      type="text-input"
                      error={errors.business_name}
                      value={seller.business_name}
                      onChange={e => setParam("business_name", e.target.value)}
                      id="text-input"
                      name="business_name"
                      placeholder="Business Name"
                      autoComplete="text-input"
                    />
                    {errors.business_name ? <CFormText className="help-block" value={errors.business_name}>Please enter your business name</CFormText> : null}
                    
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CLabel htmlFor="name">Mobile Number</CLabel>
                    <CInput
                      type="text-input"
                      id="text-input"
                      name="mobile"
                      error={errors.mobile}
                      value={seller.mobile}
                      onChange={e => setParam("mobile", e.target.value)}
                      placeholder="Mobile Number"
                      autoComplete="text-input"
                    />
                    {errors.mobile ? <CFormText className="help-block" value={errors.mobile}>Please enter your mobile number</CFormText> : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CLabel htmlFor="name">Email</CLabel>
                    <CInput
                      type="email"
                      id="email-input"
                      name="email"
                      error={errors.email}
                      value={seller.email}
                      onChange={e => setParam("email", e.target.value)}
                      placeholder="Email"
                      autoComplete="email"
                    />
                    {errors.email ? <CFormText className="help-block" value={errors.email}>Please enter your email</CFormText> : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CLabel htmlFor="name">Status</CLabel>
                    <CSelect
                      custom
                      name="status"
                      error={errors.status}
                      value={seller.status}
                      onChange={e => setParam("status", e.target.value)}
                      id="select"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Block">Block</option>
                    </CSelect>
                    {errors.status ? <CFormText className="help-block" value={errors.status}>Please select a status</CFormText> : null}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CLabel htmlFor="name">Verify status</CLabel>
                    <CSelect
                      custom
                      name="verifyStatus"
                      error={errors.verifyStatus}
                      value={seller.verifyStatus}
                      onChange={e => setParam("verifyStatus", e.target.value)}
                      id="select"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                    </CSelect>
                    {errors.verifyStatus ? <CFormText className="help-block" value={errors.verifyStatus}>Please select a verify status</CFormText> : null}
                  </CCol>
                </CFormGroup>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton
                className="m-1"
                type="submit"
                size="m"
                onClick={e => {
                  e.preventDefault();
                  updateSeller();
                }}
                color="primary"
              >
                {loading ? "Submiting.." : "Submit"}
              </CButton>
              {/* <CButton type="reset" size="sm" color="danger"><CIcon name="cil-ban" /> Reset</CButton> */}
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default EditSeller
