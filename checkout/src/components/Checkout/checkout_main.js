
class CheckoutFields {
    constructor() {
        this.cartID = parseInt($.cookie('cart_id') ? $.cookie('cart_id') : 0);
        this.cityID = parseInt($.cookie('city_id') ? $.cookie('city_id') : 1);
        this.lang = $.cookie('lang') ? $.cookie('lang') : "ru";
        this.i18n = new i18n("/localization/checkout.json", this.lang);

        this.pharmacies = [];
        // this.pharmacies = [];
        this.novaPoshtaCart = [];
        this.goods = [];
        this.partnerIDs = [];
        this.goodsStatic = [];
        this.cartCounter = 0;
        this.availableCartInAffiliate = []
        this.codeLiki24 = 'LIKI24';
        this.codeIPost = 'IPOST';
        this.codeNovaPoshtaBranch = 'NOVAPOSHTA_BRANCH';
        this.codeNovaPoshtaCourier = 'NOVAPOSHTA_COURIER';
        this.codeUkrposhtaBranch = 'UKRPOSHTA_BRANCH';
        this.codeUkrposhtaCourier = 'UKRPOSHTA_COURIER';

        this.deliveryCodeDtcPickup = 'DTC_PICKUP';
        this.userID = currentUserID == null || currentUserID == "" ? 0 : currentUserID;

        this.country = "Украина";
        this.latAddress = 0;
        this.lngAddress = 0;

        this.liki24Counter = {};
        this.liki24Products = {};
        this.pickupCounter = {};
        this.icons = {
            pharmacy: {
                acitveIcon: "/i/apteka/map/yellow.svg",
                deactiveIcon: "/i/apteka/map/green.svg"
            }
        };
        this.lastOpenedMarker = {
            lastWindow: null,
            lastMarker: null,
        };

        this.iPostFromHour = 0;
        this.iPostFromMin = 0;
        this.iPostToMin = 0;
        this.iPostToHour = 0;
        this.iPostDate = new Date();
    }

    InitEventsIPost() {
        $(document).on("change", '#from-hour', () => {
            this.iPostFromHour = parseInt($('#from-hour').val());
        });

        $(document).on("change", '#from-minutes', () => {
            this.iPostFromMin = parseInt($('#from-minutes').val());
        });

        $(document).on("change", '#to-minutes', () => {
            this.iPostToMin = parseInt($('#to-minutes').val());
        });

        $(document).on("change", '#to-hour', () => {
            this.iPostToHour = parseInt($('#to-hour').val());
        });

        $(document).on("change", "#datepicker", () => {
            this.iPostDate = $("#datepicker").datepicker( 'getDate' );
        });
    }

    checkRequireFields() {

        if (!$('#name_user').parent().hasClass('require') && !$('#phone').parent().hasClass('require')) {
            analytics("checkout", {
                step: 1,
                type:  $('#name_user').val().trim() + " " + $('#phone').val(),
            });
        }
        if ($('#delivery_fields').find('.delivery_list.active').data('code') == this.deliveryCodeDtcPickup){
            if (!$('#name_user').parent().hasClass('require') && !$('#phone').parent().hasClass('require')) {
                $('#checkout_order').removeClass('disabled');
                return
            }
        }

        if ($('#name_user').parent().hasClass('require') || $('#phone').parent().hasClass('require')){
            $('#checkout_order').addClass('disabled');
            return
        }

        if ($('#delivery_fields').find('.delivery_list.active').length <= 0) {
            $('#checkout_order').addClass('disabled');
            return
        }

        if ($('#delivery_fields').find('.delivery_list.active').data('code') == this.codeNovaPoshtaBranch){
            if (!$('#branch_number').hasClass("require") && !$('#novaposhta_city').hasClass("require")) {
                $('#checkout_order').removeClass('disabled');
                return
            }

            if ($('#novaposhta_city').hasClass('require') || $('#branch_number').hasClass("require")) {
                $('#checkout_order').addClass('disabled');
                return
            }
        }

        if ($('#delivery_fields').find('.delivery_list.active').data('code') == this.codeNovaPoshtaCourier){
            if (!$('.checkout_main_delivery_address').find('.checkout_main_point_inpt').hasClass("require")) {
                $('#checkout_order').removeClass('disabled');
                return
            }

            if ($('.checkout_main_delivery_address').find('.checkout_main_point_inpt').hasClass("require")) {
                $('#checkout_order').addClass('disabled');
                return
            }
        }

        if ($('#delivery_fields').find('.delivery_list.active').data('code') == this.codeIPost){
            if ($('#ipost_delivery-block').find('.checkout_main_point_adres-list_line.active').length <= 0) {
                $('#checkout_order').addClass('disabled');
                return
            }
        }

        if ($('#pharmacies_list').find('.pharmacy_line.active').length <= 0) {
            $('#checkout_order').addClass('disabled');
            return
        }


        if (!$('#name_user').parent().hasClass('require') && !$('#phone').parent().hasClass('require') && $('#is_accepted').attr('checked')) {

            if ( $('.delivery_list.active').data('code') == fields.codeLiki24) {
                if (!$('.checkout_main_delivery_address').find('.checkout_main_point_inpt').hasClass('require')) {
                    $('#checkout_order').removeClass('disabled');
                } else {
                    $('#checkout_order').addClass('disabled');
                }
            } else {
                $('#checkout_order').removeClass('disabled');
            }

        } else {
            $('#checkout_order').addClass('disabled');
        }
    }

}


let fields = new CheckoutFields;




export class Order {
    constructor() { }

    CreateOrderObjIPost() {
        let fio = $('#name_user').val().trim().split(' ');
        let deliveryTimeTo = new Date(fields.iPostDate.getFullYear(), fields.iPostDate.getMonth(), fields.iPostDate.getDate(), fields.iPostToHour, fields.iPostToMin);
        let deliveryTimeFrom = new Date(fields.iPostDate.getFullYear(), fields.iPostDate.getMonth(), fields.iPostDate.getDate(), fields.iPostFromHour, fields.iPostFromMin);

        let deliveryTime = {
            "time_from": deliveryTimeFrom,
            "time_to": deliveryTimeTo
        };

        let phone = $('#phone').val();
        phone = phone.substring(0, 2) + phone.substring(4, 7) + phone.substring(9, 12) + phone.substring(phone.length - 4);

        let email = $('#email').val();
        let comment = $('#comment').val();
        let deliveryType = $('.delivery_list.active').data('code');

        let goodsList = [];
        let branchID = $('#pharmacies_list .checkout_main_point_adres-list_line.active').data('pharmacy');
        let pharmacyName = $('#pharmacies_list .checkout_main_point_adres-list_line.active').data('name');
        let pharmacyAddress = $('#pharmacies_list .checkout_main_point_adres-list_line.active').data('address');

        fields.goods.forEach(function(product) {
            let objProduct =  {
                'id': product.medicine_partner_id,
                'quantity': product.count > product.quantity ? product.quantity : product.count,
                'pharmacy_id': branchID,
                'price': product.price
            };

            goodsList.push(objProduct);
        });

        let isCall = $('#is_call').attr('checked') ? 0 : 1;
        let order = {
            'status_id':1,
            'integration_status':'new',
            'first_name': fio[0] ? fio[0] : '',
            'middle_name': fio[2] ? fio[2] : '',
            'last_name':  fio[1] ? fio[1] : '',
            'phone': phone,
            'email': email,
            'integration_id': parseInt($('.pharmacy_line.active').data('integration-id')),
            'pharmacy_affiliate_name': pharmacyName,
            'pharmacy_affiliate_address': pharmacyAddress,
            'branch_id': branchID,
            'cart_id': fields.cartID,
            'city_id': fields.cityID,
            'user_id':  parseInt(fields.userID ? fields.userID : 0),
            'comment': comment,
            'delivery_type_code': deliveryType,
            'paid': 0,
            'is_call': isCall,
            'total_price': parseFloat($('#total_price').text())
        };

        let address = {
            'lat': fields.latAddress,
            'long': fields.lngAddress,
            'city': $('#select2-city_select-container').text(),
            'street': $('#street').find("input").val(),
            'number': $('#home').find("input").val(),
            'flat': $('#flat').find("input").val()
        };

        return {
            "order": order,
            "items": goodsList,
            "address": address,
            "delivery_time": deliveryTime
        }
    }
}


export class Delivery {
    constructor(cartID, cityID) {
        this.cartID = cartID;
        this.cityID = cityID;
        this.pharmacy = new Pharmacy(this.cartID, this.cityID);
        this.novaposhta = new Novaposhta(this.cartID, this.cityID);
        this.map = new Map();
        this.iPost = new IPost();
    }

