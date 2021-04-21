/* global Frames */
var payButton = document.getElementById("pay-button");
var form = document.getElementById("payment-form");


//var ApprovePayment = document.getElementById("ApprovePayment");
//var RefundPayment = document.getElementById("RefundPayment");
//var CardDetails = document.getElementById("CardDetails");
//var VoidPayment = document.getElementById("VoidPayment");

var PaymentResult = "";

Frames.init("pk_test_50e39b18-d8c6-4e97-8d45-97c4f25449da");

var logos = generateLogos();
function generateLogos() {
    var logos = {};
    logos["card-number"] = {
        src: "card",
        alt: "card number logo",
    };
    logos["expiry-date"] = {
        src: "exp-date",
        alt: "expiry date logo",
    };
    logos["cvv"] = {
        src: "cvv",
        alt: "cvv logo",
    };
    return logos;
}

var errors = {};
errors["card-number"] = "Please enter a valid card number";
errors["expiry-date"] = "Please enter a valid expiry date";
errors["cvv"] = "Please enter a valid cvv code";

Frames.addEventHandler(
    Frames.Events.FRAME_VALIDATION_CHANGED,
    onValidationChanged
);
function onValidationChanged(event) {
    var e = event.element;

    if (event.isValid || event.isEmpty) {
        if (e === "card-number" && !event.isEmpty) {
            showPaymentMethodIcon();
        }
        setDefaultIcon(e);
        clearErrorIcon(e);
        clearErrorMessage(e);
    } else {
        if (e === "card-number") {
            clearPaymentMethodIcon();
        }
        setDefaultErrorIcon(e);
        setErrorIcon(e);
        setErrorMessage(e);
    }
}

function clearErrorMessage(el) {
    var selector = ".error-message__" + el;
    var message = document.querySelector(selector);
    message.textContent = "";
}

function clearErrorIcon(el) {
    var logo = document.getElementById("icon-" + el + "-error");
    logo.style.removeProperty("display");
}

function showPaymentMethodIcon(parent, pm) {
    if (parent) parent.classList.add("show");

    var logo = document.getElementById("logo-payment-method");
    if (pm) {
        var name = pm.toLowerCase();
        logo.setAttribute("src", "./././images/payment/card-icons/" + name + ".svg");
        logo.setAttribute("alt", pm || "payment method");
    }
    logo.style.removeProperty("display");
}

function clearPaymentMethodIcon(parent) {
    if (parent) parent.classList.remove("show");

    var logo = document.getElementById("logo-payment-method");
    logo.style.setProperty("display", "none");
}

function setErrorMessage(el) {
    var selector = ".error-message__" + el;
    var message = document.querySelector(selector);
    message.textContent = errors[el];
}

function setDefaultIcon(el) {
    var selector = "icon-" + el;
    var logo = document.getElementById(selector);
    logo.setAttribute("src", "./././images/payment/card-icons/" + logos[el].src + ".svg");
    logo.setAttribute("alt", logos[el].alt);
}

function setDefaultErrorIcon(el) {
    var selector = "icon-" + el;
    var logo = document.getElementById(selector);
    logo.setAttribute("src", "./././images/payment/card-icons/" + logos[el].src + "-error.svg");
    logo.setAttribute("alt", logos[el].alt);
}

function setErrorIcon(el) {
    var logo = document.getElementById("icon-" + el + "-error");
    logo.style.setProperty("display", "block");
}

Frames.addEventHandler(
    Frames.Events.CARD_VALIDATION_CHANGED,
    cardValidationChanged
);
function cardValidationChanged() {
    payButton.disabled = !Frames.isCardValid();
}

Frames.addEventHandler(
    Frames.Events.CARD_TOKENIZATION_FAILED,
    onCardTokenizationFailed
);
function onCardTokenizationFailed(error) {
    console.log("CARD_TOKENIZATION_FAILED: %o", error);
    Frames.enableSubmitForm();
}

