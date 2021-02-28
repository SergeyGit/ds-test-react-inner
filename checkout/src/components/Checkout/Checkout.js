import React, {Component} from 'react'
// import logo from '../../img/logo-apteka.jpg'
import './Checkout.scss'
import Select from 'react-select'
// import DatePicker from "react-datepicker";
// import "react-datepicker/src/stylesheets/datepicker.scss";
// import { registerLocale } from  "react-datepicker";
// import ru from 'date-fns/locale/ru';
import Pagination from "../Navigation/Pagination/Pagination";
import CaptionNumbCheckout from "./CaptionNumbCheckout";
import request from "superagent"
import MapBlock from "./MapBlock";
import ProductItem from "./ProductItem";
import throttle from 'lodash.throttle';
import 'react-phone-number-input/style.css'
import PhoneInput, {isValidPhoneNumber} from "react-phone-number-input";
import {scroller} from "react-scroll";
import AddressBlock from "./AddressBlock";
// import AddressBlock from "./AddressBlock";
// import Marker from "./Marker";
// registerLocale('ru', ru);
// import "../Navigation/Pagination/Pagination.scss";



// const linkStart = "https://doc.ua/doc-audio";
const linkStart = "https://stage1.r2rx.doc.ua";
// const linkStart = "";
// const linkStart = "http://10.100.1.38:8888";

// const adrs= "Гетьмана 6, Киев, Украина";
let dataLayer;
class Checkout extends Component {
    state = {
        // startDate: new Date(),
        startDate: undefined,
        dataJson: undefined,
        medicinesList: undefined,
        objProduct: undefined,
        deliveryList: undefined,
        deliveryProductLine: undefined,
        orderId: +new URL( window.location).searchParams.get('cart_id'),
        cityId: +new URL( window.location).searchParams.get('city_id'),
        cityOptions: undefined,
        totalPrice: 0,
        sumProducts: 0,
        // delivery_type_code: 'IPOST',
        delivery_type_code: 'DTC_PICKUP',
        inStock: true,
        deliveryRows: {
            branch_id: 0,
            sum: 0,
            totalPrice: 0,
            integration_id: 0,
            selectPharm: undefined,
            pharmIdSelected: [],
            actualSummProducts: 0,
        },
        deliveryIPostBlock: undefined,
        handleIdSelect: [],
        pharmacyRequestRows: {
            partner_ids: undefined,
            cart_id: undefined,
            coordinate: undefined
        },
        bestOfferIsSet: {
            time: 9999,
            isSet: false
        },
        bestDelivery: {},
        ipostRows: undefined,
        ipostAddress: undefined,
        // iPostDate: new Date(),
        ipostVitamin: {
            count: new URL( window.location).searchParams.get('count') ? +new URL( window.location).searchParams.get('count') : 1,
            price: 880
        },
        isBestOffer: undefined,
        inMap: true,
        contactPeopleInfo: {
            name: '',
            comment: '',
            doctor_id: '',
            affiliate_id: '',
            desired_date: '',
            email: '',
        },
        phone: "+380",
        phoneCodesArray: ["38067", "38068", "38096", "38097", "38098", "38050", "38066", "38095", "38099", "38063", "38073", "38093", "38091", "38092", "38089", "38094"],
        validPhone: true,
        validName: true,
        validAdresRows: true,
        classAccept: '',
        loading: false,
        offersRules: true,
        enableLocation: false,
        centerMap: undefined,
        callToCustomer: true,
        removeLast: false,
        errorAdress: false,
        totalProducts: false,
        npFealds: {
            city:'',
            number: '',
            street_address: '',
            build: '',
            flat: '',
            entrance: '',
            floor: '',
            lat: '',
            lng: ''
        },
        errorCreate: false,
        sentFirstAnaliticFirst: false
    };
    constructor(props) {
        super(props);
        this.changeProductQuantity = this.changeProductQuantity.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.setPharm = this.setPharm.bind(this);
        this.changeProductQuantityThrottled = throttle(this.changeProductQuantity, 1000);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleInputPhone = this.handleInputPhone.bind(this);
        this.loadDeliveryBloksIPost = this.loadDeliveryBloksIPost.bind(this);
        this.setNPbranch = this.setNPbranch.bind(this);

    }
    setStartDate(data) {
        this.setState({
            startDate: data
        })
    }
    componentDidMount() {
        dataLayer = window.dataLayer || [];
        if (this.state.orderId !== 17416) {
            this.medicinesList();
            this.allCities();
            if ("geolocation" in navigator) {
                this.setState({
                    enableLocation: true
                })
            }
        } else {
            this.setState({
                delivery_type_code: "IPOST",
                ipostVitamin: {
                    count: this.state.ipostVitamin.count,
                    price: this.state.ipostVitamin.count*this.state.ipostVitamin.price
                }
            })
        }


    }
    medicinesList () {
        request
            .get(`${linkStart}/go/apteka/v2/cart/${+this.state.orderId}?cityID=${+this.state.cityId}`)
            // .get('http://localhost:3000/all-doc.json')
            .then(response => {
                this.setState({
                    medicinesList: response.body,
                    totalPrice: response.body.total_price.toFixed(2),
                    sumProducts: response.body.total_count,
                    // }, () => this.deliveryList())
                }, () => this.deliveryProductLine())

            })
            .catch(err => {
                console.log("Error medicines CART List")
            })
    }
    allCities () {
        request
            .get(`${linkStart}/mobapi/general/tables/affiliate_city?type=3&cart_id=${+this.state.orderId}`)
            .then(response => {
                this.setState({
                    cityOptions: response.body.map((city) => {return ({value: city.name, label: city.name, city_id: city.id})})
                });
            })
            .catch(err => {
                console.log("Error cities List")
            })
    }
    deliveryList () {
        request
            .get(`${linkStart}/go/apteka/v2/delivery/list`)
            .then(response => {
                this.setState({
                    deliveryList: response.body
                }, () => this.deliveryProductLine());
            })
            .catch(err => {
                console.log("Error delivery List")
            })
    }
    setNPbranch (city, numberNP, street_address, build, room, entrance, floor, intercom_code, lat, lng) {
        this.setState({
            npFealds: {
                city: city,
                number: numberNP,
                street_address: street_address,
                build: build,
                flat: room,
                entrance: entrance,
                floor: floor,
                intercom_code: intercom_code,
                lat: lat,
                lng: lng
            }
        })
    }
    deliveryProductLine () {
        if (this.state.medicinesList.partners_ids.length > 0 ) {
            request
                .post(`${linkStart}/go/apteka/v2/checkout/pharmacy/${this.state.cityId}`)
                // .post(`/apteki.json`)
                .send({ cart_id: +this.state.orderId, partner_ids: this.state.medicinesList.partners_ids})
                .then(response => {
                    // console.log(response.body);
                    this.setState({
                        deliveryProductLine: response.body,
                        inStock: response.body.pharmacies[0].sort_index === 3,
                        deliveryRows: {
                            branch_id: response.body.pharmacies[0].branch_id,
                            // sumProducts: response.body.pharmacies[0].products.map( product =>
                            //     parseInt(product.in_cart, 10)
                            // ).reduce(function(sum, current) {
                            //         return (sum + current)
                            //     },0),

                            totalPrice: response.body.pharmacies[0].price,
                            integration_id: response.body.pharmacies[0].id,
                            pharmIdSelected: response.body.pharmacies.reduce((pharm, city) => {
                                if (pharm.map[city.apteka_id])
                                    return pharm;
                                pharm.map[city.apteka_id] = true;
                                pharm.cities.push(city);
                                return pharm;
                            }, {
                                map: {},
                                cities: []
                            }).cities,
                        },

                        handleIdSelect: [],
                    }, () => {
                        this.setPharm(this.state.deliveryRows.branch_id, this.state.deliveryRows.integration_id, "0", undefined, true);
                        if( !this.state.sentFirstAnaliticFirst) {
                            this.setState({
                                sentFirstAnaliticFirst: true

                            }, () => this.sentAnaliticInfo(1))
                        }
                    })
                })
                .catch(err => {
                    console.log("Error deliveryProductLine" + err)
                })
        } else {
            this.setState({
                totalPrice: 0,
                sumProducts: 0,
                removeLast: true,
                deliveryRows: {
                    branch_id: 0,
                    sum: 0,
                    totalPrice: 0,
                    integration_id: 0,
                    selectPharm: undefined,
                    pharmIdSelected: [],
                    actualSummProducts: 0,
                },
                deliveryProductLine: undefined,
            })
        }


    }

