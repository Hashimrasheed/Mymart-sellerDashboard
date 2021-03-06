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
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { generalAdding, generalAddingDone } from '../../../../redux/actions/productActions'
import { getToken, axios } from '../../../../reusable'


const AddProduct = () => {
    const admin = getToken()
    const generalAddingCompleted = useSelector((state) => state.product.generalAdding)
    const dispatch = useDispatch();

    let response
    const [params, setParams] = useState({
        name: '',
        description: '',
    })
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ any: [] })
    const [product, setProduct] = useState({any: []})
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
                        console.log("response", response?.data);
                        setProduct(response?.data?.data.product)
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
        if (generalAddingCompleted) {
            dispatch(generalAddingDone(true))
            history.push(`/products-model/${product._id}`)
        }
    }, [generalAddingCompleted])

    return (
        <>
            <CRow>
                <CCol xs="12" md="12">
                    <CCard >
                        <CCardHeader>
                            Add Product
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
                                    addGeneral();
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

export default AddProduct
