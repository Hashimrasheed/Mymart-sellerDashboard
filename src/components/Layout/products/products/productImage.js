import React, { useEffect, useRef, useState } from 'react'
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
    CNav,
    CNavItem,
    CNavLink,
} from '@coreui/react'
import { Image, Edit, Trash } from "react-feather";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { generalAdding, generalAddingDone } from '../../../../redux/actions/productActions'
import { getToken, axios } from '../../../../reusable'
import { Link, useParams } from 'react-router-dom';
import EditProductHeaders from './editProductHeaders';


const AddImage = () => {
    const admin = getToken()
    const generalAddingCompleted = useSelector((state) => state.product.generalAdding)
    const dispatch = useDispatch();
    let { productId } = useParams()
    const inputFile = useRef(null)

    let response
    const [params, setParams] = useState({
        image_url: '',
        image: '',
    })
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ any: [] })

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        //Name
        if (!params.name) {
            formIsValid = false;
            errors["name"] = "This field required";
        }
        if (!params.description) {
            formIsValid = false;
            errors["description"] = "This field required";
        }
        setErrors(errors);
        return formIsValid;
    }

    const addGeneral = async () => {
        setLoading(true);
        if (handleValidation()) {
            try {
                let headers = {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${admin}`
                }
                response = await axios
                    .post('product/add-general', params, { headers })
                    .catch(err => {
                        console.log(err);
                    })
                if (response) {
                    if (response?.data?.status_code === 200) {
                        dispatch(generalAdding())
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
        console.log(generalAddingCompleted);
        if (generalAddingCompleted) {
            dispatch(generalAddingDone(true))
            history.push("/products")
        }
    }, [generalAddingCompleted])

    const openFileInput = async () => {
        await inputFile.current.click();
    };


    const handleImageUpload = (e) => {
        setParam("image_url", null)
        setParam("image", e.target.files[0])
    }
    return (
        <>
            <EditProductHeaders productId={productId} />
            <CRow>
                <CCol xs="12" md="12">
                    <CCard >
                        <CCardHeader>
                            Product Image
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
                                <CCol xl="2" md="4" sm="6" xs="12" className="mb-4">
                                    <div >
                                        <div >
                                            {
                                                params.image || params.image_url ? <div>
                                                    <img style={{ width: "6rem" }} src={params.image_url ? params.image_url : params.image ? URL.createObjectURL(params.image) : ""} alt="img" />
                                                </div>
                                                    : null
                                            }
                                            <CFormGroup row>
                                                <CCol xs="12" md="12" >
                                                    {/* <div style={{"border-style": "groove"}}> */}
                                                    <img
                                                        src="/common/upload_image.jpeg"
                                                        style={{ width: "6rem", height: "6rem", cursor: 'pointer', "border-style": "groove", "padding": "1rem" }}
                                                        onClick={e => {
                                                            openFileInput()
                                                        }}
                                                        alt="Choose file"
                                                    />
                                                    <input type='file' onChange={handleImageUpload} accept="jpg png jpeg" id='file' ref={inputFile} style={{ display: 'none' }} />
                                                    {/* </div> */}
                                                </CCol>
                                            <Trash color="red" style={{ cursor: 'pointer', "margin-left": "1rem", "margin-top": "1rem" }} size={20} />
                                            </CFormGroup>
                                            <h5>Main Image

                                            </h5>
                                        </div>
                                    </div>
                                </CCol>

                                <CCol xl="2" md="4" sm="6" xs="12" className="mb-4">
                                    <div >
                                        <div >
                                            {
                                                params.image || params.image_url ? <div>
                                                    <img style={{ width: "6rem" }} src={params.image_url ? params.image_url : params.image ? URL.createObjectURL(params.image) : ""} alt="img" />
                                                </div>
                                                    : null
                                            }
                                            <CFormGroup row>
                                                <CCol xs="12" md="12" >
                                                    {/* <div style={{"border-style": "groove"}}> */}
                                                    <img
                                                        src="/common/upload_image.jpeg"
                                                        style={{ width: "6rem", height: "6rem", cursor: 'pointer', "border-style": "groove", "padding": "1rem" }}
                                                        onClick={e => {
                                                            openFileInput()
                                                        }}
                                                        alt="Choose file"
                                                    />
                                                    <input type='file' onChange={handleImageUpload} accept="jpg png jpeg" id='file' ref={inputFile} style={{ display: 'none' }} />
                                                    {/* </div> */}
                                                </CCol>
                                            </CFormGroup>
                                            <h5>Additional Images</h5>
                                        </div>

                                    </div>
                                </CCol>
                            </CForm>
                        </CCardBody>
                        <CCardFooter>
                            <CButton
                                className="m-1"
                                type="submit"
                                size="m"
                                onClick={e => {
                                    e.preventDefault();
                                    addGeneral();
                                }}
                                color="primary"
                            >
                                {loading ? "Saving.." : "Save & Next"}
                            </CButton>
                            {/* <CButton type="reset" size="sm" color="danger"><CIcon name="cil-ban" /> Reset</CButton> */}
                        </CCardFooter>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default AddImage
