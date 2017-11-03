(function() {

'use strict';

var config = {
    apiKey: "AIzaSyCTva_s01pGVT2OWnh2WLbUXgTa0dklUXE",
    authDomain: "appcorpounidos.firebaseapp.com",
    databaseURL: "https://appcorpounidos.firebaseio.com",
    storageBucket: "appcorpounidos.appspot.com",
    messagingSenderId: "83638412877"

};

firebase.initializeApp(config);

const dbRef = firebase.database();
var auth    = firebase.auth();

var countCantSocios             = 0;
var countCantPagosSostenimiento = 0;
var totalSumaAbonos             = 0;
var totalSostenimiento          = 0;
var countCantAbonosAcueducto    = 0;

idTdTotalAPagar.innerText = 0;
var totalFinalAfinalAPagarFacturacionSostenimiento = 0;
var totalFinalAfinalAPagarFacturacionAcueducto = 0;
var totalFinalAfinalAPagarFacturacionVias1 = 0;
var totalFinalAfinalAPagarFacturacionVias2 = 0; 

var labelNombreSocio = document.getElementById('labelNombreSocio');

cargarDatosPaginaPrincipal();

function cargarDatosPaginaPrincipal(){

  $("#idDivPaginaPrincipal").show();  
  $("#procesoAdminDiv").hide();  
  $("#divTableSocios").hide();  
  $("#divNuevoSocio").hide();  
  $("#procesoSociosDiv").hide();  
  $("#divDetallesDeLaFactura").hide();  

}

btnRecargarPaginaPrincipal.addEventListener('click', function() {

  cargarDatosPaginaPrincipal();

});

procesoSocios.addEventListener('click', function() {
  
    $("#idDivPaginaPrincipal").hide();
    $("#procesoAdminDiv").hide();
    $("#procesoSociosDiv").show();
    $("#divDetallesDeLaFactura").hide();
    tdTotalSostenimiento.innerHTML    = '';
    tdSaldoAlaFecha.innerHTML         = '';
    tdTotalPagosRealizados.innerText  = '';
    vaciarCamposBusquedaSocio();

});

procesoAdmin.addEventListener('click', function() {
    
    $("#idDivPaginaPrincipal").hide();
    $("#procesoAdminDiv").show();
    $("#procesoSociosDiv").hide();
    $("#divDetallesDeLaFactura").hide();
    tdTotalSostenimiento.innerHTML    = '';
    tdSaldoAlaFecha.innerHTML         = '';
    tdTotalPagosRealizados.innerText  = '';
    vaciarCamposBusquedaSocio();

});

btnAcceder.addEventListener('click', function() {

    auth.signInWithEmailAndPassword(txtId.value, txtClave.value)
    .then((user) => {
      txtId.value       = '';
      txtClave.value    = '';
      cargarDataDespuesLogin();
    })
    .catch(e => {
      alert("Datos incorrectos, por favor verificalos y vuelve a intentarlo. Si el error persiste por favor verifica tu conexion a internet!");
    });

});

btnSalir.addEventListener('click', function() {

    auth.signOut();
    $("#procesoAdminDiv").show(100);
    $("#procesoSocios").show(100);

    $("#divLoad").hide();
    $("#btnSalir").hide();
    $("#spanCountCantSocios").hide();
    $("#divTableSocios").hide();
    $("#sociosLabel").hide();
    $("#divNuevoSocio").hide();

});

firebase.auth().onAuthStateChanged(function(user) {

  if (user) {

    var isAnonymous = user.isAnonymous;
    var uid = user.uid;

    setTimeout(function() {

        $("#btnRecargarPaginaPrincipal").hide();
        $("#btnRecargarPaginaPrincipal2").show();

        labelNombreSocio.innerHTML = '<span class="glyphicon glyphicon-user"></span> '+auth.currentUser.email;
        cargarDataDespuesLogin();
        $("#idDivPaginaPrincipal").hide();
        cargarSocios(user);
        sociosLabel.addEventListener('click', function(){
          
          $("#idDivPaginaPrincipal").hide();
          cargarDataDespuesLogin();

        });

    }, 2000);

  } else {

    setTimeout(function() {
        cargarDataAntesLogin();
        labelNombreSocio.text = '';
        $("#btnRecargarPaginaPrincipal").show();
        $("#btnRecargarPaginaPrincipal2").hide();
    }, 1000);

  }

});

btnBuscarDataSocio.addEventListener('click', function() {

  var fechaSistema = new Date();
  var fecha = fechaSistema.getDate() + "/" + (fechaSistema.getMonth() +1) + "/" + fechaSistema.getFullYear();

    if(txtPinSocio.value !== '') {

        firebase.database().ref('socios/' + txtPinSocio.value + '').once('value').then(function(snapshot) {

        if(txtPasswordSocio.value === snapshot.val().PASSWORD) {

            txtNombreSocio.innerText= snapshot.val().NOMBRE;
            txtN_Lotes.innerText    = snapshot.val().N_LOTES;
            txtCel1.innerText       = snapshot.val().CELL1;
            txtCel2.innerText       = snapshot.val().CELL2;
            txtCorreo.innerText     = snapshot.val().CORREO;
            txtDireccion.innerText  = snapshot.val().DIRECCION;
            txtFijo.innerText       = snapshot.val().FIJO;
            txtClaveSocio.innerText = snapshot.val().PASSWORD;

            //datos para la factura
            tdNombre.innerText      = snapshot.val().NOMBRE;
            tdLotes.innerText       = snapshot.val().N_LOTES;
            tdNumeroSocio.innerText = txtPinSocio.value;
            tdAportesNumLotes.innerText = snapshot.val().N_LOTES;
            txtN_LotesProvicional.value = snapshot.val().N_LOTES;

            //datos para sostenimiento
            tdPagSostNombre.innerText       = snapshot.val().NOMBRE;
            tdPagSostLotes.innerText        = snapshot.val().N_LOTES;
            tdPagSostNumeroSocio.innerText  = txtPinSocio.value;

            //datos para pagos de acueducto
					  tdAbonosAcueductoNombre.innerText 		 = snapshot.val().NOMBRE;
						tdAbonosAcueductoFecha.innerText 			 = fecha;
						tdAbonosAcueductoLotes.innerText 			 = snapshot.val().N_LOTES;
						tdAbonosAcueductoNumeroSocio.innerText = txtPinSocio.value;

            //datos para aportes de financiacion vias 1
            tdNombreVias1.innerText       = snapshot.val().NOMBRE;
            tdFechaVias1.innerText        = fecha;
            tdLotesVias1.innerText        = snapshot.val().N_LOTES;
            tdNumeroSocioVias1.innerText  = txtPinSocio.value;
            tdAportesNumLotes.innerText   = snapshot.val().N_LOTES;
            tdVias1NumLotes.innerText     = snapshot.val().N_LOTES;

            //datos para aportes de financiacion vias 2
            tdNombreVias2.innerText       = snapshot.val().NOMBRE;
            tdFechaVias2.innerText        = fecha;
            tdLotesVias2.innerText        = snapshot.val().N_LOTES;
            tdNumeroSocioVias2.innerText  = txtPinSocio.value;     
            tdVias2NumLotes.innerText   = snapshot.val().N_LOTES;       

            $("#btnVerDetallesFacturaPago").removeAttr("disabled");

        } else {
            alert('Error al buscar el socio por favor verifique sus datos');
            $("#btnVerDetallesFacturaPago").attr("disabled", "true");
        }

        });

    } else {
        vaciarCamposBusquedaSocio();
    }

});

btnBuscarVaciarCampos.addEventListener('click', function() {

    vaciarCamposBusquedaSocio();

});

btnNuevoSocio.addEventListener('click', function() {

    $("#divNuevoSocio").show(400);
    $("#tableSociosListado").hide();
    $("#btnGuardarNuevoSocio").attr("action", "guardar");
    $("#btnCompletarActualizacionSocio").hide();
    $("#btnGuardarNuevoSocio").show();

    txtNuevoNombreSocio.value   = '';
    txtNuevoN_Lotes.value       = '';
    txtNuevoCel1.value          = '';
    txtNuevoCel2.value          = '';
    txtNuevoCorreo.value        = '';
    txtNuevoDireccion.value     = '';
    txtNuevoFijo.value          = '';
    txtNuevoClave.value         = '';
    txtNuevoC_Sostenimiento.value = '';
    txtClaveSocio.value         = '';

});

btnCancelarNuevoSocio.addEventListener('click', function() {

    $("#tableSociosListado").show();
    $("#divNuevoSocio").hide(400);
    $("#btnGuardarNuevoSocio").text("GUARDAR SOCIO");
    $("#btnGuardarNuevoSocio").attr("action", "actualizar");
    $("#btnCompletarActualizacionSocio").hide();
    $("#btnNuevoSocio").show();
    txtNuevoId.value = '';

});

btnGuardarNuevoSocio.addEventListener('click', function() {

    const idSocio = countCantSocios + 1;
    firebase.database().ref('socios/' + idSocio).set({
        NOMBRE      : txtNuevoNombreSocio.value,
        N_LOTES     : txtNuevoN_Lotes.value,
        CELL1       : txtNuevoCel1.value,
        CELL2       : txtNuevoCel2.value,
        CORREO      : txtNuevoCorreo.value,
        DIRECCION   : txtNuevoDireccion.value,
        FIJO        : txtNuevoFijo.value,
        PASSWORD    : txtNuevoClave.value,
        C_SOSTENIMIENTO : txtNuevoC_Sostenimiento.value
    });

    txtNuevoNombreSocio.value   = '';
    txtNuevoN_Lotes.value       = '';
    txtNuevoCel1.value          = '';
    txtNuevoCel2.value          = '';
    txtNuevoCorreo.value        = '';
    txtNuevoDireccion.value     = '';
    txtNuevoFijo.value          = '';
    txtNuevoClave.value         = '';
    txtNuevoC_Sostenimiento.value = '';
    txtNuevoId.value              = '';

});

btnCompletarActualizacionSocio.addEventListener('click', function() {

    firebase.database().ref('socios/' + txtNuevoId.value).update({
        NOMBRE      : txtNuevoNombreSocio.value,
        N_LOTES     : txtNuevoN_Lotes.value,
        CELL1       : txtNuevoCel1.value,
        CELL2       : txtNuevoCel2.value,
        CORREO      : txtNuevoCorreo.value,
        DIRECCION   : txtNuevoDireccion.value,
        FIJO        : txtNuevoFijo.value,
        PASSWORD    : txtNuevoClave.value,
        C_SOSTENIMIENTO : txtNuevoC_Sostenimiento.value
    });

    txtNuevoNombreSocio.value   = '';
    txtNuevoN_Lotes.value       = '';
    txtNuevoCel1.value          = '';
    txtNuevoCel2.value          = '';
    txtNuevoCorreo.value        = '';
    txtNuevoDireccion.value     = '';
    txtNuevoFijo.value          = '';
    txtNuevoClave.value         = '';
    txtNuevoC_Sostenimiento.value = '';

    $("#tableSociosListado").show();
    $("#divNuevoSocio").hide();
    $("#btnGuardarNuevoSocio").text("GUARDAR SOCIO");
    $("#btnGuardarNuevoSocio").attr("action", "actualizar");
    $("#btnCompletarActualizacionSocio").hide();
    txtNuevoId.value            = '';

});

function cargarSocios(currentUser) {

    if(currentUser) {

    	var ref = firebase.database().ref('socios/');

    	ref.on('value', function(snapshot) {

        var socios             = {};
        socios                 = snapshot.val();
        tableSocios.innerHTML  = "";
        countCantSocios        = 0;
        var estadoDeudaAc  = '';
        var estadoDeudaAv1 = '';
        var estadoDeudaAv2 = '';

        var i = 1;
        for(i = 1; i < socios.length; i++) {

            if(socios[i].ESTADO_DEUDA_ACUEDUCTO === "finalizada") {
              estadoDeudaAc = 'images/estadoPagos/si.png';
            } else {
              estadoDeudaAc = 'images/estadoPagos/no.png';
            }

            if(socios[i].ESTADO_DEUDA_VIAS1 === "finalizada") {
              estadoDeudaAv1 = 'images/estadoPagos/si.png';
            } else {
              estadoDeudaAv1 = 'images/estadoPagos/no.png';
            }

            if(socios[i].ESTADO_DEUDA_VIAS2 === "finalizada") {
              estadoDeudaAv2 = 'images/estadoPagos/si.png';
            } else {
              estadoDeudaAv2 = 'images/estadoPagos/no.png';
            }

            tableSocios.innerHTML += "<tr>"+
                        "<td>" + i + "</td>"+
                        "<td>" + socios[i].NOMBRE + "</td>"+
                        "<td>" + socios[i].DIRECCION + "</td>"+
                        "<td><img style='width:15px; heigth:15px;' src='" + estadoDeudaAc + "'/></td>"+
                        "<td><img style='width:15px; heigth:15px;' src='" + estadoDeudaAv1 + "'/></td>"+
                        "<td><img style='width:15px; heigth:15px;' src='" + estadoDeudaAv2 + "'/></td>"+
                        "<td>" + socios[i].C_SOSTENIMIENTO + "</td>"+
                        "<td>" + socios[i].N_LOTES + "</td>"+
                        "<td>" + socios[i].CORREO + "</td>"+
                        "<td>" + socios[i].PASSWORD + "</td>"+
                        "<td>" +
                          "<button class='btn btn-default btn-sm' onclick='actualizarSocio(\""+i+"\")'>" +
                            "<span class='glyphicon glyphicon-pencil'></span> Editar" +
                          "</button> "+
                        "</td>"+
                        "</tr>";
                countCantSocios ++;

            spanCountCantSocios.innerHTML = countCantSocios;
        }

    });

    } else {

    }

}

sociosDelSistemaParalaBusqueda();

function sociosDelSistemaParalaBusqueda() {

    var ref = firebase.database().ref('socios/');

    ref.on('value', function(snapshot) {

        var socios                   = {};
        socios                 = snapshot.val();
        listadoSociosDelSistema.innerHTML  = "";

        var i = 1;
        for(i = 1; i < socios.length; i++) {
            listadoSociosDelSistema.innerHTML += "<a href='#' class='list-group-item' id='liItemSocioSeleccionadoCambiarColor' onclick='seleccionarSocio(\""+i+"\")'>"+i+" : "+socios[i].NOMBRE+"</a>";
        }

      });

}

btnVerDetallesFacturaPago.addEventListener('click', function() {

    $("#procesoSociosDiv").hide();
    $("#divDetallesDeLaFactura").show();

    var totalAlaFecha = 0;
    
    totalFinalAfinalAPagarFacturacionSostenimiento = 0;
    totalFinalAfinalAPagarFacturacionAcueducto = 0;
    totalFinalAfinalAPagarFacturacionVias1 = 0;
    totalFinalAfinalAPagarFacturacionVias2 = 0; 
    
    idTdTotalAPagar.innerText = 0;   
    idTdTotalMesMora.innerHTML = 0;
    idTdTotalVias1MesMora.innerHTML = 0;
    idTdTotalVias2MesMora.innerHTML = 0;
    idTdVias2MesMora.innerHTML = 0;
    idTdVias1Abono.innerHTML = 0;
    idTdVias1MesMora.innerHTML = 0;
    idTdVias2Abono.innerHTML = 0;
    idTdAbonosActual.innerHTML = 0;
    tdTdMesMora.innerHTML = 0;

    var fechaSistema = new Date();
    var formarFecha  = (fechaSistema.getMonth() +1) + "/" + fechaSistema.getDate() + "/" + fechaSistema.getFullYear();

    idTdfechaTotalPagar.innerText = formarFecha;

    tdFechaFactura.innerText = formarFecha;
	  var totalAcuerdoAcueducto= '1114000';

    firebase.database().ref('socios/'+txtPinSocio.value).once('value', function(snapshot) {

        var pagos = firebase.database().ref('socios/'+txtPinSocio.value+'/pasgos_sostenimiento/');
        pagos.on('value', function(pagosData) {

            var pagos       = pagosData.val();
            totalSumaAbonos = 0;

            $.each(pagos, function(index, item) {
                totalSumaAbonos = parseInt(item.ABONO) + parseInt(totalSumaAbonos);
                tdTotalPagosRealizados.innerText = '';
                tdTotalPagosRealizados.innerText = formatNumber.new(totalSumaAbonos, "$");
				        //idTdAbonosActual.innerHTML = formatNumber.new(totalSumaAbonos, "$");
            });

        });

    });

    var ref = firebase.database().ref('cuotas/').on('value', function(snapshot) {

        var cuotas             = {};
        cuotas                 = snapshot.val();
        tableCuotas.innerHTML  = "";
        totalSostenimiento     = 0;

        $.each(cuotas, function(indice, item) {

            let total = 0;
            total = item.N_CUOTAS * item.VALOR * txtN_LotesProvicional.value;          

            tableCuotas.innerHTML += "<tr>"+
                            "<td style='padding-left: 6px; width: 230px;'>"+indice+"</td>"+
                            "<td style='padding-left: 6px; width: 230px;'>"+item.N_CUOTAS+"</td>"+
                            "<td style='padding-left: 6px; width: 245px;'>"+formatNumber.new(item.VALOR, "$")+"</td>"+
                            "<td style='padding-left: 6px; width: 245px;'>"+formatNumber.new(total, "$")+"</td>"+
                        "</tr>";

            //calcular total sostenimiento
            totalSostenimiento = parseInt(total) + parseInt(totalSostenimiento);
            tdTotalSostenimiento.innerHTML = formatNumber.new(totalSostenimiento , "$");

            totalAlaFecha = parseInt(totalSostenimiento) - parseInt(totalSumaAbonos);            
            tdSaldoAlaFecha.innerText = formatNumber.new(totalAlaFecha, "$");

            totalFinalAfinalAPagarFacturacionSostenimiento = totalAlaFecha;              

        });      
    });

    tableCuotas2.innerHTML = "";
    var indiceC2     = 2017;
    var valorC2      = 15000;
    var fechaSistema = new Date();
    var mesC2        = (fechaSistema.getMonth() +1);
    var totalC2final = 0;
    var finalC2      = parseInt(mesC2) * parseInt(valorC2);
    totalC2final     = parseInt(txtN_LotesProvicional.value) * parseInt(finalC2);    
    tableCuotas2.innerHTML += "<tr>"+
                            "<td style='padding-left: 6px; width: 230px;'>"+indiceC2+"</td>"+
                            "<td style='padding-left: 6px; width: 230px;'>"+mesC2+"</td>"+
                            "<td style='padding-left: 6px; width: 245px;'>"+formatNumber.new(valorC2, "$")+"</td>"+
                            "<td style='padding-left: 6px; width: 245px;'>"+formatNumber.new(totalC2final, "$")+"</td>"+
                        "</tr>";

    //calcular total acueducto
		totalAcuerdoAcueducto = parseInt(txtN_LotesProvicional.value) * parseInt(totalAcuerdoAcueducto);
		idTdTotalAcuerdoAcueducto.innerText = formatNumber.new(totalAcuerdoAcueducto, '$');
		idTdTotalAcuAcueductoProvicional.innerText = formatNumber.new(totalAcuerdoAcueducto, '$');

    //calcular total vias 1
    let valorLote = 1000000;
    let total = parseInt(valorLote) * parseInt(txtN_LotesProvicional.value);
    idTdVias1Total.innerText = formatNumber.new(total ,"$");
    idtdVias1Valor.innerText = formatNumber.new(total ,"$");

    //calcular total vias 2
    let valorLoteVias2 = 2000000;
    let totalVias2 = parseInt(valorLoteVias2) * parseInt(txtN_LotesProvicional.value);
    idTdVias2Total.innerText = formatNumber.new(totalVias2 ,"$");
    idtdVias2Valor.innerText = formatNumber.new(totalVias2 ,"$");

    //cargar mes mora factura acueducto
		/*var dataMesMora = firebase.database().ref('socios/'+txtPinSocio.value+'/abonos_acueducto/').limitToLast(1);
		dataMesMora.once('value', function(data) {
			var dataMes = data.val();
			$.each(dataMes, function(indice, item) {
				//tdTdMesMora.innerHTML = item.NUMERO;                
        //idTdTotalMesMora.innerHTML = formatNumber.new(item.PASAN, "$");        
        totalFinalAfinalAPagarFacturacionAcueducto = item.PASAN;
			});
		});*/


    //cargar mes mora factura vias 1
    /*var dataMesMoraVias1 = firebase.database().ref('socios/'+txtPinSocio.value+'/abonos_vias1/').limitToLast(1);
    dataMesMoraVias1.once('value', function(data) {
      var dataMesVias1 = data.val();
      $.each(dataMesVias1, function(indice, item) {
        idTdVias1MesMora.innerHTML = item.NUMERO;
        idTdTotalVias1MesMora.innerHTML = "";  
        //idTdTotalVias1MesMora.innerHTML = formatNumber.new(item.PASAN, "$");
        totalFinalAfinalAPagarFacturacionVias1 = item.PASAN;      
      });
    });*/

    //cargar mes mora factura vias 2
    /*var dataMesMoraVias2 = firebase.database().ref('socios/'+txtPinSocio.value+'/abonos_vias2/').limitToLast(1);
    dataMesMoraVias2.once('value', function(data) {
      var dataMesVias2 = data.val();
      $.each(dataMesVias2, function(indice, item) {
        idTdVias2MesMora.innerHTML = item.NUMERO;
        idTdTotalVias2MesMora.innerHTML = "";
        idTdTotalVias2MesMora.innerHTML = formatNumber.new(item.PASAN, "$");
        totalFinalAfinalAPagarFacturacionVias2 = item.PASAN;
      });
    });*/

    cargarDatosTabSostenimiento();
    cargarDatosTabAcueducto();
    cargarDatosTabVias1();
    cargarDatosTabVias2();

    setTimeout(function(){
      //console.log(totalFinalAfinalAPagarFacturacionSostenimiento);
      idTdTotalAPagar.innerText = formatNumber.new(parseInt(totalFinalAfinalAPagarFacturacionSostenimiento)+parseInt(totalFinalAfinalAPagarFacturacionAcueducto)+parseInt(totalFinalAfinalAPagarFacturacionVias1)+parseInt(totalFinalAfinalAPagarFacturacionVias2), "$");                
    },10000);  

});

tabPagosSostenimiento.addEventListener('click', function() {

    cargarDatosTabSostenimiento();

});

btnBorrarDatosInputBuscarSociosTabla.addEventListener('click', function() {

    txtBuscadorSociosTablaNombre.value = "";
    txtBuscadorSociosTablaPing.value = "";
    cargarSocios(auth.currentUser);

});

btnBuscarSociosEnlaTabla.addEventListener('click', function() {

    if(txtBuscadorSociosTablaNombre.value !== '' && txtBuscadorSociosTablaPing.value !== '') {

      firebase.database().ref('socios/' + txtBuscadorSociosTablaPing.value).once('value', function(snapshot) {

        if(txtBuscadorSociosTablaNombre.value == snapshot.val().NOMBRE  ||
           txtBuscadorSociosTablaNombre.value == snapshot.val().FIJO    ||
           txtBuscadorSociosTablaNombre.value == snapshot.val().N_LOTES ||
           txtBuscadorSociosTablaNombre.value == snapshot.val().CORREO  ||
           txtBuscadorSociosTablaNombre.value == snapshot.val().PASSWORD) {
          tableSocios.innerHTML = "";

          tableSocios.innerHTML += "<tr>"+
              "<td>" + snapshot.val().key + "</td>"+
              "<td>" + snapshot.val().NOMBRE + "</td>"+
              "<td>" + snapshot.val().CELL1 + "</td>"+
              "<td>" + snapshot.val().CELL2 + "</td>"+
              "<td>" + snapshot.val().DIRECCION + "</td>"+
              "<td>" + snapshot.val().FIJO + "</td>"+
              "<td>" + snapshot.val().C_SOSTENIMIENTO + "</td>"+
              "<td>" + snapshot.val().N_LOTES + "</td>"+
              "<td>" + snapshot.val().CORREO + "</td>"+
              "<td>" + snapshot.val().PASSWORD + "</td>"+
              "<td>" +
                "<button class='btn btn-default btn-sm' onclick='actualizarSocio(\""+snapshot.val().key+"\")'>" +
                  "<span class='glyphicon glyphicon-pencil'></span> Editar" +
                "</button> "+
                "<button class='btn btn-default btn-sm' onclick='verDetallesSocio(\""+snapshot.val().key+"\")'>" +
                  "<span class='glyphicon glyphicon-menu-hamburger'></span> Detalles" +
                "</button> "+
              "</td>"+
              "</tr>";
        } else {
          alert("No se encontraron resultados para " + txtBuscadorSociosTablaNombre.value);
        }

      });

    } else {
      alert("RECUERDE NO DEJAR LOS CAMPOS DE BUSQUEDA VACIOS");
    }

});

btnTabPagosSostenimiento.addEventListener('click', function() {

    setTimeout(function(){
      $("#divNuevoSocio").hide(function() {
        $("#btnNuevoSocio").show();
        $("#tableSociosListado").show();
        $("#btnGuardarNuevoSocio").text("GUARDAR SOCIO");
        $("#btnGuardarNuevoSocio").attr("action", "actualizar");
        $("#btnCompletarActualizacionSocio").hide();
        txtNuevoId.value = '';
      });
    },1000);
    
    var ref = firebase.database().ref('socios/');

    ref.on('value', function(snapshot) {

        var socios                                  = {};
        socios                                      = snapshot.val();
        listSociosRegPagosSostenimiento.innerHTML   = "";

        var i = 1;
        for(i = 1; i < socios.length; i++) {
            listSociosRegPagosSostenimiento.innerHTML += "<option value='"+i+"'>"+i+" : "+socios[i].NOMBRE+"</option>";
        }

    });

});

btnGuardarNuevoPagoSostenimiento.addEventListener('click', function() {

    var fechaSistema = new Date();
    var formarFecha  = fechaSistema.getDate() + "/" + (fechaSistema.getMonth() +1) + "/" + fechaSistema.getFullYear();    

    countCantAbonosAcueducto = 0;
    firebase.database().ref('socios/'+listSociosRegPagosSostenimiento.value+'/pasgos_sostenimiento/').on('value', function(data) {
      var abonosSostenimiento = data.val();
      $.each(abonosSostenimiento, function(i, it) {
        countCantAbonosAcueducto ++;
      });
    });

    firebase.database().ref('socios/'+listSociosRegPagosSostenimiento.value+'/pasgos_sostenimiento/').push({
        FECHA   : formarFecha,
        ENTIDAD : selectEntidad.value,
        ABONO   : txtAbono.value,
        IDSOCIO : listSociosRegPagosSostenimiento.value,    
        RECIBO  : countCantAbonosAcueducto,
        NUMERORECIBO     : txtAcueductoNReciboSostenimiento.value
    });

    txtAbono.value = 0;
    txtAcueductoNReciboSostenimiento.value = 0;

    //console.log(countCantAbonosAcueducto);

});

btnTabAbonosAcueducto.addEventListener('click', function() {

  setTimeout(function(){
    $("#divNuevoSocio").hide(function() {
      $("#btnNuevoSocio").show();
      $("#tableSociosListado").show();
      $("#btnGuardarNuevoSocio").text("GUARDAR SOCIO");
      $("#btnGuardarNuevoSocio").attr("action", "actualizar");
      $("#btnCompletarActualizacionSocio").hide();
      txtNuevoId.value = '';
    });
  },1000);

	var ref = firebase.database().ref('socios/');

  ref.on('value', function(snapshot) {

		var socios                                  = {};
		socios                                      = snapshot.val();
		selectAcueductoSocio.innerHTML   = "";

		var i = 1;
		for(i = 1; i < socios.length; i++) {
			selectAcueductoSocio.innerHTML += "<option value='"+i+"'>"+i+" : "+socios[i].NOMBRE+"</option>";
		}

	});

});


btnGuardarAbonoAcueducto.addEventListener('click', function() {

	countCantAbonosAcueducto = 0;
	firebase.database().ref('socios/'+selectAcueductoSocio.value+'/abonos_acueducto/').on('value', function(data) {
		var abonos = data.val();
		$.each(abonos, function(i, it) {
			countCantAbonosAcueducto ++;
		});
	});

	var fechaSistema = new Date();
  var formarFecha  = fechaSistema.getDate() + "/" + (fechaSistema.getMonth() + 1) + "/" + fechaSistema.getFullYear();

	firebase.database().ref('socios/'+selectAcueductoSocio.value+'/abonos_acueducto/').push({
		PASAN 			: txtAcueductoPasan.value,
		IDSOCIO 		: selectAcueductoSocio.value,
		NUMERO 			: countCantAbonosAcueducto,
		ABONO 			: txtAcueductoAbono.value,
		ENTIDAD 		: selectAcueductoEntidad.value,
		INTERESES 	: txtAcueductoIntereses.value,
		CORTEMES 		: dateAcueducto.value,
        NUMERORECIBO     : txtAcueductoNRecibo.value
	});

	txtAcueductoAbono.value 		   = 0;
	txtAcueductoIntereses.value 	   = 0;
	txtAcueductoPasan.value 		   = 0;
	txtAcueductoNRecibo.value          = 0;

});

btnTabAbonosVias1.addEventListener('click', function() {

  setTimeout(function(){
    $("#divNuevoSocio").hide(function() {
      $("#btnNuevoSocio").show();
      $("#tableSociosListado").show();
      $("#btnGuardarNuevoSocio").text("GUARDAR SOCIO");
      $("#btnGuardarNuevoSocio").attr("action", "actualizar");
      $("#btnCompletarActualizacionSocio").hide();
      txtNuevoId.value = '';
    });
  },1000);

  var ref = firebase.database().ref('socios/');

  ref.on('value', function(snapshot) {

    var socios                                  = {};
    socios                                      = snapshot.val();
    selectVias1Socio.innerHTML   = "";

    var i = 1;
    for(i = 1; i < socios.length; i++) {
      selectVias1Socio.innerHTML += "<option value='"+i+"'>"+i+" : "+socios[i].NOMBRE+"</option>";
    }

  });

});

btnTabAbonosVias2.addEventListener('click', function() {

  setTimeout(function(){
    $("#divNuevoSocio").hide(function() {
      $("#btnNuevoSocio").show();
      $("#tableSociosListado").show();
      $("#btnGuardarNuevoSocio").text("GUARDAR SOCIO");
      $("#btnGuardarNuevoSocio").attr("action", "actualizar");
      $("#btnCompletarActualizacionSocio").hide();
      txtNuevoId.value = '';
    });
  },1000);

  var ref = firebase.database().ref('socios/');

  ref.on('value', function(snapshot) {

    var socios                                  = {};
    socios                                      = snapshot.val();
    selectVias2Socio.innerHTML   = "";

    var i = 1;
    for(i = 1; i < socios.length; i++) {
      selectVias2Socio.innerHTML += "<option value='"+i+"'>"+i+" : "+socios[i].NOMBRE+"</option>";
    }

  });

});

btnGuardarAbonoVias1.addEventListener('click', function() {

  countCantAbonosAcueducto = 0;
  firebase.database().ref('socios/'+selectVias1Socio.value+'/abonos_vias1/').on('value', function(data) {
    var abonos = data.val();
    $.each(abonos, function(i, it) {
      countCantAbonosAcueducto ++;
    });
  });

  firebase.database().ref('socios/'+selectVias1Socio.value+'/abonos_vias1/').push({
    PASAN       : txtVias1Pasan.value,
    IDSOCIO     : selectVias1Socio.value,
    NUMERO      : countCantAbonosAcueducto,
    ABONO       : txtVias1Abono.value,
    ENTIDAD     : selectVias1Entidad.value,
    INTERESES   : txtVias1Intereses.value,
    CORTEMES    : dateVias1.value,
    NUMERORECIBO     : txtAcueductoNReciboVias1.value
  });

  txtVias1Abono.value        = 0;
  txtVias1Intereses.value      = 0;
  txtVias1Pasan.value          = 0;
  txtAcueductoNReciboVias1.value  = 0;

});

btnGuardarAbonoVias2.addEventListener('click', function() {

  countCantAbonosAcueducto = 0;
  firebase.database().ref('socios/'+selectVias2Socio.value+'/abonos_vias2/').on('value', function(data) {
    var abonosVias2 = data.val();
    $.each(abonosVias2, function(i, it) {
      countCantAbonosAcueducto ++;
    });
  });

  firebase.database().ref('socios/'+selectVias2Socio.value+'/abonos_vias2/').push({
    PASAN       : txtVias2Pasan.value,
    IDSOCIO     : selectVias2Socio.value,
    NUMERO      : countCantAbonosAcueducto,
    ABONO       : txtVias2Abono.value,
    ENTIDAD     : selectVias2Entidad.value,
    INTERESES   : txtVias2Intereses.value,
    CORTEMES    : dateVias2.value,
    NUMERORECIBO     : txtAcueductoNReciboVias2.value
  });

  txtVias2Abono.value        = 0;
  txtVias2Intereses.value      = 0;
  txtVias2Pasan.value          = 0;
  txtAcueductoNReciboVias2.value = 0;

});

function cargarDatosTabSostenimiento() {

  var fechaSistema = new Date();
    var formarFecha  = (fechaSistema.getMonth() +1) + "/" + fechaSistema.getDate() + "/" + fechaSistema.getFullYear();

    tdFechaPagos.innerText = formarFecha;

    var socio = firebase.database().ref('socios/'+txtPinSocio.value);

    socio.once('value', function(snapshot) {

        var pagos = firebase.database().ref('socios/'+txtPinSocio.value+'/pasgos_sostenimiento/');
        pagos.on('value', function(pagosData) {

            tablePagosSostenimiento.innerHTML = '';
            var pagos               = pagosData.val();
            var i                   = 1;
            var totalSumaAbonos     = 0;

            $.each(pagos, function(index, item) {

                tablePagosSostenimiento.innerHTML += "<tr>"+
                        "<td style='padding-left: 6px; width: 115px;'>"+item.RECIBO+"</td>"+
                        "<td style='padding-left: 6px; width: 115px;'>"+item.NUMERORECIBO+"</td>"+
                        "<td style='padding-left: 6px; width: 230px;'>"+item.FECHA+"</td>"+
                        "<td style='padding-left: 6px; width: 245px;'>"+item.ENTIDAD+"</td>"+
                        "<td style='padding-left: 6px; width: 245px;'>"+formatNumber.new(item.ABONO, "$")+"</td>"+
                    "</tr>";
                totalSumaAbonos = parseInt(item.ABONO) + parseInt(totalSumaAbonos);

                idTdTotalPagosSumaAbonos.innerHTML = formatNumber.new(totalSumaAbonos, "$");

            });

        });

    });

}

tabAbonosAcueducto.addEventListener('click', function() {

	cargarDatosTabAcueducto();

});

function cargarDatosTabAcueducto() {

  //obtener mes actual
  var fechaMes = new Date();
  var anioHoy = fechaMes.getFullYear();
  var mesHoy  = fechaMes.getMonth() + 1;
  var anioPago= 2008; 
  var mesPago = 1;
  var aResult = anioHoy - anioPago;
  var aDate   = aResult * 12;
  var mResult = mesHoy - mesPago;
  var totalDate = aDate + mResult; 

  firebase.database().ref('socios/'+txtPinSocio.value+'/abonos_acueducto/').on('value', function(data) {

    var abonos = data.val();
    var totalAbonosAcueducto = 0;
    var totalUltimoMes       = 0;

    tableAportesParaAcueducto.innerHTML = '';
    $.each(abonos, function(i, it) {
      

      //total abonos acueducto
      totalAbonosAcueducto = parseInt(it.ABONO) + parseInt(totalAbonosAcueducto);
      idTotalAbonosAcueducto.innerText = formatNumber.new(totalAbonosAcueducto, '$');
      idTdAbonosActual.innerHTML = formatNumber.new(totalAbonosAcueducto, "$");

      //calcular total a pargar mes actual
      setTimeout(function(){
        if(it.NUMERO === totalDate) {        

          tableAportesParaAcueducto.innerHTML += "<tr>"+
          "<td style='padding-left: 6px; width: 78px; background:black; color:white;'>"+it.NUMERO+"</td>"+
          "<td style='padding-left: 6px; width: 79px; background:black; color:white;'>"+it.NUMERORECIBO+"</td>"+
          "<td style='padding-left: 6px; width: 157px; background:black; color:white;'>"+it.CORTEMES+"</td>"+
          "<td style='padding-left: 6px; width: 157px; background:black; color:white;'>"+formatNumber.new(it.ABONO, '$')+"</td>"+
          "<td style='padding-left: 6px; width: 165px; background:black; color:white;'>"+it.ENTIDAD+"</td>"+
          "<td style='padding-left: 6px; width: 157px; background:black; color:white;'>"+formatNumber.new(it.INTERESES, '$')+"</td>"+
          "<td style='padding-left: 6px; width: 157px; background:black; color:white;'>"+formatNumber.new(it.PASAN, '$')+"</td>"+
          "</tr>";

          /*validando si el socio tiene o no una deuda*/
          firebase.database().ref('socios/'+txtPinSocio.value).on('value', function(snapshotSocio) {
            var datosSocio = snapshotSocio.val();
            setTimeout(function() {
              switch(datosSocio.ESTADO_DEUDA_ACUEDUCTO) {
                case "finalizada":
                  idUltimoMes.innerText = "$0";
                  idTdTotalMesMora.innerHTML = "$0";
                  totalFinalAfinalAPagarFacturacionAcueducto = 0;

                break;
                default:
                  idUltimoMes.innerText = 0;
                  //idUltimoMes.innerText = formatNumber.new(parseInt(it.PASAN) - parseInt(totalAbonosAcueducto), "$");
                  idUltimoMes.innerText = formatNumber.new(parseInt(it.PASAN), "$");

                  idTdTotalMesMora.innerHTML = 0;
                  //idTdTotalMesMora.innerHTML = formatNumber.new(parseInt(it.PASAN) - parseInt(totalAbonosAcueducto), "$");
                  idTdTotalMesMora.innerHTML = formatNumber.new(parseInt(it.PASAN), "$");

                  totalFinalAfinalAPagarFacturacionAcueducto = 0;
                  totalFinalAfinalAPagarFacturacionAcueducto = it.PASAN;          
              }
            },2000);
          });
          /*fin validacion deudas del socio*/

          tdTdMesMora.innerHTML = it.NUMERO;
          
        } else {
          tableAportesParaAcueducto.innerHTML += "<tr>"+
          "<td style='padding-left: 6px; width: 78px;'>"+it.NUMERO+"</td>"+
          "<td style='padding-left: 6px; width: 79px;'>"+it.NUMERORECIBO+"</td>"+
          "<td style='padding-left: 6px; width: 157px;'>"+it.CORTEMES+"</td>"+
          "<td style='padding-left: 6px; width: 157px;'>"+formatNumber.new(it.ABONO, '$')+"</td>"+
          "<td style='padding-left: 6px; width: 165px;'>"+it.ENTIDAD+"</td>"+
          "<td style='padding-left: 6px; width: 157px;'>"+formatNumber.new(it.INTERESES, '$')+"</td>"+
          "<td style='padding-left: 6px; width: 157px;'>"+formatNumber.new(it.PASAN, '$')+"</td>"+
          "</tr>";
        }
      },500);

    });
  });

}

tabVias1.addEventListener('click', function() {

  cargarDatosTabVias1();

});

function cargarDatosTabVias1() {

  //obtener mes actual
  var fechaMes = new Date();
  var anioHoy = fechaMes.getFullYear();
  var mesHoy  = fechaMes.getMonth() + 1;
  var anioPago= 2014; 
  var mesPago = 5;

  var aResult = anioHoy - anioPago;
  var aDate   = aResult * 12;

  var mResult = mesHoy - mesPago;
  var totalDateVias1 = aDate + mResult; 

  firebase.database().ref('socios/'+txtPinSocio.value+'/abonos_vias1/').on('value', function(data) {

    var abonosVias1         = data.val();
    var totalAbonosVias1    = 0;
    var totalUltimoMesVias1 = 0;
    idTotalAbonosVias1.innerText      = 0;
    idUltimoMesVias1.innerText        = 0;

    tableAportesParaVias1.innerHTML = '';
    $.each(abonosVias1, function(i, it) {
      
      //total abonos vias 1
      totalAbonosVias1 = parseInt(it.ABONO) + parseInt(totalAbonosVias1);
      idTotalAbonosVias1.innerText = formatNumber.new(totalAbonosVias1, '$');
      idTdVias1Abono.innerHTML = formatNumber.new(totalAbonosVias1, "$");

      setTimeout(function() {
        if(it.NUMERO === totalDateVias1) {

          /*validando si el socio tiene o no una deuda*/
          firebase.database().ref('socios/'+txtPinSocio.value).on('value', function(snapshotSocio) {
            var datosSocio = snapshotSocio.val();
            setTimeout(function() {
              switch(datosSocio.ESTADO_DEUDA_VIAS1) {
                case "finalizada":
                  idUltimoMesVias1.innerText = "$0";
                  idTdTotalVias1MesMora.innerHTML = "$0";
                  totalFinalAfinalAPagarFacturacionVias1 = 0;

                break;
                default:
                  idUltimoMesVias1.innerText = 0;
                  //idUltimoMesVias1.innerText = formatNumber.new(parseInt(it.PASAN) - parseInt(totalAbonosVias1), "$");
                  idUltimoMesVias1.innerText = formatNumber.new(parseInt(it.PASAN), "$");

                  idTdTotalVias1MesMora.innerHTML = 0;
                  //idTdTotalVias1MesMora.innerHTML = formatNumber.new(parseInt(it.PASAN) - parseInt(totalAbonosVias1), "$");
                  idTdTotalVias1MesMora.innerHTML = formatNumber.new(parseInt(it.PASAN), "$");

                  totalFinalAfinalAPagarFacturacionVias1 = 0;
                  totalFinalAfinalAPagarFacturacionVias1 = it.PASAN;          
              }
            },2000);
          });

          idTdVias1MesMora.innerHTML = it.NUMERO;
          /*fin validacion deudas del socio*/

          /*idUltimoMesVias1.innerText = formatNumber.new(parseInt(it.PASAN) - parseInt(totalAbonosVias1), "$");
          idTdTotalVias1MesMora.innerText = formatNumber.new(parseInt(it.PASAN) - parseInt(totalAbonosVias1), "$");
          idTdVias1MesMora.innerHTML = it.NUMERO;
          totalFinalAfinalAPagarFacturacionVias1 = it.PASAN;  */      

          tableAportesParaVias1.innerHTML += "<tr>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 78px;  background:black; color:white;'>"+it.NUMERO+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 79px;  background:black; color:white;'>"+it.NUMERORECIBO+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 157px; background:black; color:white;'>"+it.CORTEMES+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 157px; background:black; color:white;'>"+formatNumber.new(it.ABONO, '$')+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 165px; background:black; color:white;'>"+it.ENTIDAD+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 157px; background:black; color:white;'>"+formatNumber.new(it.INTERESES, '$')+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 157px; background:black; color:white;'>"+formatNumber.new(it.PASAN, '$')+"</td>"+
          "</tr>";
        } else {
          tableAportesParaVias1.innerHTML += "<tr>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 78px;'>"+it.NUMERO+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 79px;'>"+it.NUMERORECIBO+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 157px;'>"+it.CORTEMES+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 157px;'>"+formatNumber.new(it.ABONO, '$')+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 165px;'>"+it.ENTIDAD+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 157px;'>"+formatNumber.new(it.INTERESES, '$')+"</td>"+
          "<td id='idTdItVias1' style='padding-left: 6px; width: 157px;'>"+formatNumber.new(it.PASAN, '$')+"</td>"+
          "</tr>";
        }
      },500);

    });
  });

}

tabVias2.addEventListener('click', function() {

  cargarDatosTabVias2();

});

function cargarDatosTabVias2() {

  //obtener mes actual
  var fechaMes = new Date();
  var anioHoy = fechaMes.getFullYear();
  var mesHoy  = fechaMes.getMonth() + 1;
  var anioPago= 2014; 
  var mesPago = 7;

  var aResult = anioHoy - anioPago;
  var aDate   = aResult * 12;

  var mResult = mesHoy - mesPago;
  var totalDateVias2 = aDate + mResult;

  firebase.database().ref('socios/'+txtPinSocio.value+'/abonos_vias2/').on('value', function(data) {

    var abonosVias2         = data.val();
    var totalAbonosVias2    = 0;
    var totalUltimoMesVias2 = 0;
    idTotalAbonosVias2.innerText      = 0;
    idUltimoMesVias2.innerText        = 0;

    tableAportesParaVias2.innerHTML = '';
    $.each(abonosVias2, function(i, it) {
      
      //total abonos vias 1
      totalAbonosVias2 = parseInt(it.ABONO) + parseInt(totalAbonosVias2);
      idTotalAbonosVias2.innerText = formatNumber.new(totalAbonosVias2, '$');
      idTdVias2Abono.innerHTML = formatNumber.new(totalAbonosVias2, "$");

      setTimeout(function() {
        if(it.NUMERO === totalDateVias2) {

          /*validando si el socio tiene o no una deuda*/
          firebase.database().ref('socios/'+txtPinSocio.value).on('value', function(snapshotSocio) {
            var datosSocio = snapshotSocio.val();
            setTimeout(function() {
              switch(datosSocio.ESTADO_DEUDA_VIAS2) {
                case "finalizada":
                  idUltimoMesVias2.innerText = "$0";
                  idTdTotalVias2MesMora.innerHTML = "$0";
                  totalFinalAfinalAPagarFacturacionVias2 = 0;

                break;
                default:
                  idUltimoMesVias2.innerText = 0;
                  //idUltimoMesVias2.innerText = formatNumber.new(parseInt(it.PASAN) - parseInt(totalAbonosVias2), '$');
                  idUltimoMesVias2.innerText = formatNumber.new(parseInt(it.PASAN), '$');

                  idTdTotalVias2MesMora.innerHTML = 0;
                  //idTdTotalVias2MesMora.innerHTML = formatNumber.new(parseInt(it.PASAN) - parseInt(totalAbonosVias2), '$');
                  idTdTotalVias2MesMora.innerHTML = formatNumber.new(parseInt(it.PASAN), '$');

                  totalFinalAfinalAPagarFacturacionVias2 = 0;
                  totalFinalAfinalAPagarFacturacionVias2 = it.PASAN;          
              }
            },2000);
          });

          idTdVias2MesMora.innerText = it.NUMERO;

          /*idUltimoMesVias2.innerText = formatNumber.new(parseInt(it.PASAN) - parseInt(totalAbonosVias2), '$');
          idTdVias2MesMora.innerText = it.NUMERO;
          idTdTotalVias2MesMora.innerText = formatNumber.new(parseInt(it.PASAN) - parseInt(totalAbonosVias2), '$');
          totalFinalAfinalAPagarFacturacionVias2 = it.PASAN;*/

          tableAportesParaVias2.innerHTML += "<tr>"+
          "<td style='padding-left: 6px; width: 78px;  background:black; color:white;'>"+it.NUMERO+"</td>"+
          "<td style='padding-left: 6px; width: 79px;  background:black; color:white;'>"+it.NUMERORECIBO+"</td>"+
          "<td style='padding-left: 6px; width: 157px; background:black; color:white;'>"+it.CORTEMES+"</td>"+
          "<td style='padding-left: 6px; width: 157px; background:black; color:white;'>"+formatNumber.new(it.ABONO, '$')+"</td>"+
          "<td style='padding-left: 6px; width: 165px; background:black; color:white;'>"+it.ENTIDAD+"</td>"+
          "<td style='padding-left: 6px; width: 157px; background:black; color:white;'>"+formatNumber.new(it.INTERESES, '$')+"</td>"+
          "<td style='padding-left: 6px; width: 157px; background:black; color:white;'>"+formatNumber.new(it.PASAN, '$')+"</td>"+
          "</tr>";
        } else {
          tableAportesParaVias2.innerHTML += "<tr>"+
          "<td style='padding-left: 6px; width: 78px;'>"+it.NUMERO+"</td>"+
          "<td style='padding-left: 6px; width: 79px;'>"+it.NUMERORECIBO+"</td>"+
          "<td style='padding-left: 6px; width: 157px;'>"+it.CORTEMES+"</td>"+
          "<td style='padding-left: 6px; width: 157px;'>"+formatNumber.new(it.ABONO, '$')+"</td>"+
          "<td style='padding-left: 6px; width: 165px;'>"+it.ENTIDAD+"</td>"+
          "<td style='padding-left: 6px; width: 157px;'>"+formatNumber.new(it.INTERESES, '$')+"</td>"+
          "<td style='padding-left: 6px; width: 157px;'>"+formatNumber.new(it.PASAN, '$')+"</td>"+
          "</tr>";
        }
      },500);
      
    });
  });

}

btnTabContabilidad.addEventListener('click', function() {

  cargarDatosTabContabilidad();

});

function cargarDatosTabContabilidad() {

  firebase.database().ref('/socios').on('value', function(snapshot) {
    idTableContabilidadAcueducto.innerHTML = '';   
    idTableContabilidadVias1.innerHTML     = ''; 
    idTableContabilidadVias2.innerHTML     = '';   
    var sumTotalAbonosAcueductoSocios = 0; 
    var sumTotalAbonosVias1Socios     = 0;
    var sumTotalAbonosVias2Socios     = 0;   
    var snap = snapshot.val();    
    var i = 1;
    for(i = 1; i < snap.length; i++) {      
      firebase.database().ref('/socios/'+i+'/abonos_acueducto').on('value', function(data) {        
        var dataVal = data.val();
        $.each(dataVal, function(index, item) {
          sumTotalAbonosAcueductoSocios = parseInt(item.ABONO) + parseInt(sumTotalAbonosAcueductoSocios);
          idTableContabilidadAcueducto.innerHTML = "<tr><td>TOTAL ABONOS ACUEDUCTO: " + formatNumber.new(sumTotalAbonosAcueductoSocios, "$")+"</td</tr>";
        });
      });
      firebase.database().ref('/socios/'+i+'/abonos_vias1').on('value', function(data) {        
        var dataVal = data.val();
        $.each(dataVal, function(index, item) {
          sumTotalAbonosVias1Socios = parseInt(item.ABONO) + parseInt(sumTotalAbonosVias1Socios);
          idTableContabilidadVias1.innerHTML = "<tr><td>TOTAL ABONOS VIAS 1: " + formatNumber.new(sumTotalAbonosVias1Socios, "$")+"</td</tr>";
        });
      });
      firebase.database().ref('/socios/'+i+'/abonos_vias2').on('value', function(data) {        
        var dataVal = data.val();
        $.each(dataVal, function(index, item) {
          sumTotalAbonosVias2Socios = parseInt(item.ABONO) + parseInt(sumTotalAbonosVias2Socios);
          idTableContabilidadVias2.innerHTML = "<tr><td>TOTAL ABONOS VIAS 2: " + formatNumber.new(sumTotalAbonosVias2Socios, "$")+"</td</tr>";
        });
      });
    }
  });
}

btnTabFinalizarDeuda.addEventListener('click', function() {

  firebase.database().ref('socios/').on('value', function(snapshot) {
    selectFinalizarDeudaSocio.innerHTML = '';
    var socios = snapshot.val();
    var i = 1;
    for(i = 1; i < socios.length; i++) {
      selectFinalizarDeudaSocio.innerHTML += "<option value='"+i+"'>"+i+': '+socios[i].NOMBRE+"</option>";      
    }
  });

});

idBtnFinalizarDeuda.addEventListener('click', function() {

  var socio = selectFinalizarDeudaSocio.value;
  var deuda = selectFinalizarDeudaCuenta.value;
  var datosActualar = {};

  var confirmarFinalizarDeuda = confirm("¿ESTA SEGURO QUE DESEA FINALIZAR LA ( "+ deuda +" ) DEL SOCIO ( "+ socio +" ), RECUERDE QUE ESTE PROCESO NO ES REVERTIBLE.?");
  if (confirmarFinalizarDeuda == true) {
      
      switch(deuda) {
        case "DEUDA ACUEDUCTO":
          datosActualar = {
            ESTADO_DEUDA_ACUEDUCTO: "finalizada"
          };
        break;
        case "DEUDA VIAS 1":
          datosActualar = {
            ESTADO_DEUDA_VIAS1: "finalizada"
          };
        break;
        case "DEUDA VIAS 2":
          datosActualar = {
            ESTADO_DEUDA_VIAS2: "finalizada"
          }
        break;
      }

      firebase.database().ref('socios/'+socio).update(datosActualar);

  } else {
    
  }

});


}());
