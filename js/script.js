const ubicacionActual = document.getElementById("ubicacion");
const tiempoReal = document.getElementById("tiempoReal");
const ubicacionClima = document.getElementById("ubicacionClima");
const saldoDOM = document.getElementById("saldo");
const btnSumarSaldo = document.getElementById("btn__sumarSaldo");
const btnViajesDisponibles = document.getElementById("btn__disponibles");
const btnViajesTodos = document.getElementById("btn__viajesTodos");
const btnVuelosRealizados = document.getElementById("btnVuelosRealizados");
const btnComprarBoleto = document.getElementById("btnComprarBoleto");
const btnVerPasajes = document.getElementById("btnVerPasajes");
const btnVolverPasajes = document.getElementById("btnVolverPasajes");
const btnVolverViajesRealizados = document.getElementById(
  "btnVolverViajesRealizados"
);
const selectPrecio = document.getElementById("select__precio");
const inputCargaSaldo = document.getElementById("input__sumarSaldo");
const vuelos = document.getElementById("vuelos");
const destinoDom = document.getElementById("destino");
const vuelosRealizadosContainer = document.getElementById(
  "vuelosRealizadosContainer"
);
const inputNombre = document.getElementById("inputNombre");
const inputApellido = document.getElementById("inputApellido");
const inputEmail = document.getElementById("inputEmail");
const selectOrigen = document.getElementById("selectOrigen");
const pasajesDiv = document.getElementById("pasajesDiv");
const rowViajesContainer = document.getElementById("rowViajesContainer");
const rowPasajesContainer = document.getElementById("rowPasajesContainer");
const rowViajesRealizadosContainer = document.getElementById(
  "rowViajesRealizadosContainer"
);

let viajes = [];

class Boleto {
  constructor(
    nombre,
    apellido,
    email,
    origen,
    origenID,
    destino,
    id,
    fechaHora
  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.origen = origen;
    this.origenID = origenID;
    this.destino = destino;
    this.id = id;
    this.fechaHora = fechaHora;
  }
}

let billeteraVirtual = {
  saldo: 2000,
  utilizada: false,
};
let gastoEnViajes = 0;
let viajesRealizados = [];
let boletosArray = [];
let destinoProximo = null;
let puntoDePartida = {
  destino: "Buenos Aires,Argentina",
  duracion: "7 días",
  costo: 2000,
  id: 1010,
  continente: "America",
};

/////funciones de traer data y apis

function LlamarApiClima(city, country) {
  const apiId = "dd4ac3cdf4fd6a0d93f97bf97efdad05";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;
  fetch(url)
    .then((data) => {
      return data.json();
    })
    .then((dataJSON) => {
      if (dataJSON.cod === "404") {
        dondeEstoy();
        Toastify({
          text: "ciudad no encontrada",
          duration: 4500,
          className: "info",
          style: {
            background: "red",
          },
        }).showToast();
      } else {
        verDataClima(dataJSON);
      }
    })
    .catch((error) => {
      console.error(error);
      dondeEstoy();
    });
}

function verDataClima(data) {
  const {
    name,
    main: { temp, temp_min, temp_max },
    weather: weather,
  } = data;

  const grados = kelvinACentigrados(temp);
  const min = kelvinACentigrados(temp_min);
  const max = kelvinACentigrados(temp_max);

  puntoDePartida = {
    ...puntoDePartida,
    grados: grados,
    clima: weather[0].main,
  };

  dondeEstoy();
}

function kelvinACentigrados(temp) {
  return parseInt(temp - 273.15);
}

async function consumirData(url) {
  try {
    const respuesta = await fetch(url);
    const data = await respuesta.json();
    return data;
  } catch {
    Toastify({
      text: "Algo salio mal",
      duration: 4500,
      className: "info",
      style: {
        background: "red",
      },
    }).showToast();
  }
}

