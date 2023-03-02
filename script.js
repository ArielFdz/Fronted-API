let desde =0;
let ultimaURL = "";
let busquedaRealizada = "";

var loading = document.getElementById("loading-overlay");
loading.style.display = "none";

//-----------------------------------------------------------------------------------------------------------------

$(function () {  

  $.ajax({
    url: "https://rssapi-production.up.railway.app/noticias/fecha?limite=20&desde=0&busqueda=",
    type: 'GET',
    data: '',
    success: function (respuesta) {
      console.log(respuesta);
      mostrarNoticias(respuesta);
    }
  });

  if(desde==0){
    $.each($('a.moveLeft'), function(index, value) {
      $(this).css('pointer-events','none');
      $(this).css('cursor','not-allowed');
    }); 
  }

  $.ajax({
    url: 'https://rssapi-production.up.railway.app/noticias/fecha?limite=20&desde=20&busqueda=',
    type: 'GET',
    data: '',
    success: function (respuesta) {      
      if(respuesta.length==0){
        $.each($('a.moveRight'), function(index, value) {
          $(this).css('pointer-events','none');
          $(this).css('cursor','not-allowed');
        });
      }
    }
  });

})

//-----------------------------------------------------------------------------------------------------------------

document.getElementById("search").onsearch = function () { buscar() };

function buscar() {
  loading.style.display = "block";

  var busqueda = document.getElementById("search").value;
  busquedaRealizada=busqueda;
  desde=0;
  var filtro = document.getElementById("styledSelect1");
  var bandera=desde+20;
  $.ajax({
    url: 'https://rssapi-production.up.railway.app/noticias/fecha?busqueda='+ busquedaRealizada+'&limite=20&desde='+desde+'',
    type: 'GET',
    success: function (res) {
      loading.style.display = "none";
      mostrarNoticias(res);    
    }
  });

  if(busqueda!=""){
    filtro.style.display = "none";
  }else{
    filtro.style.display = "block";
    filtro.value="fecha";
  }

  $.each($('a.moveRight'), function(index, value) {
    $(this).css('pointer-events','all');
    $(this).css('cursor','allowed');
  });

  $.ajax({
    url: 'https://rssapi-production.up.railway.app/noticias/fecha?busqueda='+ busquedaRealizada+'&limite=20&desde='+bandera+'',
    type: 'GET',
    data: '',
    success: function (respuesta) {  
      loading.style.display = "none";    
      if(respuesta.length==0){
        $.each($('a.moveRight'), function(index, value) {
          $(this).css('pointer-events','none');
          $(this).css('cursor','not-allowed');
        });
      }
    }
  });
  loading.style.display = "none";

}

//-----------------------------------------------------------------------------------------------------------------

$('#btnActualizar').click(function () {
  Swal.fire({
    title: '¿Quiere actualizar las noticias?',
    background: '#373b69',
    color: '#fff',
    icon: 'warning',
    showDenyButton: true,
    confirmButtonText: 'Actualizar',
    denyButtonText: `Cancelar`,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      loading.style.display = "block";
      $.ajax({
        url: "https://rssapi-production.up.railway.app/rss",
        type: 'PATCH',
        success: function (res) {
          loading.style.display = "none";
          var resp=ajaxActualizar(res);
          console.log(resp);
          if (resp == "finalizado") {
            Swal.fire({
              title: 'Se han actualizado las noticias!',
              background: '#373b69',
              color: '#fff',
              icon: 'success',
              allowOutsideClick: false,
            }).then((result) =>{
              if(result.isConfirmed){
                setTimeout(function(){location.href="index.html"} , 500);
              }
            });
          }
          else {
            Swal.fire('Ocurrió un error al intentar actualizar las noticias!', '', 'error');
          }
        }
      });

    }
  })


});

function ajaxActualizar(noticias){
  $.ajax({
    url: "https://rssapi-production.up.railway.app/rss",
    type: 'DELETE',
    success: function (res) {
      noticias.forEach((noticia) =>{
        ajaxMethodUpdate(noticia);
      })
    }
  });
  return "finalizado";
}

