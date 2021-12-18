/*-------------------------------------------*\
    Scroll To Top
\*-------------------------------------------*/

$("#ScrollToTop").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1000);
});
//Animación Botón Subir , aparecer y desaparecer botón según scroll top+200px
$(function () {
    var header = $(".scroll-top");
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 200) header.removeClass("scroll-top").addClass("go-up");
        else header.removeClass("go-up").addClass("scroll-top");
    });
});

/*Configuración del toast*/
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-bottom-left",
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};

$(document).ready(function () {

    // ------------------------------------
    // Block for Login
    // ------------------------------------

    /*Capture event button submit for Login*/
    $('#login_submit').click(() => {
        sendFormLogin();
    });

    var FormAdminLogin = document.getElementById('FormAdminLogin');
    if (FormAdminLogin !== null)
        FormAdminLogin.addEventListener('keypress', captureEventEnterAdminForm);

    function captureEventEnterAdminForm(e) {
        if (e.which == 13)
            sendFormLogin();
    }

    // ------------------------------------
    // Block for Signin
    // ------------------------------------

    /*Capture event button submit for Signin*/
    $('#signin_submit').click(() => {
        sendFormSignin();
    });

    var FormAdminSignin = document.getElementById('FormAdminSignin');
    if (FormAdminSignin !== null)
        FormAdminSignin.addEventListener('keypress', captureEventEnterAdminFormSignin);

    function captureEventEnterAdminFormSignin(e) {
        if (e.which == 13)
            sendFormSignin();
    }

    $("input[id=signin_password]").keyup(function () {
        if (this.value == '') {
            $("#signin_password").attr("type", "password");
        }
    });

});

function sendFormLogin() {
    var username = $('#login_username'),
        password = $('#login_password');

    if (username.val() != '') {
        if (password.val() != '') {
            $.ajax({
                data: { 'username': username.val(), 'password': password.val() },
                url: "/login",
                type: "post",
                success: function (datos) {
                    if (datos == "Ok") {
                        $('#FormAdminLogin').trigger("reset");
                        toastr["success"]("Usted ha iniciado sesión con éxito", "Satisfactorio");
                        setTimeout(function () {
                            window.location.href = "/";
                        }, 1000);
                    } else if (datos == "incorrect_username") {
                        username.focus();
                        toastr["info"]("El usuario no existe", "Usuario");
                    } else if (datos == "incorrect_password") {
                        password.val("");
                        password.focus();
                        toastr["info"]("La contraseña no es válida", "Credencial");
                    } else {
                        toastr["info"]("Está comprobado de que somos humanos y cometemos errores, inténtelo más tarde.", "Credencial");
                    }
                }
            });
        } else {
            toastr["info"]("Con una rica taza de café no se nos escapa ningún campo, escriba su contraseña.", "Credencial");
        }
    } else {
        toastr["info"]("Con una rica taza de café no se nos escapa ningún campo, escriba su nombre de usuario.", "Credencial");
    }
}

function sendFormSignin() {
    var nickname = $('#signin_nickname').val(),
        username = $('#signin_username').val(),
        password = $('#signin_password').val(),
        email = $('#signin_email').val();

    if (nickname != '' && username != '' && password != '' && email != '') {
        
        if (!ValidateEmail(email)){
            $('#signin_email').focus();
            toastr["info"]("Escriba una dirección correcta", "Correo electrónico");
            return;
        } else {
            $.ajax({
                data: {
                    'nickname': nickname,
                    'username': username,
                    'password': password,
                    'email': email
                },
                url: "/signin",
                type: "post",
                success: function (datos) {
                    if (datos == "Ok") {
                        $('#FormAdminSignin').trigger("reset");
                        
                        setTimeout(function () {
                            window.location.href = "/";
                        }, 2000);
                        toastr["success"]("¡Usted ha sido registrado!", "Satisfactorio");
                    } else if (datos == "user_exists") {
                        $('#signin_username').focus();
                        toastr["info"]("Este usuario ya existe", "Usuario");
                    } else if (datos == "email_exists") {
                        $('#signin_email').focus();
                        toastr["info"]("Este correo electrónico ya existe", "Correo electrónico");
                    } else {
                        toastr["info"]("Está comprobado de que somos humanos y cometemos errores", "Intente más tarde");
                    }
                }
            });
        }
    } else {
        toastr["info"]("Con una rica taza de café no se nos escapa ningún campo.", "Rellene todos los campos");
    }
}

function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        return true;
    return false;
}

function ShowFieldsKeys() {
    $("#signin_password").attr("type", "text");

    var Key = GenerateKey(12);

    $("#signin_password").val(Key);
}

function GenerateKey(lng) {
    long = parseInt(lng);

    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789!@#$%^&*()?><_+";
    var password = "";

    for (i = 0; i < long; i++)
        password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));

    return password;
}