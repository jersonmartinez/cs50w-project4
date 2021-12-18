var currency = "";
var update_currency = "";
var data_accounts = "";
var data_movements = "";

Spinner = '<div class="d-flex justify-content-center">' +
    '   <div class="spinner-border text-warning" style="margin-top: 20px; margin-bottom: 50px;" role="status" id="spinner_status_loading_accounts">' +
    '       <span class="sr-only">Cargando datos...</span>' +
    '   </div>' +
    '</div>';

$(document).ready(function() {

    change_badge_type($('#cb-badge-create-account').is(':checked'));
    update_badge_type($('#cb-badge-update-account').is(':checked'));
    // getAccounts();

    $('#cb-badge-create-account').click(() => {
        change_badge_type($('#cb-badge-create-account').is(':checked'));
    });

    $('#cb-badge-update-account').click(() => {
        console.log("click");
        update_badge_type($('#cb-badge-update-account').is(':checked'));
    });

    $("#amount_account").keyup(function() {
        this.value = this.value.replace(/[^0-9\.]/g,'');
    });

    $("#update_amount_account").keyup(function() {
        this.value = this.value.replace(/[^0-9\.]/g,'');
    });

    /*Capture event button submit for create account*/
    $('#create_account_submit').click(() => {
        createAccount();
    });

    var FormCreateAccount = document.getElementById('FormCreateAccount');
    if (FormCreateAccount !== null)
        FormCreateAccount.addEventListener('keypress', eventFormCreateAccount);

    function eventFormCreateAccount(e) {
        if (e.which == 13)
            createAccount();
    }

    /*Capture event button submit for update account*/
    $('#delete_account_submit').click(() => {
        deleteAccount();
    });
    
    $('#update_account_submit').click(() => {
        updateAccount();
    });

    var FormUpdateAccount = document.getElementById('FormUpdateAccount');
    if (FormUpdateAccount !== null)
        FormUpdateAccount.addEventListener('keypress', eventFormUpdateAccount);

    function eventFormUpdateAccount(e) {
        if (e.which == 13)
            updateAccount();
    }

    var FormUpdateMovement = document.getElementById('FormUpdateMovement');
    if (FormUpdateMovement !== null)
        FormUpdateMovement.addEventListener('keypress', eventFormUpdateMovement);

    function eventFormUpdateMovement(e) {
        if (e.which == 13)
            updateMovement();
    }

    $('#update_movement_submit').click(() => {
        updateMovement();
    });
    
    var FormCreateMovement = document.getElementById('FormCreateMovement');
    if (FormCreateMovement !== null)
        FormCreateMovement.addEventListener('keypress', eventFormCreateMovement);

    function eventFormCreateMovement(e) {
        if (e.which == 13)
            createMovement();
    }

    $('#create_movement_submit').click(() => {
        createMovement();
    });

    $("#amount_movement").keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });

    $("#update_amount_movement").keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });

    
});

// chooseWayURLTags();

function getDomain() {
    let url_hostname = 'https://www.factible.io/',
        hostname = document.location.hostname;

    if (hostname == '127.0.0.1' || hostname == 'localhost')
        url_hostname = 'http://127.0.0.1:5000/';

    return url_hostname;
}

function chooseWayURLTags() {
    var filtered_url = (window.location.href).split("/").filter(function (el) {
        return el != "";
    });

    var filtered_getDomain = (getDomain()).split("/").filter(function (el) {
        return el != "";
    });

    for (let x = 0; x < filtered_url.length; x++) {
        for (let i = 0; i < filtered_getDomain.length; i++) {
            if (filtered_url[i] == filtered_getDomain[i]) {
                filtered_url.shift();
                filtered_getDomain.shift();
            }
        }
    }

    // console.log(filtered_url);
    // console.log(filtered_getDomain);

    // if (filtered_url[0] == 'estudio') {
    //     showDataAllTagsAndSubTagsSideBar();

    //     if (filtered_url[1] == 'tag') {
    //         if (filtered_url.length == 3) {
    //             if (filtered_url[2] != '') {
    //                 // console.log("He accedido a getDataSubTagsByTag: " + filtered_url[2]);
    //                 getDataSubTagsByTag(filtered_url[2]);
    //             } else {
    //                 // console.log("He accedido a showDataAllTagsAndSubTagsContainer");
    //                 showDataAllTagsAndSubTagsContainer();
    //             }
    //         } else {
    //             // console.log("He accedido a showDataAllTagsAndSubTagsContainer");
    //             showDataAllTagsAndSubTagsContainer();
    //         }
    //     } else {
    //         // console.log("He accedido a getAllTagsByIDArticle");
    //         getAllTagsByIDArticle();
    //     }
    // }
}

