import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { setAdminData } from '../../redux/actions/loginActions'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { getToken, axios } from '../../reusable'


const Login = () => {
  const admin = getToken()
  const dispatch = useDispatch();

  const [params, setParams] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ any: [] })

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    //Name
    if (!params.username) {
      formIsValid = false;
      errors["userName"] = "This field required";
    }
    //Password
    if (!params.password) {
      formIsValid = false;
      errors["password"] = "This field is required";
    }
    setErrors(errors);
    return formIsValid;
  }

  const login = async () => {
    setLoading(true);
    if (handleValidation()) {
      try {
        let response = await axios
          .post('user/login', params)
          .catch(err => {
            console.log(err);
          })
        if (response?.data?.status_code === 200) {
          localStorage.setItem("admin_token", response?.data?.userToken)
          localStorage.setItem("admin_data", JSON.stringify(response?.data?.data?.user))
          dispatch(setAdminData(true))
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
    if (admin) {
      history.push("/")
    }
    // fetchProduct()
  }, [admin])

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        error={errors.userNameError}
                        value={params.username}
                        name="username"
                        onChange={e => setParam("username", e.target.value)}
                        placeholder="Username"
                        autoComplete="username"
                      />
                      {
                        errors.userName &&
                        <small className="text-danger m-0">{errors.userName}</small>
                      }
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        value={params.password}
                        error={errors.passwordError}
                        name="password"
                        onChange={e => setParam("password", e.target.value)}
                        placeholder="Password"
                        autoComplete="password"
                      />
                      {
                        errors.password &&
                        <small className="text-danger m-0">{errors.password}</small>
                      }
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton
                          color="primary"
                          className="px-4"
                          style={{ height: 46, width: 163 }}
                          onClick={e => {
                            e.preventDefault();
                            login();
                          }}
                          disabled={loading}
                        >{loading ? "Sign in.." : "Sign in"}
                        </CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
