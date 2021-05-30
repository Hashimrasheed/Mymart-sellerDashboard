import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CSelect,
  CRow,
} from '@coreui/react'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { setSellerRegister, setSellerregisteringDone } from '../../../../redux/actions/sellerActions'
import {getToken, axios} from '../../../../reusable'


const RegisterSeller = () => {
  const admin = getToken()
  const sellerRegistered = useSelector((state) => state.sellerData.sellerRegistering)
  const dispatch = useDispatch();

  let response
  const [params, setParams] = useState({
    business_name: '',
    subDomain: '',
    country: '',
    mobile: '',
    email: '',
    password: '',
    confirm_password: '',
    validityUnit: '',
    validityValue: '',
  })
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ any: [] })

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    //Name
    if (!params.business_name) {
      formIsValid = false;
      errors["business_name"] = "This field required";
    }
    if (!params.subDomain) {
      formIsValid = false;
      errors["subDomain"] = "This field required";
    }
    if (!params.validityUnit) {
      formIsValid = false;
      errors["validityUnit"] = "This field required";
    }
    if (!params.validityValue) {
      formIsValid = false;
      errors["validityValue"] = "This field required";
    }
    if (!params.country) {
      formIsValid = false;
      errors["country"] = "This field required";
    }
    if (!params.mobile) {
      formIsValid = false;
      errors["mobile"] = "This field required";
    }
    if (!params.email) {
      formIsValid = false;
      errors["email"] = "This field required";
    }
    if (!params.password) {
      formIsValid = false;
      errors["password"] = "This field required";
    }
    //Password
    if (!params.confirm_password) {
      formIsValid = false;
      errors["confirm_password"] = "This field is required";
    }
    setErrors(errors);
    return formIsValid;
  }

  const registerSeller = async () => {
    setLoading(true);
    if (handleValidation()) {
      try {
        let headers = {
          'Accept': 'application/json',
          "Authorization": `Bearer ${admin}`
      }
        response = await axios
          .post('sellers/sellerSignup', params, {headers})
          .catch(err => {
            console.log(err);
          })
          if(response) {
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
    setParams(prev => {
      return {
        ...prev,
        [name]: value
      }
    });
  };

  const history = useHistory();
  useEffect(() => {
    console.log(sellerRegistered);
    if(sellerRegistered) {
      dispatch(setSellerregisteringDone(true))
        history.push("/sellers")
    }
    // fetchProduct()
  }, [sellerRegistered])

  return (
    <>
      <CRow>
        <CCol xs="12" md="12">
          <CCard >
            <CCardHeader>
              Register seller
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
                    <CInput
                      type="text-input"
                      error={errors.business_name}
                      value={params.business_name}
                      onChange={e => setParam("business_name", e.target.value)}
                      id="text-input"
                      name="business_name"
                      placeholder="Business Name"
                      autoComplete="text-input"
                    />
                    {/* <CFormText className="help-block">Please enter your email</CFormText> */}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="7" md="7">
                    <CInput
                      type="text-input"
                      id="text-input"
                      error={errors.subDomain}
                      value={params.subDomain}
                      onChange={e => setParam("subDomain", e.target.value)}
                      name="subDomain"
                      placeholder="Your Store Name"
                      autoComplete="text-input"
                    />
                    {/* <CFormText className="help-block">Please enter a complex password</CFormText> */}
                  </CCol>
                  <CCol xs="5" md="5">
                    <CLabel htmlFor="password-input">.mymart.com</CLabel>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CSelect
                      custom
                      name="country"
                      error={errors.country}
                      value={params.country}
                      onChange={e => setParam("country", e.target.value)}
                      id="select"
                    >
                      <option value="">Please select a Country</option>
                      <option value="India">India</option>
                      <option value="America">America</option>
                      <option value="China">China</option>
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CInput
                      type="text-input"
                      id="text-input"
                      name="mobile"
                      error={errors.mobile}
                      value={params.mobile}
                      onChange={e => setParam("mobile", e.target.value)}
                      placeholder="Mobile Number"
                      autoComplete="text-input"
                    />
                    {/* <CFormText className="help-block">Please enter a complex password</CFormText> */}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CInput
                      type="email"
                      id="email-input"
                      name="email"
                      error={errors.email}
                      value={params.email}
                      onChange={e => setParam("email", e.target.value)}
                      placeholder="Email"
                      autoComplete="email"
                    />
                    {/* <CFormText className="help-block">Please enter a complex password</CFormText> */}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CInput
                      type="password"
                      id="password-input"
                      name="password"
                      error={errors.password}
                      value={params.password}
                      onChange={e => setParam("password", e.target.value)}
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                    {/* <CFormText className="help-block">Please enter a complex password</CFormText> */}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CInput
                      type="password"
                      id="password-input"
                      name="confirm_password"
                      error={errors.confirm_password}
                      value={params.confirm_password}
                      onChange={e => setParam("confirm_password", e.target.value)}
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                    />
                    {/* <CFormText className="help-block">Please enter a complex password</CFormText> */}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CSelect
                      custom
                      name="validityUnit"
                      error={errors.validityUnit}
                      value={params.validityUnit}
                      onChange={e => setParam("validityUnit", e.target.value)}
                      id="select"
                    >
                      <option value="">Please select a validity unit</option>
                      <option value="Day">Day</option>
                      <option value="Month">Month</option>
                      <option value="Year">Year</option>
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CInput
                      type="text-input"
                      id="text-input"
                      name="validityValue"
                      error={errors.validityValue}
                      value={params.validityValue}
                      onChange={e => setParam("validityValue", e.target.value)}
                      placeholder="Validity value"
                      autoComplete="text-input"
                    />
                    {/* <CFormText className="help-block">Please enter a complex password</CFormText> */}
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
                  registerSeller();
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

export default RegisterSeller