async function traerData() {
  await consumirData("./js/viajes.json")
    .then((res) => {
      viajes.push(...res);
      cardsViajes(viajes, vuelos);
      optionsSelect();
    })
    .catch(() => {
      Toastify({
        text: "no hay sistema",
        duration: 4500,
        className: "info",
        style: {
          background: "red",
        },
      }).showToast();
      vuelos.innerHTML = `<p class="fs-3 text-danger">No hay sistema</p>`;
    });
}

traerData();

///////////funciones de DOM

function dondeEstoy() {
  let icono;

  switch (puntoDePartida.clima) {
    case "Rain":
      icono = `<i class="fa-solid fa-cloud-showers-heavy"></i>`;
      break;
    case "Clear":
      icono = `<i class="fa-regular fa-sun"></i>`;
      break;
    case "Clouds":
      icono = `<i class="fa-solid fa-cloud"></i>`;
      break;
    case "Mist":
      icono = `<i class="fa-solid fa-smog"></i>`;
      break;
    default:
      icono = `<i class="fa-solid fa-question"></i>`;
  }

  ubicacionActual.innerHTML = "";
  const div = document.createElement("div");
  div.innerHTML = `
  <h3>Ubicacion</h3>
  <p class="fs-5 mb-0">${puntoDePartida.destino}</p>`;
  ubicacionActual.appendChild(div);

  ubicacionClima.innerHTML = "";
  const divClima = document.createElement("div");
  divClima.classList.add("position-relative");
  divClima.innerHTML = `
  <p class="weather_icon">${icono} </p>  <span class="position-absolute fs-6 text-dark translate-middle badge rounded-pill bg-warning border border-4 border-dark"> ${puntoDePartida.grados}°</span>
 
 `;
  ubicacionClima.appendChild(divClima);
}

function sumarSaldo() {
  if (inputCargaSaldo.value <= 0) {
    Toastify({
      text: "Elija un monto mayor a 0",
      duration: 4500,
      className: "info",
      style: {
        background: "red",
      },
    }).showToast();
  } else {
    billeteraVirtual.saldo += parseInt(inputCargaSaldo.value);
    billeteraVirtual.utilizada = true;

    localStorage.setItem("billetera", JSON.stringify(billeteraVirtual));
  }
}

inputCargaSaldo.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sumarSaldo();
    inputCargaSaldo.value = "";
    verSaldo();
  }
});

btnSumarSaldo.addEventListener("click", () => {
  sumarSaldo();
  inputCargaSaldo.value = "";
  verSaldo();
});

function verSaldo() {
  saldoDOM.innerHTML = `
  $${billeteraVirtual.saldo}`;
  if (!localStorage.getItem("billetera")) {
    localStorage.setItem("billetera", JSON.stringify(billeteraVirtual));
  }
}

////esta funcion la copie de google para generar un id random
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}

////////////////////////////////////////

verSaldo();

function cardsViajes(array, container) {
  container.innerHTML = "";
  for (item of array) {
    let card = document.createElement("div");
    card.className =
      "d-flex rounded border border-warning p-2 text-warning align-items-center justify-content-between mb-2 ";
    card.id = item.id;
    card.innerHTML = `<p class="m-0">${item.destino}</p>
   
   

    <button type="button" id=${item.id} class="btn btn-warning btn__viaje">$${item.costo}</button>`;
    container.appendChild(card);
  }

  const btnsViajes = document.querySelectorAll(".btn__viaje");

  btnsViajes.forEach((btnViaje) => {
    btnViaje.addEventListener("click", () => {
      destinoProximo = viajes.find((viaje) => {
        return parseInt(btnViaje.id) === viaje.id;
      });

      dondeVoy();
    });
  });
}

function optionsSelect() {
  for (item of viajes) {
    let option = document.createElement("option");

    option.value = item.destino + "/" + item.id;
    option.classList.add("m-0");
    option.innerHTML = `${item.destino}`;
    selectOrigen.appendChild(option);
  }
}

