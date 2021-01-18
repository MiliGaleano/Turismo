// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyCwGvtP0rMYw199TURTG6Z9H9VO1XFjBBY",
    authDomain: "turismo-28bce.firebaseapp.com",
    databaseURL: "https://turismo-28bce.firebaseio.com",
    projectId: "turismo-28bce",
    storageBucket: "turismo-28bce.appspot.com",
    messagingSenderId: "1034753195771",
    appId: "1:1034753195771:web:2c90aafd938c7bb4093a5e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  let db = firebase.firestore();
  let storage = firebase.storage();
  let storageRef = firebase.storage().ref();


// carousel
let timeout;
let slideIndex = 1;

function plusSlides(n) {
  showSlides(slideIndex += n);
  clearTimeout(timeout);
  autoslide();
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "flex";  
}

function autoslide() {
    timeout = setTimeout(function(){ plusSlides(1) }, 8000);
}


// regiones
let regiones = [
    {region: 'Litoral', texto: 'La región del Litoral abarca a seis provincias del noreste argentino, las que atesoran lugares que impactan por su fascinante belleza natural y son un gran atractivo turístico internacional. Está comprendida por las costas y zonas cercanas al Río Paraná, Río Paraguay, Río Uruguay y las islas del Delta del Paraná.', img:'img/region1.jpg'},
    {region: 'Norte', texto: 'Esta región es ante todo, una geografía de notables contrastes, extraordinaria belleza paisajística y riqueza cultural. La aridez de la Puna; la exuberante selva de las Yungas; planicies santiagueñas casi a nivel del mar, y los más de 6.800 metros de la Cordillera de los Andes.', img:'img/region2.jpg'},
    {region: 'Costa', texto: 'La Costa Atlántica destaca por sus amplias playas, algunas de las cuales permanecen vírgenes, los médanos y los bosques que se extienden a lo largo de la costa, dando lugar al nacimiento de pequeños asentamientos, ideales para el descanso, que si bien comparten ciertos rasgos geográficos, se diferencian notablemente unas de otras.', img:'img/region3.jpg'},
    {region: 'Centro', texto: 'La región Centro está compuesta por las provincias de Córdoba, La Pampa, Entre Ríos y Santa Fe. Se caracteriza en su mayor parte por llanuras y concentra grandes aglomerados urbanos y suburbanos. El clima tiene variaciones cálidas y húmedas, alcanzando altas temperaturas durante la época de verano.', img:'img/region4.jpg'},
    {region: 'Cuyo', texto: 'La Región de Cuyo se ubica sobre la Cordillera de los Andes y se extiende hasta el sur de las sierras pampeanas, abarcando a las provincias de Mendoza, San Juan y San Luis. En el cordón montañoso de los Andes, se erige el Aconcagua (6.959 m.s.n.m.) que atrae a los aventureros de todo el mundo en busca de alcanzar la cumbre más alta de América.', img:'img/region5.jpg'},
    {region: 'Patagonia', texto: 'La mítica Patagonia atesora escenarios naturales increíbles. Cumbres de volcanes con géiseres y aguas termales; montañas de donde descienden enormes glaciares, lagos y ríos. Encantadores valles y aldeas de montaña rodeadas de bosques autóctonos milenarios, o extensos campos de estepa.', img:'img/region6.jpg'}
]

function mostrarRegion(x, y) {
    document.getElementById('h1region').innerHTML = x.region;
    document.getElementById('pregion').innerHTML = x.texto;
    // document.getElementById('imgregion').setAttribute('src', x.img);
    // document.getElementById('divimgregion').setAttribute('background-image', 'url('+x.img+')');
    document.getElementById('divimgregion').style.backgroundImage = 'url('+x.img+')';
    let listofimg = document.getElementById('divpngs').getElementsByTagName('img');
    for (let i = 0; i < listofimg.length; i++) {
        listofimg[i].setAttribute('class', "regionpng");
    }
    document.getElementById(y.id).setAttribute('class', "regionpng active");
}


// API clima openweather
// https://openweathermap.org/api