    GetDeliveryProductLine(pharmacyRequestJSON) {
        let mapCtx = this.map
        let ctx = this;
        $.ajax({
            url: '/go/apteka/checkout/pharmacy/'  + fields.cityID,
            method: 'POST',
            headers: {
                "Lang": lang,
            },
            data: JSON.stringify(pharmacyRequestJSON),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data) {
                let sum = 0;
                let totalPrice = 0.0;
                let deliveryProductRow = '';
                if (data.pharmacy_list.pharmacies === null) {
                    return;
                }
                let products = data.pharmacy_list.products[data.pharmacy_list.pharmacies[0].branch_id];
                products.forEach(function(product) {
                    let qnt = parseInt(product.in_stock, 10) >  parseInt(product.in_cart, 10) ? parseInt(product.in_cart, 10) : parseInt(product.in_stock, 10);
                    sum += qnt;
                    totalPrice += parseFloat(product.price).toFixed(2) * qnt;
                });

                if (sum >= fields.cartCounter && sum != 0) {
                    deliveryProductRow +=  `<div class='checkout_main_point_adres-list_line_body_point pharmacy_price green'>
                        <span class='icon icon-basket-2'></span>
                        <span>${fields.i18n.trans('All goods')}</span>
                        <span class='price total_price'>` + parseFloat(totalPrice).toFixed(2) +` грн</span>
                    </div>`;
                } else {
                    deliveryProductRow +=`<div class='checkout_main_point_adres-list_line_body_point pharmacy_price red'>
                        <span class='icon icon-basket-2'></span>
                        <span>${sum} / ${fields.cartCounter} ${fields.i18n.trans('goods in pharmacy')}</span>
                        <span class='price total_price'>` + parseFloat(totalPrice).toFixed(2) +` грн</span> 
                    </div>`;
                }

                $('#delivery_fields').find(`.delivery_list[data-code="${fields.codeIPost}"]`).find('.pharmacy_price').remove();
                $('#delivery_fields').find(`.delivery_list[data-code="${fields.deliveryCodeDtcPickup}"]`).find('.pharmacy_price').remove();

                $(`.delivery_list[data-code="${fields.deliveryCodeDtcPickup}"]`).find('.checkout_main_point_delivery_time').after(deliveryProductRow);
                $(`.delivery_list[data-code="${fields.codeIPost}"]`).find('.checkout_main_point_delivery_time').after(deliveryProductRow);

                ctx.getPharmacyLinesFromAddress()
                // data.pharmacy_list.pharmacies.forEach(function(pharmacy, idx) {
                //     let pharmacyRow = pharmacyClass.SetPharmacyList(pharmacy, data, idx);

                //     $('#pharmacies_list').append(pharmacyRow);
                //     // this.map.InitMap(data.pharmacy_list.pharmacies)
                // });
            }
        });
    }


    getPharmacyLinesFromAddress() {
        let street = $('#street input').val();
        let home = $('#home input').val();
        let flat = $('#flat input').val();
        let address = street + ' ' + home +  ', ' + $('#select2-city_select-container').text() + ', ' + fields.country;

        this.map.GetAddressCoordinate(address).then((data) => {
            let pharmacyRequestJSON = {
                'partner_ids': fields.partnerIDs,
                'cart_id': fields.cartID,
                'coordinate': {
                    'lat': data.lat,
                    'lng': data.lng
                }
            };
            fields.latAddress = data.lat;
            fields.lngAddress = data.lng;
            this.iPost.GetPharmacyLinesIPost(pharmacyRequestJSON).then((data) => {
                $('#pharmacies_list').empty();
                this.pharmacy.SetPharmacyProduct(data);
            }).catch(function (err) {
                console.log(err);
            });
        }).catch(function(err) {
            $("#errorModal").find(".error-msg").text(fields.i18n.trans("Failed to get pharmacies, please contact support"));
            $("#errorModal").modal();
        });
    }


    DeliveryClick() {
        let pharmacyCtx = this.pharmacy;
        let mapCtx = this.map;
        let novaposhtaCtx = this.novaposhta;
        $('#delivery_fields').on('click', '.delivery_list', function() {
            let deliveryType = $(this).data('code');
            $("#pharmacy_block").hide();

            analytics("checkout", {
                step: 2,
                type: $(this).data('code'),
            });
            if (deliveryType == fields.codeIPost) {
                $('.checkout_main_delivery_address').show();

                $('.novaposhta_branch').hide();
                $('.checkout_main_point_pharmacies_lines').hide();
                $('.checkout_main_point_delivery_list').hide();
                $('.checkout_list-of-pharmacy').hide();

                $('#pharmacies_list').find('.pharmacy_line').removeClass('active');
                $('.pharmacy_numb').text('4');
                $('.delivery_order_numb').text('6');

                fields.checkRequireFields();

                return
            } else if (deliveryType == fields.codeNovaPoshtaBranch) {
                $('.novaposhta_branch').show();
                // $('.checkout_main_point_delivery_time').hide();

                $('.checkout_main_delivery_address').hide();
                $('.checkout_main_point_delivery_list').hide();
                $('.checkout_list-of-pharmacy').hide();
                $('#pharmacies_list').find('.pharmacy_line').removeClass('active');
                $('.checkout_main_point_pharmacies_lines').hide();
                $('.delivery_order_numb').text('4');

                pharmacyCtx.GetPharmacyProductNovaPoshta()
                // novaposhtaCtx.UpdateCart()
                fields.checkRequireFields();
                return;
            } else if (deliveryType == fields.codeNovaPoshtaCourier) {
                $('.checkout_main_delivery_address').show();

                $('.novaposhta_branch').hide();
                $('.checkout_main_point_pharmacies_lines').hide();
                $('.checkout_main_point_delivery_list').hide();
                $('.checkout_list-of-pharmacy').hide();
                // $('.checkout_main_point_delivery_time').hide();

                $('#pharmacies_list').find('.pharmacy_line').removeClass('active');
                $('.checkout_main_point_pharmacies_lines').hide();
                $('.delivery_order_numb').text('4');

                pharmacyCtx.GetPharmacyProductNovaPoshta()

                // novaposhtaCtx.UpdateCart()

                fields.checkRequireFields();
                return;
            }
            $('.pharmacy_numb').text('3');

            if ($('.checkout_main_point_adres-list_line.delivery_list').hasClass('active')) {
                $('.checkout_main_point_adres-list_line.delivery_list').removeClass('active');
            }

            if ($('#pharmacies_list').find('.pharmacy_line').hasClass('active')) {
                $('#pharmacies_list').find('.pharmacy_line').removeClass('active');
            }
            $('.novaposhta_branch').hide();

            fields.checkRequireFields();


            // if (deliveryType === fields.codeLiki24) {

            //     if ($('.checkout_main_point_adres-list_line.delivery_list').hasClass('active')) {
            //         $('.checkout_main_point_adres-list_line.delivery_list').removeClass('active');
            //     }
            //     $(this).addClass('active');

            //     refereshCartForLiki24();
            //     return;
            // }

            // $(".checkout_main_point_delivery_time").hide();
            $(this).addClass('active');


            let pharmacyRequestJSON = {
                'partner_ids': fields.partnerIDs,
                'cart_id': fields.cartID,
                'delivery_code': deliveryType
            };


            $('#pharmacies_block').off('click').on('click', '.pharmacy_line', function() {
                if($('.checkout_main_point_adres-list_line.pharmacy_line').hasClass('active')){
                    $('.checkout_main_point_adres-list_line.pharmacy_line').removeClass('active');
                    $('#check_pharmacy_block').remove();
                }


                $("#pharmacy_block").show();
                $("#pharmacy_block").find(".pharmacy_block_name").text($(this).data("name"));
                $("#pharmacy_block").find(".pharmacy-block_address_text").text($(this).find(".pharmacy-adderss_text").text());
                $("#pharmacy_block").find(".checkout_main_point_adres-list_line_head_logo").html("")
                $("#pharmacy_block").find(".checkout_main_point_adres-list_line_head_logo").append($(this).find(".checkout_main_point_adres-list_line_head_logo").html());

                $("#pharmacy_block").show();
                $("#pharmacy_block").find(".pharmacy_block_name").text($(this).data("name"));
                $("#pharmacy_block").find(".pharmacy-block_address_text").text($(this).find(".pharmacy-adderss_text").text());
                $("#pharmacy_block").find(".checkout_main_point_adres-list_line_head_logo").html("")
                $("#pharmacy_block").find(".checkout_main_point_adres-list_line_head_logo").append($(this).find(".checkout_main_point_adres-list_line_head_logo").html());

                $(this).addClass('active');
                // $('.delivery_list.active[data-code="DTC_PICKUP"]').find('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'));
                // $('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'));
                let ctx = this;
                $('.delivery_list').each(function(index) {
                    if ($(this).data("code") == fields.deliveryCodeDtcPickup) {
                        // $(this).find('.checkout_main_point_adres-delivery_time').text(1111);
                        // $('.delivery_list.active[data-code="DTC_PICKUP"]').find('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'))
                        // $('.checkout_main_point_adres-delivery_time').text($('#pharmacies_list .pharmacy_line').first().data('schedule'));

                        $(this).find('.checkout_main_point_adres-delivery_time').text($(".pharmacy_line.active").data('schedule'));
                        $(this).first().find('.pharmacy_price').remove();
                        // $('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'));
                        $(this).find('.checkout_main_point_delivery_time').after($(ctx).find('.pharmacy_price').wrap('<p/>').parent().html());
                    }
                });

                fields.checkRequireFields();

                $('.checkout_item_line').remove();
                pharmacyCtx.GetPharmacyProduct($(this).data('pharmacy'));
            });

            // $('.checkout_main_point_delivery_time').hide();
            $('.checkout_main_delivery_address').hide();
            $('.checkout_main_point_delivery_list').hide();
            let activeDelivery =  $('.delivery_list.active').data("code");
            $.ajax({
                url: '/go/apteka/checkout/pharmacy/' + fields.cityID,
                method: 'POST',
                headers: {
                    "Lang": lang,
                },
                data: JSON.stringify(pharmacyRequestJSON),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: (data) => {

                    if (activeDelivery != $('.delivery_list.active').data("code")) {
                        return;
                    }
                    if (data.pharmacy_list.pharmacies == null || data.pharmacy_list.pharmacies.length == 0) {
                        // $('#pharmacies_block').hide();
                        $('.checkout_main_point_pharmacies_lines').hide();
                        $('.checkout_list-of-pharmacy').hide();


                        return;
                    } else {
                        $('.checkout_main_point_pharmacies_lines').show();
                        $('.checkout_list-of-pharmacy').show();

                        $('.delivery_pay_numb').text('3');
                        $('.delivery_order_numb').text('4');
                        // $('#pharmacies_block').show();
                    }
                    $('#pharmacies_list').empty();
                    let pharmacyRow;

                    data.pharmacy_list.pharmacies.forEach((pharmacy, idx) => {

                        pharmacyRow = pharmacyCtx.SetPharmacyList(pharmacy, data, idx);
                        $('#pharmacies_list').append(pharmacyRow);
                    });
                    mapCtx.InitMap(data.pharmacy_list.pharmacies)
                },
                error: function (data) {

                }
            });

            if (deliveryType === fields.deliveryCodeDtcPickup || deliveryType === fields.codeLiki24) {
                $('.pharmacy_address').show();

                $("#delivery_price").text("0.00");
                let price = parseFloat($(".checkout_price_without_discount").text().replace(/[^0-9\.]/g, '')).toFixed(2);
                $("#total_price").text(parseFloat(price).toFixed(2))

                $('.home_address').hide();
                $('#ipost_delivery-block').closest('.checkout_main_point_delivery_time').hide();
                $('#street input').val("");
                $('#home input').val("");
                $('#flat input').val("");
            }  else {
                $('.pharmacy_address').hide();
                $('.home_address').show();
            }
        });
    }

    RefreshTotalPriceBeforeRemove() {
        let deliveryPrice = $("#delivery_price").text();
        deliveryPrice = parseFloat(deliveryPrice.replace(/[^0-9\.]/g, '')).toFixed(2);
        let price = parseFloat($(".checkout_price_without_discount").text().replace(/[^0-9\.]/g, '')).toFixed(2);
        let sum = parseFloat(deliveryPrice) + parseFloat(price);
        $("#total_price").text(sum.toFixed(2))
    }

    RefreshTotalPrice() {
        let deliveryPrice = $("#ipost_delivery-block .checkout_main_point_adres-list_line.active .delivery_ipost_price").text();
        deliveryPrice = parseFloat(deliveryPrice.replace(/[^0-9\.]/g, '')).toFixed(2);
        let price = parseFloat($(".checkout_price_without_discount").text().replace(/[^0-9\.]/g, '')).toFixed(2);
        $("#delivery_price").text(deliveryPrice);

        let sum = parseFloat(deliveryPrice) + parseFloat(price);
        $("#total_price").text(sum.toFixed(2))
    }
}

export class Cart {
    constructor(cartID, cityID) {
        this.cartID = cartID;
        this.cityID = cityID;
        this.delivery = new Delivery(this.cartID, this.cityID)
        this.pharmacy = new Pharmacy(this.cartID, this.cityID)
    }

    RefreshCart() {
        fields.goods = {}
        $.ajax({
            url: '/go/apteka/cart/get/' + fields.cartID + '/' + fields.cityID,
            headers: {
                "Lang": lang,
            },
            method: 'GET',
            success: function (data) {

                if (!('product_item' in data)) {
                    $('.checkout_item_line').remove();
                    $('#order_title').after(`<div class='checkout_side_line ord checkout_item_line'> В корзине нет товаров </div>`);
                    $('.checkout_price_without_discount').text("0.00");
                    $('#total_price').text("0.00");
                    $('.checkout_main_point_pharmacies_lines').remove();
                    $('.checkout_list-of-pharmacy').remove();

                    return;
                }

                fields.goods = data.product_item;

                fields.goodsStatic = data.product_item;
                fields.partnerIDs = data.partner_ids;
                // liki24Counter = data.liki_24_counter;
                // pickupCounter = data.pickup_counter;
                fields.cartCounter = data.cart_counter;

                $('.checkout_item_line').remove();
                data['product_item'].forEach(function (product) {
                    if (product.min_price > 0 && product.count > 0) {
                        $('#order_title').after(`
                        <div class='checkout_side_line ord checkout_item_line' data-medicine-id="` + product.medicine_id + `" data-count="` + product.count + `" data-price="` + product.price + `">
                            <div class='checkout_side_name'>` + product.name + `</div>
                            <div class='checkout_side_col'>` + product.count + ` шт </div>
                            <div class='checkout_side_price'>` + parseFloat(product.min_price * product.count).toFixed(2) + ` грн</div>
                            <div class="checkout_side_remove"> <span class="icon-close"></span> </div>
                        </div>`);
                        $('.checkout_price_without_discount').text(parseFloat(data.min_total_price).toFixed(2));
                        $('#total_price').text(parseFloat(data.min_total_price).toFixed(2));
                    }
                });
            },
            error: function () {
                $('#order_title').after(`<div class='checkout_side_line ord checkout_item_line'> В корзине нет товаров </div>`);
            },
            complete: () => {
                let pharmacyRequestJSON = {
                    'partner_ids': fields.partnerIDs,
                    'cart_id': fields.cartID
                };

                if($(`.checkout_main_point_adres-list_line.delivery_list[data-code="${fields.deliveryCodeDtcPickup}"]`).hasClass('active')) {
                    this.pharmacy.GetPharmacyLines(pharmacyRequestJSON);
                } else {
                    this.delivery.GetDeliveryProductLine(pharmacyRequestJSON, fields.cartCounter);
                }
            }
        });
    }

    InitProducts() {
        fields.cityID = parseInt($.cookie('city_id') ? $.cookie('city_id') : 1);
        $.ajax({
            url: '/go/apteka/cart/get/' + fields.cartID + '/' + fields.cityID,
            method: 'GET',
            headers: {
                "Lang": lang,
            },
            success: (data) => {

                if (!('product_item' in data)) {
                    return;
                }

                fields.goods = data.product_item;
                fields.goodsStatic = data.product_item;
                fields.partnerIDs = data.partner_ids;
                fields.liki24Counter = data.liki_24_counter;
                fields.pickupCounter = data.pickup_counter;
                fields.cartCounter = data.cart_counter;

                let pharmacyRequestJSON = {
                    'partner_ids': fields.partnerIDs,
                    'cart_id': fields.cartID
                };

                this.delivery.GetDeliveryProductLine(pharmacyRequestJSON);

                $('#city_select').change(() => {
                    fields.cityID = $('#city_select :selected').data('id');
                    $.cookie("city_id", fields.cityID, {
                        expires : 1000,
                        path    : '/',
                    });
                    $('#pharmacies_list').empty();
                    this.RefreshCart();

                    $('.checkout_main_point_adres-delivery_time').val($('#pharmacies_list').first().data('schedule'));
                });
            },
            error: function (data) {
            }
        });
    }

    generate(product) {
        return `<div class='checkout_side_line ord checkout_item_line' data-medicine-id="${product.medicine_id}" data-count="${product.count}" data-price="` + product.price + `">
            <div class='checkout_side_name'>${product.name}</div>
            <div class='checkout_side_col'>${product.coun} шт </div>
            <div class='checkout_side_price'>${parseFloat(product.min_price * product.count).toFixed(2)} грн</div>
            <div class="checkout_side_remove"> <span class="icon-close"></span> </div>
        </div>`;
    }
}

export class IPost {
    constructor() {
        this.map = new Map();
    }

    GetPharmacyLinesIPost(pharmacyRequestJSON) {
        pharmacyRequestJSON.partner_ids = fields.partnerIDs;
        let activeDelivery =  $('.delivery_list.active').data("code");
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/go/apteka/checkout/ipost/pharmacy/'  + fields.cityID,
                method: 'POST',
                headers: {
                    "Lang": lang,
                },
                data: JSON.stringify(pharmacyRequestJSON),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: (data) => {
                    if (activeDelivery != $('.delivery_list.active').data("code")) {
                        return;
                    }
                    this.map.InitMap(data.pharmacy_list.pharmacies);
                    resolve(data);
                    // return data.results[0].geometry.location
                },
                error: function (data) {
                    reject(data);
                }
            });
        });
    }
}

