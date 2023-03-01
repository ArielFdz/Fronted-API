let desde =0;

$(function () {

  $.ajax({
    url: "https://rssapi-production.up.railway.app/noticias/fecha?limite=20&desde=0",
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

})

document.getElementById("search").onsearch = function () { buscar() };

function buscar() {
  var busqueda = document.getElementById("search").value;

  if (busqueda != "") {
    $.ajax({
      url: "https://rssapi-production.up.railway.app/noticias/fecha?busqueda=" + busqueda,
      type: 'GET',
      success: function (res) {
        mostrarNoticias(res);
      }
    });
  }

}

$('#btnActualizar').click(function () {
  Swal.fire({
    title: '¿Quiere actualizar las noticias?',
    background: '#373b69',
    color: '#fff',
    showDenyButton: true,
    confirmButtonText: 'Actualizar',
    denyButtonText: `Cancelar`,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "https://rssapi-production.up.railway.app/rss",
        type: 'DELETE',
        success: function (res) {
          if (res == "ya") {
            Swal.fire({
              title: 'Se han actualizado las noticias!',
              background: '#373b69',
              color: '#fff',
              allowOutsideClick: false,
            });
          }
          else {
            Swal.fire('Ocurrió un error al intentar actualizar las noticias!', '', 'info');
          }
        }
      });

    }
  })


});

var imagen = "https://static.vecteezy.com/system/resources/previews/010/765/527/non_2x/retro-distressed-sticker-of-a-cartoon-newspaper-vector.jpg";

//MOSTRAR EL JSON RECUPERADO
const mostrarNoticias = (noticias) => {
  main.innerHTML = "";
  noticias.forEach((noticia) => {
    const elementoNoticia = document.createElement("div");
    elementoNoticia.classList.add("noticia");
    elementoNoticia.innerHTML = '<img src="' + imagen + '" alt="' + noticia.titulo + '"/><div class="noticia-info"><h3>' + noticia.titulo + '</h3><span class="' + noticia.fecha + '">' + noticia.fecha + '</span></div><div class="overview"><h3>Descripción</h3>' + noticia.descripcion + '</div>';

    main.appendChild(elementoNoticia);
  });
};

const agregarRSS = () => {
  const div = document.querySelector("bodyModal");
  const elementoRRS = document.createElement("input");
  elementoRRS.classList.add("rss");
  elementoRRS.id.add("rss");
  elementoRRS.type.add("text");
  elementoRRS.placeholder.add("RSS");

  div.appendChild(elementoRRS);

}

$('#btnAgregarRSS').click(function () {
  var html = '';
  html += '<div id="inputFormRow">';
  html += '<input type="text" name="title[]" placeholder="Ingrese RSS" class="rss" aria-invalid="true"/> ';
  html += '<input type="button" id="btnQuitarRSS" value="-" class="btnInteraccion" />';
  html += '</div>';

  $('#nuevoInput').append(html);

});

$(document).on('click', '#btnQuitarRSS', function () {
  $(this).closest('#inputFormRow').remove();
  });

/*  $('#btnQuitarRSS').click(function () {
  
});*/


$('#btnAgregar').click(function () {
  var inputs = document.getElementsByName('title[]');
  for (var i = 0; i < inputs.length; i++) {
    var rssInput= inputs[i];
    var inputValue = inputs[i].value;
    console.log("El valor del input " + (i+1) + " es: " + inputValue);
    if (inputValue != "") {
      const jsonData = { "url": inputValue };
  
      $.ajax({
        url: "https://rssapi-production.up.railway.app/rss",
        type: 'POST',
        data: jsonData,
        success: function (res) {
          Swal.fire('Se ha añadido el RSS!', '', 'success');
          Swal.fire({
            title: 'Se ha añadido el RSS!',
            background: '#373b69',
            color: '#fff',
            allowOutsideClick: false,
          }).then((result) => {
            if(result.isConfirmed){
              setTimeout(function(){location.href="https://arielfdz.github.io/Fronted-API/"} , 2000);
            }
          });

             
          //window.location.href = "https://arielfdz.github.io/Fronted-API/";
          $(rssInput).attr('aria-invalid', false);
        },
        error: function (response) {
          const respuesta = response.responseText;
          var res = JSON.parse(respuesta);
          console.log(res.message);        
          if (res.message == "La url ya está registrada") {
            Swal.fire(res.message, '', 'error');
          } else if (res.message == inputValue + " no válida por el parser") {
            Swal.fire("La URL no pertenece a un RSS", '', 'error');
          } else {
            Swal.fire("Debe proporcionar una URL existente", '', 'error');
          }
  
        }
  
      });
    }else{
      Swal.fire({
        title: 'Necesita agregar algun dato(URL)!',
        background: '#373b69',
        color: '#fff',
        icon: 'error',
      });
    }
  }

});

$('#btnCerrarModal').click(function () {
  document.getElementById('rss').value = "";
});


document.getElementById("styledSelect1").addEventListener("change", filtroSeleccionado);

function filtroSeleccionado() {
  var filtro = document.getElementById("styledSelect1").value;
  console.log(filtro);

  $.ajax({
    url: 'https://rssapi-production.up.railway.app/noticias/'+filtro+'?limite=20',
    type: 'GET',
    data: '',
    success: function (respuesta) {
      console.log(respuesta);
      mostrarNoticias(respuesta);
    }
  });

}

$('#anterior').click(function () {

  if(desde>0){
    desde=desde-20;
    $.ajax({
      url: 'https://rssapi-production.up.railway.app/noticias/fecha?limite=20&desde='+desde+'',
      type: 'GET',
      data: '',
      success: function (respuesta) {
        console.log(respuesta);
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
  console.log("adios");
  desde=desde+20;

  if(desde>0){
    var obj = document.getElementById("anterior");
    obj.style.removeProperty("pointer-events");
    obj.style.removeProperty("cursor");
  }
  

  $.ajax({
    url: 'https://rssapi-production.up.railway.app/noticias/fecha?limite=20&desde='+desde+'',
    type: 'GET',
    data: '',
    success: function (respuesta) {      
      if(respuesta.length==0){
        $.each($('a.moveRight'), function(index, value) {
          $(this).css('pointer-events','none');
          $(this).css('cursor','not-allowed');
        });
      }else{
        mostrarNoticias(respuesta);
      }
    }
  });
  

});


