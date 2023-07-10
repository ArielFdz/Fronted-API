$(function () {  

    $.ajax({
      url: "https://rssapi-production.up.railway.app/news",
      type: 'GET',
      data: '',
      success: function (respuesta) {
        console.log(respuesta);
        mostrarNoticias(respuesta);
      }
    });
  
})

//-----------------------------------------------------------------------------------------------------------------

const mostrarNoticias = (noticias) => {
    main.innerHTML = "";
    noticias.forEach((noticia) => {
  
      const parser = new DOMParser();
      const doc = parser.parseFromString(noticia.html, 'text/html');
      const imgs = doc.querySelectorAll('img');
      const elementoNoticia = document.createElement("div");
      elementoNoticia.classList.add("noticia");
      if(imgs.length==0){      
        elementoNoticia.innerHTML = '<img src="' + noticia.image.see + '" alt="' + noticia.title + '"/><div class="noticia-info"><h3>' + noticia.title + '</h3><span class="' + noticia.pubDate + '">' + noticia.pubDate + '</span></div><div class="overview"><h3>Descripción</h3>' + noticia.content + '</br><a href="'+noticia.image.download+'">Descargar</a></div>';
      }
      
      /*else{
        elementoNoticia.innerHTML = '<img src="' + noticia.image.see + '" alt="' + noticia.title + '"/><div class="noticia-info"><h3>' + noticia.title + '</h3><span class="' + noticia.pubDate + '">' + noticia.pubDate + '</span></div><div class="overview"><h3>Descripción</h3>' + noticia.content + '</br><a href="'+noticia.image.download+'">Descargar</a></div>';
      }*/
      main.appendChild(elementoNoticia);
    });
};

//-----------------------------------------------------------------------------------------------------------------

$('#btnAgregar').click(function () {
  ajaxAgregar();
});

function ajaxAgregar(){
  var inputs = document.getElementById('rss').value;
  const jsonData = { "rssUrl": inputs };

  $.ajax({
    url: "https://rssapi-production.up.railway.app/rss",
    type: 'POST',
    data: jsonData,
    success: function (response) {
      Swal.fire({
        icon: 'success',
        title: 'Operación realizada con éxito!',
        text: 'El rss ha sido registrado correctamente',
        allowOutsideClick: false,
      }).then((result) =>{
        if(result.isConfirmed){
          setTimeout(function(){location.href="index.html"} , 500);
        }
      });
    },
    error: function (response) {
      const respuesta = response.responseText;
      var res = JSON.parse(respuesta);
      if (res.statusCode === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'La Url no es valida!',
          allowOutsideClick: false,
        });
      }
    }
  });
}

//-----------------------------------------------------------------------------------------------------------------

$('#btnActualizar').click(function () {
  Swal.fire({
    title: 'Actualizar',
    text: "Las noticias se actualizarán",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, actualizar!',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "https://rssapi-production.up.railway.app/rss",
        type: 'PATCH',
        data: '',
        success: function (respuesta) {
          Swal.fire({
            icon: 'success',
            title: 'Operación realizada con éxito!',
            text: 'Las noticias han sido actualizadas correctamente',
            allowOutsideClick: false,
          }).then((result) =>{
            if(result.isConfirmed){
              setTimeout(function(){location.href="index.html"} , 500);
            }
          });
        },
        error: function (response) {
          const respuesta = response.responseText;
          var res = JSON.parse(respuesta);
          if (res.statusCode === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error!',
              allowOutsideClick: false,
            });
          }
        },
      });
    }
  })
});

//-----------------------------------------------------------------------------------------------------------------

document.getElementById("search").onsearch = function () { buscar() };

function buscar() {

  var busqueda = document.getElementById("search").value;
  // console.log(busqueda);
  //busca que coincida en todos los filtros
  //se puede filtrar por content, title, contentSnippet y rss
  var url = 'https://rssapi-production.up.railway.app/news?title='+ busqueda+'';
  // console.log(url);
  $.ajax({
    url: url,
    type: 'GET',
    success: function (res) {
      console.log(res);
      mostrarNoticias(res);    
    }
  });
}

//-----------------------------------------------------------------------------------------------------------------
