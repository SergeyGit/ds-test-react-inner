import React, {Component}from 'react'
import request from "superagent";

// import {GoogleMap, LoadScript, Marker, InfoWindow, InfoBox, MarkerClusterer} from "@react-google-maps/api";
// import GoogleMapReact from "google-map-react";
// import Marker from "./Marker";

// import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
// import StandaloneSearchBox  from "react-google-maps/lib/components/places/StandaloneSearchBox"
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";


class AddressBlock extends Component{
    state = {
        value: '',
        name: '',
        street_address: '',
        city: '',
        country: '',
        state: '',
        zip_code: '',
        googleMapLink: '',
        build: '',
        room: '',
        entrance: '',
        floor: '',
        numbernp: '',
        intercom: '',
        autocompleteComp: undefined,
        addressObject: undefined,
        address: undefined,
        map: {
           lat: undefined,
            lng: undefined
        },

    }
    constructor(props) {
        super(props);
        this.handlePlaceSelect = this.handlePlaceSelect.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.autocomplete = null
    }
    componentDidMount() {
        // this.testFunction();
        // console.log(window.isMapsApiLoaded)
        if (window.isMapsApiLoaded) {
            console.log("load")
            // this.autocomplete = window.mapsCallback(document.getElementById('autocomplete'));
            this.createAuto()
        }

    }
    createAuto( ) {
        this.setState({
            autocompleteComp: this.props.delivery_type_code === "NOVAPOSHTA_BRANCH" ?
                window.mapsCallback(document.getElementById('cityauto'),
                    {
                        componentRestrictions: {
                            country: 'ua'
                        },
                        types: ['(cities)']
                    }
                )
                :
                window.mapsCallback(document.getElementById('autocomplete'),
                    {
                        componentRestrictions: {
                            country: 'ua'
                        },
                        types: ["geocode"]
                    }
                ),
            typeDev: this.props.delivery_type_code
        }, () => {
            this.autocomplete = this.state.autocompleteComp;
            this.autocomplete.addListener("place_changed", this.handlePlaceSelect)
        })
    }


    handleChange(event) {
        let name = event.target.name;
        this.setState({[event.target.name]: event.target.value}, () => {
            if(name === "build" && this.props.delivery_type_code === "IPOST") {
                if (this.state.build.length > 0 && this.state.street_address.length > 0) {
                    this.GetAddressCoordinate("" + this.state.street_address + ", " + this.state.build + ", " + this.state.city + ", " + this.state.country)
                    // this.props.setNPbranch(this.state.city, this.state.numbernp, this.state.street_address, this.state.build, this.state.room, this.state.entrance, this.state.floor , this.state.intercom)
                }
            }
            this.props.setNPbranch(this.state.city, this.state.numbernp, this.state.street_address, this.state.build, this.state.room, this.state.entrance, this.state.floor, this.state.intercom ,  this.state.map.lat, this.state.map.lng)
            }
        )

    }
    handleSubmit(event) {
        event.preventDefault()
        // this.props.dispatch(addParlor(this.state))
        // this.clearForm()
    }
    handlePlaceSelect() {
        this.setState({
            addressObject: this.autocomplete.getPlace(),
        }, () => this.setState({
            // address: this.state.addressObject.address_components,
            street_address: this.state.addressObject.address_components.find(city => city.types.includes("route")) ? this.state.addressObject.address_components.find(city => city.types.includes("route")).short_name : '',
            build: this.state.addressObject.address_components.find(city => city.types.includes("street_number")) ? this.state.addressObject.address_components.find(city => city.types.includes("street_number")).short_name : '',
            city: this.state.addressObject.address_components.find(city => city.types.includes("locality")) ? this.state.addressObject.address_components.find(city => city.types.includes("locality")).short_name : '',
            country: this.state.addressObject.address_components.find(city => city.types.includes("country")) ? this.state.addressObject.address_components.find(city => city.types.includes("country")).long_name : '',

            // city: this.state.addressObject.address_components
            //     street_address: `${address[0].long_name} ${address[1].long_name}`,
            //     city: address[4].long_name,
            //     state: address[6].short_name,
            //     zip_code: address[8].short_name,
            //     googleMapLink: addressObject.url
            }, () => {
                this.props.setNPbranch(this.state.city, this.state.numbernp, this.state.street_address, this.state.build, this.state.room, this.state.entrance, this.state.floor, this.state.intercom ,  this.state.map.lat, this.state.map.lng)
                if (this.state.build.length > 0 && this.state.street_address.length > 0) {
                    if (this.props.delivery_type_code === "IPOST") {
                        this.GetAddressCoordinate("" + this.state.street_address + ", " + this.state.build + ", " + this.state.city + ", " + this.state.country)
                    }
                }
            })
        )


    }

        // console.log(value)
        // this.setState({
        //     name: addressObject.name,
        //     street_address: `${address[0].long_name} ${address[1].long_name}`,
        //     city: address[4].long_name,
        //     state: address[6].short_name,
        //     zip_code: address[8].short_name,
        //     googleMapLink: addressObject.url
        // })

