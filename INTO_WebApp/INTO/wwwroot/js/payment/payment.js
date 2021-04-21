//var paymentMethods = ['Cash', 'Card', 'MTransfer', 'Paypal'];
var PymtMthd = '';
var ShowLastOpr = document.querySelector("#ShowLastOpr");
//PaymentObject.CancelationDate.setHours(PaymentObject.CancelationDate.getHours() + PaymentObject.CancelationPeriod);
//document.getElementById("CancelDate").innerHTML = PaymentObject.CancelationDate.toUTCString();// Default Tab
var list = document.querySelectorAll('.pymt-progressBar li');
document.getElementById("defaultOpen").click();


getTranslatedText(PageKey);
//close Payment Modal
var span = document.getElementsByClassName("PymtClose")[0];
span.onclick = function () {
    PaymentModal.style.display = "none";
    location.reload();
}
var pymtCashTab = document.getElementById("pymtCashTab");
//if (PaymentObject.Service != "F2F") pymtCashTab.style.display = "none";

if (PaymentObject.HasBlInfo != 'False') {
    document.querySelector(".card-details").style.cssText = "display: block; flex: 0.5";
    document.querySelector("#pymtCard").style.cssText = " grid-template-columns: 1fr 1fr;";
    document.querySelector(".card-form ").style.cssText = "flex: 0.5";
}

// Step1: Choose Tab Content -> Open Method Details
function openMethod(evt, methodName, isActive) {
    var i, tabcontent, tablinks;
    if (isActive) list[1].classList.add('active');
    if (methodName != "pymtLoader") list[2].classList.add('active');
    if (methodName != "pymtComplete") list[2].classList.remove('active');
    tabcontent = document.getElementsByClassName("pymt-tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("pymt-tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(methodName).style.display = "grid";
    evt.currentTarget.className += " active";
}

// Step2: Choose Method
function renderReviewTab(method) {
    document.getElementById("pymtReviewTab").click();
    list[2].classList.add('active');

    let DetailsList = document.querySelectorAll('#pymtReview li');

    PaymentObject.Method = method;
    DetailsList[1].innerHTML = PaymentObject.Method;
    DetailsList[3].innerHTML = PaymentObject.Amount;
    //DetailsList[5].innerHTML = PaymentObject.CancelationDate.toUTCString();

    PymtMthd = method;
    if (method == "Cash") list[1].classList.add('active');
}

// Step3: Approve and complete Payment Process
function complete() {
    document.getElementById("pymtLoaderTap").click();
    let _URL = '';
    switch (PymtMthd) {
        case 'Card':
            _URL = window.location.origin.concat('/Payment/ApiRequestPayment'); 
            break;
        case 'Cash':
            _URL = window.location.origin.concat('/Payment/CashPayment'); 
            break;
        case 'MTransfer':
            _URL = window.location.origin.concat('/Payment/MTransferPayment'); 
            break;
        case 'CardDetails':
            _URL = window.location.origin.concat('/Payment/ApiCardDetails'); 
            break;
    }
    $.ajax({
        url: _URL,
        type: 'post',
        data: { json: JSON.stringify(PaymentObject) },
        success: function (result) {
            if (parseInt(result) >0) {
                PaymentObject.Opr = parseInt(result);
                if (PymtMthd == 'Card' || PymtMthd == 'CardDetails') {
                    printInvoice = document.getElementById("printInvoice");
                    printInvoice.style.display = "block";
                    printInvoice.setAttribute("data-opr", "block");
                }
                document.getElementById("pymtCompleteTab").click();
                list[3].classList.add('active');
                document.getElementById('pymt-tabs').style.display = "none";
                document.getElementById('pymt-tabs-subtitle').style.display = "none";
                document.getElementById('pymt-details-title').style.display = "none";
                document.getElementsByClassName('pymt-summary')[0].style.display = "none";
                document.getElementsByClassName('pymt-Method-details')[0].style.flex = "100%";
            }
            else {
                document.getElementById("pymtErrorTap").click();
                if (parseInt(result) == -1)
                    document.getElementById("ErrorMsg").innerHTML = 'Bad Track Data (invalid CVV and/or expiry date)';
            }
        },
        error: function () {
            document.getElementById("pymtErrorTap").click();
        }
    });
}

//Print Invoice after payemnt done
function printMyInvoice() {
    let Id = PaymentObject.Opr;
    w = window.open(window.location.origin.concat("/Payment/Invoice/").concat(Id));
    w.print();
    //w.close();
}

//upload OMT Recipt
let fileInput = document.querySelectorAll("[type=file][data-role=file-upload]");
fileInput.forEach(input => {
    let btnUpload = document.querySelector(`[data-role=${input.getAttribute("data-rel")}]`);
    btnUpload.style.visibility = input.files.length > 0 ? "visible" : "hidden";
    input.addEventListener("change", function (e) {
        let btnUpload = document.querySelector(`[data-role=${input.getAttribute("data-rel")}]`);
        if (btnUpload !== null) {
            btnUpload.style.visibility = input.files.length > 0 ? "visible" : "hidden";
        }
    });
});
let UplodReceipt = document.getElementById("UplodReceipt");
UplodReceipt.addEventListener("submit", function (event) {
    event.preventDefault();
    const promise = new Promise((resolve, reject) => {
        let frmError = function (request, status, error) {
            (request.responseText);
        };
        let frmSuccess = function (data, text) {
            resolve(data);
        };
        $.ajax({
            url: this.getAttribute("action"),
            type: this.getAttribute("method"),
            dataType: "JSON",
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: frmSuccess,
            error: frmError
        });
    }).then((data) => {        
        PaymentObject.Photo = data.Id;// '63';//Nabih get file id
        greet("Receipt Image uploaded successfully!");
    }).catch((message) => {
        console.log(message);
    });
});