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
    CHeader,
} from '@coreui/react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { generalAdding, generalAddingDone } from '../../../../redux/actions/productActions'
import { getToken, axios } from '../../../../reusable'
import { Link, useParams } from 'react-router-dom';
import EditProductHeaders from './editProductHeaders';
import { cloneDeep, set } from 'lodash-es';


const AddModel = () => {
    const admin = getToken()
    const generalAddingCompleted = useSelector((state) => state.product.generalAdding)
    const dispatch = useDispatch();
    let { productId } = useParams()
    let headers = {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }

    const selectionPrice = { title: '', price: '', isDiscountable: false, specialPrice: '', discountPercentage: '' }
    const [params, setParams] = useState({
        price: '',
        isDiscountable: false,
        discountPercentage: '',
        specialPrice: '',
        selection_price_type: 'normal',
        selected_price: [selectionPrice],
    })
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ any: [] })

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        //Name
        if (!params.price) {
            formIsValid = false;
            errors["price"] = "This field required";
        }
        if (params.isDiscountable == true) {
            if (!params.discountPercentage) {
                formIsValid = false;
                errors["discountPercentage"] = "This field required";
            }
            if (!params.specialPrice) {
                formIsValid = false;
                errors["specialPrice"] = "This field required";
            }
        }
        setErrors(errors);
        return formIsValid;
    }

    const addEditModel = async () => {
        setLoading(true);
        if (handleValidation()) {
            try {
                let response = await axios
                    .put(`product/add-model-data/${productId}`, params, { headers })
                    .catch(err => {
                        console.log(err);
                    })
                if (response) {
                    console.log("respo", response.data);
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
        if (name == "discountPercentage") {
            setParams(prev => {
                let specialPrice = 0
                params.price ? specialPrice = params.price - params.price * Number(value) / 100 : 0
                return {
                    ...prev,
                    ["specialPrice"]: specialPrice
                }
            });
        }
        if (name == "price") {
            setParams(prev => {
                let specialPrice = 0
                params.price ? specialPrice = value - value * Number(params.discountPercentage) / 100 : 0
                return {
                    ...prev,
                    ["specialPrice"]: specialPrice
                }
            });
        }
    };

    let updateSelectionPrice = (index, key, value) => {
        let selected_price = params.selected_price
        const data = cloneDeep(selected_price[index]);
        set(data, key, value);
        selected_price[index] = data
        setParam("selected_price", selected_price)
        if (key == "discountPercentage") {
            let specialPrice = 0
            data.price ? specialPrice = data.price - data.price * Number(value) / 100 : 0
            set(data, "specialPrice", specialPrice);
            selected_price[index] = data
            console.log("selected_pricess", selected_price);
            setParam("selected_price", selected_price)
        }
        if (key == "price") {
                let specialPrice = 0
                data.price ? specialPrice = value - value * Number(data.discountPercentage) / 100 : 0
                set(data, "specialPrice", specialPrice);
                selected_price[index] = data
                setParam("selected_price", selected_price)
        }
    }

    const history = useHistory();
    useEffect(() => {
        try {
            if (generalAddingCompleted) {
                dispatch(generalAddingDone(true))
                history.push(`/products-image/${productId}`)
            } else {
                axios
                    .get(`product/${productId}`, { headers })
                    .then((res) => {
                        if (res) {
                            if (res?.data?.status_code === 200) {
                                setParams(res?.data?.data?.product?.model)
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


    let addMore = () => {
        let selected_price = []
        if (params.selected_price[0]) {
            selected_price = params.selected_price
            selected_price.push(selectionPrice)
        } else {
            selected_price.push(selectionPrice)
        }
        setParam("selected_price", selected_price)
    }

    return (
        <>
            <EditProductHeaders productId={productId} />
            <CRow>
                <CCol xs="12" md="12">
                    <CCard >
                        <CCardHeader>
                            Model Data
                        </CCardHeader>
                        <CCardBody>
                            <CForm
                                // method="post"
                                // encType="multipart/form-data"
                                className="form-horizontal"
                            >
                                <CFormGroup row>
                                    <CCol xs="12" >
                                        <label>Selection Price Type</label>
                                        <CSelect
                                            type="text"
                                            value={params.selection_price_type}
                                            onChange={e => setParam("selection_price_type", e.target.value)}
                                            id="select"
                                        >
                                            <option value="selection_price">Selection Price</option>
                                            <option value="normal">Normal Price</option>
                                        </CSelect>
                                    </CCol>
                                </CFormGroup>
                                {
                                    params.selection_price_type == 'normal' ?
                                        <div>
                                            <CFormGroup row>
                                                <CCol xs="12" md="6">
                                                    <label>Product Price</label>
                                                    <CInput
                                                        type="number"
                                                        error={errors.price}
                                                        value={params.price}
                                                        onChange={e => setParam("price", e.target.value)}
                                                        id="text-input"
                                                        name="price"
                                                        placeholder="Product price"
                                                        autoComplete="text-input"
                                                    />
                                                </CCol>
                                                <CCol xs="12" md="6">
                                                    <label>isDiscountable</label>
                                                    <CSelect
                                                        type="text"
                                                        value={params.isDiscountable}
                                                        onChange={e => setParams({ ...params, isDiscountable: JSON.parse(e.target.value) })}
                                                        id="select"
                                                    >
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </CSelect>
                                                </CCol>
                                            </CFormGroup>
                                            {console.log("gg", params.isDiscountable == true)}
                                            {
                                                params.isDiscountable == true ?
                                                    <CFormGroup row>

                                                        <CCol xs="12" md="6">
                                                            <label>Discount percentage(%)</label>
                                                            {console.log("ggg", params)}
                                                            <CInput
                                                                type="number"
                                                                error={errors.discountPercentage}
                                                                value={params.discountPercentage}
                                                                onChange={e => setParam("discountPercentage", e.target.value)}
                                                                id="text-input"
                                                                name="discountPercentage"
                                                                placeholder="Discount percentage"
                                                                autoComplete="text-input"
                                                            />
                                                        </CCol>
                                                        <CCol xs="12" md="6">
                                                            <label>Special price</label>
                                                            <CInput
                                                                type="text-input"
                                                                error={errors.specialPrice}
                                                                value={params.specialPrice}
                                                                // id="text-input"
                                                                // name="specialPrice"
                                                                placeholder="Special price"
                                                            // disabled
                                                            // autoComplete="text-input"
                                                            />
                                                        </CCol>
                                                    </CFormGroup>
                                                    : null
                                            }
                                        </div>
                                        :
                                        <div>
                                            <h4 style={{ "margin-top": "1.5rem" }}>
                                                Selection Price
                                                {console.log("selected_price", params)}
                                            </h4>
                                            {
                                                params?.selected_price[0] ?
                                                    params?.selected_price.map((options, index) => (
                                                        <CFormGroup row style={{ "box-shadow": "5px 5px 8px 5px #888888", "padding": "1rem" }}>
                                                            <CCol xs="6" md="3">
                                                                <label>Product Price</label>
                                                                <CInput
                                                                    type="number"
                                                                    error={errors.price}
                                                                    value={options.price}
                                                                    onChange={e => updateSelectionPrice(index, "price", e.target.value)}
                                                                    id="text-input"
                                                                    name="price"
                                                                    placeholder="Product price"
                                                                    autoComplete="text-input"
                                                                />
                                                            </CCol>
                                                            <CCol xs="6" md="3">
                                                                <label>isDiscountable</label>
                                                                <CSelect
                                                                    type="text"
                                                                    value={options.isDiscountable}
                                                                    onChange={e => updateSelectionPrice(index, "isDiscountable", JSON.parse(e.target.value))}
                                                                    id="select"
                                                                >
                                                                    <option value={true}>Yes</option>
                                                                    <option value={false}>No</option>
                                                                </CSelect>
                                                            </CCol>
                                                            {
                                                                options.isDiscountable == true ?
                                                                    <CCol xs="6" md="3">
                                                                        <label>Discount (%)</label>
                                                                        {console.log("ggg", options)}
                                                                        <CInput
                                                                            type="number"
                                                                            error={errors.discountPercentage}
                                                                            value={options.discountPercentage}
                                                                            onChange={e => updateSelectionPrice(index, "discountPercentage", e.target.value)}
                                                                            id="text-input"
                                                                            name="discountPercentage"
                                                                            placeholder="Discount percentage"
                                                                            autoComplete="text-input"
                                                                        />
                                                                    </CCol>
                                                                    : null
                                                            }
                                                            {
                                                                options.isDiscountable == true ?
                                                                    <CCol xs="6" md="3">
                                                                        <label>Special price</label>
                                                                        <CInput
                                                                            type="text-input"
                                                                            error={errors.specialPrice}
                                                                            value={options.specialPrice}
                                                                            // id="text-input"
                                                                            // name="specialPrice"
                                                                            placeholder="Special price"
                                                                        // disabled
                                                                        // autoComplete="text-input"
                                                                        />
                                                                    </CCol>
                                                                    : null
                                                            }
                                                        </CFormGroup>
                                                    ))
                                                    : null
                                            }

                                            <CFormGroup >
                                                <CCol style={{ "float": 'right' }} col="6" sm="3" md="3" xs="6" xl className="mb-3 mb-xl-0">
                                                    <CButton
                                                        block
                                                        color="success"
                                                        onClick={() => {
                                                            addMore()
                                                        }}
                                                    >
                                                        + Add Option
                                                    </CButton>
                                                </CCol>
                                            </CFormGroup>
                                        </div>
                                }

                            </CForm>
                        </CCardBody>
                        <CCardFooter>
                            <CButton
                                className="m-1"
                                type="submit"
                                size="m"
                                onClick={e => {
                                    e.preventDefault();
                                    addEditModel();
                                }}
                                color="primary"
                            >
                                {loading ? "Saving.." : "Save & Next"}
                            </CButton>
                        </CCardFooter>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default AddModel