Frames.addEventHandler(Frames.Events.CARD_TOKENIZED, onCardTokenized);
function onCardTokenized(event) {
    var el = document.querySelector("#SuccessAuthMsg");
    PaymentObject.Token = event.token;
    console.log(event)
    //el.innerHTML =
    //    "Card tokenization completed<br>" +
    //    'Your card token is: <span class="token">' +
    //    event.token +
    //    "</span>";
    renderReviewTab("Card");
}

Frames.addEventHandler(
    Frames.Events.PAYMENT_METHOD_CHANGED,
    paymentMethodChanged
);
function paymentMethodChanged(event) {
    var pm = event.paymentMethod;
    let container = document.querySelector(".icon-container.payment-method");

    if (!pm) {
        clearPaymentMethodIcon(container);
    } else {
        clearErrorIcon("card-number");
        showPaymentMethodIcon(container, pm);
    }
}

form.addEventListener("submit", onSubmit);
function onSubmit(event) {
    event.preventDefault();
    Frames.submitCard();
}


//request example
//    {
//        "source": {
//            "type": "token",
//            "token": "tok_4gzeau5o2uqubbk6fufs3m7p54"
//        },
//        "customer": {
//            "email": "jokershere@gmail.com",
//            "name": "Jack Napier"
//            },
//        "amount": 6500,
//        "currency": "USD",
//        "reference": "ORD-5023-4E89",
//        "metadata": {
//            "udf1": "TEST123",
//            "coupon_code": "NY2018",
//            "partner_id": 123989
//        }
//    }
    
////response example
//{
//    ApiResponseModel: [{
//        "id": "pay_bjilmmlyr3xehpfkwco2riilqu",
//        "action_id": "act_bjilmmlyr3xehpfkwco2riilqu",
//        "amount": 2500,
//        "currency": "USD",
//        "approved": true,
//        "status": "Authorized",
//        "auth_code": "569107",
//        "eci": "05",
//        "scheme_id": "784665169266016",
//        "response_code": "10000",
//        "response_summary": "Approved",
//        "risk": { "flagged": false },
//        "source": { "id": "src_vakdjhuzs5wutmsyxxomo4dcv4", "type": "card", "expiry_month": 12, "expiry_year": 2021, "scheme": "Mastercard", "last4": "6378", "fingerprint": "BC5F4D1A2E317D1508E4F1804199061EA4F3036B3B9907C1FFFC4686AFA237A6", "bin": "543603", "card_type": "Credit", "card_category": "Consumer", "issuer": "STATE BANK OF MAURITIUS, LTD.", "issuer_country": "MU", "product_id": "MCC", "product_type": "MasterCard® Credit Card (mixed BIN)", "avs_check": "S", "cvv_check": "Y" },
//        "customer": { "id": "cus_vyvk32yhn3sudak4ktoc3x6zze", "email": "nabihzanaty@gmail.com", "name": "Nabih Zanaty" },
//        "processed_on": "2021-01-24T20:30:39Z",
//        "reference": "ORD-0001",
//        "processing": { "acquirer_transaction_id": "1470969125", "retrieval_reference_number": "488972176748" },
//        "_links": {
//            "self": { "href": "" },
//            "actions": { "href": "" },
//            "capture": { "href": "" },
//            "void": { "href": "" }
//        }
//    }]
//}
//ApprovePayment.addEventListener("click", function () {
//    $.ajax({
//        url: window.location.origin.concat('/Payment/ApiRequestPayment'),
//        type: 'post',
//        dataType: 'json',
//        data: { TokenString: token, Amount: 20},
//        success: function (result) {
//            if (result == 1) alert("yes"); else alert("no");
//            //let MsgContainer = document.querySelector("#SuccessPaymtMsg");
//            //PaymentResult = result;
//            //MsgContainer.innerHTML = PaymentResult.response_code;
//        },
//        error: function () {
//            alert('error');
//        }
//    });
//})