function cardsPasajes() {
  pasajesDiv.innerHTML = "";
  if (boletosArray.length == 0) {
    let card = document.createElement("div");
    card.classList.add(
      "row",
      "rounded",
      "bg-dark",
      "text-warning",
      "p-3",
      "mb-3"
    );
    card.innerHTML = ` <p class="fs-3 m-0">No hay pasajes comprados todavia</p>`;
    pasajesDiv.appendChild(card);
  } else {
    for (boleto of boletosArray) {
      let card = document.createElement("div");
      card.classList.add(
        "row",
        "rounded",
        "bg-dark",
        "text-warning",
        "p-3",
        "mb-3"
      );
      card.innerHTML = `    <div class="col-md-4">
    <p class="fs-5">${boleto.nombre} ${boleto.apellido}</p>
    <p class="fs-5">$${boleto.destino.costo}</p>
    <p class="fs-5">fecha y hora de compra: ${boleto.fechaHora}</p>
  </div>
  <div class="col-md-5">
    <p class="fs-5">Desde: ${boleto.origen}</p>
    <p class="fs-5">Hacia: ${boleto.destino.destino}</p>
    <p class="fs-5">ID: ${boleto.id}</p>
  </div>
  <div class="col-md-3">
    <button data-origenid=${boleto.origenID} data-info=${boleto.destino.id} id=${boleto.id} class="fs-2 btn  btn-outline-warning btnViajar h-100 w-100 "> <i class="fa-solid fa-plane"></i> viajar</button>
  </div>`;

      pasajesDiv.appendChild(card);
    }
    const btnsViajar = document.querySelectorAll(".btnViajar");

    btnsViajar.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (puntoDePartida.id == btn.dataset.info) {
          Toastify({
            text: `ya te encuentras en ${puntoDePartida.destino}`,
            duration: 4500,
            className: "info",
            style: {
              background: "red",
            },
          }).showToast();
        } else if (puntoDePartida.id != btn.dataset.origenid) {
          Toastify({
            text: "no te encuentras en el lugar de partida",
            duration: 4500,
            className: "info",
            style: {
              background: "red",
            },
          }).showToast();
        } else {
          let boletoID = boletosArray.find((bto) => bto.id == btn.id).destino;

          let origenBto = viajes.find(
            (viaje) => viaje.id == btn.dataset.origenid
          );

          boletoID = {
            ...boletoID,
            fechaDeVuelo: dateMoment.format("dddd DD MMMM YYYY"),
            origen: origenBto,
          };

          viajar(boletoID);
          boletosArray = boletosArray.filter((bto) => {
            return bto.id !== btn.id;
          });
          cardsPasajes();
        }
      });
    });
  }
}

btnVerPasajes.addEventListener("click", () => {
  cardsPasajes();
  rowPasajesContainer.classList.remove("d-none");
  rowViajesContainer.classList.add("d-none");
  btnViajesDisponibles.classList.add("disabled");
  btnViajesTodos.classList.add("disabled");
});

btnVolverPasajes.addEventListener("click", () => {
  rowPasajesContainer.classList.add("d-none");
  rowViajesContainer.classList.remove("d-none");
  btnViajesDisponibles.classList.remove("disabled");
  btnViajesTodos.classList.remove("disabled");
});

function dondeVoy() {
  destinoDom.innerHTML = "";
  const div = document.createElement("div");

  if (destinoProximo) {
    div.innerHTML = `<p class="fs-5 mb-0">${destinoProximo.destino}</p><p class="fs-5 mb-0">$${destinoProximo.costo}</p>`;
  } else {
    div.innerHTML = `

  <p class="fs-5 mb-1 ">no hay destino</p>`;
  }

  destinoDom.appendChild(div);
}

dondeVoy();