export class Map {
    constructor() {
        this.pharmacy = new Pharmacy(fields.cartID, fields.cityID)
    }


    GetAddressCoordinate(address) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ address +'&language=ru&key=AIzaSyDh5MkGZQcCxjMq8WIzDo6J9yhaPQFBtAQ',
                method: 'POST',
                // async: false,
                success: function(data) {
                    resolve(data.results[0].geometry.location);
                    // return data.results[0].geometry.location
                },
                error: function (data) {
                    reject(data);
                }
            });
        });
    }

    InitMap(pharmacies) {
        let marker;
        let uluru = {lat:  50.4501, lng: 30.523400000000038};
        var locationCentre;
        this.FindLatLang($('#select2-city_select-container').text()).then((locationCentre) => {
            this.SetMap(locationCentre, pharmacies)
            // locationCentre = geo
        }).catch((locationCentre) => {
            this.SetMap(locationCentre, pharmacies)
        });
    }

    SetMap(location, pharmacies) {
        var map = new google.maps.Map(document.getElementById('my_map'), {zoom: 10, center: location});
        self = this

        for (var i = 0; i < pharmacies.length; i++) {
            let pharmacyImage = this.pharmacy.GetPharmacyImage(pharmacies[i].id, pharmacies[i].name);
            let marker = new google.maps.Marker({
                title: pharmacies[i].name,
                iconApteka: pharmacyImage,
                name: pharmacies[i].name,
                address: pharmacies[i].address,
                schedule: pharmacies[i].schedule,
                reservation_time: pharmacies[i].reservation_time,
                branch_id: pharmacies[i].branch_id,
                position: new google.maps.LatLng(parseFloat(pharmacies[i].branch_location_lat), parseFloat(pharmacies[i].branch_location_lng)),
                icon: fields.icons.pharmacy.deactiveIcon,
                map: map,
            });

            google.maps.event.addListener(marker, 'click', function () {
                if (fields.lastOpenedMarker.lastWindow !== null) {
                    fields.lastOpenedMarker.lastWindow.close();
                    fields.lastOpenedMarker.lastMarker.setIcon(fields.icons.pharmacy.deactiveIcon);
                    $('.pharmacy_line[data-pharmacy="'+ fields.lastOpenedMarker.lastMarker.branch_id +'"]').removeClass('active');
                }

                let infoWindow = new google.maps.InfoWindow({
                    content: self.GenerateContentMarkerMap(this.name, this.iconApteka, this.address, this.schedule, this.reservation_time, this.branch_id)
                });
                // $('.pharmacy_line').removeClass('active');
                // $('.pharmacy_line[data-pharmacy="'+ this.branch_id +'"]').addClass('active');
                $('.pharmacy_line[data-pharmacy="'+ this.branch_id +'"]').trigger("click");

                infoWindow.open(map, this)
                this.setIcon(fields.icons.pharmacy.acitveIcon);

                fields.lastOpenedMarker.lastWindow = infoWindow;
                fields.lastOpenedMarker.lastMarker = this;
            });
        }
    }

    FindLatLang(city) {
        return new Promise(function(resolve, reject) {
            let geocoder = new google.maps.Geocoder();

            geocoder.geocode({'address': city}, function(results, status) {
                let location;
                if (status === 'OK') {
                    location = {
                        lat: +results[0].geometry.location.lat(),
                        lng: +results[0].geometry.location.lng()
                    }
                    resolve(location);
                } else {
                    let location = {
                        lat: 47.9854715,
                        lng: 22.2083201
                    }
                    reject(location);
                }
            })
        })
    }

    GenerateContentMarkerMap(name, img, address, schedule, reservationTime, branchID) {
        return `
            <div class="checkout_main_point_adres-list_line active">
                <div class="checkout_main_point_adres-list_line_head">
                        <div class="checkout_main_point_adres-list_line_head_logo">`
            + img + `
                        </div>
                        <div class="checkout_main_point_adres-list_line_head_name">` + name + `</div>
        
                        <div class="checkout_main_point_adres-list_radio"></div>
                </div>
                <div class="checkout_main_point_adres-list_line_body">
                    <div class="checkout_main_point_adres-list_line_body_point">
                        <span class="icon icon-location"></span>
                        <span class="pharmacy-adderss_text">` + address + `</span>
                    </div>
                    <div class="checkout_main_point_adres-list_line_body_point">
                        <span class="icon icon-clock"></span>
                        <span class="schedule_text">` + schedule + `</span>
                    </div>` + fields.availableCartInAffiliate[branchID] +`
                </div>
                <div class="checkout_main_point_adres-list_time">
                    Бронирование товара на протяжении <time>` + reservationTime + ` часов</time>
                </div>
            </div>`
    }

}

export class Filter {

    constructor() {
        this.pharmacy = new Pharmacy();
        this.map = new Map();
    }

    PharmacyFilter() {

        let filterPharmacies = fields.pharmacies;
        let pharmacies = fields.pharmacies;
        let filterIDs = [];
        $('.checkout_main_point_apteki-list_point.active').each(function(){
            filterIDs.push(+$(this).data('id'))
        })

        if (filterIDs.length > 0) {
            filterPharmacies = []
            pharmacies = [];
            $('#pharmacies_list').empty();

            fields.pharmacies.forEach((item) => {
                if (filterIDs.includes(item.pharmacy.apteka_id) && item.pharmacy.address.toLowerCase().includes($('#search_address').val().toLowerCase())) {
                    filterPharmacies.push(item);
                    pharmacies.push(item.pharmacy);

                    if ($('.delivery_list.active').data("code") == 'DTC_PICKUP') {
                        item.pharmacy.distance = 0;
                    }
                    let pharmacyRow = this.pharmacy.SetPharmacyList(item.pharmacy, item.data, item.idx);
                    $('#pharmacies_list').append(pharmacyRow);
                }

            });

        } else {
            $('#pharmacies_list').empty();
        }

        this.map.InitMap(pharmacies);
        $("#pharmacy_block").hide();
        if (pharmacies.length > 0) {
            this.pharmacy.GetPharmacyProduct(pharmacies[0].branch_id)
        }

        return filterPharmacies
    }
}

export class Pharmacy {
    constructor(cartID, cityID) {
        this.cartID = cartID;
        this.cityID = cityID;
    }

