import React, { Component } from 'react'
import request from 'superagent';
// import {Redirect} from 'react-router-dom'
// import axios from "axios"
import Header from '../../components/Header/Header-form'

// const linkStart = "http://stage1.r2rx.doc.ua";
const linkStart = "";

class Payment extends Component{

    state = {
        PaymentOnce: true,
        OrderPayed : false,
        SubmitFormOnce: false,
        OrderPrice: undefined,
        OrderID: undefined,
        RedirectURL: undefined,
        intervalId: undefined,
        IFrameLoaded: false,
        IntervalIsClose:undefined,
        CheckIframeIsClose: false,
    }



    // componentWillMount(){

        // get token
        // console.log("token:"+this.props.match.params.token);


    // }

    // setCookie(name,value,days) {
    //     var expires = "";
    //     if (days) {
    //         var date = new Date();
    //         date.setTime(date.getTime() + (days*24*60*60*1000));
    //         expires = "; expires=" + date.toUTCString();
    //     }
    //     document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    // }
    // componentDidUpdate(){
    //     if(this.state.OrderID!==undefined && this.state.OrderPrice!==undefined && !this.state.SubmitFormOnce){
    //         document.forms["portmoneSubmit"].submit();
    //         this.setState({
    //             SubmitFormOnce: true
    //         });
    //     }
    // }
    componentDidMount() {
        window.scrollTo(0, 0);
        request
            .post(linkStart+'/go/portmone/getdatabytoken')
            .send({
                "token": this.props.match.params.token
            })
            .then((res)=>{
                // console.log("getdatabytoken:");
                // console.log(res);
                if(res.status===200){
                    let r=JSON.parse(res.text);
                    // console.log()
                    if(r.status===true){
                        // console.log("price: "+r.orderPrice);
                        // console.log("order id"+ r.orderId);

                        this.setState({
                            OrderPrice: r.orderPrice,
                            OrderID:    r.orderId,
                            RedirectURL: r.redirectURL
                        }, function () {
                            if(this.state.OrderID!==undefined && this.state.OrderPrice!==undefined && !this.state.SubmitFormOnce){
                                document.forms["portmoneSubmit"].submit();
                                this.setState({
                                    SubmitFormOnce: true
                                });
                            }
                        });

                        // this.setCookie("portmone_order_id",r.orderId,1);
                        // this.setCookie("portmone_price",r.orderPrice,1);
                        // this.setCookie("portmone_payment_page_token",this.props.match.params.token ,1)
                    }
                }
            })
        // var I = setInterval(()=>{
        //     request
        //         // .post('/go/portmone/check/payment')
        //         .post(linkStart+'/go/portmone/check/payment')
        //         .send('order_id='+this.state.OrderID)
        //         .then(res => {
        //             // console.log("Successful" + res.JSON);
        //             if(res.status===200){
        //                 let r=JSON.parse(res.text);
        //                 if(r.status===true){
        //                     this.getCookie("SAuid");
        //                     request
        //                         .post("https://doc.ua/api/sendemail")
        //                         .set('Content-Type', 'application/json')
        //                         .send({
        //                             "token": "5twQwe12Nid0l",
        //                             "email": "info@doc.ua",
        //                             "category": "audio",
        //                             "subject": "Успешная оплата #",
        //                             "order_id": this.props.location.state.id,
        //                             "doctor_id": this.props.location.state.doctor_id,
        //                             "type": "new",
        //                             "fio": this.props.location.state.namePatient,
        //                             "phone": this.props.location.state.phonePatient,
        //                             "price": this.props.location.state.price,
        //                             "reason": this.props.location.state.problemsPatient.join(', '),
        //                             "duration": this.props.location.state.duration,
        //                             "comment": this.props.location.state.commentPatient,
        //                             "doctor_fio": this.props.location.state.name + " " + this.props.location.state.nameOther,
        //                             "doctor_specialty": this.props.location.state.position.join(', '),
        //                             "desire_time": new Date(),
        //                             "payed": 1
        //                         })
        //                         .then((res) => {
        //                             request
        //                                 .post("https://doc.ua/api/sendemail")
        //                                 .set('Content-Type', 'application/json')
        //                                 .send({
        //                                     "token": "5twQwe12Nid0l",
        //                                     "email": "doc@lic.kiev.ua",
        //                                     "category": "audio",
        //                                     "subject": "Успешная оплата",
        //                                     "order_id": this.props.location.state.id,
        //                                     "doctor_id": this.props.location.state.doctor_id,
        //                                     "type": "new",
        //                                     "fio": this.props.location.state.namePatient,
        //                                     "phone": this.props.location.state.phonePatient,
        //                                     "price": this.props.location.state.price,
        //                                     "reason": this.props.location.state.problemsPatient.join(', '),
        //                                     "duration": this.props.location.state.duration,
        //                                     "comment": this.props.location.state.commentPatient,
        //                                     "doctor_fio": this.props.location.state.name + " " + this.props.location.state.nameOther,
        //                                     "doctor_specialty": this.props.location.state.position.join(', '),
        //                                     "desire_time": new Date(),
        //                                     "payed": 1
        //                                 })
        //                                 .then((res) => {
        //                                     // console.log(res.text);
        //                                     this.setState({
        //                                         OrderPayed: true,
        //                                         PaymentOnce: false
        //                                     });
        //                                     this.setCookie("portmone_payment_page_token",this.props.match.params.token,1);
        //                                 });
        //                             // console.log(res.text);
        //                         });
        //                 }
        //                 // console.log("status:"+r.status);
        //             }
        //         })
        // },3000);
        // this.setState({
        //     intervalId: I
        // });
    }
    // componentWillUnmount(){
    //     clearInterval(this.state.intervalId);
    //     this.setState({
    //         PaymentOnce: true,
    //         OrderPayed : false,
    //         OrderPrice: undefined,
    //         OrderID: undefined,
    //         RedirectURL: undefined,
    //         intervalId: undefined,
    //         IFrameLoaded: false,
    //         IntervalIsClose:undefined,
    //         CheckIframeIsClose: false
    //     })
    // }
    toggleMenuHandler = () => {
        this.setState({
            menu: !this.state.menu
        })
    }
    menuCloseHandler = () => {
        this.setState({
            menu: false
        })
    }
    // componentDidUpdate(){
    //     console.log("updated")
    //     var iframe = document.getElementById('portmone > body');
    //     console.log("componentDidUpdate");
    //     console.log(iframe);
    // }
    