    loadDeliveryBloksIPost(adress, coordinate) {
        request
            .post(`${linkStart}/go/apteka/v2/checkout/pharmacy/${this.state.cityId}`)
            // .post(`/apteki.json`)
            .send({ cart_id: +this.state.orderId, partner_ids: this.state.medicinesList.partners_ids , coordinate: coordinate})
            .then(response => {
                // console.log(response.body);
                this.setState({
                    deliveryProductLine: response.body,
                    deliveryRows: {
                        branch_id: response.body.pharmacies[0].branch_id,
                        // sumProducts: response.body.pharmacies[0].products.map( product =>
                        //     parseInt(product.in_cart, 10)
                        // ).reduce(function(sum, current) {
                        //     return (sum + current)
                        // },0),
                        totalPrice: response.body.pharmacies[0].price,
                        integration_id: response.body.pharmacies[0].id,
                    },
                }, () => this.setPharm(this.state.deliveryRows.branch_id, this.state.deliveryRows.integration_id, "0", adress))
            })
            .catch(err => {
                console.log("Error deliveryProductLine" + err)
            })
    }
    sentAnaliticInfo(step, idOrder, createButton) {
        console.log("step: " + step)
        // console.log(dataLayer)
        dataLayer.push({
            event: 'checkout',
            ecommerce:
                step < 4 ?
                    {
                        checkout: {
                            actionField: step === 1 ? {
                                step: step,
                                option: this.state.delivery_type_code === "DTC_PICKUP" ? "Способ доставки - Самовывоз из аптеки" :
                                    this.state.delivery_type_code === "IPOST" ? "Способ доставки - Курьерская доставка iPOST" :
                                        this.state.delivery_type_code === "NOVAPOSHTA_BRANCH" ? "Способ доставки - Нова Пошта - доставка на отделение" : "Способ доставки - Нова Пошта - адресная доставка"
                            } : step === 2 ?  {
                                step: step,
                                option: this.state.delivery_type_code === "DTC_PICKUP" ? "Выбор аптеки" :
                                    this.state.delivery_type_code === "IPOST" ? "Адрес доставки" :
                                        this.state.delivery_type_code === "NOVAPOSHTA_BRANCH" ? "Доставка на отделение" : "Нова Пошта Адрес доставки"
                            } : {
                                step: step,
                                option: "Ваши данные"
                            }
                            ,
                            products:
                                this.state.medicinesList.products.map((product) => ({
                                    name: product.name,
                                    id: product.medicine_id,
                                    price: product.price,
                                    brand: product.manufacturer,
                                    category: product.category_id,
                                    variant: product.vendor_code + " " + product.reg_info,
                                    quantity: product.count
                                }))

                        }
                    }
                    :
                    {
                        currencyCode:  'UAH',
                        purchase: {
                            actionField: {
                                id: idOrder,
                                affiliation: this.state.deliveryRows.selectPharm.pharmacy.name + " " + this.state.deliveryRows.selectPharm.pharmacy.address,
                                revenue: this.state.deliveryRows.selectPharm.total_price,
                                Tax: 0.00,
                                shipping: this.state.delivery_type_code === "IPOST" ? this.state.deliveryIPostBlock ? this.state.deliveryIPostBlock.price : 0.00 : 0.00
                            },
                            products:
                                this.state.deliveryRows.selectPharm.products.map((product) => ({
                                    name: product.name,
                                    id: product.medicine_id,
                                    price: product.real_price,
                                    brand: product.manufacturer,
                                    category: product.category_id,
                                    variant: product.vendor_code + " " + product.reg_info,
                                    quantity: product.count
                                }))

                        }
                    },
            'eventCallback': () => {
                if (createButton) {
                    this.sentAnaliticInfo(3);
                }
            }
        });
    }
    deliveryTypeChange(name) {
        if(this.state.delivery_type_code !== name) {
            this.sentAnaliticInfo(1)
            this.setState({
                delivery_type_code: name,
                deliveryIPostBlock: undefined,
                errorAdress: false,
                npFealds: {
                    city:'',
                    number: '',
                    street_address: '',
                    build: '',
                    flat: '',
                    entrance: '',
                    floor: '',
                    lat: '',
                    lng: ''
                },
                errorCreate: false
            }, () => {
                if(name === "NOVAPOSHTA_BRANCH" || name === "NOVAPOSHTA_COURIER") {
                    this.setPharm()
                } else {
                    this.deliveryProductLine()
                }

            })
        }


    }
    handleChange = selectedOption => {
        // this.setState({ selectedOption });
        document.location.replace('/apteka/checkout?cart_id='+this.state.orderId+"&city_id="+selectedOption.city_id);
        // console.log(`Option selected:`, selectedOption);
    };
    changeIpostQuantity(up) {
        this.setState(prevState => ({
            ipostVitamin: {
                price: 880*(up ? prevState.ipostVitamin.count + 1 : prevState.ipostVitamin.count > 1 ? prevState.ipostVitamin.count -1 : 1),
                count: up ? prevState.ipostVitamin.count + 1 : prevState.ipostVitamin.count > 1 ? prevState.ipostVitamin.count -1 : 1,
            }
        }))
    }
    changeProductQuantity(number, medId) {
        request
            .post(`${linkStart}/go/apteka/v2/cart`)
            .send({ cart_id: this.state.orderId, count: number, medicine_id: medId, city_id: this.state.cityId })
            .then(() => this.medicinesList())
            .catch(err => {
                console.log("Error changeProductQuantity " + err)
            });
    }
    deleteProduct(medId) {
            request
                .delete(`${linkStart}/go/apteka/v2/cart`)
                .send({ cart_id: this.state.orderId, medicine_id: medId})
                .then(() => this.medicinesList())
                .catch(err => {
                    console.log("Error deleteProduct " + err)
                });


    }
    inMap() {
        this.setState(prevState => ({
            inMap: !prevState.inMap
        }))
    }
    scrollToChooseLine() {
        scroller.scrollTo('checkout_main_chose_scroll', {
            duration: 500,
            smooth: true,
            offset: 0,
        });
        this.sentAnaliticInfo(2)
    }
    setPharm(branchId, intId, indexPharm, ipost, noScroll) {
        if(this.state.delivery_type_code === "NOVAPOSHTA_BRANCH" || this.state.delivery_type_code === "NOVAPOSHTA_COURIER") {
            request
                .get(linkStart+'/go/apteka/cart/pharmacy/get/'+this.state.orderId+'/'+462070+"?integration_id=2")
                // .get('http://localhost:3000/all-doc.json')
                .then(response => {
                    this.setState(prevState => ({
                            ...prevState.deliveryRows,
                            deliveryRows: {
                                ...prevState.deliveryRows,
                                // selectPharm:  this.state.deliveryProductLine.pharmacies.find(item => item.branch_id === branchId),
                                integration_id: 2,
                                selectPharm: response.body,
                                branch_id: branchId,
                                actualSummProducts: response.body.total_available_count
                                // actualSummProducts: response.body.product_item.map( product =>
                                //     parseInt(product.quantity, 10)
                                // ).reduce(function(sum, current) {
                                //     return (sum + current)
                                // },0)
                            },
                            totalProducts: response.body.total_available_count < this.state.sumProducts,
                            errorCreate: false

                        })
                    )
                })
                .catch(err => {
                    alert("Ошибка аптеки 462070 для НП " + err)
                })

        } else {
            request
                .get(linkStart+'/go/apteka/cart/pharmacy/get/'+this.state.orderId+'/'+branchId+"?integration_id="+intId)
                // .get('http://localhost:3000/all-doc.json')
                .then(response => {
                    this.setState(prevState => ({
                            ...prevState.deliveryRows,
                            deliveryRows: {
                                ...prevState.deliveryRows,
                                // selectPharm:  this.state.deliveryProductLine.pharmacies.find(item => item.branch_id === branchId),
                                integration_id: intId,
                                selectPharm:  response.body,
                                branch_id: branchId,
                                // actualSummProducts: response.body.products.map( product =>
                                //     parseInt(product.quantity, 10) >  parseInt(product.count, 10) ? parseInt(product.count, 10) : parseInt(product.quantity, 10)
                                // ).reduce(function(sum, current) {
                                //     return (sum + current)
                                // },0)
                                actualSummProducts: response.body.total_available_count
                                // actualSummProducts: response.body.product_item.map( product =>
                                //     parseInt(product.quantity, 10)
                                // ).reduce(function(sum, current) {
                                //     return (sum + current)
                                // },0)
                            },
                            totalProducts: response.body.total_available_count < this.state.sumProducts,
                            errorCreate: false
                        }),() =>
                            !ipost ?
                                noScroll ? null : this.scrollToChooseLine()
                                :
                                this.setState({
                                        selectPharm: {
                                            distance: this.state.deliveryProductLine.pharmacies[parseInt(indexPharm)].distance,
                                            ipostAddress: ipost
                                        }
                                    }, () =>
                                        request
                                            .post(linkStart + '/go/apteka/order/ipost/price')
                                            // .post('https://doc.ua/go/apteka/order/create')
                                            .send({
                                                address: ipost,
                                                branch_id: this.state.deliveryRows.branch_id,
                                                integration_id: this.state.deliveryRows.integration_id,
                                            })
                                            // .field('price',this.props.location.state.price)
                                            .then(res => {
                                                this.setState({
                                                        ipostRows: res.body,
                                                        errorAdress: false
                                                    }, () => {
                                                        if(this.state.ipostRows.error_code > 0) {
                                                            this.setState({
                                                                errorAdress: true
                                                            })
                                                        } else {
                                                            this.setState({
                                                                deliveryIPostBlock: {
                                                                    price: this.state.ipostRows.price,
                                                                    title: "Доставка до " +(this.state.ipostRows.min_delivery_time/60) + " мин",
                                                                    id: ""
                                                                }
                                                            })
                                                        }
                                                    }
                                                )

                                            })
                                            .catch(err => {
                                                console.log("Error ipost price" + err);
                                            })
                                )
                    )

                })
                .catch(err => {
                    if(indexPharm) {
                        this.setPharm(this.state.deliveryProductLine.pharmacies[parseInt(indexPharm)+1].branch_id, this.state.deliveryProductLine.pharmacies[parseInt(indexPharm)+1].id, parseInt(indexPharm)+1, ipost)
                    }
                    console.log("Error medicines List" + err)
                })

        }

    }
    handleSetPharm(idPharm) {
        let oldCtgs = this.state.handleIdSelect.map(value => Number(value));
        let newCtgs = [...oldCtgs];
        if (newCtgs.includes(idPharm)) {
            newCtgs.splice(oldCtgs.indexOf(idPharm), 1);
            // console.log(newCtgs.length)
        } else {
            newCtgs.push(idPharm);
        }
        if (newCtgs.length === 0) {
            this.setState({
                handleIdSelect: []
            })
        } else {
            this.setState({
                handleIdSelect: newCtgs
            })
        }


    }
    handleFormSubmit(e) {
        e.preventDefault();
        if (this.state.contactPeopleInfo.name.length >= 2) {
            this.setState({
                validName: true
            })
            if (isValidPhoneNumber(
                this.state.phoneCodesArray.includes(this.state.phone.substr(1, 5)) ? this.state.phone  : "380020"
                )) {
                if(this.state.offersRules) {
                    this.setState({
                        loading: true,
                    },  () => {
                        if (this.state.delivery_type_code === "DTC_PICKUP") {
                            this.sentAnaliticInfo(3);
                        } else {
                            this.sentAnaliticInfo(2, undefined, true);
                        }
                        if ( this.state.delivery_type_code === "IPOST") {

                                if (this.state.npFealds.street_address.length > 1 && this.state.npFealds.build.length > 0) {
                                    if(this.state.ipostRows) {
                                        this.setState({
                                                validAdresRows: true,
                                                loading: true
                                            }, () =>
                                                request
                                                    .post(linkStart+'/go/apteka/order/ipost/create')
                                                    .send({
                                                        address: {
                                                            city: this.state.npFealds.city,
                                                            number: this.state.npFealds.build,
                                                            street: this.state.npFealds.street_address,
                                                            flat: this.state.npFealds.flat,
                                                            entrance: this.state.npFealds.entrance,
                                                            floor: this.state.npFealds.floor,
                                                            intercom_code: this.state.npFealds.intercom_code,
                                                            lat: this.state.npFealds.lat,
                                                            long: this.state.npFealds.lng
                                                        },
                                                        promo: this.state.orderId === 17416 ? true : undefined,
                                                        delivery_time: +this.state.ipostRows.min_delivery_time,
                                                        items: this.state.orderId !== 17416 ?
                                                            this.state.deliveryRows.selectPharm.products.map((pharm) => {
                                                                return (
                                                                    {
                                                                        id: pharm.partner_internal_medicine_id,
                                                                        pharmacy_id: this.state.deliveryRows.branch_id,
                                                                        price: pharm.price,
                                                                        quantity: pharm.count <= pharm.quantity ? pharm.count : pharm.quantity,
                                                                    }
                                                                )
                                                            })
                                                            : [{
                                                                id: 17416,
                                                                pharmacy_id: 111,
                                                                price: 880,
                                                                quantity: this.state.ipostVitamin.count,
                                                            }],
                                                        order: {
                                                            branch_id: this.state.orderId !== 17416 ? this.state.deliveryRows.branch_id : 111,
                                                            cart_id: +this.state.orderId,
                                                            city_id: +this.state.cityId,
                                                            comment: this.state.contactPeopleInfo.comment,
                                                            delivery_type_code: "IPOST",
                                                            email: this.state.contactPeopleInfo.email,
                                                            first_name: this.state.contactPeopleInfo.name,
                                                            integration_id: this.state.orderId !== 17416 ? +this.state.deliveryRows.integration_id : 17 ,
                                                            integration_status: this.state.orderId !== 17416 ? "new" : "0",
                                                            is_call: this.state.callToCustomer ? 1 : 0,
                                                            last_name: "",
                                                            middle_name: "",
                                                            // paid: 0,
                                                            paid: -1,
                                                            delivery_price: this.state.deliveryIPostBlock ? this.state.deliveryIPostBlock.price : 0,
                                                            pharmacy_affiliate_address: this.state.orderId !== 17416 ? this.state.deliveryRows.selectPharm.pharmacy.address : "Антоновича, 115",
                                                            pharmacy_affiliate_name: this.state.orderId !== 17416 ? this.state.deliveryRows.selectPharm.pharmacy.name : "Аптека Рецептика",
                                                            phone: ""+parseInt(this.state.phone),
                                                            status_id: 1,
                                                            total_price: this.state.orderId !== 17416 ? +this.state.deliveryRows.selectPharm.total_price :this.state.ipostVitamin.price,
                                                            user_id: 0
                                                        }
                                                    })
                                                    .then(res => {
                                                        if(res.body.error_code > 0) {
                                                            this.setState({
                                                                errorCreate: true
                                                            })
                                                        } else {
                                                            this.sentAnaliticInfo(3, res.body.order_id);
                                                            let e = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
                                                            let domain = window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2');
                                                            document.cookie = "order_id=" +res.body.order_id+ "; domain="+domain+"; path=/; expires=" + e.toUTCString();
                                                            setTimeout(function () {
                                                                window.location.href = "/apteka/thankyou";
                                                            }, 700);
                                                            // console.log('Send')
                                                            this.setState({
                                                                loading: false,
                                                                errorCreate: false
                                                            })
                                                        }

                                                    })
                                                    .catch(err => {
                                                        console.log("Error " + err);
                                                        this.setState({
                                                            loading: false,
                                                            errorCreate: true
                                                        })
                                                    })
                                        )
                                    } else {
                                        this.setState({
                                            loading: false,
                                        })
                                    }
                                } else {
                                    this.setState({
                                        validAdresRows: false,
                                        loading: false
                                    }, function () {
                                        scroller.scrollTo('addressblock', {
                                            duration: 500,
                                            smooth: true,
                                            offset: -50,
                                        });
                                    })
                                }

                        }
                        else if ( this.state.delivery_type_code === "NOVAPOSHTA_BRANCH") {
                            if (this.state.npFealds.city.length > 1 && this.state.npFealds.number.length > 0) {
                                this.setState({
                                    validAdresRows: true,
                                    loading: true
                                }, () =>
                                    request
                                        .post(linkStart + '/go/apteka/order/novaposhta/create')
                                        // .post('https://doc.ua/go/apteka/order/create')
                                        .send({
                                            delivery_type_code: "NOVAPOSHTA_BRANCH",
                                            items: this.state.deliveryRows.selectPharm.products.map((pharm) => {
                                                return (
                                                    {
                                                        id: pharm.partner_internal_medicine_id,
                                                        name: pharm.name,
                                                        // pharmacy_id: +this.state.deliveryRows.branch_id,
                                                        price: pharm.real_price,
                                                        quantity: pharm.count <= pharm.quantity ? pharm.count : pharm.quantity,
                                                    }
                                                )
                                            }),
                                            order: {
                                                address_branch: "Самовывоз с отделения, город - "+this.state.npFealds.city+", отделение - "+this.state.npFealds.number,
                                                cart_id: +this.state.orderId,
                                                city_id: +this.state.cityId,
                                                city: this.state.cityOptions.find(city => city.city_id === this.state.cityId).label,
                                                comment: this.state.contactPeopleInfo.comment,
                                                delivery_price: 45,
                                                delivery_type_code: "NOVAPOSHTA_BRANCH",
                                                email: this.state.contactPeopleInfo.email,
                                                first_name: this.state.contactPeopleInfo.name,
                                                integration_id: this.state.deliveryRows.integration_id,
                                                integration_status: "new",
                                                is_call: this.state.callToCustomer ? 1 : 0,
                                                items: this.state.deliveryRows.selectPharm.products.map((pharm) => {
                                                    return (
                                                        {
                                                            id: pharm.partner_internal_medicine_id,
                                                            name: pharm.name,
                                                            price: pharm.real_price,
                                                            quantity: pharm.count <= pharm.quantity ? pharm.count : pharm.quantity,
                                                        }
                                                    )
                                                }),
                                                last_name: "",
                                                middle_name: "",
                                                paid: 0,
                                                phone: "" + parseInt(this.state.phone),
                                                status_id: 1,
                                                total_price: +this.state.deliveryRows.selectPharm.total_price,
                                                user_id: 0
                                            }
                                            // active: 0,
                                            // address_branch: this.state.deliveryRows.selectPharm.address,
                                            // city: this.state.cityOptions.find(city => city.city_id === this.state.cityId).value,
                                            // commission: 0,
                                            // date_create: new Date().toLocaleDateString(),
                                            // date_update: new Date().toLocaleDateString(),
                                            // id: 0,
                                            // is_delivery: false,
                                            // order_integration_id: this.state.deliveryRows.integration_id,
                                        })
                                        // .field('price',this.props.location.state.price)
                                        .then(res => {
                                            if(res.body.error_code > 0) {
                                                this.setState({
                                                    errorCreate: true
                                                })
                                            } else {
                                                let e = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
                                                let domain = window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2');
                                                this.sentAnaliticInfo(3, res.body.order_id)
                                                document.cookie = "order_id=" + res.body.order_id + "; domain=" + domain + "; path=/; expires=" + e.toUTCString();
                                                setTimeout(function () {
                                                    window.location.href = "/apteka/thankyou";
                                                }, 700);
                                                // console.log('Send')
                                                this.setState({
                                                    loading: false,
                                                    errorCreate: false
                                                })
                                            }

                                        })
                                        .catch(err => {
                                            console.log("Error " + err);
                                            this.setState({
                                                loading: false,
                                                errorCreate: true
                                            })
                                        })
                                )
                            } else {
                                this.setState({
                                    validAdresRows: false,
                                    loading: false
                                }, function () {
                                    scroller.scrollTo('addressblock', {
                                        duration: 500,
                                        smooth: true,
                                        offset: -50,
                                    });
                                })
                            }

                        } else
                            if ( this.state.delivery_type_code === "NOVAPOSHTA_COURIER") {
                                if (this.state.npFealds.street_address.length > 1 && this.state.npFealds.build.length > 0) {
                                    this.setState({
                                            validAdresRows: true,
                                            loading: true
                                        }, () =>
                                            request
                                                .post(linkStart + '/go/apteka/order/novaposhta/create')
                                                // .post('https://doc.ua/go/apteka/order/create')
                                                .send({
                                                    delivery_type_code: "NOVAPOSHTA_COURIER",
                                                    items: this.state.deliveryRows.selectPharm.products.map((pharm) => {
                                                        return (
                                                            {
                                                                id: pharm.partner_internal_medicine_id,
                                                                name: pharm.name,
                                                                // pharmacy_id: +this.state.deliveryRows.branch_id,
                                                                price: pharm.real_price,
                                                                quantity: pharm.count <= pharm.quantity ? pharm.count : pharm.quantity,
                                                            }
                                                        )
                                                    }),
                                                    order: {
                                                        address_branch: "Курьерская доставка, город - " + this.state.npFealds.city + ", адрес - " + this.state.npFealds.street_address + ", " + this.state.npFealds.build + " - кв. " + this.state.npFealds.flat + " - эт. " + this.state.npFealds.floor + " - код домофона " + this.state.npFealds.intercom_code,
                                                        cart_id: +this.state.orderId,
                                                        city_id: +this.state.cityId,
                                                        city: this.state.cityOptions.find(city => city.city_id === this.state.cityId).label,
                                                        comment: this.state.contactPeopleInfo.comment,
                                                        delivery_price: 45,
                                                        delivery_type_code: "NOVAPOSHTA_COURIER",
                                                        email: this.state.contactPeopleInfo.email,
                                                        first_name: this.state.contactPeopleInfo.name,
                                                        integration_id: this.state.deliveryRows.integration_id,
                                                        integration_status: "new",
                                                        is_call: this.state.callToCustomer ? 1 : 0,
                                                        items: this.state.deliveryRows.selectPharm.products.map((pharm) => {
                                                            return (
                                                                {
                                                                    id: pharm.partner_internal_medicine_id,
                                                                    name: pharm.name,
                                                                    price: pharm.real_price,
                                                                    quantity: pharm.count <= pharm.quantity ? pharm.count : pharm.quantity,
                                                                }
                                                            )
                                                        }),
                                                        last_name: "",
                                                        middle_name: "",
                                                        paid: 0,
                                                        phone: "" + parseInt(this.state.phone),
                                                        status_id: 1,
                                                        total_price: +this.state.deliveryRows.selectPharm.total_price,
                                                        user_id: 0
                                                    }
                                                    // active: 0,
                                                    // address_branch: this.state.deliveryRows.selectPharm.address,
                                                    // city: this.state.cityOptions.find(city => city.city_id === this.state.cityId).value,
                                                    // commission: 0,
                                                    // date_create: new Date().toLocaleDateString(),
                                                    // date_update: new Date().toLocaleDateString(),
                                                    // id: 0,
                                                    // is_delivery: false,
                                                    // order_integration_id: this.state.deliveryRows.integration_id,
                                                })
                                                // .field('price',this.props.location.state.price)
                                                .then(res => {
                                                    if(res.body.error_code > 0) {
                                                        this.setState({
                                                            errorCreate: true
                                                        })
                                                    } else {
                                                        let e = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
                                                        let domain = window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2');
                                                        this.sentAnaliticInfo(3, res.body.order_id)
                                                        document.cookie = "order_id=" + res.body.order_id + "; domain=" + domain + "; path=/; expires=" + e.toUTCString();
                                                        setTimeout(function () {
                                                            window.location.href = "/apteka/thankyou";
                                                        }, 700);
                                                        // console.log('Send')
                                                        this.setState({
                                                            loading: false,
                                                            errorCreate: false
                                                        })
                                                    }

                                                })
                                                .catch(err => {
                                                    console.log("Error " + err);
                                                    this.setState({
                                                        loading: false,
                                                        errorCreate: true
                                                    })
                                                })
                                    )
                                } else {
                                    this.setState({
                                        validAdresRows: false,
                                        loading: false
                                    }, function () {
                                        scroller.scrollTo('addressblock', {
                                            duration: 500,
                                            smooth: true,
                                            offset: -50,
                                        });
                                    })
                                }

                        } else {
                            if (this.state.deliveryRows.integration_id === 2) {
                                request
                                    .post(linkStart+'/go/apteka/order/dobrogodnya/create')
                                    // .post('https://doc.ua/go/apteka/order/create')
                                    .send({
                                        status_id: 1,
                                        integration_status: "new",
                                        last_name: "",
                                        middle_name: "",
                                        first_name: this.state.contactPeopleInfo.name,
                                        phone: ""+parseInt(this.state.phone),
                                        email: this.state.contactPeopleInfo.email,
                                        integration_id: this.state.deliveryRows.integration_id,
                                        pharmacy_affiliate_address: this.state.deliveryRows.selectPharm.pharmacy.address,
                                        pharmacy_affiliate_name: this.state.deliveryRows.selectPharm.pharmacy.name,
                                        branch_id: +this.state.deliveryRows.branch_id,
                                        cart_id: +this.state.orderId,
                                        city_id: +this.state.cityId,
                                        user_id: 0,
                                        comment: this.state.contactPeopleInfo.comment,
                                        delivery_type_code: "DTC_PICKUP",
                                        delivery_price: 0,
                                        paid: 0,
                                        is_call: !this.state.callToCustomer ? 1 : 0,
                                        total_price: +this.state.deliveryRows.selectPharm.total_price,
                                        items: this.state.deliveryRows.selectPharm.products.map((pharm) => {
                                            return (
                                                {
                                                    id: pharm.partner_internal_medicine_id,
                                                    name: pharm.name,
                                                    pharmacy_id: +this.state.deliveryRows.branch_id,
                                                    price: pharm.real_price,
                                                    quantity: pharm.count <= pharm.quantity ? pharm.count : pharm.quantity,
                                                }
                                            )
                                        }),
                                        // active: 0,
                                        // address_branch: this.state.deliveryRows.selectPharm.address,
                                        // city: this.state.cityOptions.find(city => city.city_id === this.state.cityId).value,
                                        // commission: 0,
                                        // date_create: new Date().toLocaleDateString(),
                                        // date_update: new Date().toLocaleDateString(),
                                        // id: 0,
                                        // is_delivery: false,
                                        // order_integration_id: this.state.deliveryRows.integration_id,
                                    })
                                    // .field('price',this.props.location.state.price)
                                    .then(res => {
                                        if(res.body.error_code > 0) {
                                            this.setState({
                                                errorCreate: true
                                            })
                                        } else {
                                            let e = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
                                            let domain = window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2');
                                            this.sentAnaliticInfo(3, res.body.order_id)
                                            document.cookie = "order_id=" +res.body.order_id+ "; domain="+domain+"; path=/; expires=" + e.toUTCString();
                                            setTimeout(function () {
                                                window.location.href = "/apteka/thankyou";
                                            }, 700);
                                            // console.log('Send')
                                            this.setState({
                                                loading: false,
                                                errorCreate: false
                                            })
                                        }

                                    })
                                    .catch(err => {
                                        console.log("Error " + err);
                                        this.setState({
                                            loading: false,
                                            errorCreate: true
                                        })
                                    });


                            } else if(this.state.deliveryRows.integration_id === 4){
                                request
                                    .post(linkStart+'/go/apteka/order/api911/create')
                                    // .post('https://doc.ua/go/apteka/order/create')
                                    .send({
                                        status_id: 1,
                                        integration_status: "new",
                                        last_name: "",
                                        middle_name: "",
                                        first_name: this.state.contactPeopleInfo.name,
                                        phone: ""+parseInt(this.state.phone),
                                        email: this.state.contactPeopleInfo.email,
                                        integration_id: this.state.deliveryRows.integration_id,
                                        pharmacy_affiliate_address: this.state.deliveryRows.selectPharm.pharmacy.address,
                                        pharmacy_affiliate_name: this.state.deliveryRows.selectPharm.pharmacy.name,
                                        branch_id: +this.state.deliveryRows.branch_id,
                                        cart_id: +this.state.orderId,
                                        city_id: +this.state.cityId,
                                        user_id: 0,
                                        comment: this.state.contactPeopleInfo.comment,
                                        delivery_type_code: "DTC_PICKUP",
                                        delivery_price: 0,
                                        paid: 0,
                                        is_call: !this.state.callToCustomer ? 1 : 0,
                                        total_price: +this.state.deliveryRows.selectPharm.total_price,
                                        items: this.state.deliveryRows.selectPharm.products.map((pharm) => {
                                            return (
                                                {
                                                    id: pharm.partner_internal_medicine_id,
                                                    // name: pharm.name,
                                                    // pharmacy_id: +this.state.deliveryRows.branch_id,
                                                    price: pharm.real_price,
                                                    quantity: pharm.count <= pharm.quantity ? pharm.count : pharm.quantity,
                                                }
                                            )
                                        }),
                                        // active: 0,
                                        // address_branch: this.state.deliveryRows.selectPharm.address,
                                        // city: this.state.cityOptions.find(city => city.city_id === this.state.cityId).value,
                                        // commission: 0,
                                        // date_create: new Date().toLocaleDateString(),
                                        // date_update: new Date().toLocaleDateString(),
                                        // id: 0,
                                        // is_delivery: false,
                                        // order_integration_id: this.state.deliveryRows.integration_id,
                                    })
                                    // .field('price',this.props.location.state.price)
                                    .then(res => {
                                        let e = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
                                        let domain = window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2');
                                        this.sentAnaliticInfo(3, res.body.order_id)
                                        document.cookie = "order_id=" +res.body.order_id+ "; domain="+domain+"; path=/; expires=" + e.toUTCString();
                                        setTimeout(function () {
                                            window.location.href = "/apteka/thankyou";
                                        }, 700);
                                        // console.log('Send')
                                        this.setState({
                                            loading: false
                                        })
                                    })
                                    .catch(err => {
                                        console.log("Error " + err);
                                        this.setState({
                                            loading: false
                                        })
                                    });
                            }else {
                                request
                                    .post(linkStart+'/go/apteka/order/create')
                                        .send({
                                            status_id: 1,
                                            integration_status: "new",
                                            last_name: "",
                                            middle_name: "",
                                            first_name: this.state.contactPeopleInfo.name,
                                            phone: ""+parseInt(this.state.phone),
                                            email: this.state.contactPeopleInfo.email,
                                            integration_id: this.state.deliveryRows.integration_id,
                                            pharmacy_affiliate_address: this.state.deliveryRows.selectPharm.pharmacy.address,
                                            pharmacy_affiliate_name: this.state.deliveryRows.selectPharm.pharmacy.name,
                                            branch_id: this.state.deliveryRows.branch_id,
                                            cart_id: +this.state.orderId,
                                            city_id: +this.state.cityId,
                                            user_id: 0,
                                            comment: this.state.contactPeopleInfo.comment,
                                            delivery_type_code: "DTC_PICKUP",
                                            delivery_price: 0,
                                            paid: 0,
                                            is_call: !this.state.callToCustomer ? 1 : 0,
                                            total_price: +this.state.deliveryRows.selectPharm.total_price,
                                            items: this.state.deliveryRows.selectPharm.products.map((pharm) => {
                                                return (
                                                    {
                                                        id: pharm.partner_internal_medicine_id,

                                                        price: pharm.real_price,
                                                        quantity: pharm.count <= pharm.quantity ? pharm.count : pharm.quantity,
                                                    }
                                                )
                                            }),
                                        })
                                        .then(res => {
                                            let e = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
                                            let domain = window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2');
                                            this.sentAnaliticInfo(3, res.body.order_id)
                                            document.cookie = "order_id=" +res.body.order_id+ "; domain="+domain+"; path=/; expires=" + e.toUTCString();
                                            setTimeout(function () {
                                                window.location.href = "/apteka/thankyou";
                                            }, 700);
                                            console.log('Send')
                                            this.setState({
                                                loading: false
                                            })
                                        })
                                        .catch(err => {
                                            console.log("Error " + err);
                                            this.setState({
                                                loading: false
                                            })
                                        });
                                // alert("Неизвестный integration_id (" + this.state.deliveryRows.integration_id + ")")
                            }
                        }



                    })
                } else {
                    this.setState({
                        classAccept: 'red'
                    })
                }
            } else {
                this.setState({
                    validPhone: false
                }, function () {
                    scroller.scrollTo('phoneInp', {
                        duration: 500,
                        smooth: true,
                        offset: -150,
                    });
                })
            }
        } else {
            this.setState({
                validName: false
            }, function () {
                scroller.scrollTo('nameInput', {
                    duration: 500,
                    smooth: true,
                    offset: -150,
                });
            })
        }


    }
    handleInput(e) {
        let value = e.target.value;
        let name = e.target.name;
        this.setState( prevState => {
                return {
                    contactPeopleInfo : {
                        ...prevState.contactPeopleInfo, [name]: value
                    }
                }
            }
            // , () => console.log(this.state.contactPeopleInfo)
        )
    }
    handleInputPhone(e) {
        this.setState({
            phone:  !e ? '' : e,
            validPhone: true
        })
    }
    changeCenterMap(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    centerMap: {lat: position.coords.latitude, lng: position.coords.longitude}
                })
            }
        );
    }
    render() {
        return(
            <>
                <Pagination/>
                <section className="checkout">
                    <div className="container checkout_cnt">
                        <div className="checkout_main">
                            <CaptionNumbCheckout
                                index={1}
                                name="Ваш заказ"
                            />
                            {
                                this.state.orderId === 17416 ?
                                    <div className="checkout_main_point">
                                        <div className="checkout_side_product-item ord  no-pad no-bord">
                                            <div className="checkout_side_line_cnt">
                                                <div className="checkout_side_name">Акционный витаминный комплекс (Omega - 3, Zn, D3) №1 от Doc.ua</div>
                                                <div className="checkout_side_col">
                                                    <div className="range">
                                                        <div className="range_btn down-col"
                                                             onClick={() => this.changeIpostQuantity()}
                                                        />
                                                        <div className="col-tovar">{this.state.ipostVitamin.count}</div>
                                                        <div className="range_btn up-col"
                                                             onClick={() => this.changeIpostQuantity(true)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="checkout_side_price">{this.state.ipostVitamin.price}.00 грн</div>
                                                <div className="checkout_side_remove"><span className="icon-close"/></div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="checkout_main_point">
                                        <a href="/apteka/catalog" className="checkout_main_caption_link">Добавить товар</a>
                                        {
                                            !this.state.medicinesList || !this.state.medicinesList || !this.state.medicinesList.products
                                                ? null
                                                :
                                                this.state.medicinesList.products.length < 1 ?
                                                    <div className="checkout_side_product-item_alert ipost">
                                                        <span className="icon icon-info"/>
                                                        <span>В вашей корзине нет товаров.</span>
                                                    </div>
                                                    :
                                                    this.state.medicinesList.products.map((product, index) => {
                                                        return (
                                                            <ProductItem
                                                                key={product.medicine_id}
                                                                nameClass={`checkout_side_product-item ord ${this.state.medicinesList.products.length - 1  === index ? "no-bord" : ""} ${index === 0 ? "no-pad" : ""}`}
                                                                product={product}
                                                                changeProductQuantity={this.changeProductQuantityThrottled}
                                                                deleteProduct={this.deleteProduct}
                                                            />
                                                        )
                                                    })
                                        }
                                    </div>
                            }

                            <CaptionNumbCheckout
                                index={2}
                                name="Способ доставки"
                            />
                            <div className="checkout_main_point ">
                                {
                                    this.state.orderId === 17416 ?
                                        <div className="checkout_main_point_inpt head ">
                                            <div className="checkout_main_point_inpt_name f-b">Ваш город:</div>
                                            <div className="checkout_main_point_inpt select require">
                                                <Select
                                                    classNamePrefix='filter'
                                                    placeholder="Киев"
                                                    isDisabled
                                                />
                                            </div>
                                        </div>
                                        :
                                        !this.state.medicinesList ? null
                                        :
                                        !this.state.cityOptions ? null
                                            :
                                            <div className="checkout_main_point_inpt head ">
                                                <div className="checkout_main_point_inpt_name f-b">Ваш город:</div>
                                                <div className="checkout_main_point_inpt select require">
                                                    <Select
                                                        classNamePrefix='filter'
                                                        options={this.state.cityOptions}
                                                        defaultValue={this.state.cityOptions.find(city => city.city_id === this.state.cityId)}
                                                        placeholder="Выберите город"
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                            </div>
                                }
                                {
                                    this.state.orderId === 17416 ?
                                        <div className="checkout_main_point_adres-list">
                                            <div className="checkout_main_point_adres-list_line active">
                                                <div className="checkout_main_point_adres-list_line_head">
                                                    <div
                                                        className="checkout_main_point_adres-list_line_head_name">Курьерская
                                                        доставка iPOST
                                                    </div>

                                                    <div className="checkout_main_point_adres-list_radio"/>
                                                </div>
                                                <div className="checkout_main_point_adres-list_line_body">
                                                    <div className="checkout_main_point_adres-list_line_body_point"><span
                                                        className="icon icon-clock"/><span>В течение 2-х часов либо в удобное для клиента время</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null
                                }
                                    {
                                        !this.state.deliveryProductLine ? null
                                            :
                                            <div className="checkout_main_point_adres-list">
                                                <div className={`checkout_main_point_adres-list_line ${this.state.delivery_type_code === "DTC_PICKUP" ? "active" : ""}`}
                                                     onClick={() => this.deliveryTypeChange("DTC_PICKUP")}>
                                                    <div className="checkout_main_point_adres-list_line_head">
                                                        <div className="checkout_main_point_adres-list_line_head_name">Самовывоз из аптеки</div>
                                                        <div className="checkout_main_point_adres-list_line_head_price">Бесплатно</div>
                                                        <div className="checkout_main_point_adres-list_radio"/>
                                                    </div>
                                                    <div className="checkout_main_point_adres-list_line_body">
                                                        <div className={`checkout_main_point_adres-list_line_body_point ${this.state.deliveryProductLine.pharmacies[0].sort_index === 3 ? 'green' : 'red'}`} >
                                                            <span className="icon icon-basket-2"/>
                                                            {
                                                                this.state.deliveryProductLine.pharmacies[0].sort_index === 3 ?
                                                                    <span className='f-b h6'>Все товары</span>
                                                                    :
                                                                    <span className='f-b h6'>{
                                                                        this.state.deliveryProductLine.pharmacies[0].products.map( product =>
                                                                            parseInt(product.in_stock, 10) >  parseInt(product.in_cart, 10) ? parseInt(product.in_cart, 10) : parseInt(product.in_stock, 10)
                                                                        )
                                                                            .reduce(function(sum, current) {
                                                                                return (sum + current)
                                                                            },0)
                                                                    }/{
                                                                        this.state.sumProducts
                                                                    } товаров в аптеке</span>
                                                            }
                                                            {/*<span className="price">от {this.state.deliveryRows.selectPharm ? this.state.deliveryRows.selectPharm.total_price.toFixed(2) : this.state.deliveryProductLine.pharmacies[0].price.toFixed(2)} грн</span>*/}
                                                            <span className="price">от {this.state.deliveryProductLine.pharmacies[0].price.toFixed(2)} грн</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`checkout_main_point_adres-list_line ${this.state.delivery_type_code === "IPOST" ? "active" : ""}`}
                                                     onClick={() => this.deliveryTypeChange("IPOST")}>
                                                    <div className="checkout_main_point_adres-list_line_head">
                                                        <div className="checkout_main_point_adres-list_line_head_name">Курьерская доставка iPOST</div>
                                                        {/*<div className="checkout_main_point_adres-list_line_head_price">{`${delivery.high_price === 0 ? "Бесплатно" : delivery.low_price+" - "+delivery.high_price+" грн"}`}</div>*/}
                                                        <div className="checkout_main_point_adres-list_line_head_price">85 - 150 грн.
                                                            {/*<span className="icon-help"><span className="icon-help_text fade-in">Для уточнения стоимости введите адрес доставки</span></span>*/}
                                                        </div>
                                                        <div className="checkout_main_point_adres-list_radio"/>
                                                    </div>
                                                    <div className="checkout_main_point_adres-list_line_body">
                                                        <div className="checkout_main_point_adres-list_line_body_point">
                                                            <span className="icon icon-clock"/>
                                                            <span>В течение 2-х часов либо в удобное для клиента время</span>
                                                        </div>
                                                        <div className={`checkout_main_point_adres-list_line_body_point ${this.state.deliveryProductLine.pharmacies[0].sort_index === 3 ? 'green' : 'red'}`} >
                                                            <span className="icon icon-basket-2"/>
                                                            {
                                                                this.state.deliveryProductLine.pharmacies[0].sort_index === 3 ?
                                                                    <span className='f-b h6'>Все товары</span>
                                                                    :
                                                                    <span className='f-b h6'>{
                                                                        this.state.deliveryProductLine.pharmacies[0].products.map( product =>
                                                                            parseInt(product.in_stock, 10) >  parseInt(product.in_cart, 10) ? parseInt(product.in_cart, 10) : parseInt(product.in_stock, 10)
                                                                        )
                                                                            .reduce(function(sum, current) {
                                                                                return (sum + current)
                                                                            },0)
                                                                    }/{
                                                                        this.state.sumProducts
                                                                    } товаров в аптеке</span>
                                                            }
                                                            <span className="price">от {this.state.deliveryProductLine.pharmacies[0].price.toFixed(2)} грн</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    !this.state.deliveryProductLine.pharmacies.find(apteka => Number(apteka.branch_id) === 462070) ? null
                                                        :
                                                        <>
                                                            <div className={`checkout_main_point_adres-list_line ${this.state.delivery_type_code === "NOVAPOSHTA_BRANCH" ? "active" : ""}`}
                                                                 onClick={() => this.deliveryTypeChange("NOVAPOSHTA_BRANCH")}>
                                                                <div className="checkout_main_point_adres-list_line_head">
                                                                    <div className="checkout_main_point_adres-list_line_head_name"> Нова Пошта - доставка на отделение</div>
                                                                    {/*<div className="checkout_main_point_adres-list_line_head_price">{`${delivery.high_price === 0 ? "Бесплатно" : delivery.low_price+" - "+delivery.high_price+" грн"}`}</div>*/}
                                                                    <div className="checkout_main_point_adres-list_line_head_price">45 - 150 грн.
                                                                        {/*<span className="icon-help"><span className="icon-help_text fade-in">Для уточнения стоимости введите адрес доставки</span></span>*/}
                                                                    </div>
                                                                    <div className="checkout_main_point_adres-list_radio"/>
                                                                </div>
                                                                <div className="checkout_main_point_adres-list_line_body">

                                                                    <div className={`checkout_main_point_adres-list_line_body_point ${this.state.deliveryProductLine.pharmacies.find(apteka => Number(apteka.branch_id) === 462070).sort_index === 3 ? 'green' : 'red'}`} >
                                                                        <span className="icon icon-basket-2"/>
                                                                        {
                                                                            this.state.deliveryProductLine.pharmacies.find(apteka => Number(apteka.branch_id) === 462070).sort_index === 3 ?
                                                                                <span className='f-b h6'>Все товары</span>
                                                                                :
                                                                                <span className='f-b h6'>{
                                                                                    this.state.deliveryProductLine.pharmacies.find(apteka => Number(apteka.branch_id) === 462070).products.map( product =>
                                                                                        parseInt(product.in_stock, 10) >  parseInt(product.in_cart, 10) ? parseInt(product.in_cart, 10) : parseInt(product.in_stock, 10)
                                                                                    )
                                                                                        .reduce(function(sum, current) {
                                                                                            return (sum + current)
                                                                                        },0)
                                                                                }/{
                                                                                    this.state.sumProducts
                                                                                } товаров в аптеке</span>
                                                                        }
                                                                        <span className="price">от {this.state.deliveryProductLine.pharmacies.find(apteka => Number(apteka.branch_id) === 462070).price.toFixed(2)} грн</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={`checkout_main_point_adres-list_line ${this.state.delivery_type_code === "NOVAPOSHTA_COURIER" ? "active" : ""}`}
                                                                 onClick={() => this.deliveryTypeChange("NOVAPOSHTA_COURIER")}>
                                                                <div className="checkout_main_point_adres-list_line_head">
                                                                    <div className="checkout_main_point_adres-list_line_head_name"> Нова Пошта - адресная доставка</div>
                                                                    <div className="checkout_main_point_adres-list_line_head_price">65 - 150 грн.
                                                                    </div>
                                                                    <div className="checkout_main_point_adres-list_radio"/>
                                                                </div>
                                                                <div className="checkout_main_point_adres-list_line_body">
                                                                    <div className={`checkout_main_point_adres-list_line_body_point ${this.state.deliveryProductLine.pharmacies.find(apteka => Number(apteka.branch_id) === 462070).sort_index === 3 ? 'green' : 'red'}`} >
                                                                        <span className="icon icon-basket-2"/>
                                                                        {
                                                                            this.state.deliveryProductLine.pharmacies.find(apteka => Number(apteka.branch_id) === 462070).sort_index === 3 ?
                                                                                <span className='f-b h6'>Все товары</span>
                                                                                :
                                                                                <span className='f-b h6'>{
                                                                                    this.state.deliveryProductLine.pharmacies.find(apteka => Number(apteka.branch_id) === 462070).products.map( product =>
                                                                                        parseInt(product.in_stock, 10) >  parseInt(product.in_cart, 10) ? parseInt(product.in_cart, 10) : parseInt(product.in_stock, 10)
                                                                                    )
                                                                                        .reduce(function(sum, current) {
                                                                                            return (sum + current)
                                                                                        },0)
                                                                                }/{
                                                                                    this.state.sumProducts
                                                                                } товаров в аптеке</span>
                                                                        }
                                                                        <span className="price">от {this.state.deliveryProductLine.pharmacies.find(apteka => Number(apteka.branch_id) === 462070).price.toFixed(2)} грн</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>

                                                }
                                            </div>
                                    }
                            </div>
                            {
                                !this.state.deliveryProductLine && this.state.orderId !== 17416 ? null
                                    :
                                    this.state.delivery_type_code === "DTC_PICKUP" ?
                                        <>
                                            <CaptionNumbCheckout
                                                index={3}
                                                name="Выберите аптеку"
                                            />
                                            <div className="checkout_main_point min-margin">
                                                <div className="b">Выбрать из сетевых аптек:</div>
                                                <div className="checkout_main_point_apteki-list">
                                                    {
                                                        this.state.handleIdSelect.length < 1 ? null
                                                            :
                                                            <div className="catalog_products_sort-panel_second_clear"
                                                                 onClick={ () =>
                                                                     this.setState({
                                                                         handleIdSelect: []
                                                                     })
                                                                 }
                                                            >
                                                                Очистить все
                                                                <span className="icon-close"/>
                                                            </div>
                                                    }
                                                    <div className="checkout_main_point_apteki-list_ul">
                                                        {
                                                            this.state.deliveryRows.pharmIdSelected ?
                                                                this.state.deliveryRows.pharmIdSelected.map((pharm) => {
                                                                    return (
                                                                        <div className={`checkout_main_point_apteki-list_point ${this.state.handleIdSelect.indexOf(pharm.apteka_id) !== -1 ? "active" : ""}`}
                                                                             key={pharm.apteka_id}
                                                                             onClick={() => this.handleSetPharm(pharm.apteka_id)}
                                                                        >
                                                                            <img  src={pharm.image_url} alt={pharm.name}/>
                                                                            <div className="checkout_main_point_apteki-list_point_radio"/>
                                                                        </div>
                                                                    )
                                                                })
                                                                : null

                                                        }
                                                    </div>

                                                </div>
                                            </div>

                                            <div className={`checkout_main_point ${this.state.inMap ? "with-map" : ""}`}>
                                                <div className="checkout_main_point_line">
                                                    <div className="catalog_products_sort-panel_in-stock"
                                                         onClick={() => this.setState(prevState => ({inStock: !prevState.inStock}))}>
                                                        <div>В наличии:</div>
                                                        <div
                                                            className={`catalog_products_sort-panel_in-stock_btn ${this.state.inStock ? "active" : ""}`}/>
                                                    </div>

                                                    {/*<div className="main-sec_search_line">*/}
                                                    {/*    <button className="icon-loop" id=""/>*/}
                                                    {/*    <input placeholder="Поиск по адресу" type="text"/>*/}
                                                    {/*</div>*/}
                                                    <div className="checkout_main_map_shower" onClick={() => this.inMap()}>
                                                        <div
                                                            className={`checkout_main_map_shower_point ${this.state.inMap ? "active" : ""}`}>
                                                            <span>На карте</span>
                                                            <svg width="12" height="13" viewBox="0 0 12 13" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M4.3641 1.8573L7.63683 2.62726V11.358L4.3641 10.7805V1.8573ZM4.14613 1.36377C4.09726 1.36377 4.04948 1.38013 4.01043 1.4109C3.95828 1.45213 3.92773 1.51519 3.92773 1.58195V10.9638C3.92773 11.0696 4.00366 11.1601 4.10795 11.1785L7.81704 11.833C7.8297 11.8354 7.84235 11.8365 7.85501 11.8365C7.90584 11.8365 7.95559 11.8186 7.9953 11.7854C8.04461 11.744 8.07319 11.6827 8.07319 11.6183V2.45468C8.07319 2.35344 8.00359 2.26551 7.90497 2.24217L4.19588 1.36944C4.1793 1.36551 4.16272 1.36377 4.14613 1.36377Z"/>
                                                                <path
                                                                    d="M11.9096 0.968591C11.8526 0.927573 11.7793 0.916009 11.713 0.9387L7.78574 2.24779C7.69672 2.27746 7.63672 2.36081 7.63672 2.45485V11.6185C7.63672 11.6905 7.67228 11.7579 7.73185 11.7985C7.7685 11.8236 7.8117 11.8367 7.8549 11.8367C7.88174 11.8367 7.90835 11.8319 7.93388 11.8218L11.8612 10.2946C11.9452 10.2618 12.0004 10.1811 12.0004 10.0912V1.14575C12.0004 1.0755 11.9668 1.00983 11.9096 0.968591Z"/>
                                                                <path
                                                                    d="M4.09811 1.36918L0.170836 2.24191C0.0711273 2.26438 0 2.35274 0 2.45507V11.8369C0 11.9032 0.0301091 11.9656 0.0818182 12.0071C0.120873 12.0385 0.169091 12.0551 0.218182 12.0551C0.233891 12.0551 0.249818 12.0533 0.265527 12.0501L4.1928 11.1773C4.29251 11.1549 4.36364 11.0663 4.36364 10.9642V1.58234C4.36364 1.51602 4.33353 1.45362 4.28182 1.41216C4.23055 1.37071 4.16291 1.35543 4.09811 1.36918Z"/>
                                                            </svg>
                                                        </div>
                                                        <div
                                                            className={`checkout_main_map_shower_point ${!this.state.inMap ? "active" : ""}`}>
                                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="2.57227" y="0.857422" width="9.42774"
                                                                      height="2.05755"/>
                                                                <rect y="0.857422" width="1.71413" height="2.05755"/>
                                                                <rect y="4.9707" width="1.71413" height="2.05755"/>
                                                                <rect y="9.08447" width="1.71413" height="2.05755"/>
                                                                <rect x="2.57227" y="4.9707" width="9.42774" height="2.05755"/>
                                                                <rect x="2.57227" y="9.08447" width="9.42774" height="2.05755"/>
                                                            </svg>
                                                            <span>Cписок</span>
                                                        </div>
                                                    </div>
                                                    {
                                                        !this.state.enableLocation ? null
                                                            :
                                                            <div className="checkout_main_map_near" onClick={()=> this.changeCenterMap()}>
                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g clipPath="url(#clip0)">
                                                                        <path d="M8.00003 5.2335C6.47407 5.2335 5.23337 6.47456 5.23337 8.00015C5.23337 9.52575 6.47411 10.7668 8.00003 10.7668C9.52595 10.7668 10.7667 9.52575 10.7667 8.00015C10.7667 6.47456 9.52599 5.2335 8.00003 5.2335ZM8.00003 9.90015C6.95238 9.90015 6.10003 9.0478 6.10003 8.00015C6.10003 6.95251 6.95238 6.10015 8.00003 6.10015C9.04768 6.10015 9.90003 6.95251 9.90003 8.00015C9.90003 9.0478 9.04768 9.90015 8.00003 9.90015Z"  strokeWidth="0.2"/>
                                                                        <path d="M15.6667 7.56666H14.077C13.8633 4.5494 11.4509 2.13666 8.43334 1.92299V0.333344C8.43334 0.0938653 8.23948 -0.1 8 -0.1C7.76052 -0.1 7.56666 0.0938652 7.56666 0.333344V1.92299C4.54913 2.13666 2.13666 4.5494 1.92299 7.56666H0.333344C0.0938651 7.56666 -0.1 7.76052 -0.1 8C-0.1 8.23948 0.0938653 8.43334 0.333344 8.43334H1.92299C2.13666 11.4506 4.54913 13.8633 7.56666 14.077V15.6667C7.56666 15.9062 7.76052 16.1 8 16.1C8.23948 16.1 8.43334 15.9062 8.43334 15.6667V14.077C11.4509 13.8633 13.8633 11.4506 14.077 8.43334H15.6667C15.9062 8.43334 16.1 8.23948 16.1 8C16.1 7.76051 15.9061 7.56666 15.6667 7.56666ZM8 13.2333C5.11448 13.2333 2.76666 10.8855 2.76666 8C2.76666 5.11448 5.11448 2.76666 8 2.76666C10.8855 2.76666 13.2333 5.11448 13.2333 8C13.2333 10.8855 10.8855 13.2333 8 13.2333Z"  strokeWidth="0.2"/>
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0">
                                                                            <rect width="16" height="16" fill="white" transform="matrix(-1 0 0 1 16 0)"/>
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                                Рядом со мной
                                                            </div>
                                                    }
                                                </div>
                                                {
                                                    this.state.inMap ?
                                                        !this.state.cityOptions ? null
                                                            :
                                                            <MapBlock
                                                                sumProducts={this.state.sumProducts}
                                                                // pharmacy_list={this.state.deliveryProductLine.pharmacies.filter(instock => !this.state.inStock ? true : instock.sort_index === 3)
                                                                //     .filter(apteka => !this.state.handleIdSelect ? true
                                                                //         : this.state.handleIdSelect.length < 1 ? true : this.state.handleIdSelect.includes(apteka.apteka_id))}
                                                                handleIdSelect={this.state.handleIdSelect}
                                                                inStock={this.state.inStock}
                                                                pharmacy_list={this.state.deliveryProductLine.pharmacies}
                                                                cardId={this.state.orderId}
                                                                onsetPharm={this.setPharm}
                                                                selectCity={this.state.cityOptions.find(city => city.city_id === this.state.cityId)}
                                                                selectPharm={this.state.deliveryRows.selectPharm}
                                                                actualSummProducts={this.state.deliveryRows.actualSummProducts}
                                                                selectPharmId={this.state.deliveryRows.branch_id}
                                                                centerMap={this.state.centerMap}
                                                            />
                                                        :
                                                        <div className="checkout_main_point_adres-list fade-in">
                                                            {
                                                                this.state.deliveryProductLine.pharmacies.filter(instock => !this.state.inStock ? true : instock.sort_index === 3)
                                                                    .filter(apteka => !this.state.handleIdSelect ? true
                                                                        : this.state.handleIdSelect.length < 1 ? true
                                                                            : this.state.handleIdSelect.includes(apteka.apteka_id)).map((pharm, index) => {
                                                                    return (
                                                                        <div className={`checkout_main_point_adres-list_line fade-in  ${this.state.deliveryRows.branch_id === pharm.branch_id ? "active" : ""}`}
                                                                             onClick={() => this.setPharm(pharm.branch_id, pharm.id)}
                                                                             key={pharm.branch_id}
                                                                        >
                                                                            <div className="checkout_main_point_adres-list_line_head">
                                                                                {
                                                                                    index === 0 ?
                                                                                        <div className="checkout_main_point_adres-list_line_head_marker  ">
                                                                                            <div className="checkout_main_point_adres-list_line_head_marker_text">лучшее
                                                                                                предложение
                                                                                            </div>
                                                                                            <div className="checkout_main_point_adres-list_line_head_marker_logo"/>
                                                                                        </div>
                                                                                        : null
                                                                                }
                                                                                <div className="checkout_main_point_adres-list_line_head_logo"><img src={pharm.image_url} alt={pharm.name}/></div>
                                                                                <div className="checkout_main_point_adres-list_line_head_name">{pharm.name}</div>
                                                                                <div className="checkout_main_point_adres-list_radio"/>
                                                                            </div>
                                                                            <div className="checkout_main_point_adres-list_line_body">
                                                                                <div className="checkout_main_point_adres-list_line_body_point">
                                                                                    <span className="icon icon-location"/>
                                                                                    <span>{pharm.address}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="checkout_main_point_adres-list_line_body_point">
                                                                                    <span className="icon icon-clock"/>
                                                                                    <span>{pharm.schedule}</span>
                                                                                </div>
                                                                                {
                                                                                    this.state.deliveryRows.branch_id === pharm.branch_id && this.state.deliveryRows.selectPharm ?
                                                                                        <div className={`checkout_main_point_adres-list_line_body_point ${this.state.deliveryRows.actualSummProducts >= this.state.sumProducts ? 'green' : 'red'}`}>
                                                                                            <span className="icon icon-basket-2"/>
                                                                                            <span className='f-b h6'>{this.state.deliveryRows.actualSummProducts >= this.state.sumProducts ? "Все товары" : this.state.deliveryRows.actualSummProducts +"/"+this.state.sumProducts + " товаров в аптеке"}</span>
                                                                                            <span className="price">{this.state.deliveryRows.selectPharm.total_price.toFixed(2)}</span>
                                                                                        </div>
                                                                                        :
                                                                                        <div className={`checkout_main_point_adres-list_line_body_point ${pharm.sort_index === 3 ? "green" : "red"}`}>
                                                                                            <span className="icon icon-basket-2"/>
                                                                                            <span className='f-b h6'>{pharm.sort_index === 3 ? "Все товары" : pharm.products.map( product => parseInt(product.in_stock, 10) >  parseInt(product.in_cart, 10) ?
                                                                                                parseInt(product.in_cart, 10) : parseInt(product.in_stock, 10)).reduce((sum, current) => (sum + current),0) +"/"+this.state.sumProducts + " товаров в аптеке"}</span>
                                                                                            <span className="price">{pharm.price.toFixed(2)}</span>
                                                                                        </div>
                                                                                }
                                                                            </div>
                                                                            {/*<div className="checkout_main_point_adres-list_time">*/}
                                                                            {/*    Бронирование товара на протяжении <time>2 часов</time>*/}
                                                                            {/*</div>*/}
                                                                        </div>

                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                }
                                                <div className="checkout_main_chose_scroll" id="checkout_main_chose_scroll"/>
                                                <div className="checkout_main_chose">
                                                    <div className="checkout_main_chose_caption">Вы выбрали:</div>
                                                    {
                                                        !this.state.deliveryRows.selectPharm ? null
                                                            :
                                                            <div className="checkout_main_chose_line">
                                                                <div className={`checkout_main_point_adres-list_line fade-in`}>
                                                                    <div className="checkout_main_point_adres-list_line_head">
                                                                        <div className="checkout_main_point_adres-list_line_head_logo"><img src={this.state.deliveryRows.selectPharm.pharmacy.logo} alt="apteka" /></div>
                                                                        <div className="checkout_main_point_adres-list_line_head_name">{this.state.deliveryRows.selectPharm.pharmacy.name}</div>
                                                                    </div>
                                                                    <div className="checkout_main_point_adres-list_line_body">
                                                                        <div className="checkout_main_point_adres-list_line_body_point">
                                                                            <span className="icon icon-location"/>
                                                                            <span>{this.state.deliveryRows.selectPharm.pharmacy.address}</span>
                                                                        </div>
                                                                        <div className={`checkout_main_point_adres-list_line_body_point f-b ${this.state.deliveryRows.selectPharm.total_available_count < this.state.sumProducts ? 'red' : 'green'}`}>
                                                                            <span className="icon icon-basket-2 "/>
                                                                            {
                                                                                this.state.deliveryRows.selectPharm.total_available_count < this.state.sumProducts ?
                                                                                    <span >{this.state.deliveryRows.selectPharm.total_available_count }/{this.state.sumProducts} товаров в аптеке</span>
                                                                                    :
                                                                                    <span className='h6'>Все товары</span>
                                                                            }
                                                                            <span className="price">{this.state.deliveryRows.selectPharm.total_price.toFixed(2)} <span className='h6'>грн</span></span>
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        this.state.deliveryRows.selectPharm.total_available_count < this.state.sumProducts ?
                                                                            <div className="checkout_main_point_adres-list_line_absent">
                                                                                {
                                                                                    this.state.medicinesList.products.map((product) => {
                                                                                        if(this.state.deliveryRows.selectPharm.products.find(selectProducts => selectProducts.medicine_id === product.medicine_id) ) {
                                                                                            return(
                                                                                                product.count > this.state.deliveryRows.selectPharm.products.find(selectProducts => selectProducts.medicine_id === product.medicine_id).quantity ?
                                                                                                    <div className="checkout_main_point_adres-list_line_absent_point" key={product.medicine_id}>
                                                                                                        <div className="checkout_main_point_adres-list_line_absent_point_name">{product.name}</div>
                                                                                                        <div className="checkout_main_point_adres-list_line_absent_point_status">В наличии {this.state.deliveryRows.selectPharm.products.find(selectProducts => selectProducts.medicine_id === product.medicine_id).quantity} из {product.count}</div>
                                                                                                    </div>
                                                                                                    : null
                                                                                            )
                                                                                        } else {
                                                                                            return(
                                                                                                <div className="checkout_main_point_adres-list_line_absent_point" key={product.medicine_id}>
                                                                                                    <div className="checkout_main_point_adres-list_line_absent_point_name">{product.name}</div>
                                                                                                    <div className="checkout_main_point_adres-list_line_absent_point_status">Нет в наличии</div>
                                                                                                </div>
                                                                                            )

                                                                                        }

                                                                                    })
                                                                                }

                                                                            </div>
                                                                            : null
                                                                    }

                                                                </div>
                                                            </div>
                                                    }
                                                </div>

                                            </div>
                                        </>
                                        :
                                        <>
                                            <CaptionNumbCheckout
                                                index={3}
                                                name={this.state.delivery_type_code === "NOVAPOSHTA_BRANCH" ? "Доставка на отделение" : "Адрес доставки"}
                                            />

                                            <AddressBlock
                                                key={this.state.delivery_type_code}
                                                delivery_type_code={this.state.delivery_type_code}
                                                loadDeliveryBloksIPost={this.loadDeliveryBloksIPost}
                                                setNPbranch={this.setNPbranch}
                                                orderId={this.state.orderId}
                                                errorAdress={this.state.errorAdress}
                                                validAdresRows={this.state.validAdresRows}
                                            />


                                            {
                                                this.state.delivery_type_code !== "IPOST" ? null
                                                    :
                                                    !this.state.deliveryIPostBlock ? null
                                                        :
                                                        <div className="checkout_main_point">
                                                            <div className="checkout_main_point_adres-list with-select">
                                                                <div className="checkout_main_point_adres-list_line active">
                                                                    <div className="checkout_main_point_adres-list_line_head no-bord">
                                                                        {
                                                                            !this.state.isBestOffer ? null
                                                                                :
                                                                                <div className="checkout_main_point_adres-list_line_head_marker  h5">
                                                                                    <div
                                                                                        className="checkout_main_point_adres-list_line_head_marker_text">лучшее
                                                                                        предложение
                                                                                    </div>
                                                                                    <div
                                                                                        className="checkout_main_point_adres-list_line_head_marker_logo">%
                                                                                    </div>
                                                                                </div>
                                                                        }
                                                                        <div className="checkout_main_point_adres-list_line_head_name">{this.state.deliveryIPostBlock.title}</div>
                                                                        {/*<div className="checkout_main_point_adres-list_line_head_price">*/}
                                                                        {/*    <span className="delivery_ipost_price">{this.state.deliveryIPostBlock.price} </span> грн*/}
                                                                        {/*</div>*/}
                                                                        <div className="checkout_main_point_adres-list_line_head_price">
                                                                            <span className="delivery_ipost_price">0 </span> грн
                                                                        </div>
                                                                        <div className="checkout_main_point_adres-list_radio"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                            }

                                        </>


                            }

                        <CaptionNumbCheckout
                            index={4}
                            name="Ваши данные"
                        />
                        <div className="checkout_main_point">
                            <div className="checkout_main_point_inpt cnt">

                                <div className={`checkout_main_point_inpt half require ${this.state.validName ? '' : "err"}`}>
                                    <div className="checkout_main_point_inpt_placeholder">Имя и Фамилия</div>
                                    <input
                                        id={'nameInput'}
                                        type="text" name='name'
                                        value={this.state.contactPeopleInfo.name}
                                        onChange={this.handleInput}
                                    />
                                </div>
                                <div className="checkout_main_point_inpt half">
                                    <div className="checkout_main_point_inpt_placeholder">Email</div>
                                    <input type="email" placeholder="name@gmail.com"/>
                                </div>
                            </div>
                            <div className="checkout_main_point_inpt  cnt">
                                <div className="checkout_main_point_inpt require half">
                                    <div className="checkout_main_point_inpt_placeholder">Телефон</div>
                                    <div className={`Checkout_form_point_input require ${this.state.validPhone ? '' : "err"}`}>
                                        <PhoneInput
                                            displayInitialValueAsLocalNumber
                                            international
                                            id={'phoneInp'}
                                            name="phone"
                                            value={this.state.phone}
                                            onChange={this.handleInputPhone}
                                            defaultCountry="UA"
                                            maxLength={18}
                                        />
                                    </div>
                                </div>
                                <div className="radio">
                                    <input name="call" type="checkbox"
                                           checked={this.state.callToCustomer}
                                           onChange={() => this.setState({callToCustomer : !this.state.callToCustomer})}
                                    />
                                    <label className="radio-label">Не звоните мне для подтверждения заказа!
                                    </label>
                                </div>
                            </div>
                            <div className="checkout_textar">
                                {
                                    this.state.showTextarea ?
                                        <div className="checkout_main_textarea">
                                            <div className="checkout_main_point_inpt_placeholder">Добавьте комментарий к заказу</div>
                                            <textarea cols="30" rows="5"
                                                      value={this.state.contactPeopleInfo.comment}
                                                      name={'comment'}
                                                      onChange={this.handleInput}
                                                      maxLength="1000"
                                            />
                                        </div>
                                        :
                                        <div className="checkout_show-text m-w" onClick={() => this.setState({showTextarea: true})}>Комментарий</div>
                                }
                            </div>
                        </div>
                            {
                                this.state.orderId !== 17416 ? null
                                    :
                                    <>
                                        <div className="checkout_main_caption">
                                            <div className="checkout_main_caption_numb"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.1415 4.91094H11.6649C11.6349 2.3625 9.554 0.300781 7.00009 0.300781C4.44619 0.300781 2.36533 2.3625 2.33798 4.91094H0.861421C0.339156 4.95195 0.284468 5.40039 0.311812 5.56172L1.61337 13.2344C1.65986 13.5023 1.89228 13.6992 2.16298 13.6992H11.8372C12.1106 13.6992 12.3431 13.5023 12.3868 13.2344L13.6911 5.56172C13.7185 5.40039 13.6528 4.94922 13.1415 4.91094ZM7.00009 1.41641C8.93877 1.41641 10.5165 2.97773 10.5466 4.9082H3.45361C3.48369 2.97773 5.06142 1.41641 7.00009 1.41641ZM11.3669 12.5836H2.63603L1.52041 6.02656H12.4798L11.3669 12.5836Z" fill="white"/>
                                            </svg></div>
                                            <div className="h2">Итого</div>
                                        </div>
                                        <div className="checkout_main_point total">
                                            <div className="checkout_side_line ord no-pad">
                                                <div className="checkout_side_name f-b">Корзина:</div>
                                                <div className="total_wrap">
                                                    <div>{this.state.ipostVitamin.count}
                                                        {
                                                            this.state.ipostVitamin.count < 2 ?
                                                                " товар"
                                                                : this.state.ipostVitamin.count < 5 ?
                                                                " товара"
                                                                : " товаров"
                                                        } на сумму</div>
                                                    <div className="f-b">{this.state.ipostVitamin.price}.00 <span className="h6">грн</span></div>
                                                </div>
                                            </div>
                                            <div className="checkout_side_line ord no-bord">
                                                <div className="checkout_side_name f-b">Способ доставки:</div>
                                                <div className="total_wrap">
                                                    <div>г. Киев, курьерская доставка iPOST</div>
                                                </div>
                                            </div>
                                            <div className="checkout_side_line sum">
                                                <div className="checkout_sum_point f-b h4">Итого:</div>
                                                <div className="b h4">{this.state.ipostVitamin.price} грн</div>
                                            </div>
                                        </div>
                                    </>
                            }
                            {
                                !this.state.deliveryRows
                                    ? null
                                    :
                                    !this.state.deliveryRows.selectPharm
                                        ? null
                                        :
                                        <>
                                            <div className="checkout_main_caption">
                                                <div className="checkout_main_caption_numb"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.1415 4.91094H11.6649C11.6349 2.3625 9.554 0.300781 7.00009 0.300781C4.44619 0.300781 2.36533 2.3625 2.33798 4.91094H0.861421C0.339156 4.95195 0.284468 5.40039 0.311812 5.56172L1.61337 13.2344C1.65986 13.5023 1.89228 13.6992 2.16298 13.6992H11.8372C12.1106 13.6992 12.3431 13.5023 12.3868 13.2344L13.6911 5.56172C13.7185 5.40039 13.6528 4.94922 13.1415 4.91094ZM7.00009 1.41641C8.93877 1.41641 10.5165 2.97773 10.5466 4.9082H3.45361C3.48369 2.97773 5.06142 1.41641 7.00009 1.41641ZM11.3669 12.5836H2.63603L1.52041 6.02656H12.4798L11.3669 12.5836Z" fill="white"/>
                                                </svg></div>
                                                <div className="h2">Итого</div>
                                            </div>
                                            <div className="checkout_main_point total">
                                                <div className="checkout_main_point_total_head" onClick={
                                                    () => {
                                                        this.setState(prevState => ({
                                                            totalProducts: !prevState.totalProducts
                                                        }))
                                                    }
                                                }>
                                                    <span className="f-b">Корзина:</span>
                                                    <span className={`icon icon-angle-arrow-down ${this.state.totalProducts ? "up" : ""}`}/>
                                                </div>
                                                {
                                                    this.state.totalProducts ?
                                                        <div className="checkout_main_point_total_body fade-in">
                                                            {
                                                                this.state.medicinesList.products.map((product) => {
                                                                    if(this.state.deliveryRows.selectPharm.products.find(selectProducts => selectProducts.medicine_id === product.medicine_id) ) {
                                                                        return(
                                                                            <div className={`checkout_side_line ord ${product.count > this.state.deliveryRows.selectPharm.products.find(selectProducts => selectProducts.medicine_id === product.medicine_id).quantity ? "two_p" : ""}`} key={product.medicine_id}>
                                                                                <div className="checkout_side_name">{product.name}</div>
                                                                                <div className="checkout_main_point_total_col">{product.count} <span>шт</span></div>
                                                                                {
                                                                                    product.count > this.state.deliveryRows.selectPharm.products.find(selectProducts => selectProducts.medicine_id === product.medicine_id).quantity ?
                                                                                        <div className="checkout_main_point_total_status f-b red">{this.state.deliveryRows.selectPharm.products.find(selectProducts => selectProducts.medicine_id === product.medicine_id).quantity} из {product.count}</div>
                                                                                        :
                                                                                        <div className="checkout_main_point_total_status f-b">все товары</div>
                                                                                }
                                                                                <div className="checkout_main_point_total_price f-b">{this.state.deliveryRows.selectPharm.products.find(selectProducts => selectProducts.medicine_id === product.medicine_id).real_price.toFixed(2)} <span className="h6">грн</span></div>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return(
                                                                            <div className="checkout_side_line ord one_p" key={product.medicine_id}>
                                                                                <div className="checkout_side_name">{product.name}</div>
                                                                                <div className="checkout_main_point_total_col">{product.count} <span>шт</span></div>
                                                                                <div className="checkout_main_point_total_status red f-b">
                                                                                    Нет в наличии
                                                                                </div>
                                                                                <div className="checkout_main_point_total_price f-b">0.00 <span className="h6">грн</span></div>
                                                                            </div>
                                                                        )

                                                                    }

                                                                })
                                                            }
                                                        </div>
                                                        : null
                                                }
                                                <div className="checkout_main_point_total_last-line">
                                                    <div className="f-b">Способ доставки:</div>
                                                    <br/>
                                                    <div className="total_wrap">
                                                        <div>г. {!this.state.medicinesList ? null : !this.state.cityOptions ? null : this.state.cityOptions.find(city => city.city_id === this.state.cityId).label},
                                                            {
                                                                this.state.delivery_type_code === "IPOST" ?
                                                                    " курьерская доставка iPOST"
                                                                    :   this.state.delivery_type_code === "NOVAPOSHTA_BRANCH" ?
                                                                    " Нова Пошта - доставка на отделение"
                                                                    : this.state.delivery_type_code === "NOVAPOSHTA_COURIER" ?
                                                                        " Нова Пошта - адресная доставка"
                                                                        : " самовывоз из аптеки"
                                                            }
                                                        </div>
                                                        <div className="f-b">
                                                            {
                                                                this.state.delivery_type_code === "IPOST" ?
                                                                    !this.state.deliveryIPostBlock ? null
                                                                        :
                                                                        // this.state.deliveryIPostBlock.price.toFixed(2) + " грн"
                                                                        "Бесплатно"
                                                                    :   this.state.delivery_type_code === "NOVAPOSHTA_BRANCH" ?
                                                                    "45 - 150 грн"
                                                                    : this.state.delivery_type_code === "NOVAPOSHTA_COURIER" ?
                                                                        "65 - 150 грн"
                                                                        : "Бесплатно"
                                                            }
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="checkout_side_line sum">
                                                    <div className="checkout_sum_point f-b h4">Итого:</div>
                                                    <div className="b h4">
                                                        {
                                                            this.state.delivery_type_code === "IPOST" ?
                                                                !this.state.deliveryIPostBlock ? this.state.deliveryRows.selectPharm.total_price.toFixed(2)
                                                                    :
                                                                    // (+this.state.deliveryRows.selectPharm.total_price + +this.state.deliveryIPostBlock.price).toFixed(2)
                                                                    (+this.state.deliveryRows.selectPharm.total_price).toFixed(2)
                                                                :   this.state.delivery_type_code === "NOVAPOSHTA_BRANCH" ?
                                                                "от " +(+this.state.deliveryRows.selectPharm.total_price + 45).toFixed(2)
                                                                : this.state.delivery_type_code === "NOVAPOSHTA_COURIER" ?
                                                                    "от " + (+this.state.deliveryRows.selectPharm.total_price + 65).toFixed(2)
                                                                    : this.state.deliveryRows.selectPharm.total_price.toFixed(2)
                                                        } грн</div>
                                                </div>
                                            </div>
                                        </>
                            }
                            <div className="radio rules">
                                <input name="offers"
                                       type="checkbox"
                                       checked={this.state.offersRules}
                                       onChange={() => this.setState({offersRules: !this.state.offersRules})}
                                />
                                <label className="radio-label">
                                    Ознакомился и принимаю условия <a target="_blank" rel="noreferrer noopener"
                                                                      href="https://doc.ua/pravila-servisa-pharmacy.html">Правил
                                    сайта</a>, <a target="_blank" rel="noreferrer noopener"
                                                  href="https://doc.ua/dogovir-publichno-oferti.html">Публичной
                                    оферты</a>, <a target="_blank" rel="noreferrer noopener"
                                                   href="https://doc.ua/privacy.html">Политики
                                    конфиденциальности</a></label>
                            </div>
                            {
                                this.state.errorCreate ?
                                    <div className="checkout_side_product-item_alert ipost create"><span className="icon icon-info"/><span>Упс, что-то пошло не так. Выберете другой способ доставки или свяжитесь с нами по номеру <a href="tel:+380443370707">+38 (044) 337-07-07</a></span></div>
                                    : null
                            }
                            {
                                this.state.orderId === 17416 ?
                                    <div className="checkout_main_submit_cnt">
                                        {
                                            this.state.loading
                                                ? <div className='sk-circle-bounce'>
                                                    <div className='sk-child sk-circle-1'/>
                                                    <div className='sk-child sk-circle-2'/>
                                                    <div className='sk-child sk-circle-3'/>
                                                    <div className='sk-child sk-circle-4'/>
                                                    <div className='sk-child sk-circle-5'/>
                                                    <div className='sk-child sk-circle-6'/>
                                                    <div className='sk-child sk-circle-7'/>
                                                    <div className='sk-child sk-circle-8'/>
                                                    <div className='sk-child sk-circle-9'/>
                                                    <div className='sk-child sk-circle-10'/>
                                                    <div className='sk-child sk-circle-11'/>
                                                    <div className='sk-child sk-circle-12'/>
                                                </div>
                                                : <button className={"checkout_main_submit"} onClick={this.handleFormSubmit}
                                                          disabled={!this.state.offersRules}>Оформить заказ</button>
                                        }
                                    </div>
                                    :
                                    !this.state.medicinesList || !this.state.deliveryRows ? null
                                        :
                                        <div className="checkout_main_submit_cnt">
                                            {
                                                this.state.loading
                                                    ? <div className='sk-circle-bounce'>
                                                        <div className='sk-child sk-circle-1'/>
                                                        <div className='sk-child sk-circle-2'/>
                                                        <div className='sk-child sk-circle-3'/>
                                                        <div className='sk-child sk-circle-4'/>
                                                        <div className='sk-child sk-circle-5'/>
                                                        <div className='sk-child sk-circle-6'/>
                                                        <div className='sk-child sk-circle-7'/>
                                                        <div className='sk-child sk-circle-8'/>
                                                        <div className='sk-child sk-circle-9'/>
                                                        <div className='sk-child sk-circle-10'/>
                                                        <div className='sk-child sk-circle-11'/>
                                                        <div className='sk-child sk-circle-12'/>
                                                    </div>
                                                    : <button className={"checkout_main_submit"} onClick={this.handleFormSubmit}
                                                              disabled={!this.state.offersRules
                                                              || this.state.errorAdress
                                                              || this.state.medicinesList.products.length < 1
                                                              || this.state.deliveryRows.actualSummProducts < 1
                                                              // || this.state.delivery_type_code === "IPOST" ? !this.state.deliveryIPostBlock : false
                                                              }>Оформить заказ</button>
                                            }
                                        </div>
                            }

                        </div>
                    </div>
                </section>
            </>
        )
    }
}

export default Checkout