    GetPharmacyLines(pharmacyRequestJSON) {
        self = this;
        $.ajax({
            url: '/go/apteka/checkout/pharmacy/'  + fields.cityID,
            method: 'POST',
            headers: {
                "Lang": lang,
            },
            data: JSON.stringify(pharmacyRequestJSON),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data) {
                if (data.pharmacy_list.pharmacies == null || data.pharmacy_list.pharmacies.length == 0) {
                    $('.checkout_main_point_pharmacies_lines').hide();
                    $('.checkout_list-of-pharmacy').hide();

                    return
                } else {
                    $('.checkout_main_point_pharmacies_lines').hide();
                    $('.checkout_list-of-pharmacy').hide();

                    // $('#pharmacies_block').show();
                }

                fields.pharmacies = [];
                data.pharmacy_list.pharmacies.forEach((pharmacy, idx) => {
                    fields.pharmacies.push({
                        pharmacy: pharmacy,
                        data: data,
                        idx: idx
                    });
                });

                self.ClearPharmacyLines();

                data.pharmacy_list.pharmacies.forEach(function(pharmacy, idx) {
                    let pharmacyRow = self.SetPharmacyList(pharmacy, data, idx);
                    $('#pharmacies_list').append(pharmacyRow);
                });
                if($('.checkout_main_point_adres-list_line.delivery_list').hasClass('active')) {
                    $('.checkout_main_point_pharmacies_lines').show();
                    $('.checkout_list-of-pharmacy').show();

                }
                self.GetBasketDelivery();
                new Search().SearchPharmacy($("#search_address").val())

                $('#pharmacies_block').off('click').on('click', '.pharmacy_line', function() {
                    if($('.checkout_main_point_adres-list_line.pharmacy_line').hasClass('active')) {
                        $('.checkout_main_point_adres-list_line.pharmacy_line').removeClass('active');
                        $('#check_pharmacy_block').remove();
                    }

                    $(this).addClass('active');
                    $(`.delivery_list.active[data-code="${fields.deliveryCodeDtcPickup}"]`).find('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'));
                    let ctx = this;
                    $('.delivery_list').each(function(index) {
                        if ($(this).data("code") == 'DTC_PICKUP') {
                            $('.checkout_main_point_adres-delivery_time').text($('#pharmacies_list .pharmacy_line').first().data('schedule'));
                            $(this).first().find('.pharmacy_price').remove();
                            $(`.delivery_list.active[data-code="${fields.deliveryCodeDtcPickup}"]`).find('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'));

                            // $('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'));
                            $(this).find('.checkout_main_point_delivery_time').after($(ctx).find('.pharmacy_price').wrap('<p/>').parent().html());
                        }
                    });
                    fields.checkRequireFields();

                    $('.checkout_item_line').remove();
                    new Pharmacy().GetPharmacyProduct($(this).data('pharmacy'));
                });
            }
        });
    }

    SetPharmacyList(pharmacy, data, idx) {
        let pharmacyRow = ``;
        pharmacyRow += `<div class='checkout_main_point_adres-list_line pharmacy_line' data-integration-id='` + pharmacy.id + `' data-schedule='`+ pharmacy.schedule+`' data-name='`+ pharmacy.name+ `' data-address='`+ pharmacy.address+`' data-pharmacy='`+ pharmacy.branch_id+`'>
            <div class='checkout_main_point_adres-list_line_head'>`;

        if (idx === 0) {
            pharmacyRow += `<div class="checkout_main_point_adres-list_line_head_marker yellow h5">
                  <div class="checkout_main_point_adres-list_line_head_marker_text">${fields.i18n.trans("best price")}</div>
                  <div class="checkout_main_point_adres-list_line_head_marker_logo">$</div>
            </div>`;
        }

        pharmacyRow += `
                <div class='checkout_main_point_adres-list_line_head_logo'>`;

        pharmacyRow += this.GetPharmacyImage(pharmacy.id, pharmacy.name);

        pharmacyRow += `</div>
                <div class='checkout_main_point_adres-list_line_head_name'>`+ pharmacy.name +`</div>`;

        if (pharmacy.distance > 0) {
            pharmacyRow += `<span class="checkout_main_point_distance" style="margin-right: 20px;"><span class="pharmacy_distance">` + pharmacy.distance + `</span> м. </span>`
        }
        pharmacyRow += `<div class='checkout_main_point_adres-list_radio'></div>
            </div>
            <div class='checkout_main_point_adres-list_line_body'>
                <div class='checkout_main_point_adres-list_line_body_point'>
                    <span class='icon icon-location'></span>
                    <span class="pharmacy-adderss_text">`+ pharmacy.address +`</span>
                </div>
                <div class='checkout_main_point_adres-list_line_body_point'>
                    <span class='icon icon-clock'></span>
                    <span class="schedule_text">` + pharmacy.schedule +`</span>
                </div>`;

        let pharmacyMedicineIDs = [];
        let sum = 0;
        // let allProduct = 0;
        let totalPrice = 0;

        fields.goodsStatic.forEach(function(productInCart) {
            pharmacyMedicineIDs.push(productInCart.medicine_id);
            // allProduct += parseInt(productInCart.count, 10)
        });
        data.pharmacy_list.products[pharmacy.branch_id].forEach(function(product) {
            let qnt = parseInt(product.in_stock, 10) >  parseInt(product.in_cart, 10) ? parseInt(product.in_cart, 10) : parseInt(product.in_stock, 10);
            sum += qnt;
            totalPrice += parseFloat(product.price).toFixed(2) * qnt;
            pharmacyMedicineIDs.push(product.medicine_id)
        });

        fields.availableCartInAffiliate[pharmacy.branch_id] = '';
        if (sum >= fields.cartCounter && sum != 0) {
            fields.availableCartInAffiliate[pharmacy.branch_id] += `<div class='checkout_main_point_adres-list_line_body_point pharmacy_price green'>
                <span class='icon icon-basket-2'></span>
                <span>${fields.i18n.trans('All goods')}</span>
                <span class='price total_price'>` + parseFloat(totalPrice).toFixed(2) +` грн</span>
            </div>`;

            pharmacyRow += fields.availableCartInAffiliate[pharmacy.branch_id];

            // pharmacyRow +=  `<div class='checkout_main_point_adres-list_line_body_point pharmacy_price green'>
            //     <span class='icon icon-basket-2'></span>
            //     <span>Все товары</span>
            //     <span class='price total_price'>` + parseFloat(totalPrice).toFixed(2) +` грн</span>
            // </div>`;
        } else {
            fields.availableCartInAffiliate[pharmacy.branch_id] += `<div class='checkout_main_point_adres-list_line_body_point pharmacy_price red'>
                <span class='icon icon-basket-2'></span>
                <span>${sum} / ${fields.cartCounter} ${fields.i18n.trans('goods in pharmacy')}</span>
                <span class='price total_price'>` + parseFloat(totalPrice).toFixed(2) +` грн</span> 
            </div>`;
            pharmacyRow +=  fields.availableCartInAffiliate[pharmacy.branch_id];
        }

        let isExistProductInPharmacy = false;
        let fullCart = true;

        let pharmacyProducts = data.pharmacy_list.products[pharmacy.branch_id];
        let pharmacyProductIDs = [];

        let pharmacyProductArr = [];


        if (sum < fields.cartCounter) {
            let names = [];
            fields.goodsStatic.forEach(function(productInCart) {
                for (let i = 0; i < pharmacyProducts.length; i++) {
                    let pharmacyProductObj = {};

                    let tracker = false;

                    if (names.includes(productInCart.name) || names.includes(pharmacyProducts[i].product_name)) {
                        continue;
                    }
                    if (productInCart.medicine_id == pharmacyProducts[i].medicine_id) {

                        isExistProductInPharmacy = true;

                        tracker = true;

                        if (pharmacyProducts[i].in_stock < pharmacyProducts[i].in_cart && pharmacyProducts[i].in_stock >= 1) {
                            // pharmacyProductObj.line = `<div class='checkout_main_point_adres-list_line_body_point h5'>
                            //     <span class='icon'></span>
                            //     <span>` + pharmacyProducts[i].product_name + `</span>
                            //     <span class='col'>` +  parseInt(pharmacyProducts[i].in_stock) + ` шт</span>
                            //     <span class='price'> ` + parseFloat(pharmacyProducts[i].price).toFixed(2) * parseInt(pharmacyProducts[i].in_stock, 10) + ` грн </span>
                            // </div>`;
                            // pharmacyProductObj.qnt = parseInt(pharmacyProducts[i].in_stock);
                            pharmacyProductArr.push({
                                "line": `<div class='checkout_main_point_adres-list_line_body_point h5'>
                                        <span class='icon'></span>
                                        <span>` + pharmacyProducts[i].product_name + `</span>
                                        <span class='col'>` +  parseInt(pharmacyProducts[i].in_stock) + ` шт</span>
                                        <span class='price'> ` + parseFloat(parseFloat(pharmacyProducts[i].price).toFixed(2) * parseInt(pharmacyProducts[i].in_stock, 10)).toFixed(2) + ` грн </span>
                                    </div>`,
                                "qnt": parseInt(pharmacyProducts[i].in_stock)
                            });

                            names.push(pharmacyProducts[i].product_name);
                            fullCart = false;
                        } else if (pharmacyProducts[i].in_stock < 1 && pharmacyProducts[i].in_stock > 0) {

                            pharmacyProductArr.push({
                                "line": `<div class='checkout_main_point_adres-list_line_body_point gray h5'>
                                    <span class='icon '></span>
                                    <span>` + productInCart.name + `</span>
                                    <span class='price'> нет в наличии </span>
                                </div>`,
                                "qnt": 0
                            });

                            names.push(pharmacyProducts[i].name);

                            break;
                        } else {
                            break;
                        }
                    }
                }

                if (!isExistProductInPharmacy) {
                    pharmacyProductArr.push({
                        "line": `<div class='checkout_main_point_adres-list_line_body_point gray h5'>
                            <span class='icon '></span>
                            <span>` + productInCart.name + `</span>
                            <span class='price'> нет в наличии </span>
                        </div>`,
                        "qnt": 0
                    });

                    // pharmacyRow += `<div class='checkout_main_point_adres-list_line_body_point gray h5'>
                    //   <span class='icon '></span>
                    //   <span>` + productInCart.name + `</span>
                    //   <span class='price'> нет в наличии </span>
                    // </div>`;
                    fullCart = false;
                    names.push(productInCart.name);

                }
                isExistProductInPharmacy = false;
            });
        }

        pharmacyProductArr.sort((a, b) => {
            if ( a.qnt > b.qnt ) {
                return -1;
            } else if ( a.qnt < b.qnt ) {
                return 1;
            }

            return 0;
        });

        pharmacyProductArr.forEach((obj) => {
            pharmacyRow += obj.line;
        });

        pharmacyRow +=`
                <div class='checkout_main_point_adres-list_time'>
                   ${fields.i18n.trans("Reservation of goods during")} <time>` + pharmacy.reservation_time + `  ${fields.i18n.trans("hours")}</time>
                </div>
            </div>
        </div>`;

        return pharmacyRow;
    }

    GetPharmacyProduct(pharmacyID) {

        $.ajax({
            url: '/go/apteka/cart/pharmacy/get/'+ fields.cartID + '/' + pharmacyID,
            headers: {
                "Lang": lang,
            },
            method: 'GET',
            success: function(data) {

                if (!('product_item' in data) || ('product_item' in data && data.product_item[0].quantity < 1)) {
                    $('#order_title').after( `
                                    <div class='checkout_side_line ord checkout_item_line'>
                                       ${fields.i18n.trans("There are no products in the pharmacy")}
                                    </div>
                                `);
                    $('#total_price').text('0.00 грн');
                    $('#check_pharmacy_block').remove();

                    $(".pharmacy_line[data-pharmacy='" + pharmacyID + "']").remove();

                    $("#errorModal").find(".error-msg").text(fields.i18n.trans("Failed to get pharmacies, please contact support"));
                    $("#errorModal").modal();
                    return;
                }

                let productsIsExist = [];

                fields.goodsStatic.forEach(function(productInCart) {
                    data['product_item'].forEach(function(product) {
                        if (product.medicine_id == productInCart.medicine_id) {
                            productsIsExist.push(product.medicine_id);
                        }
                    });
                });
                $('.checkout_item_line').remove();

                data['product_item'].forEach(function(product) {
                    if (product.price > 0 && product.count > 0) {
                        let availableProduct = product.count > product.quantity ? product.quantity : product.count;
                        $('#order_title').after(`
                        <div class='checkout_side_line ord checkout_item_line' data-medicine-id="` + product.medicine_id + `" data-count="` + product.count + `" data-price="` + product.price + `">
                            <div class='checkout_side_name'>` + product.name + `</div>
                            <div class='checkout_side_col'>` + availableProduct + ` шт </div>
                            <div class='checkout_side_price'>` + parseFloat(product.price * availableProduct).toFixed(2) + ` грн</div>
                            <div class="checkout_side_remove"> <span class="icon-close"></span> </div>
                        </div>`);
                    }
                });

                fields.goodsStatic.forEach(function(productInCart) {
                    if (!productsIsExist.includes(productInCart.medicine_id)) {
                        $('#order_title').after(`
                        <div class='checkout_side_line ord checkout_item_line' data-medicine-id="` + productInCart.medicine_id + `" data-count="` + 0 + `" data-price="` + 0 + `">
                            <div class='checkout_side_name'>` + productInCart.name + `</div>
                            <div class='checkout_side_col checkout_side_price'> нет в наличии </div>
                            <div class="checkout_side_remove"> <span class="icon-close"></span> </div>
                        </div>`);
                    }
                });

                $('.checkout_price_without_discount').text(parseFloat(data.total_price ? data.total_price : 0).toFixed(2));

                let deliveryPrice = $("#delivery_price").text();
                deliveryPrice = parseFloat(deliveryPrice.replace(/[^0-9\.]/g, '')).toFixed(2);
                let totalPrice = parseFloat(data.total_price) + parseFloat(deliveryPrice)
                $('#total_price').text(parseFloat(totalPrice ? totalPrice : 0).toFixed(2));
                fields.goods = data.product_item;
            },
            error: function (data) {
            }
        });
    }

    GetPharmacyProductNovaPoshta() {
        $('.checkout_item_line').remove();

        $.ajax({
            url: '/go/apteka/cart/pharmacy/get/'+ fields.cartID + '/462070',
            method: 'GET',
            headers: {
                "Lang": lang,
            },
            success: function(data) {

                if (!('product_item' in data) || ('product_item' in data && data.product_item[0].quantity < 1)) {
                    $('#order_title').after( `
                                    <div class='checkout_side_line ord checkout_item_line'>
                                       ${fields.i18n.trans("There are no products in the pharmacy")}
                                    </div>
                                `);
                    $('#total_price').text('0.00 грн');
                    $('#check_pharmacy_block').remove();

                    $("#errorModal").find(".error-msg").text(fields.i18n.trans("When delivering by novaposhta, there is no product, please choose another type of delivery."));
                    $("#errorModal").modal();
                    return;
                }

                let productsIsExist = [];

                fields.goodsStatic.forEach(function(productInCart) {
                    data['product_item'].forEach(function(product) {
                        if (product.medicine_id == productInCart.medicine_id) {
                            productsIsExist.push(product.medicine_id);
                        }
                    });
                });

                data['product_item'].forEach(function(product) {
                    if (product.price > 0 && product.count > 0) {
                        let availableProduct = product.count > product.quantity ? product.quantity : product.count;
                        $('#order_title').after(`
                        <div class='checkout_side_line ord checkout_item_line' data-medicine-id="` + product.medicine_id + `" data-count="` + product.count + `" data-price="` + product.price + `">
                            <div class='checkout_side_name'>` + product.name + `</div>
                            <div class='checkout_side_col'>` + availableProduct + ` шт </div>
                            <div class='checkout_side_price'>` + parseFloat(product.price * availableProduct).toFixed(2) + ` грн</div>
                            <div class="checkout_side_remove"> <span class="icon-close"></span> </div>
                        </div>`);
                    }
                });

                fields.goodsStatic.forEach(function(productInCart) {
                    if (!productsIsExist.includes(productInCart.medicine_id)) {
                        $('#order_title').after(`
                        <div class='checkout_side_line ord checkout_item_line' data-medicine-id="` + productInCart.medicine_id + `" data-count="` + 0 + `" data-price="` + 0 + `">
                            <div class='checkout_side_name'>` + productInCart.name + `</div>
                            <div class='checkout_side_col checkout_side_price'> нет в наличии </div>
                            <div class="checkout_side_remove"> <span class="icon-close"></span> </div>
                        </div>`);
                    }
                });

                $('.checkout_price_without_discount').text(parseFloat(data.total_price ? data.total_price : 0).toFixed(2));

                let deliveryPrice = $("#delivery_price").text();
                deliveryPrice = parseFloat(deliveryPrice.replace(/[^0-9\.]/g, '')).toFixed(2);
                let totalPrice = parseFloat(data.total_price) + parseFloat(deliveryPrice)
                $('#total_price').text(parseFloat(totalPrice ? totalPrice : 0).toFixed(2));
                fields.goods = data.product_item;

            },
            error: function (data) {
            }
        });
    }

    InitDeliveryTimeClick() {
        $('#ipost_delivery-block').on("click", ".checkout_main_point_adres-list_line", function () {

            $("#ipost_delivery-block .checkout_main_point_adres-list_line").removeClass("active");
            $(this).addClass("active");

            let deliveryPrice = $("#ipost_delivery-block .checkout_main_point_adres-list_line.active .delivery_ipost_price").text();
            deliveryPrice = parseFloat(deliveryPrice.replace(/[^0-9\.]/g, '')).toFixed(2);
            let price = parseFloat($(".checkout_price_without_discount").text().replace(/[^0-9\.]/g, '')).toFixed(2);
            $("#delivery_price").text(deliveryPrice);

            let sum = parseFloat(deliveryPrice) + parseFloat(price);
            $("#total_price").text(sum.toFixed(2))
            fields.checkRequireFields();
        });
    }

    SetPharmacyProduct(data) {
        self = this;
        fields.pharmacies = [];
        if (data.pharmacy_list.pharmacies == null || data.pharmacy_list.pharmacies.length == 0) {
            $('.checkout_main_point_pharmacies_lines').hide();
            $('.checkout_list-of-pharmacy').hide();

            return
        } else {
            $('.checkout_main_point_pharmacies_lines').hide();
            $('.checkout_list-of-pharmacy').hide();

            // $('#pharmacies_block').show();
        }

        data.pharmacy_list.pharmacies.forEach((pharmacy, idx) => {
            fields.pharmacies.push({
                pharmacy: pharmacy,
                data: data,
                idx: idx
            });
            let pharmacyRow = self.SetPharmacyList(pharmacy, data, idx);

            // fields.pharmacies.append(pharmacyRow);

            $('#pharmacies_list').append(pharmacyRow);
        });

        if($('.checkout_main_point_adres-list_line.delivery_list').hasClass('active')) {
            // $('.checkout_main_point_pharmacies_lines').show();
            // $('.checkout_list-of-pharmacy').show();
            $('#pharmacies_list .pharmacy_line').first().addClass('active');
            $('.checkout_main_point_delivery_time').show();
            updateDeliveryBloksIPost();

        }
        this.GetBasketDelivery();

        $('#pharmacies_block').off('click').on('click', '.pharmacy_line', function() {
            let self = new Pharmacy();

            let orderCtx = new Order();
            if($('.checkout_main_point_adres-list_line.pharmacy_line').hasClass('active')) {
                $('.checkout_main_point_adres-list_line.pharmacy_line').removeClass('active');
                $('#check_pharmacy_block').remove();
            }

            $("#pharmacy_block").show();
            $("#pharmacy_block").find(".pharmacy_block_name").text($(this).data("name"));
            $("#pharmacy_block").find(".pharmacy-block_address_text").text($(this).find(".pharmacy-adderss_text").text());
            $("#pharmacy_block").find(".checkout_main_point_adres-list_line_head_logo").html("")
            $("#pharmacy_block").find(".checkout_main_point_adres-list_line_head_logo").append($(this).find(".checkout_main_point_adres-list_line_head_logo").html());

            $(this).addClass('active');
            // $(`.delivery_list.active[data-code="${fields.deliveryCodeDtcPickup}"]`).find('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'));
            let ctx = this;

            fields.checkRequireFields();


            if ($('.delivery_list.active').data("code") == fields.codeIPost) {
                let orderObj = orderCtx.CreateOrderObjIPost();
                orderObj.order.phone = "380950000000"

                $.ajax({
                    url: '/go/apteka/order/ipost/price',
                    method: 'POST',
                    headers: {
                        "Lang": lang,
                    },
                    data: JSON.stringify(orderObj),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data) {
                        let deliveryIPostBlock = "";
                        let bestOfferIsSet  = {
                            "time": 9999,
                            "isSet": false
                        };
                        self.ClearOldDeliveryBlockIPost();

                        let deliveryIsSet = false;
                        let bestDelivery = {};

                        Object.keys(data.delivery_price_list).forEach(function(idx, i) {
                            let el = data.delivery_price_list[idx];

                            if (el.hasOwnProperty("message")) {
                                if (el.message != "") {
                                    return
                                }
                            }

                            let pharmacyDistance = parseInt($(".pharmacy_line.active").find(".pharmacy_distance").text());
                            switch (idx) {

                                case "DELIVERY_TYPE_FAST60":
                                    if (pharmacyDistance > 5000) {
                                        break;
                                    }

                                    if (bestOfferIsSet.time > 60) {
                                        bestOfferIsSet.time = 60;
                                        bestDelivery = el
                                        bestDelivery.title = "Доставка до 60 " + fields.i18n.trans('min')
                                        bestDelivery.id = idx
                                    }

                                    break;
                                case "DELIVERY_TYPE_FAST90":

                                    if (pharmacyDistance > 15000 || deliveryIsSet) {
                                        break;
                                    }

                                    if (bestOfferIsSet.time > 120) {
                                        bestOfferIsSet.time = 120;
                                        bestDelivery = el
                                        bestDelivery.title = "Доставка до 120 " + fields.i18n.trans('min')
                                        bestDelivery.id = idx
                                    }

                                    break;
                                case "DELIVERY_TYPE_FAST120":
                                    if (pharmacyDistance > 30000 || deliveryIsSet) {
                                        break;
                                    }
                                    if (bestOfferIsSet.time > 180) {
                                        bestOfferIsSet.time = 180;
                                        bestDelivery = el
                                        bestDelivery.title = "Доставка до 180 " + fields.i18n.trans('min')
                                        bestDelivery.id = idx
                                    }

                                    break;
                            }
                        });

                        if (bestDelivery.price != undefined) {
                            deliveryIPostBlock += self.AddDeliveryBlockIPost(bestDelivery.price, bestDelivery.title, true, bestDelivery.id);
                        }

                        // if ($(".checkout_main_point_delivery_time").hasClass("valid_phone")) {
                        $('.checkout_main_point_delivery_time').show();
                        // }
                        // $('.checkout_main_point_delivery_time').show();
                        // $('#ipost_delivery-block').on("click", ".checkout_main_point_adres-list_line", function () {

                        //     $("#ipost_delivery-block .checkout_main_point_adres-list_line").removeClass("active");
                        //     $(this).addClass("active");

                        //     let deliveryPrice = $("#ipost_delivery-block .checkout_main_point_adres-list_line.active .delivery_ipost_price").text();
                        //     deliveryPrice = parseFloat(deliveryPrice.replace(/[^0-9\.]/g, '')).toFixed(2);
                        //     let price = parseFloat($(".checkout_price_without_discount").text().replace(/[^0-9\.]/g, '')).toFixed(2);
                        //     $("#delivery_price").text(deliveryPrice);

                        //     let sum = parseFloat(deliveryPrice) + parseFloat(price);
                        //     $("#total_price").text(sum.toFixed(2))
                        //     fields.checkRequireFields();
                        // });

                        $('#ipost_delivery-block').prepend(deliveryIPostBlock);
                    }
                });

                if ($('.delivery_list.active').data("code") == fields.codeIPost) {
                    // $('.checkout_main_point_adres-delivery_time').text($('#pharmacies_list .pharmacy_line').first().data('schedule'));

                    // $('.checkout_main_point_adres-delivery_time').text($('#pharmacies_list .pharmacy_line').first().data('schedule'));
                    $('.delivery_list.active').first().find('.pharmacy_price').remove();
                    $(`.delivery_list.active[data-code="${fields.codeIPost}"]`).find('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'));

                    $('.delivery_list.active').find('.checkout_main_point_delivery_time').after($(ctx).find('.pharmacy_price').wrap('<p/>').parent().html());
                }
            }


            $('.delivery_list').each(function(index) {
                if ($(this).data("code") == 'DTC_PICKUP') {
                    // $('.checkout_main_point_adres-delivery_time').text($('#pharmacies_list .pharmacy_line').first().data('schedule'));
                    $(this).first().find('.pharmacy_price').remove();
                    $(`.delivery_list.active[data-code="${fields.deliveryCodeDtcPickup}"]`).find('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'));

                    // $('.checkout_main_point_adres-delivery_time').text($(this).data('schedule'));
                    $(this).find('.checkout_main_point_delivery_time').after($(ctx).find('.pharmacy_price').wrap('<p/>').parent().html());
                }
            });

            $('.checkout_item_line').remove();
            self.GetPharmacyProduct($(this).data('pharmacy'));
        });
    }

    AddDeliveryBlockIPost(price, title, isBestOffer, code) {
        let bestOffer = '';
        if (isBestOffer) {
            bestOffer = `<div class="checkout_main_point_adres-list_line_head_marker  h5">
                <div class="checkout_main_point_adres-list_line_head_marker_text">${fields.i18n.trans('best deal')}</div>
                <div class="checkout_main_point_adres-list_line_head_marker_logo">%</div>
            </div>`
        }

        $('.delivery_ipost_price.other_ipost_delivery').text(price);

        return `
            <div class="checkout_main_point_adres-list_line only-head" data-code="` + code + `">
                <div class="checkout_main_point_adres-list_line_head">`
            + bestOffer +
            `<div class="checkout_main_point_adres-list_line_head_name">` + title + `</div>
                    <div class="checkout_main_point_adres-list_line_head_price"><span class="delivery_ipost_price">` + price + ` </span> грн </div>
                    <div class="checkout_main_point_adres-list_radio"></div>
                </div>
            </div>`;
    }


    GetPharmacyImage(id, name) {
        switch (id) {
            case 2:
                if (name == "Аптека Доброго Дня") {
                    return ` <img src='/i/apteka/dobrogodnya.jpeg' alt='logo apteka'>`;
                } else {
                    return ` <img src='/i/apteka/socialna.png' alt='logo apteka'>`;
                }
                break;
            case 3:
                return ` <img src='/i/apteka/vitamin.png' alt='logo apteka'>`;
                break;
            case 4:
                return ` <img src='/i/apteka/api911.jpg' alt='logo apteka'>`;
                break;
        }

        return ''
    }

    GetBasketDelivery() {
        $('.delivery_list').each(function(index) {
            if ($(this).data("code") == 'DTC_PICKUP') {
                $(this).first().find('.pharmacy_price').remove();
                $(this).find('.checkout_main_point_delivery_time').after($('.pharmacy_line').first().find('.pharmacy_price').wrap('<p/>').parent().html());
            } else if ($(this).data("code") == 'IPOST') {
                $(this).first().find('.pharmacy_price').remove();
                $(this).find('.checkout_main_point_delivery_time').after($('.pharmacy_line').first().find('.pharmacy_price').wrap('<p/>').parent().html());
            }
        });
    }


    ClearOldDeliveryBlockIPost() {
        $('.checkout_main_point_adres-list_line.only-head[data-code=DELIVERY_TYPE_FAST30]').remove();
        $('.checkout_main_point_adres-list_line.only-head[data-code=DELIVERY_TYPE_FAST60]').remove();
        $('.checkout_main_point_adres-list_line.only-head[data-code=DELIVERY_TYPE_FAST90]').remove();
        $('.checkout_main_point_adres-list_line.only-head[data-code=DELIVERY_TYPE_FAST120]').remove();
    }


    ClearPharmacyLines() {
        $(".pharmacy_line").remove();
    }
}

