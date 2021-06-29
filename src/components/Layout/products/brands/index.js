import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { getToken, axios } from '../../../../reusable'
import { Image, Edit, Trash } from "react-feather";
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CCol,
  CDataTable,
  CProgress,
  CRow,
  CCallout,
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
  console.log("zzz,", status);
  switch (status) {
    case true: return 'success'
    case false: return 'secondary'
  }
}

const fields = ['#', 'Image', 'Name', 'Items', 'Status', 'Edit', 'Delete']

const Brands = () => {
  const admin = getToken()
  let headers = {
    'Accept': 'application/json',
    "Authorization": `Bearer ${admin}`
  }

  const [brands, setBrands] = useState([])
  const [total, setTotal] = useState("")
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    nameError: false,
    name: ''
  })
  const inputFile = useRef(null)
  const [brand, setBrand] = useState({
    name: '',
    status: false,
    image: '',
  })

  const setBrandData = (name: string, value: any) => {
    console.log(brand);
    if (name === "status") {
      value = JSON.parse(value)
    }
    setBrand(prev => {
      return {
        ...prev,
        [name]: value
      }
    });
  };

  useEffect(() => {
    try {

      axios.get('brand/', { headers })
        .then((response) => {
          console.log("zzz", response);
          if (response) {
            if (response?.data?.status_code === 200) {
              console.log("hi", response?.data?.data);
              setBrands(response?.data?.data?.brands)
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
  }, [])

  const openFileInput = async () => {
    await inputFile.current.click();
  };

  const handleImageUpload = (e) => {
    setBrandData("image", e.target.files[0])
  }

  const handleValidation = () => {
    let formIsValid = true;
    let errors = {};

    if (!brand.name || brand.name == '') {
      console.log("hi");
      formIsValid = false;
      errors["name"] = 'This field is required';
      errors["nameError"] = true;
    }
    console.log(errors);
    setErrors(errors);
    return formIsValid;
  }

  const saveBrand = async () => {
    setLoading(true);
    if (handleValidation() == true) {
      try {
        let formData = new FormData()
        formData.append('bimage', brand.image);
        formData.append("name", brand.name);
        formData.append("status", brand.status);
        axios.post('brand/add/', formData, { headers }).then(res => {
          setLoading(false);
          setModal(false)
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

  return (
    <>
      <CRow>
        <CCol>
          <CCard style={{ minHeight: "80vh" }}>
            <CCardHeader style={{ border: "0px" }}>
              <CRow style={{ display: "contents" }}>
                <strong>Brands</strong>
                <CButton color="info" style={{ float: "right" }} onClick={() => setModal(!modal)}>
                  Add Brand
                </CButton>
              </CRow>
            </CCardHeader>
            <CCardHeader style={{ padding: "0.25rem" }}>
              <CFormGroup  >
                <CCol md="6" >
                  <CInputGroup>
                    <CInput id="input1-group2" name="input1-group2" placeholder="Brand Name" />
                    <CInputGroupAppend>
                      <CButton type="button" color="success"><CIcon name="cil-magnifying-glass" /> Search</CButton>
                    </CInputGroupAppend>
                  </CInputGroup>
                </CCol>
              </CFormGroup>
            </CCardHeader>
            <CCardBody >
              <CDataTable
                items={brands}
                fields={fields}
                itemsPerPage={10}
                pagination
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
                        {item.name}
                      </td>
                    ),
                  'Items':
                    (item) => (
                      <td>
                        {item.product_count}
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
                        <Edit color="gray" style={{ cursor: 'pointer' }} size={20}
                        />
                      </td>
                    ),
                    'Delete':
                    (item) => (
                      <td>
                        <Trash color="red" style={{ cursor: 'pointer' }} size={20}
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
            onClose={() => setModal(!modal)}
            color="info"
          >
            <CModalHeader closeButton>
              <CModalTitle>Add Brand</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div style={{ "margin-left": "35%" }}>
                {
                  brand.image ? <div>
                    <img style={{ width: "6rem" }} src={URL.createObjectURL(brand.image)} alt="brand img" />
                  </div>
                    : null
                }
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CLabel htmlFor="name">Brand Image</CLabel>
                    <Image onClick={e => {
                      openFileInput()
                    }} color="blue" style={{ cursor: 'pointer' }} size={20}
                    />
                    <input type='file' onChange={handleImageUpload} accept="jpg png jpeg" id='file' ref={inputFile} style={{ display: 'none' }} />                  {/* {pError.Cpassword ? <CFormText className="help-block" value={pError.password}>Please confirm password</CFormText> : null} */}
                  </CCol>
                </CFormGroup>
              </div>
              <CFormGroup row>
                <CCol xs="12" md="12">
                  <CLabel htmlFor="name">Brand Name</CLabel>
                  <CInput
                    type="text"
                    id="text-input"
                    name="name"
                    error={errors.name}
                    value={brand.name}
                    onChange={e => setBrandData("name", e.target.value)}
                    placeholder="Brand Name"
                    autoComplete="text-input"
                  />
                  {errors.nameError ? <CFormText className="help-block" value={errors.name}>Brand name is required</CFormText> : null}
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol xs="12" md="12">
                  <CLabel htmlFor="name">Status</CLabel>
                  <CSelect
                    name="status"
                    type="text"
                    value={brand.status}
                    onChange={e => setBrandData("status", e.target.value)}
                    id="select"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </CSelect>
                </CCol>
              </CFormGroup>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModal(!modal)}>Cancel</CButton>
              <CButton
                color="danger"
                onClick={e => {
                  e.preventDefault();
                  saveBrand();
                }}
              >{loading ? "Saving Brand" : "Add Brand"}</CButton>
            </CModalFooter>
          </CModal>
        </CCol>
      </CRow>
    </>
  )
}

export default Brands
