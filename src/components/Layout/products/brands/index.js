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

const fields = ['#', 'Image', 'Name', 'Items', 'Status', 'Edit', 'Delete']

const Brands = () => {
  const admin = getToken()
  let headers = {
    'Accept': 'application/json',
    "Authorization": `Bearer ${admin}`
  }
  const [brands, setBrands] = useState([])
  const [total, setTotal] = useState("")
  const [deleteBrandId, setDeleteBrandId] = useState("")
  const [brandAdded, setBrandAdded] = useState('')
  const [modal, setModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [editBrand, setEditBrand] = useState(false)
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
    image_url: '',
    _id: ''
  })

  const setBrandData = (name: string, value: any) => {
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
  }, [brandAdded])

  const openFileInput = async () => {
    await inputFile.current.click();
  };

  const handleImageUpload = (e) => {
    setBrandData("image_url", null)
    setBrandData("image", e.target.files[0])
  }

  const handleValidation = () => {
    let formIsValid = true;
    let errors = {};

    if (!brand.name || brand.name == '') {
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
        axios.post('brand/add/', formData, { headers })
          .then(res => {
            setBrand({
              name: '',
              status: false,
              image: '',
              image_url: '',
              _id: ''
            })
            setLoading(false);
            setModal(false)
            setBrandAdded(res?.data?.data?.brand?.name)
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
  
  const updateBrand = async () => {
    setLoading(true);
    if (handleValidation() == true) {
      try {
        let formData = new FormData()
        formData.append('bimage', brand.image);
        formData.append("name", brand.name);
        formData.append("status", brand.status);
        formData.append("_id", brand._id);
        axios.put(`brand/update/${brand._id}`, formData, { headers })
          .then(res => {
            setBrand({
              name: '',
              status: false,
              image: '',
              image_url: '',
              _id: ''
            })
            setLoading(false);
            setModal(false)
            setBrandAdded(res?.data?.data?.brand?.name)
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

  const openEditPage = (_id, image_url, name, status) => {
    setModal(!modal);
    setEditBrand(true)
    setBrand({
      name: name,
      status: status,
      image: '',
      image_url: image_url,
      _id: _id
    })
  }

  const deleteBrand = async (_id) => {
    setLoading(true);
      try {
        axios.delete(`brand/delete/${_id}`, { headers })
          .then(res => {
            setLoading(false);
            setDeleteConfirm(false)
            setBrandAdded(_id)
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
                responsive={true}
                outlined
                itemsPerPage={10}
                pagination
                activePage
                hover
                underTableSlot={`Total: ${total}`}
                itemsPerPageSelect={ {label: 'Brands per page:',  values: [5, 10, 20, 50, 100] }}
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
                        <Edit color="gray" style={{ cursor: 'pointer' }} onClick={() => {
                          openEditPage(item._id, item.image_url, item.name, item.status)
                        }} size={20}
                        />
                      </td>
                    ),
                  'Delete':
                    (item) => (
                      <td>
                        <Trash color="red" style={{ cursor: 'pointer' }} onClick={() => {
                          return (
                            setDeleteConfirm(!deleteConfirm), setDeleteBrandId(item._id)
                          )
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
                editBrand ? setEditBrand(false) : null
                )
            }}
            color="info"
          >
            <CModalHeader closeButton>
              <CModalTitle>{editBrand ? "Edit Brand" : "Add Brand"}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div style={{ "margin-left": "35%" }}>
                {console.log("brand", brand)}
                {
                  brand.image || brand.image_url ? <div>
                    <img style={{ width: "6rem" }} src={brand.image_url ? brand.image_url : brand.image ? URL.createObjectURL(brand.image) : ""} alt="brand img" />
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
              <CButton color="secondary" onClick={() => {
                return(
                setModal(!modal),
                editBrand ? setEditBrand(false) : null
                )
              }}>Cancel</CButton>
              {
                editBrand ?
                <CButton
                color="danger"
                onClick={e => {
                  e.preventDefault();
                  updateBrand();
                }}
              >{loading ? "Updating Brand" : "Update Brand"}</CButton>
              : 
              <CButton
                color="danger"
                onClick={e => {
                  e.preventDefault();
                  saveBrand();
                }}
              >{loading ? "Saving Brand" : "Add Brand"}</CButton>
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
                Do you want to delete this brand
              </CModalBody>
              <CModalFooter >
                <CButton style={{"margin-right": "2rem"}} color="secondary" onClick={() => setDeleteConfirm(!deleteConfirm)}>Cancel</CButton>
                <CButton color="danger" onClick={() => deleteBrand(deleteBrandId)}>Delete</CButton>{' '}
              </CModalFooter>
            </CModal>
        </CCol>
      </CRow>
    </>
  )
}

export default Brands
