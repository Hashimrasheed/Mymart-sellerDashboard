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
    CNav,
    CNavItem,
    CNavLink,
    CSwitch,
} from '@coreui/react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { generalAdding, generalAddingDone } from '../../../../redux/actions/productActions'
import { getToken, axios } from '../../../../reusable'
import { Link, useParams } from 'react-router-dom';
import EditProductHeaders from './editProductHeaders';


const EditProduct = () => {
    const admin = getToken()
    const generalAddingCompleted = useSelector((state) => state.product.generalAdding)
    const dispatch = useDispatch();
    let { productId } = useParams()
    let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }
    const [params, setParams] = useState({
        name: '',
        description: '',
    })
    const [status, setStatus] = useState();
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

    const editGeneral = async () => {
        setLoading(true);
        if (handleValidation()) {
            try {
                let response = await axios
                    .put(`product/edit-general/${productId}`, params, { headers })
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

    const changeStatus = async () => {
        let productStatus = await axios
            .put(`product/change-status/${productId}`, {}, { headers })
            .catch(err => {
                console.log(err);
            })
            if(productStatus) {
                setStatus(productStatus?.data?.data?.product?.status)
            }
    }

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
        try {
            if (generalAddingCompleted) {
                dispatch(generalAddingDone(true))
                history.push(`/products-model/${productId}`)
            } else {
                axios
                    .get(`product/${productId}`, { headers })
                    .then((res) => {
                        if (res) {
                            if (res?.data?.status_code === 200) {
                                setParams(res?.data?.data?.product?.general)
                                console.log("status", res?.data?.data?.product?.status);
                                setStatus(res?.data?.data?.product?.status)
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

        } catch (e) {
            console.log(e);
        }
    }, [generalAddingCompleted])

    return (
        <>
            <EditProductHeaders productId={productId} />
            <CRow>
                <CCol xs="12" md="12">
                    <CCard >
                        <CCardHeader className="d-flex justify-content-between">
                            Edit Product

                            <div className="d-flex">
                                <h5 className="mr-2">status</h5>
                                <CSwitch
                                    className="mr-1"
                                    color="success"
                                    shape="pill"
                                    checked={status == true ? true : false}
                                    onClick={changeStatus}
                                />
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                // method="post"
                                // encType="multipart/form-data"
                                className="form-horizontal"
                            >
                                <CFormGroup row>

                                    <CCol xs="12" md="12">
                                        <label>Product Name</label>
                                        <CInput
                                            type="text-input"
                                            error={errors.name}
                                            value={params.name}
                                            onChange={e => setParam("name", e.target.value)}
                                            id="text-input"
                                            name="name"
                                            placeholder="Product Name"
                                            autoComplete="text-input"
                                        />
                                        {/* <CFormText className="help-block">Please enter your email</CFormText> */}
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <label>Product Discription</label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={params.description}
                                            onChange={(event, editor) => setParam('description', editor.getData())}
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
                                    editGeneral();
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

export default EditProduct