/*result example

{ "action_id": "act_bfxs7zo7gzzetl5dhjky3lzd4q",
"reference": "REFUND-0001",
"_links": { "payment": { "href": "https://api.sandbox.checkout.com/payments/pay_5tbkszgjcoqubfbg346ag5bcya" } }
}

//RefundPayment.addEventListener("click", function () {
//    $.ajax({
//        url: window.location.origin.concat('/Payment/ApiRefundPayment'),
//        type: 'post',
//        dataType: 'json',
//        data: { PaymentId: PaymentResult.id, Amount: 20},
//        success: function (result) {
//            let MsgContainer = document.querySelector("#SuccessRefundMsg");
//            MsgContainer.innerHTML = result.action_id;
//        },
//        error: function () {
//            alert('error');
//        }
//    });
//})
/*result example
{"id":"pay_myt64vzjr6ielel7wgbtqsprci","action_id":"act_myt64vzjr6ielel7wgbtqsprci","amount":2000,"currency":"USD","approved":true,"status":"Authorized","auth_code":"653447","eci":"05","scheme_id":"297794347105370","response_code":"10000","response_summary":"Approved","risk":{"flagged":false},"source":{"id":"src_vakdjhuzs5wutmsyxxomo4dcv4","type":"card","expiry_month":12,"expiry_year":2021,"scheme":"Mastercard","last4":"6378","fingerprint":"BC5F4D1A2E317D1508E4F1804199061EA4F3036B3B9907C1FFFC4686AFA237A6","bin":"543603","card_type":"Credit","card_category":"Consumer","issuer":"STATE BANK OF MAURITIUS, LTD.","issuer_country":"MU","product_id":"MCC","product_type":"MasterCard® Credit Card (mixed BIN)","avs_check":"S","cvv_check":"Y"},"customer":{"id":"cus_vyvk32yhn3sudak4ktoc3x6zze","email":"nabihzanaty@gmail.com","name":"Nabih Zanaty"},"processed_on":"2021-01-24T21:13:46Z","reference":"CARDDETAILS-0001","processing":{"acquirer_transaction_id":"6953472104","retrieval_reference_number":"048128163343"},"_links":{"self":{"href":"https://api.sandbox.checkout.com/payments/pay_myt64vzjr6ielel7wgbtqsprci"},"actions":{"href":"https://api.sandbox.checkout.com/payments/pay_myt64vzjr6ielel7wgbtqsprci/actions"},"capture":{"href":"https://api.sandbox.checkout.com/payments/pay_myt64vzjr6ielel7wgbtqsprci/captures"},"void":{"href":"https://api.sandbox.checkout.com/payments/pay_myt64vzjr6ielel7wgbtqsprci/voids"}}}
*/
//CardDetails.addEventListener("click", function () {
//    $.ajax({
//        url: window.location.origin.concat('/Payment/ApiCardDetails'),
//        type: 'post',
//        dataType: 'json',
//        data: { SourceId: PaymentResult.source.id, Amount: 2},
//        success: function (result) {
//            let MsgContainer = document.querySelector("#SuccessCarddetailsMsg");
//            MsgContainer.innerHTML = result.id;
//        },
//        error: function () {
//            alert('error');
//        }
//    });
//})
/*result example
{"action_id":"act_sijy5j73y2su5jthclhctx5khe","reference":"VOID-0001","_links":{"payment":{"href":"https://api.sandbox.checkout.com/payments/pay_kfxmyovwcptelo7gshddbmq4em"}}}
*/
//VoidPayment.addEventListener("click", function () {
//    $.ajax({
//        url: window.location.origin.concat('/Payment/ApiVoidPayment'),
//        type: 'post',
//        dataType: 'json',
//        data: { PaymentId: PaymentResult.id},
//        success: function (result) {
//            let MsgContainer = document.querySelector("#SuccessVoidPayment");
//            MsgContainer.innerHTML = result.action_id;
//        },
//        error: function () {
//            alert('error');
//        }
//    });
//})