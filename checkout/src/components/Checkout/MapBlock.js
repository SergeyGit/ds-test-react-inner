import React from 'react'

// import {GoogleMap, LoadScript, Marker, InfoWindow, InfoBox, MarkerClusterer} from "@react-google-maps/api";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";



const MapBlock = (props) => {
    return (
        <div className="checkout_main_point_map ">
            <GoogleMapReact
                bootstrapURLKeys={{key: "AIzaSyDh5MkGZQcCxjMq8WIzDo6J9yhaPQFBtAQ"}}
                // mapContainerStyle={containerStyle}
                defaultCenter={{
                    lat: +props.pharmacy_list[0].branch_location_lat,
                    lng: +props.pharmacy_list[0].branch_location_lng
                }}
                center={props.centerMap}
                defaultZoom={13}
            >
                {
                    props.pharmacy_list.filter(instock => !props.inStock ? true : instock.sort_index === 3)
                        .filter(apteka => !props.handleIdSelect ? true
                            : props.handleIdSelect.length < 1 ? true : props.handleIdSelect.includes(apteka.apteka_id))
                        .map((pharm) => {
                        return (
                            <Marker
                                tittle={'text'}
                                cardId={props.cardId}
                                key={pharm.branch_id}
                                sumProducts={props.sumProducts}
                                // position={{
                                //     lat: +pharm.branch_location_lat,
                                //     lng: +pharm.branch_location_lng
                                // }}
                                lat={+pharm.branch_location_lat}
                                lng={+pharm.branch_location_lng}
                                text={'Marker'}
                                pharm={pharm}
                                selectPharm={props.selectPharm}
                                selectPharmId={props.selectPharmId}
                                actualSummProducts={props.actualSummProducts}
                                handleClick={props.onsetPharm}

                                // className="checkout_main_point_map_infobox"
                            />

                        )
                    })
                }
                {
                    !props.centerMap ? null
                        :
                        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg"
                             lat={+props.centerMap.lat}
                             lng={+props.centerMap.lng}
                             className="checkout_main_point_map_my-lock"
                        >
                            <path
                                d="M11.7458 32C13.8169 32 15.4958 31.4403 15.4958 30.75C15.4958 30.0596 13.8169 29.5 11.7458 29.5C9.67477 29.5 7.99585 30.0596 7.99585 30.75C7.99585 31.4403 9.67477 32 11.7458 32Z"
                                fill="#00829A" fillOpacity="0.2"/>
                            <path
                                d="M10.4951 29.9895L10.4952 29.9896C11.1859 30.6808 12.3056 30.6809 12.9963 29.9895C14.0475 28.9373 16.4012 26.4396 18.4983 23.2016C20.5828 19.9829 22.4914 15.9149 22.4914 11.7457C22.4914 5.81103 17.6804 1 11.7457 1C5.81103 1 1 5.81103 1 11.7457C1 15.9149 2.90863 19.9829 4.99314 23.2016C7.09022 26.4396 9.44394 28.9373 10.4951 29.9895Z"
                                fill="#0957C3" stroke="white" strokeWidth="2"/>
                            <path
                                d="M3.81086 11.7457C3.81086 6.66868 7.69333 2.49907 12.6512 2.04225C12.353 2.01479 12.0511 2 11.7457 2C6.36332 2 2 6.36331 2 11.7457C2 19.5145 9.15246 27.2306 11.2026 29.2827C11.5027 29.5832 11.9888 29.5832 12.2889 29.2827C12.396 29.1755 12.5179 29.0519 12.6512 28.9145C10.2344 26.4229 3.81086 19.1084 3.81086 11.7457Z"
                                fill="#063678"/>
                            <circle cx="12" cy="11" r="2" fill="white"/>
                        </svg>
                }
            </GoogleMapReact>

        </div>
    )
}
export default MapBlock