function getAccounts() {
    
    Initial = '<div class="card-header border-0">' +
        '    <div class="row align-items-center">' +
        '        <div class="col">' +
        '            <h3 class="mb-0">Cuentas</h3>' +
        '        </div>' +
        '        <div class="col text-right">' +
        '            <!-- <a href="#!" class="btn btn-sm btn-primary">Ver todo</a> -->' +
        '        </div>' +
        '    </div>' +
        '</div>';
        
    TableInit = '<div class="table-responsive">' +
        '    <table class="table align-items-center table-flush">' +
        '        <thead class="thead-light">' +
        '            <tr>' +
        '                <th scope="col">Nombre</th>' +
        '                <th scope="col">Divisa</th>' +
        '                <th scope="col">Saldo Inicial</th>' +
        '                <th scope="col">Saldo Actual</th>' +
        '                <th scope="col">Descripción</th>' +
        '                <th scope="col">Estado</th>' +
        '            </tr>' +
        '        </thead>' +
        '        <tbody>';
    
    TableFinish = '</tbody>' +
        '    </table>';
    
    Finish = '</div>';

    ButtomCreateAccount = '<a href="#" class="btn btn-sm btn-neutral" data-toggle="modal" data-target="#modal-notification-nueva-cuenta">Crear una cuenta</a>';
    
    $("#dashboard_accounts").html(Initial + Finish + Spinner);

    Data = "";
        
    $.ajax({
        url: "/get_accounts",
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (datos) {
            if (datos == 'there_is_not_records') {
                $("#dashboard_accounts").html("" + Initial + Finish + '<p style="text-align: center; margin-top: 30px; margin-bottom:30px;">No hay cuentas registradas.</p><p style="text-align: center;">' + ButtomCreateAccount + '</p>');
            } else {
                data_accounts = datos;
                console.log(data_accounts);

                for (var i = 0; i < data_accounts.length; i++) {

                    Data += '<tr onclick="javascript: getAccountById(this);" data-toggle="modal" data-target="#modal-notification-control-cuenta" id="tr_item_account_' + data_accounts[i].id + '" id_account="' + data_accounts[i].id +'" class="tr_list_accounts">' +
                        '    <th scope="row">' + data_accounts[i].name + '</th>' +
                        '    <td>' + data_accounts[i].currency + '</td>' +
                        '    <td>' + data_accounts[i].currency + data_accounts[i].amount + '</td>' +
                        '    <td>' + data_accounts[i].currency + data_accounts[i].amount + '</td>' +
                        '    <td>' + data_accounts[i].description + '</td>' +
                        '    <td>' + '<i class="fas fa-arrow-up text-success mr-3"></i> 00,00%' + '</td>' +
                        '</tr>';
                }
                
                $("#dashboard_accounts").html(Initial + TableInit + Data + TableFinish + Finish);
            }
        }
    });
}

function getAccountsForMovements() {
    LabelSelectAccount = '<label for="SelectAccountMovement">Seleccione una cuenta</label>';
    InitSelectAccount = '<select class="form-control" id="SelectAccountMovement">';
    FinishSelectAccount = '</select>';
    OptionDefaultSelectAccount = '<option>Ninguna</option>';

    // $("#ListAccountsMovement").html(LabelSelectAccount + Spinner);
    $("#ListAccountsMovement").html(Spinner);
    
    Data = "";

    $.ajax({
        url: "/get_accounts",
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (datos) {
            if (datos == 'there_is_not_records') {
                return datos;
            } else {
                data_accounts = datos;
                console.log(data_accounts);

                for (var i = 0; i < data_accounts.length; i++) {
                    Data += '<option>' + data_accounts[i].name + '</option>';
                }

                // $("#ListAccountsMovement").html(LabelSelectAccount + InitSelectAccount + OptionDefaultSelectAccount + Data + FinishSelectAccount);
                $("#SelectAccountMovement").html(Data);
            }
        }
    });
}