// datos para url de openweather
let openweather = "https://api.openweathermap.org/data/2.5/forecast?",
    tempactual = "https://api.openweathermap.org/data/2.5/weather?",
    q = "q=", 
    idioma = "&lang=sp",
    grados = "&units=metric",
    apiKey = "&appid=117c1cebe56ecdb7718f1b279aaa75d7",
    infoclima;

    // Mapas here
    // https://developer.here.com/documentation/maps/3.1.19.2/dev_guide/index.html

    // Inicializo la plataforma para el mapa con mi apikey
    let platform = new H.service.Platform({
        'apikey': 'ZN0DVG6NHOjgmKmIRqORIZtGGgQVHMdnSxqdBWX5_2A'
    });

    let defaultLayers = platform.createDefaultLayers();

    // coordenadas iniciales: Buenos Aires 
    let coordenadas= {
        lat: -34.61,
        lng: -58.38
        }

    // Inicializo el mapa dandole zoom y coordenadas iniciales: Buenos Aires
    let map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map,
        {
            zoom: 12,
            center: coordenadas
        });

    // estilos del mapa: lenguaje español
    let ui = H.ui.UI.createDefault(map, defaultLayers, 'es-ES');

    // Habilitar los eventos dentro del mapa
    let mapEvents = new H.mapevents.MapEvents(map);

    function habilitarEventoTap(map) {
        // Agregar event listener tap
        map.addEventListener('tap', function (evt) {
          console.log(evt.type, evt.currentPointer.type);
          // obtener las coordenadas del lugar clickeado
          var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
          console.log(coord);
          // redondear coordenadas 
          let newlat= redondeo(coord.lat, 2);
          let newlng= redondeo(coord.lng, 2);
          // armar url para hacer el fetch de openweather con coordenadas   
          let coordenadasNuevas = 'lat=' + newlat + '&lon=' + newlng;
          let fetchCoord = tempactual + coordenadasNuevas + idioma + grados + apiKey;
          // llamo funcion que vuelca datos de clima
          temperaturaCiudad(fetchCoord);
        });
      }

    // permitir uso de eventos en mapa
    let behavior = new H.mapevents.Behavior(mapEvents);


    // funcion buscar ciudad por nombre
    function buscarCiudad() {
        // obtener valor ingresado
        let ciudadBuscada = document.getElementById('nombreCiudad').value;
        console.log(ciudadBuscada);
        // comprobar que se haya ingresado un valor
        if (ciudadBuscada === "") {
            alert("Ingrese una ciudad");
        } else {
            // armar url para hacer el fetch de openweather con nombre
            let fetchNombre = tempactual + q + ciudadBuscada +idioma + grados + apiKey;
            // llamo funcion que ubica en mapa y vuelca datos de clima
            temperaturaCiudad(fetchNombre);
        }
    }

    let ciudadAbuscar = { lat: 0, lng: 0 }

    // funcion que ubica en mapa y vuelca datos de clima
    function temperaturaCiudad(x) {
        fetch(x)
        .then(function(response) {
            infoclima = response;
            console.log(infoclima);
            return response.json();
        })
        .then(function(data){
        console.log(data);
        // obtengo coordenadas y ubico en mapa
        ciudadAbuscar.lat= data.coord.lat;
        ciudadAbuscar.lng= data.coord.lon;
        map.setCenter(ciudadAbuscar);
        // vuelco datos de clima en el html
        document.getElementById("iconoClima").setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.weather[0].icon +'@2x.png');
        document.getElementById("nombreciudad").innerHTML= data.name;
        document.getElementById("tempactual").innerHTML= Math.round(data.main.temp) + '°';
        document.getElementById("senstermica").innerHTML= 'ST: ' + Math.round(data.main.feels_like) + '°';
        document.getElementById("descripcionclima").innerHTML= data.weather[0].description;
        document.getElementById('errorbusqueda').style.display= 'none';
        })
        .catch(function(err) {
            console.log(err);
            document.getElementById('errorbusqueda').style.display= 'flex';  
        });
    }



        //funcion que trae datos del clima a 3 dias
        function climaExtendido(y,z){
            // traigo datos del clima actual
            fetch(tempactual + q + y + idioma + grados + apiKey)
            .then(function(response) {
                infoclima = response;
                console.log(infoclima);
                return response.json();
            })
            .then(function(data){
                console.log(data);
                // vuelco datos de clima actual en el html
                document.getElementById("nombrecapital").innerHTML= data.name;
                document.getElementById("iconoClimahoy").setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.weather[0].icon +'@2x.png');
                document.getElementById("tempactualhoy").innerHTML= Math.round(data.main.temp) + '°';
                document.getElementById("senstermicahoy").innerHTML= 'ST: ' + Math.round(data.main.feels_like) + '°';
                document.getElementById("descripcionclimahoy").innerHTML= data.weather[0].description;
            })
            .catch(function(err) {
                console.log(err);
            });

            // traigo datos del clima extendido
            fetch(openweather + q + y + idioma + grados + apiKey)
            .then(function(response) {
                infoclima = response;
                console.log(infoclima);
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                // ubico en el mapa
                ciudadAbuscar.lat= data.city.coord.lat;
                ciudadAbuscar.lng= data.city.coord.lon;
                map.setCenter(ciudadAbuscar);
                crearMarcador(z.data().marcadores);
                if (z.data().setzoom !== 0){
                    map.setZoom(z.data().setzoom);
                }
                // vuelco datos de clima en el html
                // obtengo fecha de los datos traidos 
                let fechahoracero = data.list[0].dt_txt;
                function fechaClima(x){
                    let fechacero = x.split(' ')[0];
                    let fechahoy = fechacero.split('-');
                    let reverse = fechahoy.reverse();
                    reverse.pop();
                    let fechafinal = reverse.join('-');
                    return fechafinal;
                }
                function horaclima(x){
                    let horacero = x.split(' ')[1];
                    let horahoy = horacero.split(':');
                    horahoy.pop();
                    let horafinal = horahoy.join(':');
                    return horafinal;
                }
                let horacero = fechahoracero.split(' ')[1];
                let contenedorHoy = document.getElementById('pronosticohoy');
                let contenedorExt = document.getElementById('climaExtendido');
                //  compruebo la primer hora recibida. la data traida es de 6 horas mas tarde.
                if (horacero === '00:00:00') { 
                    // son entre las 6 y las 9 de la noche.
                    contenedorHoy.getElementsByTagName('h2')[3].innerHTML= Math.round(data.list[0].main.temp) + '°';
                    contenedorHoy.getElementsByTagName('img')[3].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon +'@2x.png');
                    contenedorHoy.getElementsByTagName('p')[3].innerHTML= horaclima(data.list[0].dt_txt);
                    for (let x = 0; x < 4; x++) {
                        contenedorExt.getElementsByTagName('p')[x].innerHTML= fechaClima(data.list[x*8].dt_txt);
                        for (let i= 0; i<16; i++) {
                            contenedorExt.getElementsByTagName('h1')[i].innerHTML= Math.round(data.list[(i*2)+2].main.temp) + '°';
                        }
                        contenedorExt.getElementsByTagName('img')[x].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(x*8)+5].weather[0].icon +'@2x.png');
                        contenedorExt.getElementsByTagName('h2')[x].innerHTML= data.list[(x*8)+5].weather[0].description;
                    }
                } 
                else if (horacero === '03:00:00') {
                    // son enter las 9 y las 12 de la noche.
                    contenedorHoy.getElementsByTagName('h2')[3].innerHTML= Math.round(data.list[0].main.temp) + '°';
                    contenedorHoy.getElementsByTagName('img')[3].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon +'@2x.png');
                    contenedorHoy.getElementsByTagName('p')[3].innerHTML= horaclima(data.list[0].dt_txt);
                    for (let x = 0; x < 4; x++) {
                        contenedorExt.getElementsByTagName('p')[x].innerHTML= fechaClima(data.list[x*8].dt_txt);
                        for (let i= 0; i<16; i++) {
                            contenedorExt.getElementsByTagName('h1')[i].innerHTML= Math.round(data.list[(i*2)+1].main.temp) + '°';
                        }
                        contenedorExt.getElementsByTagName('img')[x].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(x*8)+4].weather[0].icon +'@2x.png');
                        contenedorExt.getElementsByTagName('h2')[x].innerHTML= data.list[(x*8)+4].weather[0].description;
                    }              
                }
                else if (horacero === '06:00:00') {
                    for (let i= 0; i < 4; i++) {
                        contenedorHoy.getElementsByTagName('h2')[i].innerHTML= Math.round(data.list[i*2].main.temp) + '°';
                        contenedorHoy.getElementsByTagName('img')[i].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[i*2].weather[0].icon +'@2x.png');
                        contenedorHoy.getElementsByTagName('p')[i].innerHTML= horaclima(data.list[i*2].dt_txt);
                    }
                    for (let x = 0; x < 4; x++) {
                        contenedorExt.getElementsByTagName('p')[x].innerHTML= fechaClima(data.list[(x*8)+8].dt_txt);
                        for (let i= 0; i<16; i++) {
                            contenedorExt.getElementsByTagName('h1')[i].innerHTML= Math.round(data.list[(i*2)+8].main.temp) + '°';
                        }
                        contenedorExt.getElementsByTagName('img')[x].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(x*8)+11].weather[0].icon +'@2x.png');
                        contenedorExt.getElementsByTagName('h2')[x].innerHTML= data.list[(x*8)+11].weather[0].description;
                    }  
                }
                else if (horacero === '09:00:00') {
                    for (let i=1; i < 4; i++) {
                        contenedorHoy.getElementsByTagName('h2')[i].innerHTML= Math.round(data.list[(i*2)-1].main.temp) + '°';
                        contenedorHoy.getElementsByTagName('img')[i].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(i*2)-1].weather[0].icon +'@2x.png');
                        contenedorHoy.getElementsByTagName('p')[i].innerHTML= horaclima(data.list[(i*2)-1].dt_txt);
                    }
                    for (let x = 0; x < 4; x++) {
                        contenedorExt.getElementsByTagName('p')[x].innerHTML= fechaClima(data.list[(x*8)+7].dt_txt);
                        for (let i= 0; i<16; i++) {
                            contenedorExt.getElementsByTagName('h1')[i].innerHTML= Math.round(data.list[(i*2)+7].main.temp) + '°';
                        }
                        contenedorExt.getElementsByTagName('img')[x].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(x*8)+10].weather[0].icon +'@2x.png');
                        contenedorExt.getElementsByTagName('h2')[x].innerHTML= data.list[(x*8)+10].weather[0].description;
                    }  
                    contenedorHoy.getElementsByTagName('h2')[0].innerHTML= Math.round(data.list[0].main.temp) + '°';
                    contenedorHoy.getElementsByTagName('img')[0].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon +'@2x.png');
                    contenedorHoy.getElementsByTagName('p')[0].innerHTML= horaclima(data.list[0].dt_txt);

                }
                else if (horacero === '12:00:00') {
                    for (let i= 1; i < 4; i++) {
                        contenedorHoy.getElementsByTagName('h2')[i].innerHTML= Math.round(data.list[(i*2)-2].main.temp) + '°';
                        contenedorHoy.getElementsByTagName('img')[i].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(i*2)-2].weather[0].icon +'@2x.png');
                        contenedorHoy.getElementsByTagName('p')[i].innerHTML= horaclima(data.list[(i*2)-2].dt_txt);
                    }
                    for (let x = 0; x < 4; x++) {
                        contenedorExt.getElementsByTagName('p')[x].innerHTML= fechaClima(data.list[(x*8)+6].dt_txt);
                        for (let i= 0; i<16; i++) {
                            contenedorExt.getElementsByTagName('h1')[i].innerHTML= Math.round(data.list[(i*2)+6].main.temp) + '°';
                        }
                        contenedorExt.getElementsByTagName('img')[x].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(x*8)+9].weather[0].icon +'@2x.png');
                        contenedorExt.getElementsByTagName('h2')[x].innerHTML= data.list[(x*8)+9].weather[0].description;
                    }                 
                }
                else if (horacero === '15:00:00') {
                    for (let i= 2; i < 4; i++) {
                        contenedorHoy.getElementsByTagName('h2')[i].innerHTML= Math.round(data.list[(i*2)-3].main.temp) + '°';
                        contenedorHoy.getElementsByTagName('img')[i].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(i*2)-3].weather[0].icon +'@2x.png');
                        contenedorHoy.getElementsByTagName('p')[i].innerHTML= horaclima(data.list[(i*2)-3].dt_txt);
                    }
                    for (let x = 0; x < 4; x++) {
                        contenedorExt.getElementsByTagName('p')[x].innerHTML= fechaClima(data.list[(x*8)+5].dt_txt);
                        for (let i= 0; i<16; i++) {
                            contenedorExt.getElementsByTagName('h1')[i].innerHTML= Math.round(data.list[(i*2)+5].main.temp) + '°';
                        }
                        contenedorExt.getElementsByTagName('img')[x].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(x*8)+8].weather[0].icon +'@2x.png');
                        contenedorExt.getElementsByTagName('h2')[x].innerHTML= data.list[(x*8)+8].weather[0].description;
                    }  
                    contenedorHoy.getElementsByTagName('h2')[1].innerHTML= Math.round(data.list[0].main.temp) + '°';
                    contenedorHoy.getElementsByTagName('img')[1].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon +'@2x.png');
                    contenedorHoy.getElementsByTagName('p')[1].innerHTML= '12:00'
                }
                else if (horacero === '18:00:00') {
                    for (let i= 2; i < 4; i++) {
                        contenedorHoy.getElementsByTagName('h2')[i].innerHTML= Math.round(data.list[(i*2)-4].main.temp) + '°';
                        contenedorHoy.getElementsByTagName('img')[i].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(i*2)-4].weather[0].icon +'@2x.png');
                        contenedorHoy.getElementsByTagName('p')[i].innerHTML= horaclima(data.list[(i*2)-4].dt_txt);
                    }
                    for (let x = 0; x < 4; x++) {
                        contenedorExt.getElementsByTagName('p')[x].innerHTML= fechaClima(data.list[(x*8)+4].dt_txt);
                        for (let i= 0; i<16; i++) {
                            contenedorExt.getElementsByTagName('h1')[i].innerHTML= Math.round(data.list[(i*2)+4].main.temp) + '°';
                        }
                        contenedorExt.getElementsByTagName('img')[x].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(x*8)+7].weather[0].icon +'@2x.png');
                        contenedorExt.getElementsByTagName('h2')[x].innerHTML= data.list[(x*8)+7].weather[0].description;
                    }  
                }
                else if (horacero === '21:00:00') {
                        contenedorHoy.getElementsByTagName('h2')[3].innerHTML= Math.round(data.list[1].main.temp) + '°';
                        contenedorHoy.getElementsByTagName('img')[3].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[1].weather[0].icon +'@2x.png');
                        contenedorHoy.getElementsByTagName('p')[3].innerHTML= horaclima(data.list[1].dt_txt);
                    for (let x = 0; x < 4; x++) {
                        contenedorExt.getElementsByTagName('p')[x].innerHTML= fechaClima(data.list[(x*8)+3].dt_txt);
                        for (let i= 0; i<16; i++) {
                            contenedorExt.getElementsByTagName('h1')[i].innerHTML= Math.round(data.list[(i*2)+3].main.temp) + '°';
                        }
                        contenedorExt.getElementsByTagName('img')[x].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[(x*8)+6].weather[0].icon +'@2x.png');
                        contenedorExt.getElementsByTagName('h2')[x].innerHTML= data.list[(x*8)+6].weather[0].description;
                    }  
                    contenedorHoy.getElementsByTagName('h2')[2].innerHTML= Math.round(data.list[0].main.temp) + '°';
                    contenedorHoy.getElementsByTagName('img')[2].setAttribute('src', 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon +'@2x.png');
                    contenedorHoy.getElementsByTagName('p')[2].innerHTML= '18:00'
                }
            })
            .catch(function(err) {
                console.log(err);
            });
        }

    // funcion crear marcador en mapa
    function crearMarcador(x){
        for (let i = 0; i < x.length; i++) {
            let svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41.5 55.9" height="50">' +
            '<style type="text/css">.st0{fill:#7BCDDB;}</style>'+
            '<g id="Capa_2">'+
            '<path class="st0" d="M21.9,2c0.4,0,1.1,0,1.5,0.4c7.1,1.1,12,4.9,15,11.3c2.2,5.6,1.9,11.3-0.7,16.5c-3,5.3-6,10.5-9,15.7 c-1.1,2.2-2.2,4.1-3.8,6.4c-1.5,2.6-5.3,3-7.1,0.7c-0.4-0.4-0.8-0.7-0.8-1.1C12.9,45.1,9.1,38,5,31.3c-1.9-3.4-3-6.8-3-10.5 c0-5.6,2.2-10.5,6.8-14.2c2.6-2.2,6-3.8,9.4-4.1c0.4,0,1.1,0,1.5-0.4C20.8,2,21.1,2,21.9,2z M14,19.6c0,3.8,3,6.8,6.8,6.8 s6.8-3,6.8-6.8s-3-6.8-6.8-6.8S14,15.9,14,19.6z"/>'+
            '</g></svg>';

            // Create an icon, an object holding the latitude and longitude, and a marker:
            let icon = new H.map.Icon(svgMarkup),
                coords = {lat: x[i].lat, lng: x[i].lng},
                marker = new H.map.Marker(coords, {icon: icon}),
                bubble = new H.ui.InfoBubble(coords, {content: '<p class="bubble" id="'+x[i].name+'" onclick="openNoticia(this)">'+x[i].name+'</p>'});
                bubble.close();
                ui.addBubble(bubble);
            // Add event
            marker.addEventListener('tap', function (evt) {
                bubble.open();
            });
            // Add the marker to the map:
            map.addObject(marker);
        }
    }

    // funcion fecha
    function obtenerFecha() {
        var year = (new Date()).getFullYear();
        var actualmonth = (new Date()).getMonth();
        var month = actualmonth + 1;
        var day = (new Date()).getDate();
        if (day < 10 ){ day='0'+day.toString(); 
        var fecha = year.toString() +'-'+ month.toString() +'-'+ day;
        }
        else {var fecha = year.toString() +'-'+ month.toString() +'-'+ day.toString();}
        console.log(fecha);
        return fecha;
    }

    // funcion redonderar numero
    function redondeo(numero, decimales) {
        var flotante = parseFloat(numero);
        var resultado = Math.round(flotante*Math.pow(10,decimales))/Math.pow(10,decimales);
        return resultado;
    }

    // ARR PROVINCIAS
    let mapaprovs = [
        {nombre: 'Catamarca', 
        superficie: '102.602 Km²',
        poblacion: '367.828 habitantes',
        capital: 'San Fernando del Valle de Catamarca',
        texto: 'El territorio presenta dos tipos de clima: cálido (con las variantes tropical serrano y andino puneño) y árido (en sierras y bolsones). Las precipitaciones medias anuales oscilan entre 400 y 500 mm en el Este, con marcada disminución hacia el Oeste, compensada parcialmente por nieves. Las medias anuales son de 20°C. en el Este y centro, registrándose marcas de hasta 45°C. en verano.', 
        mapa:'img/catamarca.svg',
        fotos:['img/catamarca0.jpg', 'img/catamarca1.jpg', 'img/catamarca2.jpg'],
        imperdibles:['El shincal', 'Campo de Piedra Pomez', 'Volcán Carachi Pampa', 'Volcan Galan', 'Las Pirquitas', 'Laguna Verde']
        },
        {nombre: 'Buenos Aires', 
        superficie: '307.571 Km²',
        poblacion: '15.625.084 habitantes',
        capital: 'La Plata',
        texto: 'Habitado por querandíes, pampas y tehuelches fue testigo de la llegada de los conquistadores españoles en la primera mitad del siglo XVI. En tiempos de Rosas defendió heroicamente el Puerto, frente al bloqueo de ingleses y franceses. Al federalizarse la ciudad de Buenos Aires en 1880, la Provincia inauguró su capital: La Plata, en 1882. En cuanto al clima, es templado pampeano. Presenta veranos calurosos e inviernos frescos, precipitaciones suficientes y vientos predominantes del Este y Noreste.',
        mapa:'img/buenosaires.svg',
        fotos:['img/bsas0.jpg', 'img/bsas1.jpg', 'img/bsas2.jpg'],
        imperdibles:['Tigre', 'Mar del Plata', 'Bahía Blanca', 'Luján', 'La Plata', 'San Antonio de Areco']
        },
        {nombre: 'Chaco', 
        superficie: '99.633 Km²',
        poblacion: '1.055.259 habitantes',
        capital: 'Resistencia',
        texto: 'Nuestros habitantes son el resultado de un encuentro de culturas. Contamos con una de las mayores poblaciones originarias del territorio nacional: wichís, quom y mocovíes, a los que se sumaron posteriormente criollos e inmigrantes europeos. Desde 2010 los idiomas qom, moqoit y wichí son idiomas oficiales alternativos en nuestra provincia.',       
        mapa:'img/chaco.svg',
        fotos:['img/Resistencia3.jpg', 'img/Resistencia4.jpg', 'img/Resistencia5.jpg'],
        imperdibles:['El Impenetrable', 'Parque Nacional Chaco', 'Parque Nacional Provi', 'Humedales', 'Campos del cielo', 'Aguas termales']
        },
        {nombre: 'Chubut', 
        superficie: '224.686 Km²',
        poblacion: '509.108 habitantes',
        capital: 'Rawson',
        texto: 'Nuestro territorio estaba poblado por pueblos originarios, particularmente los tsonk, a quienes los españoles denominaron tehuelches o patagones. Luego del primer avistaje de la expedición de Magallanes en 1520, se sucedieron en él recorridas de misioneros y asentamientos provisorios. A mediados del XIX acogimos una importante colonización galesa. Y fuimos Territorio Nacional hasta 1955, en que adquirimos nuestro estatus provincial.',   
        mapa:'img/chubut.svg',
        fotos:['img/Rawson3.jpg', 'img/Rawson5.jpg', 'img/Rawson6.jpg'],
        imperdibles:['Puerto Madryn', 'Esquel', 'Parque Nacional Los Alerces', 'La trochita', 'La Hoya', 'Península Vales']
        },
        {nombre: 'Córdoba', 
        superficie: '165.321 Km²',
        poblacion: '3.308.876 habitantes',
        capital: 'Córdoba',
        texto: 'Territorio mediterráneo con montañas, ríos, lagos, arroyos, llanuras, áreas verdes y boscosas, originalmente poblado por comechingones, olongastas y algunos pueblos influenciados por la cultura guaraní, vio llegar a los conquistadores españoles en el siglo XVI. La provincia alumbró grandes hechos que tuvieron notable incidencia en la vida institucional del país, como la Reforma Universitaria en 1918 y el Cordobazo en 1969.',
        mapa:'img/cordoba.svg',
        fotos:['img/Córdoba3.jpg', 'img/Córdoba4.jpg', 'img/Córdoba5.jpg'],
        imperdibles:['Villa Grl. Belgrano', 'Cerro Uritorco', 'Carlos Paz', 'Mina Clavero', 'Calamuchita', 'Champaquí']
        },
        {nombre: 'Corrientes', 
        superficie: '88.199 Km²',
        poblacion: '992.595 habitantes',
        capital: 'Corrientes',
        texto: 'Corrientes se encuentra entre dos ríos: el Uruguay (al este) y el Paraná (al oeste y norte), que constituyen las fronteras naturales de su territorio. Abarca la región aproximada que sus antiguos habitantes, los guaraníes, denominaban Taragüí. En 2004 el idioma guaraní fue declarado idioma oficial alternativo.El clima predominante es subtropical sin estación seca, con precipitaciones abundantes y temperaturas elevadas de escasas variaciones diarias y estacionales, sobre todo en el NO.',    
        mapa:'img/corrientes.svg',
        fotos:['img/Corrientes3.jpg', 'img/Corrientes4.jpg', 'img/Corrientes5.jpg'],
        imperdibles:['Esteros del Ibera', 'Yapeyú', 'Paso de la Patria', 'Yacyretá', 'Mburucuyá', 'Monte Caseros']
        },
        {nombre: 'Entre Ríos', 
        superficie: '78.781 Km²',
        poblacion: '1.235.994 habitantes',
        capital: 'Paraná',
        texto: 'Ubicada en la región centroeste del país, forma parte geográficamente de la Mesopotamia e integra políticamente la Región Centro, junto con las Provincias de Córdoba y Santa Fe. A la llegada de los españoles, la costa del Paraná estaba poblada por Chaná-Timbúes, considerados los primeros habitantes que trabajaron la madera, el cuero, el hueso y la piedra. Representantes de la cultura charrúa, minuán, chaná, guaraní o querandí, (hábiles cazadores, agricultores y pescadores) dejarían huellas indelebles en nuestro territorio.',
        mapa:'img/entrerios.svg',
        fotos:['img/Paraná6.jpg', 'img/Paraná3.jpg', 'img/Paraná5.jpg'],
        imperdibles:['Gualeguaychú', 'Palmares', 'Paraná', 'Colón', 'Concordia', 'Termas']
        },
        {nombre: 'Formosa', 
        superficie: '72.066 Km²',
        poblacion: '530.162 habitantes',
        capital: 'Formosa',
        texto: 'Nuestro territorio, habitado por tres grandes pueblos originarios: tobas, matacos y pilagás, vio arribar a los primeros conquistadores españoles en 1528, quienes le dieron el apelativo de Fermosa (Hermosa, en el castellano antiguo).Respecto del clima, es cálido y la temperatura media oscila en los 22° C., aunque en verano puede llegar hasta los 45° C. Según la época, se debate entre la escasez y el exceso de humedad.',        
        mapa:'img/formosa.svg',
        fotos:['img/Formosa3.jpg', 'img/Formosa5.jpg', 'img/Formosa6.jpg'],
        imperdibles:['Bañado la Estrella', 'Río Pilcomayo', 'Río Bermejo']
        },
        {nombre: 'Jujuy', 
        superficie: '53.219 Km²',
        poblacion: '673.307 habitantes',
        capital: 'San Salvador de Jujuy',
        texto: 'Situada en la Región del Norte Grande Argentino, al iniciarse la conquista española, estas tierras ya estaban pobladas por diversos pueblos originarios, en especial quechuas. En la lucha por la independencia, el pueblo jujeño, a instancias de Belgrano, protagonizó una de las gestas más valerosas de la historia argentina, cuyo sacrificio se vio coronado por las victorias decisivas de Tucumán y Salta.',
        mapa:'img/jujuy.svg',
        fotos:['img/jujuy0.jpg', 'img/jujuy1.jpg', 'img/jujuy2.jpg'],
        imperdibles:['Tilcara', 'Salinas Grandes', 'Humahuaca', 'Purmamarca', 'Calilegua', 'Laguna de los Pozuelos']
        },
        {nombre: 'La Pampa', 
        superficie: '143.440 Km²',
        poblacion: '318.951 habitantes',
        capital: 'Santa Rosa',
        texto: 'La presencia humana más antigua data de hace 8.600 años. A su llegada, los españoles hallaron un territorio vasto y llano habitado por diversos pueblos originarios, a los que llamaron pampas (conocidos también como tehuelches, querandíes y puelches). Esta tierra conoció grandes guerreros como Namuncurá o Calfulcurá, fue testigo doloroso de la campaña del Desierto comandada por el Gral. Julio A. Roca en 1879 y acogió luego la inmigración agrícola con ánimo generoso. Adquirió su estatuto de Provincia en 1951.',
        mapa:'img/lapampa.svg',
        fotos:['img/LaPampa5.jpg', 'img/LaPampa4.jpg', 'img/LaPampa6.jpg'],
        imperdibles:['Colonia Menonita', 'Parque Nacional Lihué Calel', 'Colonia Baron', 'Leuvocó', 'Guatraché']
        },
        {nombre: 'La Rioja', 
        superficie: '89.680 Km²',
        poblacion: '333.642 habitantes',
        capital: 'La Rioja',
        texto: 'Nuestro territorio, poblado por los diaguitas, vio la llegada de los españoles a mediados del siglo XVI y fue testigo de la valiente resistencia indígena. En los años de la lucha por la independencia, el cabildo local apoyó la Revolución de Mayo. En 1820 obtuvimos la autonomía. El clima que predomina en nuestro territorio es el semiárido y con escasa humedad. En las zonas bajas, los veranos son muy calurosos y los inviernos cortos y con bajas temperaturas.',
        mapa:'img/larioja.svg',
        fotos:['img/larioja4.jpg', 'img/larioja5.jpg', 'img/larioja6.jpg'],
        imperdibles:['Laguna Brava', 'Talampaya', 'Cañón de Anchumbil', 'Sanagasta', 'Museo de los caudillos']
        },
        {nombre: 'Mendoza', 
        superficie: '148.827 Km²',
        poblacion: '1.738.929 habitantes',
        capital: 'Mendoza',
        texto: 'Nuestro territorio, poblado por puelches y etnias de diversos linajes, vio la llegada de los conquistadores españoles provenientes del Perú a mediados del siglo XVI, integrándose al Virreinato del Río de la Plata desde su creación en 1776. El aporte de Mendoza a las luchas por la independencia nacional fue decisivo. Aquí, con el apoyo de nuestros compatriotas, San Martín levantó el campamento de Las Heras en el paraje El Plumerillo, donde conformó el Ejército de los Andes.',        
        mapa:'img/mendoza.svg',
        fotos:['img/Mendoza3.jpg', 'img/Mendoza4.jpg', 'img/Mendoza6.jpg'],
        imperdibles:['Caminos de Uspallata', 'Puentes del Inca', 'Cañón del Atuel', 'Aconcagua', 'Valle Grande', 'Ruta de los vinos']
        },
        {nombre: 'Misiones', 
        superficie: '29.801 Km²',
        poblacion: '1.101.593 habitantes',
        capital: 'Posadas',
        texto: 'La conformación de nuestra sociedad ha sido fruto de un largo y enriquecedor proceso de construcción sociocultural, debido al entrecruzamiento de guaraníes, jesuitas, inmigrantes y criollos, lo que dio forma a lo que es hoy un pueblo respetuoso de la diversidad y pluralidad. Respecto del clima, es subtropical sin estación seca, lo que convierte a nuestro territorio en uno de los más húmedos del país.',
        mapa:'img/misiones.svg',
        fotos:['img/Posadas3.jpg', 'img/Posadas4.jpg', 'img/Posadas6.jpg'],
        imperdibles:['Cataratas', 'Parque Iguazú', 'San Ignacio', 'Saltos del Moconá', 'Ruta de la yerba mate', 'Reserva San Antonio']
        },
        {nombre: 'Neuquén', 
        superficie: '94.078 Km²',
        poblacion: '551.266 habitantes',
        capital: 'Neuquén',
        texto: 'La Provincia toma su nombre del río homónimo, cuya voz proviene del mapudungun Newenken (que significa "correntoso") o del araucano Ñedquén (traducido como "atrevido y audaz"). Varias etnias: picunche; pehuenche y puelche, huarpes; tehuelche septentrionales y huilliche habitaron esta tierra, previo al proceso de araucanización mapuche. Las primeras exploraciones españolas datan del siglo XVI. El territorio fue testigo del asentamiento de la primera misión jesuita en 1653, de la campaña militar de Juan Manuel de Rosas en 1833 y de la denominada Conquista del Desierto dirigida por Julio A. Roca en 1879.',
        mapa:'img/neuquen.svg',
        fotos:['img/Neuquén3.jpg', 'img/Neuquén5.jpg', 'img/Neuquén4.jpg'],
        imperdibles:['Los Bolillos', 'Nahuel Huapi', 'Villa La Angostura', 'San Martín de los Andes', 'Reservorio Paleontológico', 'Los Arrayanes']
        },
        {nombre: 'Río Negro', 
        superficie: '203.013 Km²',
        poblacion: '638.645 habitantes',
        capital: 'Viedma',
        texto: 'Formamos parte de la Región de la Patagonia, eje de encadenamientos de atractivos de alto valor patrimonial que nacen en la Cordillera de los Andes y llegan hasta el Océano Atlántico. Antes de la llegada de los españoles, nuestro territorio cobijó cuatro etnias de pueblos originarios: Tehuelches, Puelches, Huarpes o Pehuenches y Mapuches.',
        mapa:'img/rionegro.svg',
        fotos:['img/Viedma3.jpg', 'img/Viedma4.jpg', 'img/Viedma5.jpg'],
        imperdibles:['Bariloche', 'Nahuel Huapi', 'El Bolsón', 'Viedma', 'Carmen de Patagones']
        },
        {nombre: 'Salta', 
        superficie: '155.488 Km²',
        poblacion: '1.214.441 habitantes',
        capital: 'Salta',
        texto: 'Situado en la actual Región del Noroeste Argentino, nuestro territorio estaba y está habitado por atacamas y calchaquíes. Bastión en la guerra de la Independencia, fue invadido varias veces por los españoles, a quienes Martín Miguel de Güemes opuso férrea resistencia. Con la decisiva batalla de Salta, Belgrano logró que todo el NOA quedase libre en 1813.A pesar de situarse en una zona tropical, su clima es cálido, aunque con variaciones bastante marcadas, en función de lo variado de su relieve.',
        mapa:'img/salta.svg',
        fotos:['img/Salta3.jpg', 'img/Salta6.jpg', 'img/Salta5.jpg'],
        imperdibles:['Iruya', 'Salinas Grandes', 'Cafayate', 'Baritú', 'Los Cardones', 'Museo Güemes']
        },
        {nombre: 'San Juan', 
        superficie: '89.651 Km²',
        poblacion: '681.055 habitantes',
        capital: 'San Juan',
        texto: 'Nuestra tierra, habitada por huarpes y diaguitas, vio la llegada de los conquistadores españoles provenientes de Chile a mediados del siglo XVI, integrándose luego al Virreinato del Río de la Plata a partir de su creación. Aportó hombres y recursos materiales al Ejército de los Andes y al Congreso reunido en Tucumán en 1816 el pensamiento de sus diputados Fray Justo Santa María de Oro y Francisco Narciso de Laprida, quien presidió la sesión que declaró nuestra independencia.',
        mapa:'img/sanjuan.svg',
        fotos:['img/sanjuan0.jpg', 'img/sanjuan1.jpg', 'img/sanjuan2.jpg'],
        imperdibles:['Valle de la Luna', 'Valle Fertil', 'Valle de Tullum Ullum y Zonda', 'Casa de Sarmiento', 'Parque Nacional San Guillermo', 'Ruta del Vino']
        },
        {nombre: 'San Luis', 
        superficie: '76.748 Km²',
        poblacion: '432.310 habitantes',
        capital: 'San Luis',
        texto: 'San Luis integra la Región del Nuevo Cuyo y está ubicada estratégicamente en el centro geográfico del Corredor Bioceánico que une los puertos de Buenos Aires (Argentina) y Valparaíso (Chile). Nuestro territorio, habitado por diversas naciones indígenas: huarpes, diaguitas, comechingones, vio la llegada del conquistador español en el siglo XVI. Fuimos, más tarde, la primera provincia como ciudad Cabildo en adherir al movimiento Revolucionario de Mayo de 1810.',
        mapa:'img/sanluis.svg',
        fotos:['img/sanluis0.jpg', 'img/sanluis1.jpg', 'img/sanluis2.jpg'],
        imperdibles:['Sierras de Los Comechingones', 'Sierras de las Quijadas', 'Merlo', 'Salinas del Bebedero', 'Parque Astronómico de la Punta']
        },
        {nombre: 'Santa Cruz', 
        superficie: '243.943 Km²',
        poblacion: '273.964 habitantes',
        capital: 'Río Gallegos',
        texto: 'Antes de la llegada de los primeros europeos, nuestro actual territorio ubicado en la región patagónica, estaba habitado por poblaciones indígenas pertenecientes a la cultura tehuelche. Las primeras incursiones españolas en el siglo XVI tuvieron carácter exploratorio y un siglo más tarde se registraron asentamientos con carácter más estable. Entre 1878 y 1920 tuvo lugar un importante crecimiento, basado en la explotación ovina, y hacia 1950 las grandes oleadas migratorias hicieron de Santa Cruz un polo de atracción poblacional vinculado a la actividad minera.',
        mapa:'img/santacruz.svg',
        fotos:['img/RíoGallegos3.jpg', 'img/RíoGallegos4.jpg', 'img/RíoGallegos5.jpg'],
        imperdibles:['Glaciar Perito Moreno', 'Cuevas de Walichu', 'Cuevas de las Manos', 'El Chaltén', 'Ruta Azul', 'Río Gallegos']
        },
        {nombre: 'Santa Fe', 
        superficie: '133.007 Km²',
        poblacion: '3.194.537 habitantes',
        capital: 'Santa Fe',
        texto: 'Nuestro territorio, inicialmente poblado por Tobas, Guaraníes, Mocovíes, Pilagás, Guaycurúes, Querandíes, Abipones, Timbúes, Quiloazas, Mocoretás y Corondas, fue testigo del primer asentamiento europeo en 1527: el fuerte de Sancti Spíritu, por parte de Sebastián Gaboto. Casi cincuenta años más tarde, don Juan de Garay habría de fundar la ciudad de Santa Fe. En tiempos de la lucha por la independencia dependió de Buenos Aires hasta 1815, en que designó su propio gobernador y fue referente insoslayable del ideario federal, encarnado en Estanislao Lopez.',
        mapa:'img/santafe.svg',
        fotos:['img/santafe0.jpg', 'img/santafe1.jpg', 'img/santafe2.jpg'],
        imperdibles:['Rosario', 'Río Paraná', 'Puente colgante', 'San Lorenzo', 'Islas de Santa Fé']
        },
        {nombre: 'Santiago del Estero', 
        superficie: '136.351 Km²',
        poblacion: '874.006 habitantes',
        capital: 'Santiago del Estero',
        texto: 'Nuestro territorio, habitado por los toconotés, lules, vilelas, mocovíes y sanavirones, fue testigo de la llegada de los conquistadores españoles en la primera mitad del siglo XVI y de la fundación de nuestra capital por Juan Núñez de Prado, llegando a ser ésta la ciudad más antigua del país. Ya en el período independiente, obtuvimos nuestra autonomía al separarnos de la Gobernación de Tucumán en 1820, a instancias de Juan Felipe Ibarra, quien encarnó la defensa del ideario federal.',
        mapa:'img/santiagodelestero.svg',
        fotos:['img/santiago0.jpg', 'img/santiago1.jpg', 'img/santiago2.jpg'],
        imperdibles:['Guasayán', 'Sumampa', 'Termas de Río Hondo', 'Isla Tara Inti', 'Marcha de los Bombos', 'Pampa de los Guanacos']
        },
        {nombre: 'Tierra del Fuego', 
        superficie: '987.168 km²',
        poblacion: '127.205 habitantes',
        capital: 'Ushuaia',
        texto: 'Habitada desde hace aproximadamente 10.000 años por selknam u onas, manneken -ambos grupos integrantes del complejo tehuelches-, yámanas y alacalufes, esta tierra que integra la Región Patagónica, vio llegar a los marinos españoles comandados por Fernando de Magallanes en 1520. Fue testigo de hechos dolorosos de nuestra historia, como la ocupación británica de las Islas Malvinas en 1833, la matanza de los pueblos originarios desde 1880 hasta bien entrada la década de 1920 y el enfrentamiento bélico contra Gran Bretaña por la recuperación de las Islas en 1982.',
        mapa:'img/tierradelfuego.svg',
        fotos:['img/Ushuaia5.jpg', 'img/Ushuaia4.jpg', 'img/Ushuaia6.jpg'],
        imperdibles:['Canal Beagle', 'Museo del fin del mundo', 'Montes Martial', 'Laguna Esmeralda', 'Ushuaia']
        },
        {nombre: 'Tucumán', 
        superficie: '22.524 km²',
        poblacion: '1.448.188 habitantes',
        capital: 'San Miguel de Tucumán',
        texto: 'Habitada desde hace aproximadamente 10.000 años por selknam u onas, manneken -ambos grupos integrantes del complejo tehuelches-, yámanas y alacalufes, esta tierra que integra la Región Patagónica, vio llegar a los marinos españoles comandados por Fernando de Magallanes en 1520. Fue testigo de hechos dolorosos de nuestra historia, como la ocupación británica de las Islas Malvinas en 1833, la matanza de los pueblos originarios desde 1880 hasta bien entrada la década de 1920 y el enfrentamiento bélico contra Gran Bretaña por la recuperación de las Islas en 1982.',
        mapa:'img/tucuman.svg',
        fotos:['img/tucuman0.jpg', 'img/tucuman1.jpg', 'img/tucuman2.jpg'],
        imperdibles:['Tafi del Valle', 'Las Ruinas', 'Amaicha del Valle', 'San Jose de Lules', 'Aconquija']
        },
        {nombre: 'Islas Malvinas', 
        superficie: '12.173 km²',
        poblacion: '2.840 habitantes',
        capital: 'Puerto Argentino',
        texto: 'Islas Malvinas es una derivación del topónimo francés îles Malouines, nombre dado por el navegante francés Louis Antoine de Bougainville en 1764, quien fundó el primer asentamiento de las islas en Puerto Soledad, en recuerdo del puerto de Saint-Malo en Francia. Dicha localidad fue el punto de partida para sus barcos y colonos. Las islas forman parte del departamento Islas del Atlántico Sur de la provincia de Tierra del Fuego, Antártida e Islas del Atlántico Sur, cuya capital es Ushuaia.',
        mapa:'img/islasmalvinas.svg',
        fotos:['img/Malvinas4.jpg', 'img/Malvinas5.jpg', 'img/Malvinas6.jpg'],
        imperdibles:['Puerto Argentino', 'Cabo San Felipe', 'Cementerio de Darwin', 'Isla Soledad']
        },
]

