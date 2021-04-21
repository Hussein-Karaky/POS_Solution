var datass = '';
var DataArr = [];
PDFJS.workerSrc = '';
//hay l3am besta3mela
function MyExtractText(data) {
    //var input = document.getElementById("file-id");
    var fReader = new FileReader();
    //fReader.readAsDataURL(input.files[0]);
    // console.log(input.files[0]);
   // fReader.onloadend = function (event) {
        convertDataURIToBinarytest(data);
   // }
}
function ExtractText() {
    var input = document.getElementById("file-id");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    // console.log(input.files[0]);
    fReader.onloadend = function (event) {
        convertDataURIToBinary(event.target.result);
    }
}
var BASE64_MARKER = ';base64,';
function convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    pdfAsArray(array);
}
//hay l3am bsta3mela
function convertDataURIToBinarytest(data){
    var raw = atob(data);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    pdfAsArray(array);
}
function getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            // The main trick to obtain the text of the PDF page, use the getTextContent method
            pdfPage.getTextContent().then(function (textContent) {
                var textItems = textContent.items;
                var finalString = "";
                // Concatenate the string of the item to the final string
                for (var i = 0; i < textItems.length; i++) {
                    var item = textItems[i];
                    finalString += item.str + " ";
                }
                // Solve promise with the text retrieven from the page
                resolve(finalString);
            });
        });
    });
}
function pdfAsArray(pdfAsArray) {
    PDFJS.getDocument(pdfAsArray).then(function (pdf) {
        var pdfDocument = pdf;
        // Create an array that will contain our promises
        var pagesPromises = [];
        for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
            // Required to prevent that i is always the total of pages
            (function (pageNumber) {
                // Store the promise of getPageText that returns the text of a page
                pagesPromises.push(getPageText(pageNumber, pdfDocument));
            })(i + 1);
        }
        // Execute all the promises
        Promise.all(pagesPromises).then(function (pagesText) {
            // Display text of all the pages in the console
            // e.g ["Text content page 1", "Text content page 2", "Text content page 3" ... ]
            console.log(pagesText); // representing every single page of PDF Document by array indexing
            console.log(pagesText.length);
            var outputStr = "";
            for (var pageNum = 0; pageNum < pagesText.length; pageNum++) {
                console.log(pagesText[pageNum]);
                outputStr = "";
                outputStr = "<br/><br/>Page " + (pageNum + 1) + " contents <br/> <br/>";
                var div = document.getElementById('fileloc');
                div.innerHTML += (outputStr + pagesText[pageNum]);
            }
            let spinner = document.getElementById("spinner");
            spinner.remove();
        });
      
    }, function (reason) {
        // PDF loading error
        console.error(reason);
    });
}
function parseWordDocxFile(inputElement) {
    var files = inputElement.files || [];
    if (!files.length) return;
    var file = files[0];

    console.time();
    var reader = new FileReader();
    reader.onloadend = function (event) {
        var arrayBuffer = reader.result;
        // debugger
        let result1 = document.getElementById("output");
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(function (resultObject) {
            result1.innerHTML = resultObject.value
            console.log(resultObject.value)
        })
        console.timeEnd();

    };
    reader.readAsArrayBuffer(file);
}
//hay lzabtaa

function parseWordDocxFileTst(data) {
  
    var raw = atob(data);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    let result1 = document.getElementById("fileloc");
    mammoth.convertToHtml({ arrayBuffer: array }).then(function (resultObject) {
            result1.innerHTML = resultObject.value
            console.log(resultObject.value)
        })
        console.timeEnd();

    }