function getAccountById(value) {
    
    id_account = $(value).attr("id_account");
    data_label_off = "";
    data_label_on = "";

    for (var i = 0; i < data_accounts.length; i++) {
        if (data_accounts[i].id == id_account) {
            update_currency = data_accounts[i].currency;
            
            if (data_accounts[i].currency == '$') {
                data_label_off = 'C$';
                data_label_on = '$';
            } else {
                data_label_off = '$';
                data_label_on = 'C$';
            }

            data_label_on = data_accounts[i].currency;

            $("#modal-notification-control-cuenta #update_id_account").val(data_accounts[i].id);
            $("#modal-notification-control-cuenta #update_name_account").val(data_accounts[i].name);
            $("#modal-notification-control-cuenta #span-update-badge-selected").html(data_accounts[i].currency);
            $("#modal-notification-control-cuenta #cb-badge-update-account-value").attr('data-label-on', data_label_on);
            $("#modal-notification-control-cuenta #cb-badge-update-account-value").attr('data-label-off', data_label_off);

            $("#modal-notification-control-cuenta #update_amount_account").val(data_accounts[i].amount);
            $("#modal-notification-control-cuenta #update_description_account").val(data_accounts[i].description);
        }
    }

}

function createAccount(){
    var name        = $('#name_account').val(),
        amount      = $('#amount_account').val(),
        description = $('#description_account').val();

    if (name == '') {
        toastr["info"]("Identifiquemos la cuenta", "¡No tan rápido!");
    } else if (amount == '') {
        toastr["info"]("Indique la cantidad", "¡No tan rápido!");
    } else {
        $.ajax({
            data: { 'name': name, 'amount': amount, 'description': description, 'currency': currency},
            url: "/create_account",
            type: "post",
            success: function (datos) {
                if (datos == "Ok") {
                    toastr["success"]("La cuenta ha sido creada", "Satisfactorio");
                    $('#FormCreateAccount').trigger("reset");
                    
                    $('#modal-notification-nueva-cuenta').modal('toggle');
                    getAccounts();
                } else {
                    toastr["info"]("Intente más tarde", "Oops");
                }
            }
        });
    }
}

function createMovement(){
    var type_charge = $('input[name="customRadioInline1"]:checked').val(),
        account     = $('select[name="SelectAccountMovement"] option').filter(':selected').val(),
        tag         = $('select[name="SelectTagMovement"] option').filter(':selected').val(),
        date        = $('#SelectDateMovement').val(),
        amount      = $('#amount_movement').val(),
        description = $('#description_movement').val();

    if (description == '') {
        toastr["info"]("Identifiquemos este movimiento", "¡No tan rápido!");
    } else if (amount == '') {
        toastr["info"]("Indique la cantidad", "¡No tan rápido!");
    } else {
        $.ajax({
            data: { 'type_charge': type_charge, 'account': account, 'tag':tag, 'date':date, 'amount': amount, 'description': description, 'currency': currency},
            url: "/create_movement",
            type: "post",
            success: function (datos) {
                if (datos == "Ok") {
                    toastr["success"]("El movimiento ha sido añadido", "Satisfactorio");
                    $('#FormCreateMovement').trigger("reset");
                    
                    $('#modal-notification-nuevo-movimiento').modal('toggle');
                    getMovements();
                } else {
                    toastr["info"]("Intente más tarde", "Oops");
                }
            }
        });
    }
}