function mostrarprov(x,y) {
    let completardata = document.getElementsByClassName('completardata');
    completardata[0].innerHTML= mapaprovs[x].nombre;
    if (mapaprovs[x].capital === 'Puerto Argentino') {
        completardata[0].setAttribute('id', 'Rincon%20Grande%20Settlement');}
    else if (mapaprovs[x].capital === 'La Rioja') {
            completardata[0].setAttribute('id', 'La%20Rioja%20Province');}
    else if (mapaprovs[x].capital === 'Santa Rosa') {
        completardata[0].setAttribute('id', 'La%20Pampa%20Province');}
    else { completardata[0].setAttribute('id', mapaprovs[x].capital.replaceAll(' ', '%20'));}
    completardata[0].setAttribute('onclick', 'abrirPag(this)');
    completardata[1].innerHTML= 'Superficie: ' + mapaprovs[x].superficie;
    completardata[2].innerHTML= 'Población: ' + mapaprovs[x].poblacion;
    completardata[3].innerHTML= 'Capital: ' + mapaprovs[x].capital;
    completardata[4].innerHTML= mapaprovs[x].texto;
    completardata[5].setAttribute('src', mapaprovs[x].mapa);
    let fotosprov = document.getElementsByClassName('fotosprovs');
    for (let i=0; i< fotosprov.length; i++) {
        fotosprov[i].setAttribute('src', mapaprovs[x].fotos[i]);
    }
    let impcompletar = document.getElementsByClassName('completarimp');
    for (let i=0; i< impcompletar.length; i++) {
        impcompletar[i].innerHTML = mapaprovs[x].imperdibles[i];
    }
    for (let i=0; i< impcompletar.length; i++) {
        if (impcompletar[i].innerHTML === 'undefined') {
            impcompletar[i].innerHTML = '';
        }
    }
    let ultimaSeleccion = document.getElementsByClassName('seleccionado');
    console.log(ultimaSeleccion);
    if (ultimaSeleccion.length !== 0 ) {
        ultimaSeleccion[0].setAttribute('class', 'hover');
    }
    document.getElementById(y.id).setAttribute('class', 'seleccionado');
}