export class Search {
    constructor(cartID, cityID) {
        this.pharmacy = new Pharmacy(cartID, cityID)
        this.filter = new Filter()
        this.map = new Map()
    }

    SearchPharmacy(text) {

        let fieldPharmacies = this.filter.PharmacyFilter()

        let pharmacyMatch = [];
        let pharmacies = [];
        if (text.length == 0 || text.length >= 2) {
            $('#pharmacies_list').empty();


            fieldPharmacies.forEach((item, i) => {
                if (item.pharmacy.address.toLowerCase().includes(text.toLowerCase())) {
                    if ($('.delivery_list.active').data("code") == 'DTC_PICKUP') {
                        item.pharmacy.distance = 0;
                    }

                    pharmacies.push(item.pharmacy)
                    let pharmacyRow = this.pharmacy.SetPharmacyList(item.pharmacy, item.data, item.idx);
                    pharmacyMatch.push({
                        idx: item.idx,
                        row: pharmacyRow
                    });
                    $('#pharmacies_list').append(pharmacyRow);
                }

            });

            this.map.InitMap(pharmacies)
        }

        pharmacyMatch.sort(function(a, b) {
            return a.idx - b.idx;
        });
    }
}

export class Novaposhta {
    constructor(cartID, cityID, i18n) {
        this.cartID = cartID;
        this.i18n = i18n;

        // this.delivery = new Delivery(this.cartID, this.cityID)
        // this.pharmacy = new Pharmacy(this.cartID, this.cityID)
    }

    GetCartNovaPoshta() {
        self = this;

        $.ajax({
            url: '/go/apteka/cart/novaposhta/get/'  + fields.cartID,
            method: 'GET',
            headers: {
                "Lang": lang,
            },
            dataType: 'json',
            success: function(data) {
                let novaposhtaRow = '';
                let sum = 0, totalPrice = 0;

                if (data.product_item != undefined) {
                    data.product_item.forEach(function(product) {
                        let qnt = parseInt(product.quantity, 10) > parseInt(product.count, 10) ?
                            parseInt(product.count, 10) : parseInt(product.quantity, 10);
                        sum += qnt;
                        totalPrice += parseFloat(product.price).toFixed(2) * qnt;
                    });
                }

                if (sum >= data.cart_counter && sum !== 0) {
                    novaposhtaRow =  `<div class='checkout_main_point_adres-list_line_body_point pharmacy_price green'>
                        <span class='icon icon-basket-2'></span>
                        <span>${fields.i18n.trans('All goods')}</span>
                        <span class='price total_price'>` + parseFloat(totalPrice).toFixed(2) +` грн</span>
                    </div>`;
                } else if (sum > 0) {
                    novaposhtaRow +=`<div class='checkout_main_point_adres-list_line_body_point pharmacy_price red'>
                        <span class='icon icon-basket-2'></span>
                        <span>${sum} / ${data.cart_counter} ${fields.i18n.trans('goods in pharmacy')}</span>
                        <span class='price total_price'>` + parseFloat(totalPrice).toFixed(2) +` грн</span> 
                    </div>`;
                } else {
                    novaposhtaRow +=`<div class='checkout_main_point_adres-list_line_body_point pharmacy_price red'>
                        <span class='icon icon-basket-2'></span>
                        <span>Товаров на доставку нет в наличии </span>
                    </div>`;
                }

                let novaposhtaCourierDelivery = $('.delivery_list[data-code="' + fields.codeNovaPoshtaCourier + '"]').find('.checkout_main_point_adres-list_line_body');
                novaposhtaCourierDelivery.find('.pharmacy_price').remove();
                novaposhtaCourierDelivery.find('.checkout_main_point_delivery_time').after(novaposhtaRow);

                let novaposhtaBranchDelivery = $('.delivery_list[data-code="' + fields.codeNovaPoshtaBranch + '"]').find('.checkout_main_point_adres-list_line_body');
                novaposhtaBranchDelivery.find('.pharmacy_price').remove();
                novaposhtaBranchDelivery.find('.checkout_main_point_delivery_time').after(novaposhtaRow);
                fields.novaPoshtaCart = data.product_item;
            }
        });
    }

    UpdateCart() {
        $.ajax({
            url: '/go/apteka/cart/novaposhta/get/' + fields.cartID,
            method: 'GET',
            headers: {
                "Lang": lang,
            },
            dataType: 'json',
            success: function (data) {
                $('.checkout_item_line').remove();

                data.product_item.forEach(function (product) {
                    if (product.price > 0 && product.count > 0) {
                        $('#order_title').after(`
                        <div class='checkout_side_line ord checkout_item_line' data-medicine-id="` + product.medicine_id + `" data-count="` + product.count + `" data-price="` + product.price + `">
                            <div class='checkout_side_name'>` + product.name + `</div>
                            <div class='checkout_side_col'>` + product.count + ` шт </div>
                            <div class='checkout_side_price'>` + parseFloat(product.price * product.count).toFixed(2) + ` грн</div>
                            <div class="checkout_side_remove"> <span class="icon-close"></span> </div>
                        </div>`);
                        $('.checkout_price_without_discount').text(parseFloat(data.total_price).toFixed(2));
                        $('#total_price').text(parseFloat(data.total_price).toFixed(2));
                    }
                });
            }
        });
    }