function ajaxMethodUpdate(datosRss){

  const jsonData = { "url": datosRss.url };

  $.ajax({
    url: "https://rssapi-production.up.railway.app/rss",
    type: 'POST',
    data: jsonData,
    success: function (response) {
      console.log("hecho");
    },
  });
}

//-----------------------------------------------------------------------------------------------------------------

var imagen = "https://static.vecteezy.com/system/resources/previews/010/765/527/non_2x/retro-distressed-sticker-of-a-cartoon-newspaper-vector.jpg";

const mostrarNoticias = (noticias) => {
  main.innerHTML = "";
  noticias.forEach((noticia) => {

    const parser = new DOMParser();
    const doc = parser.parseFromString(noticia.html, 'text/html');
    const imgs = doc.querySelectorAll('img');
    const elementoNoticia = document.createElement("div");
    elementoNoticia.classList.add("noticia");
    if(imgs.length!=0){      
      elementoNoticia.innerHTML = '<img src="' + imgs[0].src + '" alt="' + noticia.titulo + '"/><div class="noticia-info"><h3>' + noticia.titulo + '</h3><span class="' + noticia.fecha + '">' + noticia.fecha + '</span></div><div class="overview"><h3>Descripción</h3>' + noticia.descripcion + '</br><a href="' + noticia.url + '">Leer más...</a></div>';
    }else{
      elementoNoticia.innerHTML = '<img src="' + imagen + '" alt="' + noticia.titulo + '"/><div class="noticia-info"><h3>' + noticia.titulo + '</h3><span class="' + noticia.fecha + '">' + noticia.fecha + '</span></div><div class="overview"><h3>Descripción</h3>' + noticia.descripcion + '</br><a href="' + noticia.url + '">Leer más...</a>'+'</div>';
    }
    

    main.appendChild(elementoNoticia);
  });
};

//-----------------------------------------------------------------------------------------------------------------

$('#btnAgregarRSS').click(function () {
  var html = '';
  html += '<div id="inputFormRow">';
 // html += '<input type="text" name="title[]" placeholder="Ingrese RSS" class="rss" aria-invalid="true"/> ';
  html += '<input type="text" name="title[]" placeholder="Ingrese RSS" class="rss"/> ';
  html += '<input type="button" id="btnQuitarRSS" value="-" class="btnInteraccion" />';
  html += '</div>';

  $('#nuevoInput').append(html);

});

$(document).on('click', '#btnQuitarRSS', function () {
  $(this).closest('#inputFormRow').remove();
});

//-----------------------------------------------------------------------------------------------------------------

function ajaxMethod(inputValue, rssInput){

  const jsonData = { "url": inputValue };

  $.ajax({
    url: "https://rssapi-production.up.railway.app/rss",
    type: 'POST',
    data: jsonData,
    success: function (response) {
      $(rssInput).attr('aria-invalid', false);
    },
    error: function (response) {
      const respuesta = response.responseText;
      var res = JSON.parse(respuesta);

      $(rssInput).attr('aria-invalid', true);

      if (res.message == inputValue + " no válida por el parser") {
        $(rssInput).attr('placeholder', "La URL no pertenece a un RSS");
      } else {
        $(rssInput).attr('placeholder', "Ningun Campo puede estar vacío");
      }
    }
  });
}

$('#btnAgregar').click(function () {
  loading.style.display = "block";
  ajaxAgregar();
  setTimeout(verificarDatos, 4000);


});

function ajaxAgregar(){
  var inputs = document.getElementsByName('title[]');
  $.ajax({
    url: "https://rssapi-production.up.railway.app/rss",
    type: 'DELETE',
    success: function (res) {
      for (var i = 0; i < inputs.length; i++) {
        var rssInput = inputs[i];
        var inputValue = inputs[i].value;
        ajaxMethod(inputValue, rssInput);
      }
    }
  });
}