function getMovements() {

    Initial = '<div class="card-header border-0">' +
        '    <div class="row align-items-center">' +
        '        <div class="col">' +
        '            <h3 class="mb-0">Movimientos</h3>' +
        '        </div>' +
        '        <div class="col text-right">' +
        '            <!-- <a href="#!" class="btn btn-sm btn-primary">Ver todo</a> -->' +
        '        </div>' +
        '    </div>' +
        '</div>';

    TableInit = '<div class="table-responsive">' +
        '    <table class="table align-items-center table-flush">' +
        '        <thead class="thead-light">' +
        '            <tr>' +
        '                <th scope="col">Descripción</th>' +
        '                <th scope="col">Categoría</th>' +
        '                <th scope="col">Monto</th>' +
        '                <th scope="col">Cuenta</th>' +
        '                <th scope="col">Divisa</th>' +
        '                <th scope="col">Fecha</th>' +
        '                <th scope="col">Cargo</th>' +
        '            </tr>' +
        '        </thead>' +
        '        <tbody>';

    TableFinish = '</tbody>' +
        '    </table>';

    Finish = '</div>';

    ButtomCreateMovement = '<a href="#" class="btn btn-sm btn-neutral" data-toggle="modal" data-target="#modal-notification-nuevo-movimiento">Crear un movimiento</a>';

    $("#dashboard_movements").html(Initial + Finish + Spinner);

    Data = "";

    $.ajax({
        url: "/get_movements",
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (datos) {
            if (datos == 'there_is_not_records') {
                $("#dashboard_movements").html("" + Initial + Finish + '<p style="text-align: center; margin-top: 30px; margin-bottom:30px;">No hay movimientos registrados.</p><p style="text-align: center;">' + ButtomCreateMovement + '</p>');
            } else {
                data_movements = datos;
                console.log(data_movements);

                for (var i = 0; i < data_movements.length; i++) {

                    Data += '<tr onclick="javascript: getMovementById(this);" data-toggle="modal" data-target="#modal-notification-nuevo-movimiento" id="tr_item_movement_' + data_movements[i].id + '" id_movement="' + data_movements[i].id + '" class="tr_list_movement">' +
                        '    <th scope="row">' + data_movements[i].description + '</th>' +
                        '    <td>' + data_movements[i].tag + '</td>' +
                        '    <td>' + data_movements[i].amount + '</td>' +
                        '    <td>' + data_movements[i].account + '</td>' +
                        '    <td>' + data_movements[i].currency + '</td>' +
                        '    <td>' + data_movements[i].date + '</td>' +
                        '    <td>' + data_movements[i].type_charge + '</td>' +
                        '    <td>' + '<i class="fas fa-arrow-up text-success mr-3"></i> 00,00%' + '</td>' +
                        '</tr>';
                }

                $("#dashboard_movements").html(Initial + TableInit + Data + TableFinish + Finish);
            }
        }
    });
}

function deleteAccount() {
    $.ajax({
        data: { 'id': $('#update_id_account').val() },
        url: "/delete_account",
        type: "post",
        success: function (datos) {
            if (datos == "Ok") {
                toastr["success"]("La cuenta ha sido eliminada", "Satisfactorio");
                $('#FormCreateAccount').trigger("reset");

                $('#modal-notification-control-cuenta').modal('toggle');
                getAccounts();
            } else {
                toastr["info"]("Intente más tarde", "Oops");
            }
        }
    });
}

function updateAccount() {
    var id = $('#update_id_account').val(),
        name = $('#update_name_account').val(),
        amount = $('#update_amount_account').val(),
        description = $('#update_description_account').val();

    if (name == '') {
        toastr["info"]("Identifiquemos la cuenta", "¡No tan rápido!");
    } else if (amount == '') {
        toastr["info"]("Indique la cantidad", "¡No tan rápido!");
    } else {
        $.ajax({
            data: { 'id':id, 'name': name, 'amount': amount, 'description': description, 'currency': update_currency },
            url: "/update_account",
            type: "post",
            success: function (datos) {
                if (datos == "Ok") {
                    toastr["success"]("La cuenta ha sido actualizada", "Satisfactorio");
                    $('#FormUpdateAccount').trigger("reset");

                    $('#modal-notification-control-cuenta').modal('toggle');
                    getAccounts();
                } else {
                    toastr["info"]("Intente más tarde", "Oops");
                }
            }
        });
    }
}

// change badge type checkbox state $ or C$
function change_badge_type(value) {
    if (!value) {
        currency = '$';
        $("#span-badge-selected").html("$");
    } else {
        currency = 'C$';
        $("#span-badge-selected").html("C$");
    }
}

// change badge type checkbox state $ or C$
function update_badge_type(value) {
    if (value) {
        update_currency = '$';
        $("#span-update-badge-selected").html("$");
    } else {
        update_currency = 'C$';
        $("#span-update-badge-selected").html("C$");
    }
}