    CreateOrderObjNovaPoshta() {
        let fio = $('#name_user').val().trim().split(' ');
        let phone = $('#phone').val();
        phone = phone.substring(0, 2) + phone.substring(4, 7) + phone.substring(9, 12) + phone.substring(phone.length - 4);
        let email = $('#email').val();
        let comment = $('#comment').val();
        let deliveryType = $('.delivery_list.active').data('code');

        let goodsList = [];
        let branchID = $('#pharmacies_list .checkout_main_point_adres-list_line.active').data('pharmacy');
        let pharmacyName = $('#pharmacies_list .checkout_main_point_adres-list_line.active').data('name');
        let pharmacyAddress = $('#pharmacies_list .checkout_main_point_adres-list_line.active').data('address');


        let deliveryAddress, deliveryBranch

        if ($('.delivery_list.active').data('code') == fields.codeNovaPoshtaBranch) {
            deliveryBranch = `самовывоз с отделения, город - ${$('#novaposhta_city').find('input').val()}, отделение - ${$('#branch_number').find("input").val()}`
        } else if ($('.delivery_list.active').data('code') == fields.codeNovaPoshtaCourier) {
            let addressCourier = `${$('#street').find("input").val()}, ${$('#home').find("input").val()} - ${$('#flat').find("input").val()} `
            deliveryAddress = `курьерская доставка, город - ${ $('#select2-city_select-container').text()}, адрес - ${addressCourier}`
        }

        fields.novaPoshtaCart.forEach(function(product) {
            let objProduct =  {
                'id': product.medicine_partner_id,
                'name': product.name,
                'quantity': product.count > product.quantity ? product.quantity : product.count,
                'pharmacy_id': branchID,
                'price': product.price
            };

            goodsList.push(objProduct);
        });

        let isCall = $('#is_call').attr('checked') ? 0 : 1;
        let order = {
            'status_id':1,
            'integration_status':'new',
            'first_name': fio[0] ? fio[0] : '',
            'middle_name': fio[2] ? fio[2] : '',
            'last_name':  fio[1] ? fio[1] : '',
            'phone': phone,
            'email': email,
            'integration_id': 2,
            'pharmacy_affiliate_name': pharmacyName,
            'pharmacy_affiliate_address': pharmacyAddress,
            'branch_id': branchID,
            'cart_id': fields.cartID,
            'city_id': fields.cityID,
            'user_id':  parseInt(fields.userID ? fields.userID : 0),
            'comment': comment,
            'delivery_type_code': deliveryType,
            'delivery_price': parseFloat($('#delivery_price').text()),
            'paid': 0,
            'is_call': isCall,
            'total_price': parseFloat($('#total_price').text()),
            'address': deliveryAddress,
            'address_branch': deliveryBranch,
            'city': $('#select2-city_select-container').text()
        };
        order.items = goodsList;

        return {
            "order": order,
            "items": goodsList,
        }
    }
}
//



let deliveryClass = new Delivery(fields.cartID, fields.cityID);
let cartClass = new Cart(fields.cartID, fields.cityID);
let pharmacyClass = new Pharmacy(fields.cartID, fields.cityID);
let filterClass = new Filter();

let searchClass = new Search(fields.cartID, fields.cityID);
let novaposhtaClass = new Novaposhta(fields.cartID, fields.cityID, fields.i18n);

let ipostClass = new IPost();
let map = new Map();
let orderClass = new Order();

let iPostToHour = 0;
let iPostToMin = 0;
let iPostFromHour = 0;
let iPostFromMin = 0;
let iPostDate = new Date();

let liki24Token = "";

// let availableCartInAffiliate = {};

$( document ).ready(function() {

    $('#ipost_delivery-block').find('.checkout_main_point_adres-list_line').off('click');
    var dateToday = new Date();
    $("#datepicker").datepicker({
        dateFormat:"dd.mm.y",
        minDate: dateToday,
    }).datepicker("setDate",new Date);

    $("#phone").inputmask({"mask": "99 (999) 999-9999"});

    let city = '';
    initEventFields();
    cartClass.InitProducts();
    deliveryClass.DeliveryClick();
    pharmacyClass.InitDeliveryTimeClick();
    novaposhtaClass.GetCartNovaPoshta()
    fields.InitEventsIPost();
    initDeliveryTimeIPost();

    $(document).on("click", ".checkout_list-of-pharmacy .catalog_products_sort-panel_second_clear", function(){
        $(".checkout_main_point_apteki-list_ul").find(".checkout_main_point_apteki-list_point").each(function () {
            $(this).removeClass("active");
        });
        $('#pharmacy_block').hide()
        $('#pharmacies_list').empty();
    })

    $("#datepicker").change(function() {
        initDeliveryTimeIPost();
    })

    $(document).on("click", "#calculate-ipost", function () {
        let orderObj = orderClass.CreateOrderObjIPost();
        orderObj.order.phone = "380950000000"

        // let deliveryTimeTo = new Date(fields.iPostDate.getFullYear(), fields.iPostDate.getMonth(), iPostDate.getDate(), fields.iPostToHour, iPostToMin);
        // let deliveryTimeFrom = new Date(fields.iPostDate.getFullYear(), fields.iPostDate.getMonth(), fields.iPostDate.getDate(), fields.iPostFromHour, fields.iPostFromMin);

        // orderObj.delivery_time = {
        //     "time_from": deliveryTimeFrom,
        //     "time_to": deliveryTimeTo
        // };
        $.ajax({
            url: '/go/apteka/order/ipost/user/price',
            method: 'POST',
            headers: {
                "Lang": lang,
            },
            data: JSON.stringify(orderObj),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data) {
                if (typeof data.delivery_price.price === "undefined") {
                    $("#errorModal").find(".error-msg").text(fields.i18n.trans("Failed to get delivery for this time"));
                    $("#errorModal").modal();
                    $("#ipost_delivery-block .checkout_main_point_adres-list_line").removeClass("active");
                    fields.checkRequireFields();
                    return
                }

                $(".delivery_ipost_price.other_ipost_delivery").text(data.delivery_price.price);

                let deliveryPrice = $("#ipost_delivery-block .checkout_main_point_adres-list_line.active .delivery_ipost_price").text();
                deliveryPrice = parseFloat(deliveryPrice.replace(/[^0-9\.]/g, '')).toFixed(2);
                let price = parseFloat($(".checkout_price_without_discount").text().replace(/[^0-9\.]/g, '')).toFixed(2);
                $("#delivery_price").text(deliveryPrice);
                let sum = parseFloat(deliveryPrice) + parseFloat(price);
                $("#total_price").text(sum.toFixed(2))

            },
            // error: function (data) {
            //     console.log(data.price)
            //     $("#errorModal").find(".error-msg").text("Не удалось получить список аптек, обратитесь в службу поддержки");
            //     $("#errorModal").modal();
            // }
        });
    });

    $(document).on("keyup", "#search_address", function () {
        searchClass.SearchPharmacy(this.value);
    });


    $(document).on("click", ".checkout_main_point_apteki-list_point", function () {
        filterClass.PharmacyFilter();
    });

    // $('#datepicker').datepicker("option", "onSelect", function(){alert('hi')});

    $('#city_select').val($('#city_select').find('[data-id="'+ $.cookie('city_id') +'"]').val());
    $("#city_select").trigger('change');

    $('.checkout_main_point_popular_line a').on('click', function () {
        $('#city_select').val($(this).data("select"));
        $('#select2-city_select-container').text($(this).data("select"));
        $('#city_select').trigger('change');
    });

    $('a[href="#"]').click(function () {
        $('#city').val($(this).data('select'))
    });

    $(document).on('click', '.checkout_side_remove', function() {
        let element = $(this).closest('.checkout_item_line'),
            medicineID = $(this).parent().data('medicine-id');
        deleteProduct(medicineID, element).then(function () {
            let pharmacyRequestJSON = {
                'partner_ids': fields.partnerIDs,
                'cart_id': fields.cartID
            };

            if($(`.checkout_main_point_adres-list_line.delivery_list[data-code="${fields.deliveryCodeDtcPickup}"]`).hasClass('active')) {
                pharmacyClass.GetPharmacyLines(pharmacyRequestJSON);
            }
        }).catch(function(err) {
            $("#errorModal").find(".error-msg").text(fields.i18n.trans("Failed to delete item"));
            $("#errorModal").modal();
        });
    });

    $( '#delivery' ).change(function() {
        let deliveryType = $('#delivery_type [value="' + $(this).val() + '"]').data('code');

        let pharmacyRequestJSON = {
            'partner_ids': fields.partnerIDs,
            'cart_id': fields.cartID,
            'delivery_code': deliveryType
        };

        $.ajax({
            url: '/go/apteka/checkout/pharmacy/'  + fields.cityID,
            method: 'POST',
            headers: {
                "Lang": lang,
            },
            data: JSON.stringify(pharmacyRequestJSON),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data) {
                $('#pharmacies_list').empty();
                data.pharmacy_list.pharmacies.forEach(function(pharmacy, idx) {
                    let pharmacyRow = pharmacy.SetPharmacyList(pharmacy, data, idx);
                    $('#pharmacies_list').append(pharmacyRow);
                });
            },
            error: function (data) {
                $("#errorModal").find(".error-msg").text(fields.i18n.trans("Failed to get pharmacies, please contact support"));
                $("#errorModal").modal();
            }
        });

        if (deliveryType === fields.deliveryCodeDtcPickup) {
            $('.pharmacy_address').show();
            $('.home_address').hide();
        } else {
            $('.pharmacy_address').hide();
            $('.home_address').show();
        }
    });

    $('#is_call').click(function() {
        if (this.checked) {
            $(this).attr('checked', true).trigger('change');
        } else {
            $(this).attr('checked', false).trigger('change');
        }
    });

    $('#is_accepted').click(function() {
        if (this.checked) {
            $(this).attr('checked', true).trigger('change');
            fields.checkRequireFields();
        } else {
            $('#checkout_order').addClass('disabled');
            $(this).attr('checked', false).trigger('change');
        }
    });

    $('#checkout_order').click(function() {
        let hasError = false;
        if ($(this).hasClass('disabled')) {
            checkForms();
            if ($('.checkout_main_point_inpt').find('input').hasClass('error')) {
                hasError = true;
                return;
            }
        }

        if ( hasError ) {
            return;
        }

        $(this).addClass('disabled');

        let fio = $('#name_user').val().trim().split(' ');
        let phone = $('#phone').val();
        phone = phone.substring(0, 2) + phone.substring(4, 7) + phone.substring(9, 12) + phone.substring(phone.length - 4);
        let email = $('#email').val();
        let comment = $('#comment').val();
        let deliveryType = $('.delivery_list.active').data('code');

        let goodsList = [];
        let branchID = $('#pharmacies_list .checkout_main_point_adres-list_line.active').data('pharmacy');
        let pharmacyName = $('#pharmacies_list .checkout_main_point_adres-list_line.active').data('name');
        let pharmacyAddress = $('#pharmacies_list .checkout_main_point_adres-list_line.active').data('address');

        fields.goods.forEach(function(product) {
            let objProduct =  {
                'id': product.medicine_partner_id,
                'quantity': product.count > product.quantity ? product.quantity : product.count,
                'pharmacy_id': branchID,
                'price': product.price
            };

            goodsList.push(objProduct);
        });

        let isCall = $('#is_call').attr('checked') ? 0 : 1;
        let order = {
            'status_id':1,
            'integration_status':'new',
            'first_name': fio[0] ? fio[0] : '',
            'middle_name': fio[2] ? fio[2] : '',
            'last_name':  fio[1] ? fio[1] : '',
            'phone': phone,
            'email': email,
            'integration_id': 2,
            'pharmacy_affiliate_name': pharmacyName,
            'pharmacy_affiliate_address': pharmacyAddress,
            'branch_id': branchID,
            'cart_id': fields.cartID,
            'city_id': fields.cityID,
            'user_id':  parseInt(fields.userID ? fields.userID : 0),
            'comment': comment,
            'delivery_type_code': deliveryType,
            'delivery_price': parseFloat($('#delivery_price').text()),
            'paid': 0,
            'is_call': isCall,
            'total_price': parseFloat($('#total_price').text())
        };

        if (deliveryType === fields.codeLiki24) {

            let order = {
                'status_id':1,
                'integration_status':'new',
                'first_name': fio[1] ? fio[1] : '',
                'middle_name': fio[2] ? fio[2] : '',
                'last_name':  fio[0] ? fio[0] : '',
                'phone': phone,
                'email': email,
                'integration_id': 1,
                'cart_id': fields.cartID,
                'city_id': fields.cityID,
                'user_id':  parseInt(fields.userID ? fields.userID : 0),
                'comment': comment,
                'paid': 0,
                'is_call': isCall,
                'total_price': parseFloat($('#total_price').text())
            };

            let items = [];
            $('.checkout_item_line').each(function (elem) {
                let item = {
                    "productId": $( this ).data('medicine-id').toString(),
                    "price": $( this ).data('price'),
                    "quantity": $( this ).data('count')
                };

                items.push(item);
            });

            let deliveryWindow = {
                "start": $(".delivery-info.active").data('start'),
                "finish": $(".delivery-info.active").data('finish')
            };

            createOrderLiki24(order, deliveryWindow, items);
            return
        }

        if (deliveryType === fields.codeIPost) {
            let orderObj = orderClass.CreateOrderObjIPost();
            orderObj.delivery_type_code = $(".checkout_main_point_adres-list_line.only-head.active").data("code");

            $.ajax({
                type: 'POST',
                url: '/go/apteka/order/ipost/create',
                headers: {
                    "Lang": lang,
                },
                data: JSON.stringify(orderObj),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: (data) => {
                    $.cookie("order_id", data.order_id);
                    document.cookie = 'cart_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    $.cookie("cart_id", null, { path: '/' });
                    if ($('#card').hasClass('active')) {
                        $(location).attr('href', '/portmone/payment/' + data.order_id + '/2');
                    } else {
                        ga('send', 'event', 'Замовлення', 'Cтворення замовлення', 'Cтворення замовлення - Аптека');
                        $(location).attr('href', '/apteka/thankyou');
                    }
                },
                error: (data) => {
                    $(this).removeClass('disabled');
                    $("#errorModal").find(".error-msg").text(fields.i18n.trans("Failed to create order, please contact support"));
                    $("#errorModal").modal();
                }
            });


            return
        }
        if (deliveryType === fields.codeNovaPoshtaBranch || deliveryType === fields.codeNovaPoshtaCourier) {
            let orderObj = novaposhtaClass.CreateOrderObjNovaPoshta();
            orderObj.delivery_type_code = $('.delivery_list.active').data('code');

            $.ajax({
                type: 'POST',
                url: '/go/apteka/order/novaposhta/create',
                headers: {
                    "Lang": lang,
                },
                data: JSON.stringify(orderObj),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: (data) => {
                    $.cookie("order_id", data.order_id);
                    document.cookie = 'cart_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    $.cookie("cart_id", null, { path: '/' });
                    if ($('#card').hasClass('active')) {
                        $(location).attr('href', '/portmone/payment/' + data.order_id + '/2');
                    } else {
                        ga('send', 'event', 'Замовлення', 'Cтворення замовлення', 'Cтворення замовлення - Аптека');
                        $(location).attr('href', '/apteka/thankyou');
                    }
                },
                error: (data) => {
                    $(this).removeClass('disabled');
                    $("#errorModal").find(".error-msg").text(fields.i18n.trans("Failed to create order, please contact support"));
                    $("#errorModal").modal();
                }
            });


            return
        }

        order.items = goodsList;
        let api = "";
        let integrationID = parseInt($('.pharmacy_line.active').data('integration-id'));
        switch (integrationID) {
            case 2:
                api += "/dobrogodnya";
                break;
            case 3:
                api += "/vitamin";
                break;
            case 4:
                api += "/api911";
                break;
            case 5,6:
                api += "";
                break;
        }
        order.integration_id = integrationID;
        $.ajax({
            type: 'POST',
            url: '/go/apteka/order'+ api + '/create',
            headers: {
                "Lang": lang,
            },
            data: JSON.stringify(order),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: (data) => {
                $.cookie("order_id", data.order_id);
                document.cookie = 'cart_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                $.cookie("cart_id", null, { path: '/' });
                $(this).removeClass('disabled');

                if ($('#card').hasClass('active')) {
                    $(location).attr('href', '/portmone/payment/' + data.order_id + '/2');
                } else {
                    ga('send', 'event', 'Замовлення', 'Cтворення замовлення', 'Cтворення замовлення - Аптека');
                    $(location).attr('href', '/apteka/thankyou');
                }
            },
            error: (data) => {
                $(this).removeClass('disabled');
                $("#errorModal").find(".error-msg").text(fields.i18n.trans("Failed to create order, please contact support"));
                $("#errorModal").modal();
            }
        });
    });
});

