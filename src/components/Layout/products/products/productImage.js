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
    CRow,
} from '@coreui/react'
import { Image, Edit, Trash } from "react-feather";
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
    const additionalInputFile = useRef(null)

    let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }

    let response
    const [mainImageParams, setMainImageParams] = useState({
        _id: '',
        main_image: '',
        main_image_url: '',
        type: '',
    })
    const [additionalImageParams, setAdditionalImageParams] = useState([{
        _id: '',
        main_image: '',
        main_image_url: '',
        type: '',
    }])
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ any: [] })

    const handleValidation = (e) => {
        let errors = {};
        let formIsValid = true;
        //Name
        if (!e?.target?.files[0]) {
            formIsValid = false;
            errors["image"] = "This field required";
        }
        setErrors(errors);
        return formIsValid;
    }

    const uploadImage = async (e) => {
        setLoading(true);
        if (handleValidation(e)) {
            try {
                let imageUploadParams = new FormData()
                imageUploadParams.append('image', e.target.files[0]);
                imageUploadParams.append("product_id", productId);
                imageUploadParams.append("type", "main");
                response = await axios
                    .post('product/upload_image', imageUploadParams, { headers })
                    .catch(err => {
                        console.log(err);
                    })
                if (response) {
                    if (response?.data?.status_code === 200) {
                        dispatch(generalAdding(!generalAddingCompleted))
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        setLoading(false);
    };

    const deleteImage = async (imgId) => {
        try {
            console.log("deletng");
            await axios
                .delete(`product/remove_image/${productId}/${imgId}`, { headers })
                .then((deleteImage) => {
                    if (deleteImage?.data?.status_code === 200) {
                        console.log("hhhhhh");
                        dispatch(generalAdding(!generalAddingCompleted))
                    }
                })
                .catch(err => {
                    console.log(err);
                })

        } catch (error) {
            console.log(error);
        }
    }

    const uploadAdditionalImage = async (e) => {
        setLoading(true);
        if (handleValidation(e)) {
            try {
                let imageUploadParams = new FormData()
                imageUploadParams.append('image', e.target.files[0]);
                imageUploadParams.append("product_id", productId);
                imageUploadParams.append("type", "other");
                response = await axios
                    .post('product/upload_image', imageUploadParams, { headers })
                    .catch(err => {
                        console.log(err);
                    })
                if (response) {
                    if (response?.data?.status_code === 200) {
                        dispatch(generalAdding(!generalAddingCompleted))
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        console.log("second hhhh");
        axios
            .get(`product/fetch_all_images/${productId}`, { headers })
            .then(async (res) => {
                if (res) {
                    if (res?.data?.status_code === 200) {
                        let additionalImages = []
                        let mainImageData = {
                            _id: '',
                            main_image: '',
                            main_image_url: '',
                            type: '',
                        }
                        let additionalImageData = {
                            _id: '',
                            main_image: '',
                            main_image_url: '',
                            type: '',
                        }
                        res?.data?.data.map(img => {
                            if (img.type == 'main') {
                                mainImageData = {
                                    _id: img._id,
                                    main_image: img.main_image,
                                    main_image_url: img.main_image_url,
                                    type: img.type,
                                }
                            } else {
                                additionalImageData = {
                                    _id: img._id,
                                    main_image: img.main_image,
                                    main_image_url: img.main_image_url,
                                    type: img.type,
                                }
                                additionalImages.push(additionalImageData)
                            }
                        })
                        setMainImageParams(mainImageData)
                        setAdditionalImageParams(additionalImages)
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [generalAddingCompleted])

    const openFileInput = async () => {
        await inputFile.current.click();
    };

    const openAdditionalFileInput = async () => {
        await additionalInputFile.current.click();
    };

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
                                <h5>Main Image </h5>
                                <CCol xl="2" md="4" sm="6" xs="12" className="mb-4" style={{ "border-style": "solid" }}>
                                    <div >

                                        <div >
                                            {
                                                mainImageParams.main_image || mainImageParams.main_image_url ?
                                                    <div style={{ "padding": "1rem" }}>
                                                        <img style={{ width: "6rem" }} src={mainImageParams.main_image_url ? mainImageParams.main_image_url : mainImageParams.main_image ? URL.createObjectURL(mainImageParams.main_image) : ""} alt="img" />
                                                        {/* <Trash color="red" style={{ cursor: 'pointer', "margin-left": "1rem", "margin-top": "1rem" }} size={20} /> */}

                                                        <Trash
                                                            color="red"
                                                            style={{ cursor: 'pointer', "margin-left": "1rem", "margin-top": "1rem" }}
                                                            size={20}
                                                            onClick={() => deleteImage(mainImageParams._id)}
                                                        />
                                                    </div>
                                                    :
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
                                                            <input type='file' onChange={uploadImage} accept="jpg png jpeg" id='file' ref={inputFile} style={{ display: 'none' }} />
                                                            {/* </div> */}
                                                        </CCol>
                                                    </CFormGroup>
                                            }

                                        </div>
                                    </div>
                                </CCol>

                                <h5>Additional Images</h5>
                                <CCol xl="2" md="4" sm="6" xs="12" className="mb-4" style={{ "border-style": "solid" }}>
                                    {
                                        additionalImageParams.length ?
                                            additionalImageParams.map((additionalImage) => {
                                                <div >
                                                    <div >
                                                        {
                                                            additionalImage.main_image || additionalImage.main_image_url ?
                                                                <div>
                                {console.log("adsfadf",additionalImage)}

                                                                    <img style={{ width: "6rem" }} src={additionalImage.main_image_url ? additionalImage.main_image_url : additionalImage.main_image ? URL.createObjectURL(additionalImage.main_image) : ""} alt="img" />
                                                                    <Trash
                                                                        color="red"
                                                                        style={{ cursor: 'pointer', "margin-left": "1rem", "margin-top": "1rem" }}
                                                                        size={20}
                                                                        onClick={() => deleteImage(mainImageParams._id)}
                                                                    />
                                                                </div>
                                                                :
                                                                null
                                                        }
                                                    </div>

                                                </div>
                                            })
                                            : null
                                    }
                                    <div >
                                        <CFormGroup row>
                                            <CCol xs="12" md="12" >
                                                {/* <div style={{"border-style": "groove"}}> */}
                                                <img
                                                    src="/common/upload_image.jpeg"
                                                    style={{ width: "6rem", height: "6rem", cursor: 'pointer', "border-style": "groove", "padding": "1rem" }}
                                                    onClick={e => {
                                                        openAdditionalFileInput()
                                                    }}
                                                    alt="Choose file"
                                                />
                                                <input type='file' onChange={uploadAdditionalImage} accept="jpg png jpeg" id='file' ref={additionalInputFile} style={{ display: 'none' }} />
                                            </CCol>
                                        </CFormGroup>
                                    </div>
                                </CCol>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default AddImage