    render() {
        return (
            <React.Fragment>
                <Header
                    onToggle={this.toggleMenuHandler}
                    isOpen={this.state.menu}
                />
                <div className={"Payment"}>

                    {
                        this.state.OrderPrice ?
                            <>
                                <form id="portmoneSubmit" action="https://www.portmone.com.ua/gateway/" method="post"
                                      target="myFrame">
                                    <input type="hidden" name="bodyRequest" value={`{
                                    "paymentTypes":{"card":"Y","portmone":"Y","token":"N","masterpass":"N",
                                                    "visacheckout":"Y","createtokenonly":"N","createtokenonlyp2p":"N"},
                                    "priorityPaymentTypes":{"card":"1","portmone":"2","qr":"0","masterpass":"0",
                                                            "token":"0","visacheckout":"0","createtokenonly":"0",
                                                            "createtokenonlyp2p":"0"},
                                    "payee":{"payeeId":"` + process.env.REACT_APP_PORTMONE_PAYEEID + `","login":"` + process.env.REACT_APP_PORTMONE_LOGIN + `","dt":"","signature":"", "shopSiteId":""},
                                    "order":{"description":"Test Payment","shopOrderNumber":"SHP-` + this.state.OrderID + `",
                                            "billAmount":"` + this.state.OrderPrice + `","attribute1":"1","attribute2":"2","attribute3":"3",
                                            "attribute4":"4","attribute5":"","successUrl":"","failureUrl":"",
                                            "preauthFlag":"N","billCurrency":"UAH", "encoding":""},
                                    "token":{"tokenFlag":"N","returnToken":"N","token":"","cardMask":"",
                                            "otherPaymentMethods":"Y","sellerToken":""},
                                    "payer":{"lang":"uk", "emailAddress":"test@ukr.net"},
                                    "style":{"type":"light","logo":"","backgroundColorHeader":"",
                                            "backgroundColorButtons":"","colorTextAndIcons":"",
                                            "borderColorList":"","bcMain":""}
                                }`}/>
                                    <input type="hidden" name="typeRequest" value='json'/>
                                    <input type="hidden" value="Portmone.com"/>
                                </form>
                                <div className={'Payment'}>
                                    <iframe id="portmone" title="payment" name="myFrame" width="100%" height="1000px"
                                            frameBorder="0"/>
                                </div>
                            </>
                            : null
                    }
                    {/*{*/}
                    {/*    this.state.OrderPayed ? <Redirect*/}
                    {/*        to={{*/}
                    {/*            pathname: "/audio/timer",*/}
                    {/*            state: {*/}
                    {/*                namePatient: this.props.location.state.namePatient,*/}
                    {/*                phonePatient: this.props.location.state.phonePatient,*/}
                    {/*                commentPatient: this.props.location.state.commentPatient,*/}
                    {/*                problemsPatient: this.props.location.state.problemsPatient,*/}
                    {/*                orderID: this.state.OrderID,*/}
                    {/*                id: this.props.location.state.id,*/}
                    {/*                img: this.props.location.state.img,*/}
                    {/*                name: this.props.location.state.name,*/}
                    {/*                nameOther: this.props.location.state.nameOther,*/}
                    {/*                position: this.props.location.state.position,*/}
                    {/*                price: this.props.location.state.price,*/}
                    {/*                duration: this.props.location.state.duration,*/}
                    {/*                date: +Date.parse(new Date()) + 1800000,*/}
                    {/*                linkSell: this.state.linkSell,*/}
                    {/*                doctor_id: this.props.location.state.doctor_id*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    /> : null*/}
                    {/*}*/}
                    {/*<Link*/}
                    {/*    to={{*/}
                    {/*        pathname: "/audio/timer",*/}
                    {/*        state: {*/}
                    {/*            id: this.props.location.state.id,*/}
                    {/*            img: this.props.location.state.img,*/}
                    {/*            name: this.props.location.state.name,*/}
                    {/*            nameOther: this.props.location.state.nameOther,*/}
                    {/*            position: this.props.location.state.position,*/}
                    {/*            price: this.props.location.state.price,*/}
                    {/*            duration: this.props.location.state.duration,*/}
                    {/*            date: +Date.parse(new Date()) + 1800000*/}
                    {/*        }*/}
                    {/*    }}>{+Date.parse(new Date())}</Link>*/}
                </div>
            </React.Fragment>
        )
    }
}
export default Payment