    GetAddressCoordinate(address) {
        console.log("load " + address);
        request
            .post('https://maps.googleapis.com/maps/api/geocode/json?address='+ address +'&language=ru&key=AIzaSyDh5MkGZQcCxjMq8WIzDo6J9yhaPQFBtAQ')
            // .get('http://localhost:3000/all-doc.json')
            .then(response => {
                this.setState({
                    map:  response.body.results[0].geometry.location
                }, () =>  {
                    if(this.props.orderId !== 17416) {
                        this.props.loadDeliveryBloksIPost({
                            city: this.state.city,
                            flat: this.state.floor,
                            lat: this.state.map.lat,
                            long: this.state.map.lng,
                            number: this.state.build,
                            street: this.state.street_address
                            }, {
                                lat: this.state.map.lat,
                                lng: this.state.map.lng
                        });
                    }
                    this.props.setNPbranch(this.state.city, this.state.numbernp, this.state.street_address, this.state.build, this.state.room, this.state.entrance, this.state.floor, this.state.intercom,  this.state.map.lat, this.state.map.lng)
                    }
                );
            })
            .catch(err => {
                console.log("Error medicines List" + err)
            })
    }
    // setValue(value) {
    //     this.setState({
    //         value: value
    //
    //     })
    // }

    render() {
        return (
            this.props.delivery_type_code === "NOVAPOSHTA_BRANCH" ?
                <div className="checkout_main_point " id="addressblock">
                    <div className="checkout_main_point_inpt cnt map">
                        <div className={`checkout_main_point_inpt require ${this.props.validAdresRows ? "" : this.state.city.length < 2 ? "err" : ""}`} >
                            <div className="checkout_main_point_inpt_placeholder">Город</div>
                            <input
                                id="cityauto"
                                className="input-field"
                                ref="input2"
                                type="text"
                                placeholder={""}
                                autoComplete="off"
                            />
                        </div>
                        <div className={`checkout_main_point_inpt require small ${this.props.validAdresRows ? "" : this.state.numbernp.length < 1 ? "err" : ""}`} >
                            <div className="checkout_main_point_inpt_placeholder">Номер отделения НП</div>
                            <input
                                name={"numbernp"}
                                value={this.state.numbernp}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                </div>


                :
                <div className="checkout_main_point " id="addressblock" key={this.props.delivery_type_code}
                     onClick={() => {
                         if(!this.state.autocompleteComp) {
                             if(window.isMapsApiLoaded) {
                                 this.createAuto()
                             }
                         }
                     }}
                >
                    <div className="checkout_main_point_inpt cnt map">
                        <div className={`checkout_main_point_inpt require ${this.props.validAdresRows ? "" : this.state.street_address.length < 2 ? "err" : ""}`} >
                            <div className="checkout_main_point_inpt_placeholder">Быстрый поиск адресса</div>
                            {/*<input type="text"/>*/}
                            <input id="autocomplete"
                                   className="input-field"
                                   ref="input"
                                   type="text"
                                   placeholder={""}
                                   autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="checkout_main_point_inpt cnt map">
                        <div className={`checkout_main_point_inpt require ${this.props.validAdresRows ? "" : this.state.street_address.length < 2 ? "err" : ""}`} >
                            <div className="checkout_main_point_inpt_placeholder">Улица</div>
                            <input
                                name={"street_address"}
                                value={this.state.street_address}

                                onChange={this.handleChange}
                                onFocus={() => {document.getElementById('autocomplete').focus()}}
                                readOnly={this.state.street_address.length > 0}
                                autoComplete="off"
                            />
                        </div>
                        <div className={`checkout_main_point_inpt require small ${this.props.validAdresRows ? "" : this.state.build.length < 1 ? "err" : ""}`} >
                            <div className="checkout_main_point_inpt_placeholder">Дом</div>
                            <input
                                name={"build"}
                                value={this.state.build}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                    <div className="checkout_main_point_inpt cnt map">
                        <div className="checkout_main_point_inpt   small">
                            <div className="checkout_main_point_inpt_placeholder">Квартира\Офис</div>
                            <input
                                name={"room"}
                                value={this.state.room}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="checkout_main_point_inpt  small">
                            <div className="checkout_main_point_inpt_placeholder">Подьезд</div>
                            <input
                                name={"entrance"}
                                value={this.state.entrance}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="checkout_main_point_inpt  small">
                            <div className="checkout_main_point_inpt_placeholder">Этаж</div>
                            <input
                                name={"floor"}
                                value={this.state.floor}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="checkout_main_point_inpt  small">
                            <div className="checkout_main_point_inpt_placeholder">Код домофона</div>
                            <input
                                name={"intercom"}
                                value={this.state.intercom}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                    {
                        this.props.errorAdress ?
                            <div className="checkout_side_product-item_alert ipost">
                                <span className="icon icon-info"/>
                                <span>Город доставки не совпадает с городом покупки препаратов.</span>
                            </div>
                            : null
                    }

                </div>
        )
    }
}
export default AddressBlock