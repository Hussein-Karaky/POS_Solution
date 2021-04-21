var swalInit = swal.mixin({
    buttonsStyling: false,
    confirmButtonClass: 'btn btn-primary',
    cancelButtonClass: 'btn btn-light'
});

warnInactiveUser = function () {
    warn('Account not activated yet! please check your email.', 3000);
}

greet = function (msg, timer = 0, timerProgressBar = false) {
    return swalInit.fire({
        text: msg,
        type: "success",
        toast: true,
        timer: timer,
        showConfirmButton: false,
        position: "top-right",
        customClass: {
            popup: ["border-1", 'bg-blur-4', "success", "shadow"],
            content: ["text-dark"],
            icon: ["success"],
        }
    });
};

inform = function (msg, timer, timerProgressBar) {
    return swalInit.fire({
        text: msg,
        type: "info",
        toast: true,
        timer: timer,
        showConfirmButton: false,
        position: "top-right",
        customClass: {
            popup: ["border-1", 'bg-blur-4', "info", "shadow"],
            content: ["text-dark"],
            icon: ["info"],
        }
    });
};

warn = function (msg, timer, timerProgressBar) {
    return swalInit.fire({
        text: msg,
        type: "warning",
        toast: true,
        timer: timer,
        showConfirmButton: false,
        position: "top-right",
        customClass: {
            popup: ["border-1", 'bg-blur-4', "warning", "shadow"],
            content: ["text-dark"],
            icon: ["warning"],
        }
    });
};

err = function (msg) {
    return swalInit.fire({
        text: msg,
        type: "error",
        toast: true,
        showConfirmButton: false,
        position: "top-right",
        customClass: {
            popup: ["border-1", 'bg-blur-4', "error", "shadow"],
            content: ["text-dark"],
            icon: ["error"],
        }
    });
};

assure = function (title, msg) {
    return Swal.fire({
        title: title,
        text: msg,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    });
}