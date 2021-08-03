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
    CAlert,
    CToast,
    CToastHeader,
    CToastBody,
    CInputCheckbox,
} from '@coreui/react'
import { X } from "react-feather";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { generalAdding, generalAddingDone, fetchLinkDatas } from '../../../../redux/actions/productActions'
import { getToken, axios } from '../../../../reusable'
import { Link, useParams } from 'react-router-dom';
import EditProductHeaders from './editProductHeaders';
import CIcon from '@coreui/icons-react';


const AddLinks = () => {
    const admin = getToken()
    const generalAddingCompleted = useSelector((state) => state.product.generalAdding)
    const linksData = useSelector((state) => state.product.linksData)
    const dispatch = useDispatch();
    let { productId } = useParams()
    let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }
    const [cats, setCats] = useState({ any: [] })
    const [params, setParams] = useState({
        manufacturer: '',
        categories: [],
        related_product: [],
    })
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ any: [] })

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        if (!params.categories) {
            formIsValid = false;
            errors["categories"] = "This field required";
        }
        setErrors(errors);
        return formIsValid;
    }

    const saveLinksData = async () => {
        setLoading(true);
        if (handleValidation()) {
            try {
                let response = await axios
                    .put(`product/add-product-links/${productId}`, params, { headers })
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
        if (name == 'categories' || name == 'related_product') {
            let data = []
            if (name == 'categories') params?.categories ? data = [...params.categories, value] : data = [value]
            if (name == 'related_product') {
                let flag = true
                let index
                data = params?.related_product
                data?.map((id, i) => {
                    if (id == value) flag = false, index = i
                })
                if (flag === true) {
                    params?.related_product ? data = [...params.related_product, value] : data = [value]
                } else {
                    data.splice(index, 1)
                }
            }
            data = [... new Set(data)]
            setParams(prev => {
                return {
                    ...prev,
                    [name]: data
                }
            });
        }
        else {
            setParams(prev => {
                return {
                    ...prev,
                    [name]: value
                }
            });
        }
    };

    const history = useHistory();
    useEffect(() => {
        try {
            if (generalAddingCompleted) {
                dispatch(generalAddingDone(true))
                history.push(`/products-image/${productId}`)
            } else {
                axios
                    .get(`product/${productId}`, { headers })
                    .then(async (res) => {
                        if (res) {
                            if (res?.data?.status_code === 200) {
                                setParams(res?.data?.data?.product?.general)
                            }
                        }
                    }).then(async () => {
                        let brands = await axios
                            .get(`brand/get-active`, { headers })
                            .catch(err => {
                                console.log(err);
                            })
                        let product = await axios
                            .get(`product`, { headers })
                            .catch(err => {
                                console.log(err);
                            })
                        let categories = await axios
                            .get(`category/get-active`, { headers })
                            .catch(err => {
                                console.log(err);
                            })
                        console.log(brands, product, categories);
                        let data = { brands: brands.data?.data, product: product.data.data?.product, categories: categories.data?.data }
                        await dispatch(fetchLinkDatas(data))
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        } catch (e) {
            console.log(e);
        }
    }, [generalAddingCompleted])
    let close = (catId) => {
        console.log("cloe");
        setParams(prev => {
            let data = []
            params.categories
            params?.categories?.map((cat) => {
                if (cat != catId) {
                    data.push(cat)
                }
            })
            return {
                ...prev,
                categories: data
            }
        });
    }

    return (
        <>
            <EditProductHeaders productId={productId} />
            <CRow>
                <CCol xs="12" md="12">
                    <CCard >
                        <CCardHeader>
                            Product Links
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                // method="post"
                                // encType="multipart/form-data"
                                className="form-horizontal"
                            >

                                <CFormGroup row>

                                    <CCol xs="12" md="12">
                                        <label>Product Brand</label>
                                        <CSelect
                                            type="text"
                                            value={params.manufacturer}
                                            onChange={e => setParam("manufacturer", e.target.value)}
                                            id="select"
                                        >
                                            {
                                                linksData?.brands ?
                                                    linksData.brands.map((brand) => {
                                                        return <option value={brand._id}>{brand.name}</option>
                                                    })
                                                    :
                                                    null
                                            }

                                        </CSelect>
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>

                                    <CCol xs="12" md="12">
                                        <label>Product Category</label>
                                        <CSelect
                                            type="text"
                                            // value={params.categories}
                                            onChange={e => setParam("categories", e.target.value)}
                                            id="select"
                                        >
                                            {
                                                linksData?.categories ?
                                                    linksData.categories.map((category) => {
                                                        return <option value={category._id}>{category.cat_name}</option>
                                                    })
                                                    : null
                                            }
                                        </CSelect>
                                        <br />
                                        {
                                            params?.categories && linksData?.categories ?
                                                linksData.categories.map((category) => {
                                                    return params.categories.map((cat) => {
                                                        // category._id == cat ? 
                                                        return (
                                                            category._id == cat ?
                                                                <CToast
                                                                    key={'toast'}
                                                                    show={true}
                                                                    autohide={false}
                                                                    style={{ "minWidth": "fit-content", "width": "fit-content", "float": "left" }}
                                                                >
                                                                    <CToastHeader
                                                                        closeButton={false}>
                                                                        {category.cat_name}
                                                                        <div onClick={() => close(category._id)}>
                                                                            <X />
                                                                        </div>
                                                                    </CToastHeader>
                                                                </CToast>
                                                                : null
                                                        )
                                                        // 
                                                    })
                                                })

                                                : null
                                        }
                                    </CCol>
                                </CFormGroup>
                                <CFormGroup row>
                                    <CCol xs="12" md="12">
                                        <label>Related Products</label>
                                        <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                                            <tbody>
                                                {
                                                    linksData?.product ?
                                                        linksData.product.map((prod) => {
                                                            return (
                                                                <tr>
                                                                    <td className="text-center">
                                                                        <div className="c-avatar">
                                                                            <img src={prod.image ? prod.image : '/common/no_image.png'} className="c-avatar-img" alt="img" />
                                                                            {/* <span className="c-avatar-status "></span> */}
                                                                        </div>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <CFormGroup variant="custom-checkbox" inline>
                                                                            <CInputCheckbox
                                                                                custom
                                                                                id={prod._id}
                                                                                name="inline-checkbox1"
                                                                                value={prod._id}
                                                                                onClick={e => setParam("related_product", e.target.value)}
                                                                            />
                                                                            <CLabel variant="custom-checkbox" htmlFor={prod._id}></CLabel>
                                                                        </CFormGroup>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {/* <div className="c-avatar"> */}
                                                                        {prod.product_name}
                                                                        {/* </div> */}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                        : null
                                                }
                                            </tbody>
                                        </table>
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
                                    saveLinksData();
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

export default AddLinks