function getPharmacyLinesFromAddress() {
    let street = $('#street input').val();
    let home = $('#home input').val();
    let flat = $('#flat input').val();
    let address = street + ' ' + home +  ', ' + $('#select2-city_select-container').text() + ', ' + fields.country;

    map.GetAddressCoordinate(address).then(function (data) {
        let pharmacyRequestJSON = {
            'partner_ids': fields.partnerIDs,
            'cart_id': fields.cartID,
            'coordinate': {
                'lat': data.lat,
                'lng': data.lng
            }
        };
        fields.latAddress = data.lat;
        fields.lngAddress = data.lng;
        if($(`.checkout_main_point_adres-list_line.delivery_list[data-code="${fields.codeIPost}"]`).hasClass('active')) {
            ipostClass.GetPharmacyLinesIPost(pharmacyRequestJSON).then(function (data) {
                $('#pharmacies_list').empty();
                pharmacyClass.SetPharmacyProduct(data);
            }).catch(function (err) {
                console.log(err);
            });
        }
    }).catch(function(err) {
        $("#errorModal").find(".error-msg").text(fields.i18n.trans("Failed to get pharmacies, please contact support"));
        $("#errorModal").modal();
    });
}


function deleteProduct(medicineID, element) {
    let removeFromCart = {
        'cart_id':  fields.cartID,
        'medicine_id': parseInt(medicineID),
        'user_id':  parseInt(fields.userID ? fields.userID : 0)
    };

    return new Promise(function(resolve, reject) {
        $.ajax({
            url: '/go/apteka/cart/delete',
            data: JSON.stringify(removeFromCart),
            headers: {
                "Lang": lang,
            },
            method: 'DELETE',
            success: function() {
                analytics("removeFromBasket", {
                    name: element.find('.checkout_side_name').text(),
                    id: removeFromCart.medicine_id,
                    price: element.data('price'),
                    quantity: element.data('count'),
                })
                if (element) {
                    element.remove();
                }
                $('#total_price').text(0);
                cartClass.RefreshCart();
                deliveryClass.RefreshTotalPriceBeforeRemove();
                resolve();
                // return data.results[0].geometry.location
            },
            error: function () {
                reject();
            }
        });
    });
    // $.ajax({
    //     url: '/go/apteka/cart/delete',
    //     data: JSON.stringify(removeFromCart),
    //     method: 'DELETE',
    //     success: function() {
    //         if (element) {
    //             element.remove();
    //         }
    //         $('#total_price').text(0);
    //         refreshCart();
    //         // refreshPharmacies(parseInt(medicineID));
    //     }
    // });
}

function getDeliveries() {
    $.ajax({
        url: '/go/apteka/checkout/all/delivery',
        headers: {
            "Lang": lang,
        },
        method: 'GET',
        success: function(data) {
            data.delivery_list.forEach(function(delivery) {
                $('#delivery_type').append('<option data-code='+ delivery.code + ' value=' +  delivery.name + '></option>');
            });
        }
    });
}


function clearOldDeliveryBlockIPost() {

    $('.checkout_main_point_adres-list_line.only-head[data-code=DELIVERY_TYPE_FAST30]').remove();
    $('.checkout_main_point_adres-list_line.only-head[data-code=DELIVERY_TYPE_FAST60]').remove();
    $('.checkout_main_point_adres-list_line.only-head[data-code=DELIVERY_TYPE_FAST90]').remove();
    $('.checkout_main_point_adres-list_line.only-head[data-code=DELIVERY_TYPE_FAST120]').remove();

}

function updateDeliveryBloksIPost() {
    let orderObj =  orderClass.CreateOrderObjIPost();
    orderObj.order.phone =  "380950000000"
    $.ajax({
        url: '/go/apteka/order/ipost/price',
        headers: {
            "Lang": lang,
        },
        method: 'POST',
        data: JSON.stringify(orderObj),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            let deliveryIPostBlock = "";
            let bestOfferIsSet = {
                "time": 999,
                "isSet": false
            };
            pharmacyClass.ClearOldDeliveryBlockIPost();

            let deliveryIsSet = false;
            let bestDelivery = {};
            Object.keys(data.delivery_price_list).forEach(function(idx, i) {
                let el = data.delivery_price_list[idx];

                if (el.hasOwnProperty("message")) {
                    if (el.message != "") {
                        return
                    }
                }

                let pharmacyDistance = parseInt($(".pharmacy_line.active").find(".pharmacy_distance").text());

                switch (idx) {
                    case "DELIVERY_TYPE_FAST60":
                        if (pharmacyDistance > 5000) {
                            break;
                        }

                        if (bestOfferIsSet.time > 60) {
                            bestOfferIsSet.time = 60;
                            bestDelivery = el
                            bestDelivery.title = "Доставка до 60 " + fields.i18n.trans('min')
                            bestDelivery.id = idx
                        }
                        break;
                    case "DELIVERY_TYPE_FAST90":

                        if (pharmacyDistance > 15000 || deliveryIsSet) {
                            break;
                        }

                        if (bestOfferIsSet.time > 120) {
                            bestOfferIsSet.time = 120;
                            bestDelivery = el
                            bestDelivery.title = "Доставка до 120" + fields.i18n.trans('min')
                            bestDelivery.id = idx
                        }

                        // if (bestOfferIsSet.time != 30 && bestOfferIsSet.time != 60) {
                        //     bestOfferIsSet.isSet = true;
                        // }

                        // deliveryIPostBlock += pharmacyClass.AddDeliveryBlockIPost(el.price, "Доставка до 120 мин",  bestOfferIsSet.isSet, "DELIVERY_TYPE_FAST90");
                        // bestOfferIsSet.isSet = false;
                        // deliveryIsSet = true;
                        break;
                    case "DELIVERY_TYPE_FAST120":
                        if (pharmacyDistance > 30000 || deliveryIsSet) {
                            break;
                        }
                        if (bestOfferIsSet.time > 180) {
                            bestOfferIsSet.time = 180;
                            bestDelivery = el
                            bestDelivery.title = "Доставка до 180 " + fields.i18n.trans('min')
                            bestDelivery.id = idx
                        }

                        // deliveryIPostBlock += pharmacyClass.AddDeliveryBlockIPost(el.price, "Доставка до 180 мин", false, "DELIVERY_TYPE_FAST120");
                        break;
                }
            });

            if (bestDelivery.title === undefined || bestDelivery.price === undefined || bestDelivery.id == undefined) {
                return;
            }
            deliveryIPostBlock += pharmacyClass.AddDeliveryBlockIPost(bestDelivery.price, bestDelivery.title, true, bestDelivery.id);
            // if ($(".pharmacy_line").hasClass("valid_phone")) {
            $('.checkout_main_point_delivery_time').show();
            // }
            // $('.checkout_main_point_delivery_time').show();
            $('#ipost_delivery-block').on("click", ".checkout_main_point_adres-list_line", function () {
                $("#ipost_delivery-block .checkout_main_point_adres-list_line").removeClass("active");
                $(this).addClass("active");
                deliveryClass.RefreshTotalPrice();
            });

            $('#ipost_delivery-block').prepend(deliveryIPostBlock);
        }
    });
}

function createTwoDigitNumber(number) {
    number = parseInt(number);
    if (number >= 0 && number < 10) {
        return "0" + number;
    }

    return number;
}
/*********************                  Delivery                  *********************/

function getDeliveryWindow(windowDelivery, minPrice) {
    let start = new Date(windowDelivery.start);
    let finish = new Date(windowDelivery.finish);

    if (start.getMinutes() != 0) {
        return
    }
    let fieldWindow = `<div class="checkout_main_point_adres-list_line delivery-info" data-start="`+ windowDelivery.start + `" data-finish="`+ windowDelivery.finish + `" data-price="`+windowDelivery.price + `">
    <div class="checkout_main_point_adres-list_line_head">`;

    if (minPrice == windowDelivery.price) {
        fieldWindow += ` <div class="checkout_main_point_adres-list_line_head_marker  h5">
        <div class="checkout_main_point_adres-list_line_head_marker_text">${fields.i18n.trans('best deal')}</div>
        <div class="checkout_main_point_adres-list_line_head_marker_logo">%</div>
    </div>`;
    }

    fieldWindow += `
            <div class="checkout_main_point_adres-list_line_head_time">` + start.getHours() + `:` + createTwoDigitNumber(start.getMinutes()) + ` - ` + finish.getHours() + `:` + (finish.getMinutes() == 0 ? '00' : finish.getMinutes()) + ` </div>
            <div class="checkout_main_point_adres-list_line_head_price"> <span class="delivery_price" data-price="` + windowDelivery.price + `">` + windowDelivery.price + `</span>` + ` грн</div>
            <div class="checkout_main_point_adres-list_radio"></div>
        </div>
    </div>`;

    return fieldWindow
}

/*********************                  LIKI24                  *********************/

function createOrderLiki24(order, deliveryWindow, items) {
    let orderLines = {
        "order": order,
        "delivery_address": {
            "address": $('#street').find('input').val(),
            "home": $('#home').find('input').val(),
            "flat": $('#flat').find('input').val()
        },
        "deliveryPricePaidByCustomer": parseFloat($('.delivery-info.active').data('price')),
        "deliveryWindow": deliveryWindow,
        "items": items
    };

    $.ajax({
        url: '/go/apteka/order/liki24/create',
        headers: {
            "Lang": lang,
        },
        method: 'POST',
        data: JSON.stringify(orderLines),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            document.cookie = 'cart_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            $.cookie("cart_id", null, { path: '/' });

            if ($('#card').hasClass('active')) {
                $(location).attr('href', '/portmone/payment/' + data.order_id + '/2');
            } else {
                $(location).attr('href', '/apteka/thankyou');
            }
        },
        error: function (data) {
        }
    });
}