function viajesDisponible() {
  let viajesPosibles = viajes.filter((viaje) => {
    return viaje.costo <= billeteraVirtual.saldo;
  });

  if (viajesPosibles.length == 0) {
    vuelos.innerHTML = "";
    let card = document.createElement("div");
    card.innerHTML = `<p class="text-warning fs-4">no hay viajes disponibles con tu saldo actual</p>`;
    vuelos.appendChild(card);
  } else {
    vuelos.innerHTML = "";
    cardsViajes(viajesPosibles, vuelos);
  }
}

btnViajesDisponibles.addEventListener("click", () => {
  viajesDisponible();
});

btnViajesTodos.addEventListener("click", () => {
  cardsViajes(viajes, vuelos);
});

function ordenarViajes() {
  let viajesOrdenados = viajes.sort((viaje1, viaje2) => {
    if (selectPrecio.value == "precioMasBajo") {
      return viaje1.costo - viaje2.costo;
    } else if (selectPrecio.value == "precioMasAlto") {
      return viaje2.costo - viaje1.costo;
    }
  });

  cardsViajes(viajesOrdenados, vuelos);
}

selectPrecio.addEventListener("change", () => {
  ordenarViajes();
});

function verViajesRealizados() {
  if (viajesRealizados.length == 0) {
    vuelosRealizadosContainer.innerHTML = "";
    vuelosRealizadosContainer.innerHTML = `<p class="fs-4">Todavia no se han realizados vuelos</p>`;
  } else {
    let costoTotal = viajesRealizados.reduce((acumulador, viaje) => {
      return acumulador + viaje.costo;
    }, 0);

    cardsViajes(viajesRealizados, vuelosRealizadosContainer);

    vuelosRealizadosContainer.innerHTML = "";
    for (item of viajesRealizados) {
      let card = document.createElement("div");
      card.className =
        "row rounded border border-dark p-2 text-dark align-items-center justify-content-between mb-2 mx-0";
      card.innerHTML = `<div class="col-md-4"><p class="m-0">desde: ${item.origen.destino}</p> <p class="m-0">hacia: ${item.destino}</p> </div><div class="col-md-4"><p class="m-0">precio: $${item.costo} </p></div><div class="col-md-4"><p class="m-0">realizado el: ${item.fechaDeVuelo}`;
      vuelosRealizadosContainer.appendChild(card);
    }

    let gastos = document.createElement("div");
    gastos.innerHTML = "";
    gastos.innerHTML = `<p class="fs-4">gastos en viajes $${costoTotal}</p>`;

    vuelosRealizadosContainer.appendChild(gastos);
  }
}

btnVolverViajesRealizados.addEventListener("click", () => {
  rowViajesRealizadosContainer.classList.add("d-none");
  rowViajesContainer.classList.remove("d-none");
  btnViajesDisponibles.classList.remove("disabled");
  btnViajesTodos.classList.remove("disabled");
});

btnVuelosRealizados.addEventListener("click", () => {
  rowViajesContainer.classList.add("d-none");
  rowViajesRealizadosContainer.classList.remove("d-none");
  rowPasajesContainer.classList.add("d-none");
  btnViajesDisponibles.classList.add("disabled");
  btnViajesTodos.classList.add("disabled");
  verViajesRealizados();
});

/////////funciones recuperar datos Storage

function recuperarDatosStorage() {
  let billetera = JSON.parse(localStorage.getItem("billetera"));
  if (billetera.utilizada == true) {
    billeteraVirtual = billetera;
    verSaldo();
  }

  if (!JSON.parse(localStorage.getItem("puntoDePartida"))) {
    localStorage.setItem("puntoDePartida", JSON.stringify(puntoDePartida));
    LlamarApiClima(
      (puntoDePartida.destino.split(",")[0],
      puntoDePartida.destino.split(",")[1].trim())
    );
  } else {
    puntoDePartida = JSON.parse(localStorage.getItem("puntoDePartida"));
    LlamarApiClima(
      (puntoDePartida.destino.split(",")[0],
      puntoDePartida.destino.split(",")[1].trim())
    );
  }

  localStorage.getItem("viajesRealizados") &&
    (viajesRealizados = JSON.parse(localStorage.getItem("viajesRealizados")));

  localStorage.getItem("boletosArray") &&
    (boletosArray = JSON.parse(localStorage.getItem("boletosArray")));

  LlamarApiClima(
    (puntoDePartida.destino.split(",")[0],
    puntoDePartida.destino.split(",")[1].trim())
  );

  actualizarReloj();
}