function abrirPag(x){
    localStorage.setItem('idProv', x.id);
    window.location.assign('provincia.html');
}

function cargarProv(){
    let newProv = localStorage.getItem('idProv');
    db.collection('ciudades').where('__name__',"==",newProv).get().then((query) => {  
        const thing = query.docs[0];
        document.getElementById('provmenu').innerHTML= thing.data().nombre;
        let imagenes = document.getElementsByClassName('imagenprov');
        for (let i = 0; i < imagenes.length; i++) {
            let gsReference = storage.refFromURL('gs://turismo-28bce.appspot.com/'+newProv+i+'.jpg');
            gsReference.getDownloadURL()
                .then(function(url) {
                imagenes[i].style.backgroundImage= 'url('+url+')';
            }).catch(function(error) {
                console.log("Error: ", error);
            });
        }
        let noticias = document.getElementsByClassName('notiprov');
        for (let i = 0; i < noticias.length; i++) {
            noticias[i].innerHTML= thing.data().noticias[i];
        }
        document.getElementById('provtitulo').innerHTML= thing.data().nombre + ': Destacados';
        let destacados = document.getElementsByClassName('provdest');
        for (let i = 0; i < destacados.length; i++) {
            destacados[i].innerHTML= thing.data().destacados[i];
        }
        let descriprov = document.getElementsByClassName('descriprov');
        for (let i = 0; i < descriprov.length; i++) {
            descriprov[i].innerHTML= thing.data().categorias[i];
        }
        climaExtendido(newProv, thing);
    })
    .catch(function(error) {
        console.log("Error: " , error);
        });
}

