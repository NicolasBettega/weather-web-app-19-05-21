const d = document;

const api_key = "";
const url_clima = "https://api.openweathermap.org/data/2.5/";
const idioma = "es";
const unit = "metric";

const api_key_map = "";
const url_map = "https://maps.googleapis.com/maps/api/staticmap?";
const v_map = 1;
const tipo_mapa = "place";
const layer = "basic";

const btn = document.getElementById("btnBuscar");
const main = document.getElementById("main");
const nombCiudad = document.getElementById("buscar");
const iframeMap = document.getElementById("mapa");

/*-------------- */

if (localStorage.busqueda) {
  const guardado = JSON.parse(localStorage.busqueda);

  mostrarClima(guardado);
  mapapear(guardado);
}

/*-------------- */

btn.addEventListener("click", () => {
  if (validInputs() == true) {
    console.log(nombCiudad.value);
    buscarCiudad(nombCiudad.value);
  } else {
    console.log(nombCiudad.value);
  }
});

function validInputs() {
  let enviar = true;
  {
    if (nombCiudad.value.length == 0) {
      enviar = false;
      nombCiudad.classList.add("error");
    } else {
      nombCiudad.classList.remove("error");
    }
  }

  return enviar;
}

function buscarCiudad(ciudad) {
  console.log("Palabra", ciudad);

  const fetchPromise = fetch(
    `${url_clima}weather?q=${ciudad}&lang=${idioma}&units=${unit}&appid=${api_key}`
  );

  fetchPromise
    .then((Response) => {
      console.log("resultado", Response);
      return Response.json();
    })
    .then((result) => {
      console.log("Datos", result);
      mostrarClima(result);
      mapapear(result);
    })
    .catch((err) => {
      console.log("Algo fallo", err);
    });
}

function mostrarClima(datos) {
  console.log(datos.cod);

  if (datos.cod == 200) {
    const nomb = datos.name;
    const temp = datos.main.temp;
    const estado = datos.weather[0].description;
    const tempMax = datos.main.temp_max;
    const tempMin = datos.main.temp_min;
    const humedad = datos.main.humidity;
    const senTerm = datos.main.feels_like;
    const preAtmos = datos.main.pressure;
    const velViento = datos.wind.speed;
    const icon = datos.weather[0]["icon"];

    clima = `
            <div class="row text-center align-items-center mx-2 mx-md-5">
              <div class="col-12">
                <div class="row align-items-center justify-content-around vent-clima shadow mb-5 py-4">
                    <div class="col-12 col-md-4 col-lg-3">
                        <h2 class="h1">${nomb}</h2>
                        <p>Estado: ${estado}</p>
                    </div>
                    <div class="col-12 col-md-4 col-lg-3 estado py-4">
                        <img class="d-inline" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${icon}.svg"
                            alt="estado del clima ${estado}">
                        <p class="h1 d-inline align-middle">${temp}°C</p>
                    </div>

                </div>
                <div class="datos col-12 ">
                    <ul class="row list-unstyled justify-content-around">
                        <li class="col-12 col-md-4 col-lg-3 mx-2 minima">Minima: <span>${tempMin}°C</span></li>
                        <li class="col-12 col-md-4 col-lg-3 mx-2 maxima">maxima: <span>${tempMax}°C</span></li>
                        <li class="col-12 col-md-4 col-lg-3 mx-2 humedad">Humedad: <span>${humedad}%</span></li>
                        <li class="col-12 col-md-4 col-lg-3 mx-2 sen-term">Sen. termica: <span>${senTerm}°C</span></li>
                        <li class="col-12 col-md-4 col-lg-3 mx-2 pre-atmos">Pre. atmosferica: <span>${preAtmos}pa</span></li>
                        <li class="col-12 col-md-4 col-lg-3 mx-2 vel-viento">Vel. del viento:<span>${velViento}km/h</span></li>
                    </ul>

                </div>
                </div>
              </div>
                `;
    guardar(datos);

    main.innerHTML = clima;
  } else {
    msgError();
  }
}

/*------------------- MAPA -----------------------*/

function mapapear(datos) {
  // iframeMap.innerHTML = "";

  if (datos.cod != 404) {
    const nomb = datos.name;
    const long = datos.coord.lon;
    const lat = datos.coord.lat;
    console.log(nomb, lat, long);

    mapa = `
                <iframe width="100" height="350" style="border:0" src="https://www.google.com/maps/embed/v1/view?key=${api_key_map}&center=${lat},${long}&zoom=12" allowfullscreen></iframe>
        `;

    iframeMap.innerHTML = mapa;
  }
}

function guardar(datos) {
  localStorage.busqueda = JSON.stringify(datos);
}

/*-------------- mensaje de msgError ante igreso incorrecto --------------*/
/**
 * funcion arroja un mensaje de error cuando no encuentra una hubicacion al obtener un 404 del fetch
 */
function msgError() {
  let modal = d.createElement("div");
  modal.setAttribute(
    "class",
    "modal position-fixed d-flex  justify-content-center flex-column align-middle"
  );
  d.querySelector("body").appendChild(modal);

  let modalDialog = d.createElement("div");
  modalDialog.setAttribute("class", "modal-dialog");
  modal.appendChild(modalDialog);
  1;

  let modalCont = d.createElement("div");
  modalCont.setAttribute("class", "modal-content text-center");
  modalDialog.appendChild(modalCont);

  let modalBody = d.createElement("div");
  modalBody.setAttribute("class", "modal-body text-center");
  modalCont.appendChild(modalBody);

  let contenido = d.createElement("div");
  contenido.setAttribute("class", "cont-modal");
  modalBody.appendChild(contenido);

  let h3 = d.createElement("h3");
  h3.setAttribute("class", "h2");
  h3.innerText = "Ooops!";
  contenido.appendChild(h3);

  let texto = d.createElement("p");
  texto.setAttribute("class", "m-3");
  texto.innerText =
    "No se encontro la ubicacion que solicito vuelva a intentar";
  contenido.appendChild(texto);

  // btn cerrar

  let btn = d.createElement("button");
  btn.innerHTML = "Cerrar";
  btn.setAttribute("class", "btn btnCerrar");
  btn.onclick = function () {
    modal.remove();
  };
  modalBody.appendChild(btn);
}