btnComprarBoleto.addEventListener("click", (e) => {
  e.preventDefault();

  let valorSelect = selectOrigen.value.split("/");

  let boletoNuevo = new Boleto(
    inputNombre.value,
    inputApellido.value,
    inputEmail.value,
    valorSelect[0],
    valorSelect[1],
    destinoProximo,
    guid(),
    dateMoment.format("dddd DD MMMM YYYY")
  );

  if (
    inputNombre.value == "" ||
    inputApellido.value == "" ||
    inputEmail.value == "" ||
    selectOrigen.value == "" ||
    destinoProximo == null
  ) {
    Toastify({
      text: "llene todos los capos o elija un destino",
      duration: 4500,
      className: "info",
      style: {
        background: "red",
      },
    }).showToast();
  } else if (billeteraVirtual.saldo < destinoProximo.costo) {
    Toastify({
      text: "dinero insuficiente",
      duration: 4500,
      className: "info",
      style: {
        background: "red",
      },
    }).showToast();
  } else if (
    destinoProximo.destino == (() => selectOrigen.value.split("/")[0])()
  ) {
    Toastify({
      text: "el destino debe ser diferente al origen",
      duration: 4500,
      className: "info",
      style: {
        background: "red",
      },
    }).showToast();
  } else {
    boletosArray.push(boletoNuevo);
    billeteraVirtual.saldo -= destinoProximo.costo;
    localStorage.setItem("billetera", JSON.stringify(billeteraVirtual));
    verSaldo();
    Toastify({
      style: {
        background: "#ffc107",
        color: "black",
      },
      text: `Pasaje comprado hacia ${destinoProximo.destino}`,
    }).showToast();
    billeteraVirtual.utilizada = true;
    localStorage.setItem("boletosArray", JSON.stringify(boletosArray));
    localStorage.setItem("billetera", JSON.stringify(billeteraVirtual));
    inputApellido.value = null;
    inputNombre.value = null;
    inputEmail.value = null;
    destinoProximo = null;
    selectOrigen.value = null;
    dondeVoy();
  }
});

recuperarDatosStorage();

//////////////////////////////////////////////

function viajar(viaje) {
  puntoDePartida = viaje;
  LlamarApiClima(
    (puntoDePartida.destino.split(",")[0],
    puntoDePartida.destino.split(",")[1].trim())
  );
  viajesRealizados.push(viaje);
  localStorage.setItem("viajesRealizados", JSON.stringify(viajesRealizados));
  localStorage.setItem("puntoDePartida", JSON.stringify(puntoDePartida));
  dondeVoy();
  dondeEstoy();
  cardsViajes(viajes, vuelos);
  actualizarReloj();

  Toastify({
    style: {
      background: "#ffc107",
      color: "black",
    },
    text: `ahora te encuentras en ${puntoDePartida.destino}`,
  }).showToast();
}

///funcion para reloj en tiempo real con momentJs

moment.locale("es");
let dateMoment = moment();

function actualizarReloj() {
  let tiempoActual = moment()
    .tz(
      `${puntoDePartida.continente}/${puntoDePartida.destino
        .split(",")[0]
        .replace(/ /g, "_")}`
    )
    .format("HH:mm:ss");
  tiempoReal.innerHTML = tiempoActual;
}

setInterval(actualizarReloj, 1000);