function refereshCartForLiki24() {
    $('.checkout_main_delivery_address').show();
    $('.checkout_main_point_delivery_list').show();
    $('.checkout_main_point.delivery').find('.checkout_main_point_adres-list.fade-in').remove();
    $('#liki_deliver_type').empty();
    // $('#pharmacies_block').hide();
    $('.checkout_main_point_pharmacies_lines').hide();
    $('.checkout_list-of-pharmacy').hide();

    $('#checkout_order').addClass('disabled');
    $('.delivery_pay_numb').text('5');
    $('.delivery_order_numb').text('6');

    let total_price = 0;
    $('.checkout_item_line').remove();
    liki24Products.forEach(function(product) {
        if (product.price > 0 && product.count > 0) {
            let price = product.count > product.estimatedStock ? product.price * product.estimatedStock : product.price * product.count;
            let count = product.count > product.estimatedStock ? product.estimatedStock : product.count;
            $('#order_title').after(`
            <div class='checkout_side_line ord checkout_item_line' data-medicine-id="` + product.medicine_id + `" data-count="` + product.count + `" data-price="` + product.price + `">
                <div class='checkout_side_name'>` + product.name_ru + `</div>
                <div class='checkout_side_col'>` + count + ` шт </div>
                
                <div class='checkout_side_price'>` + parseFloat(price).toFixed(2) + ` грн</div>
                <div class="checkout_side_remove"> <span class="icon-close"></span> </div>

            </div>
        `);
            total_price += price
        }
    });
    $('.checkout_price_without_discount').text(total_price ? parseFloat(total_price).toFixed(2) : 0.00);
    $('#total_price').text(total_price ? parseFloat(total_price).toFixed(2) : 0.00);

    uploadLiki24Delivery(liki24Token);
}


function uploadLiki24Delivery(tokenAuth) {
    $('.checkout_main_point_delivery_list').show();
    let token = {
        'token_auth': tokenAuth
    };
    $.ajax({
        url: '/go/apteka/integration/getDeliveryWindows/1',
        headers: {
            "Lang": lang,
        },
        data: JSON.stringify(token),
        method: 'POST',
        success: function (data) {
            let listOfDeliveries = [];
            let minPrice = 99;
            let isExistToday = false;
            data.forEach(function (deliveryWindow) {

                let minutes = new Date(Date.parse(deliveryWindow.start)).getMinutes();

                if (deliveryWindow.price < minPrice) {
                    minPrice = deliveryWindow.price
                }

                if (listOfDeliveries[deliveryWindow.day_pointer] == undefined) {
                    listOfDeliveries[deliveryWindow.day_pointer] = [];
                }
                listOfDeliveries[deliveryWindow.day_pointer].push(getDeliveryWindow(deliveryWindow));
                if ($('#liki_deliver_type div').is('[data-type="'+ deliveryWindow.day_pointer + '"]')) {
                } else if (deliveryWindow.day_pointer === 'urgently') {
                    $('#liki_deliver_type').append(`<div class="delivery_item" data-type="`+ deliveryWindow.day_pointer + `"> <span class="icon-fire"></span> ` +  deliveryWindow.title  + `</div>`);
                    $('#liki_deliver_type').after(`<div class="checkout_main_point_adres-list fade-in" data-delivery-type="` + deliveryWindow.day_pointer  + `">`);
                } else if (deliveryWindow.day_pointer === 'today') {
                    $('#liki_deliver_type').append(`<div class="delivery_item" data-type="`+ deliveryWindow.day_pointer + `">` +  deliveryWindow.title  + `</div>`);
                    $('#liki_deliver_type').after(`<div class="checkout_main_point_adres-list fade-in active"  data-delivery-type="` + deliveryWindow.day_pointer  + `">`);
                    $('.checkout_main_point_adres-list[data-delivery-type="' + deliveryWindow.day_pointer  + '"]').fadeIn();
                    $('#liki_deliver_type').find('div[data-type="' + deliveryWindow.day_pointer  + '"]').addClass('active');
                    isExistToday = true;
                } else if (deliveryWindow.day_pointer === 'tommorow') {
                    $('#liki_deliver_type').append(`<div class="delivery_item" data-type="`+ deliveryWindow.day_pointer + `">` +  deliveryWindow.title  + `</div>`);
                    $('#liki_deliver_type').after(`<div class="checkout_main_point_adres-list fade-in"  data-delivery-type="` + deliveryWindow.day_pointer  + `">`);
                    $('.checkout_main_point_adres-list[data-delivery-type="' + deliveryWindow.day_pointer  + '"]').fadeOut();
                } else {
                    $('#liki_deliver_type').append(`<div class="delivery_item" data-type="`+ deliveryWindow.day_pointer + `">` +  deliveryWindow.title  + `</div>`);
                    $('#liki_deliver_type').after(`<div class="checkout_main_point_adres-list fade-in"  data-delivery-type="` + deliveryWindow.day_pointer  + `">`);
                    $('.checkout_main_point_adres-list[data-delivery-type="' + deliveryWindow.day_pointer  + '"]').fadeOut();
                }
            });

            if (!isExistToday) {
                $('.checkout_main_point_adres-list[data-delivery-type="urgently"]').fadeIn();
                $('#liki_deliver_type').find('div[data-type="urgently"]').addClass('active');
            }

            data.forEach(function (deliveryWindow) {
                $('.checkout_main_point_adres-list[data-delivery-type="' + deliveryWindow.day_pointer + '"]').append(getDeliveryWindow(deliveryWindow, minPrice));
            });

            $('#liki_deliver_type').off('click').on('click', 'div.delivery_item', function () {
                $('#liki_deliver_type').find('div').removeClass('active');
                $(this).addClass('active');

                let deliveryType = $(this).data('type');
                $('.checkout_main_point.delivery').find('.checkout_main_point_adres-list').fadeOut(0);
                $('.checkout_main_point.delivery').find('.checkout_main_point_adres-list[data-delivery-type="'+ deliveryType +'"]').fadeIn();
            });

            $('.checkout_main_point_adres-list_line.delivery-info').off('click').on('click', function () {
                let totalPrice = parseFloat($('#total_price').text());

                if ($('.checkout_main_point_adres-list.fade-in').find('.checkout_main_point_adres-list_line').hasClass('active')) {
                    let deliveryPrice = parseFloat($('.checkout_main_point_adres-list_line.active').find('.delivery_price').text());
                    totalPrice = totalPrice - deliveryPrice;
                    $('.checkout_main_point_adres-list.fade-in').find('.checkout_main_point_adres-list_line').removeClass('active');
                }

                $(this).addClass('active');
                totalPrice += parseFloat($('.checkout_main_point_adres-list_line.active').find('.delivery_price').text());

                $('#total_price').text(totalPrice);
            });
        },
        error: function (data) {
            console.log(data);
        }
    });
}


/*********************                  FORM FIELDS                  *********************/
function initEventFields() {
    let name = $('#name_user').val().trim();
    let phone = $('#phone').val();

    if (name != undefined && name != '' && (name.match(/^[\'ЩЬЮЯҐЄІЇа-щьюяґєіїа-яА-Яa-zA-Z-\s]{3,}$/g) || []).length == 1) {
        $('#name_user').parent().removeClass('require');
    }

    if (phone != '' && (phone.match(/^([+]?[0-9\s-\(\)]{13,19})*$/g) || []).length == 1) {
        $('#phone').parent().removeClass('require');
    }
    fields.checkRequireFields();

    $('#name_user').on('keyup change', function() {
        let name = $(this).val();

        if (name == '' || (name.match(/^[\'ЩЬЮЯҐЄІЇа-щьюяґєіїа-яА-Яa-zA-Z-\s]{3,}$/g) || []).length !== 1) {
            $(this).parent().addClass('require')
        } else {
            $(this).removeClass('error');
            $(this).parent().removeClass('require');
        }

        fields.checkRequireFields();
    });

    $('#street input').on('keyup change', function() {
        let street = $(this).val();
        if (street == '' || (street.match(/^[\'ЩЬЮЯҐЄІЇщьюяґєіїа-яА-Яa-zA-Z0-9-\.\-\.,\s]{3,}$/g) || []).length !== 1) {
            $(this).parent().addClass('require')
        } else {
            $(this).removeClass('error');
            $(this).parent().removeClass('require')
        }

        fields.checkRequireFields();
        checkAddressFieldsIPost();
    });

    $('#branch_number input').on('keyup change', function() {
        let branchNumber = $(this).val();
        if (branchNumber == '' || (branchNumber.match(/^[\'ЩЬЮЯҐЄІЇщьюяґєіїа-яА-Яa-zA-Z0-9-\.\-\.,\s]{1,}$/g) || []).length !== 1) {
            $(this).parent().addClass('require')
        } else {
            $(this).removeClass('error');
            $(this).parent().removeClass('require')
        }

        fields.checkRequireFields();
    });

    $('#novaposhta_city input').on('keyup change', function() {
        let branchNumber = $(this).val();
        if (branchNumber == '' || (branchNumber.match(/^[\'ЩЬЮЯҐЄІЇщьюяґєіїа-яА-Яa-zA-Z-\-\s]{2,}$/g) || []).length !== 1) {
            $(this).parent().addClass('require')
        } else {
            $(this).removeClass('error');
            $(this).parent().removeClass('require')
        }

        fields.checkRequireFields();
    });

    $('#home input').on('keyup change', function() {
        let home = $(this).val();
        if (home == '' || (home.match(/^[\'ЩЬЮЯҐЄІЇа-щьюяґєіїа-яА-Яa-zA-Z0-\\/\-\.,\s]{1,5}$/g) || []).length !== 1) {
            $(this).parent().addClass('require')
        } else {
            $(this).removeClass('error');
            $(this).parent().removeClass('require')
        }

        fields.checkRequireFields();
        checkAddressFieldsIPost();
    });

    $('#flat input').on('keyup change', function() {
        let flat = $(this).val();
        if (flat == '' || (flat.match(/^[\'ЩЬЮЯҐЄІЇа-щьюяґєіїа-яА-Яa-zA-Z0-9\/\-\.,\s]{1,5}$/g) || []).length !== 1) {
            $(this).parent().addClass('require')
        } else {
            $(this).removeClass('error');
            $(this).parent().removeClass('require')
        }

        fields.checkRequireFields();
        checkAddressFieldsIPost();
    });


    $('#phone').bind("keyup change", function() {
        let phone = $(this).val();

        if (phone == '' || (phone.match(/^([+]?[0-9\s-\(\)]{13,18})*$/g) || []).length !== 1) {
            $(this).parent().addClass('require')
            $('.checkout_main_point_delivery_time').hide();
        } else {
            $(this).removeClass('error');
            $(this).parent().removeClass('require');
        }

        if ($(".pharmacy_line").hasClass("active") && $('.delivery_list.active').data('code') == fields.codeIPost) {
            $('.checkout_main_point_delivery_time').show();
            updateDeliveryBloksIPost();
        }

        if (!$('#name_user').parent().hasClass('require') && !$('#phone').parent().hasClass('require')) {
            $('#checkout_order').removeClass('disabled');
        } else {
            $('#checkout_order').addClass('disabled');
        }

        fields.checkRequireFields();
        // if ($('#name_user').parent().hasClass('require') || $('#phone').parent().hasClass('require'))
    });
}

// function checkRequireFields() {

//     if ($('#delivery_fields').find('.delivery_list.active').length <= 0) {
//         $('#checkout_order').addClass('disabled');
//         return
//     }

//     if ($('#pharmacies_list').find('.pharmacy_line.active').length <= 0) {
//         $('#checkout_order').addClass('disabled');
//         return
//     }

//     if (!$('#name_user').parent().hasClass('require') && !$('#phone').parent().hasClass('require') && $('#is_accepted').attr('checked')) {

//         if ( $('.delivery_list.active').data('code') == fields.codeLiki24) {
//             if (!$('.checkout_main_delivery_address').find('.checkout_main_point_inpt').hasClass('require')) {
//                 $('#checkout_order').removeClass('disabled');
//             } else {
//                 $('#checkout_order').addClass('disabled');
//             }
//         } else {
//             $('#checkout_order').removeClass('disabled');
//         }

//     } else {
//         $('#checkout_order').addClass('disabled');
//     }
// }

function checkAddressFieldsIPost() {
    if ( $('.delivery_list.active').data('code') == fields.codeIPost) {
        if (!$('.checkout_main_delivery_address').find('.checkout_main_point_inpt').hasClass('require')) {
            getPharmacyLinesFromAddress();
        }
    }
}

function checkForms() {
    if ($('#name_user').parent().hasClass("require")) {
        $('#name_user').addClass('error')
    }

    if ($('#phone').parent().hasClass("require")) {
        $('#phone').addClass('error')
    }

    if ($('.delivery_list.active').data('code') == fields.codeLiki24) {
        if ($('#street').parent().hasClass("require")) {
            $('#street').addClass('error')
        }
        if ($('#home').parent().hasClass("require")) {
            $('#home').addClass('error')
        }
        if ($('#flat').parent().hasClass("require")) {
            $('#flat').addClass('error')
        }
    }
}

function initDeliveryTimeIPost() {
    $('#from-hour').empty().trigger("change");
    $('#to-hour').empty().trigger("change");

    let today = new Date();
    let hourToday = -2
    let dayOfMonth = $.datepicker.formatDate('dd', $("#datepicker").datepicker( 'getDate' ));

    if (dayOfMonth == today.getDate()) {
        hourToday = today.getHours();
    }

    for (let i  = hourToday+2; i < 24; i++) {
        if (i < 10) {
            $("#from-hour").append(`<option value="${i}">0${i}</option>`);
        } else {
            $("#from-hour").append(`<option value="${i}">${i}</option>`);
        }
    }

    for (let i  = hourToday+3; i < 24; i++) {
        if (i < 10) {
            $("#to-hour").append(`<option value="${i}">0${i}</option>`);
        } else {
            $("#to-hour").append(`<option value="${i}">${i}</option>`);
        }
    }

    $("#from-hour").trigger('change');
    $("#to-hour").trigger('change');
}