function verificarDatos(){
  let mensaje="";
  var inputs = document.getElementsByName('title[]');
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    if (input.getAttribute("aria-invalid") === "true") {
      mensaje=mensaje +" '"+input.getAttribute("placeholder") +"'";
    }
  }
  loading.style.display = "none";
  if(mensaje==""){
    Swal.fire({
      title: 'Se ha(n) añadido el(los) RSS!',
      background: '#373b69',
      icon: 'success',
      color: '#fff',
      allowOutsideClick: false,
    }).then((result) => {
      if(result.isConfirmed){
        setTimeout(function(){location.href="index.html"} , 500);
      }
    });
  }else{
    Swal.fire({
      title: mensaje,
      background: '#373b69',
      icon: 'error',
      color: '#fff',
      allowOutsideClick: false,
    })
  }

}

$('#btnCerrarModal').click(function () {
  document.getElementById('rss').value = "";
  $("#rss").removeAttr('aria-invalid');
  document.getElementById("nuevoInput").innerHTML="";
});

//-----------------------------------------------------------------------------------------------------------------

document.getElementById("styledSelect1").addEventListener("change", filtroSeleccionado);

function filtroSeleccionado() {
  var filtro = document.getElementById("styledSelect1").value;
  desde=0;
  document.getElementById("search").value="";
  $.ajax({
    url: 'https://rssapi-production.up.railway.app/noticias/'+filtro+'?limite=20&desde='+desde+'&busqueda='+busquedaRealizada+'',
    type: 'GET',
    data: '',
    success: function (respuesta) {
      mostrarNoticias(respuesta);
      $.each($('a.moveRight'), function(index, value) {
        $(this).css('pointer-events', 'all');
        $(this).css('cursor', 'allowed');
      });
    }
  });
}

//-----------------------------------------------------------------------------------------------------------------

$('#anterior').click(function () {
  var filtroSeleccionado = document.getElementById("styledSelect1").value;
  console.log(filtroSeleccionado);
  if(desde>0){
    desde=desde-20;
    $.ajax({
      url: 'https://rssapi-production.up.railway.app/noticias/'+filtroSeleccionado+'?limite=20&desde='+desde+'&busqueda='+busquedaRealizada+'',
      type: 'GET',
      data: '',
      success: function (respuesta) {
        mostrarNoticias(respuesta);
        if(respuesta.length>0){
          var obj = document.getElementById("siguiente");
          obj.style.removeProperty("pointer-events");
          obj.style.removeProperty("cursor");
        }
      }
    });
  }

  if(desde==0){
    $.each($('a.moveLeft'), function(index, value) {
      $(this).css('pointer-events','none');
      $(this).css('cursor','not-allowed');
    }); 
  }
});

$('#siguiente').click(function () {
  
  desde=desde+20;
  var bandera=desde+20;
  var filtroSeleccionado = document.getElementById("styledSelect1").value;

  if(desde>0){
    var obj = document.getElementById("anterior");
    obj.style.removeProperty("pointer-events", "all");
    obj.style.removeProperty("cursor", "allowed");
  }
  
  $.ajax({
    url: 'https://rssapi-production.up.railway.app/noticias/'+filtroSeleccionado+'?limite=20&desde='+desde+'&busqueda='+busquedaRealizada+'',
    type: 'GET',
    data: '',
    success: function (respuesta) {      
      mostrarNoticias(respuesta);
    }
  });

  $.ajax({
    url: 'https://rssapi-production.up.railway.app/noticias/'+filtroSeleccionado+'?limite=20&desde='+bandera+'&busqueda='+busquedaRealizada+'',
    type: 'GET',
    data: '',
    success: function (respuesta) {      
      if(respuesta.length==0){
        $.each($('a.moveRight'), function(index, value) {
          $(this).css('pointer-events','none');
          $(this).css('cursor','not-allowed');
        });
      }
    }
  });
});

//-----------------------------------------------------------------------------------------------------------------
