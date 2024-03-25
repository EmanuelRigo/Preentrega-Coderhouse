const ubicacionActual = document.getElementById("ubicacion");
const saldoDOM = document.getElementById("saldo");
const btnSumarSaldo = document.getElementById("btn__sumarSaldo");
const btnViajesDisponibles = document.getElementById("btn__disponibles");
const btnViajesTodos = document.getElementById("btn__viajesTodos");
const btnOrdenarViajes = document.getElementById("btn__ordenarPrecio");
//const btnViajar = document.getElementById("viajar");
const btnVuelosRealizados = document.getElementById("btnVuelosRealizados");
const btnComprarBoleto = document.getElementById("btnComprarBoleto");
const btnVerPasajes = document.getElementById("btnVerPasajes");
const btnVolverPasajes = document.getElementById("btnVolverPasajes");
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

let viajes = [];

class Boleto {
  constructor(nombre, apellido, email, origen, destino, id) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.origen = origen;
    this.destino = destino;
    this.id = id;
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

let opcion = false;

let puntoDePartida = {
  destino: "Buenos Aires, Argentina",
  duracion: "7 días",
  costo: 2000,
};

async function consumirData(url) {
  try {
    const respuesta = await fetch(url);
    const data = await respuesta.json();
    return data;
  } catch {
    Toastify({
      text: "algo salio mal",
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
      cardsViajes(filtrarViajes(), vuelos);
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
      vuelos.innerHTML = `<p class="fs-3 text-danger">no hay sistema</p>`;
    });
}

traerData();

//////////////////////////////////////////////
////////////Funciones para la tercer Preentrega/////////////
//////////////////////////////////////////////

function dondeEstoy() {
  ubicacionActual.innerHTML = "";
  const div = document.createElement("div");

  div.innerHTML = `
  <h3>Ubicacion</h3>
  <p class="fs-5 ">${puntoDePartida.destino}</p>`;

  ubicacionActual.appendChild(div);
}

dondeEstoy();

function sumarSaldo() {
  if (inputCargaSaldo.value <= 0) {
    Toastify({
      text: "elija un monto mayor a 0",
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

//esta funcion la copie para generar un id
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

function filtrarViajes() {
  return viajes.filter((viaje) => viaje.destino != puntoDePartida.destino);
}

function cardsViajes(array, container) {
  container.innerHTML = "";
  for (item of array) {
    let card = document.createElement("div");
    card.className =
      "d-flex rounded border border-warning p-2 text-warning align-items-center justify-content-between mb-2 ";
    card.id = item.id;
    card.innerHTML = `<p class="m-0">${item.destino}  $${item.costo}</p>

    <button type="button" id=${item.id} class="btn btn-warning btn__viaje">seleccionar</button>`;
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
    option.innerHTML = `<option value=${item.id} class="m-0">${item.destino}</option>`;
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
    card.innerHTML = ` <p class="fs-3 m-0">no hay pasajes comprados todavia</p>`;
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
    <p class="fs-5">hora"12:30"</p>
  </div>
  <div class="col-md-5">
    <p class="fs-5">Desde: ${boleto.origen}</p>
    <p class="fs-5">Hacia: ${boleto.destino.destino}</p>
    <p class="fs-5">ID: ${boleto.id}</p>
  </div>
  <div class="col-md-3">
    <button id=${boleto.id} class="fs-4 btn btn-outline-warning btnViajar">viajar</button>
  </div>`;

      pasajesDiv.appendChild(card);
    }
    const btnsViajar = document.querySelectorAll(".btnViajar");

    btnsViajar.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (puntoDePartida.destino === boleto.destino.destino) {
          console.log(puntoDePartida.destino);
          console.log(boleto.destino.destino);
          Toastify({
            text: `ya te encuentras en ${puntoDePartida.destino}`,
            duration: 4500,
            className: "info",
            style: {
              background: "red",
            },
          }).showToast();
        } else {
          viajar(boleto.destino);
          boletosArray = boletosArray.filter((boleto) => {
            return boleto.id !== btn.id;
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

/* btnViajar.addEventListener("click", () => {
  viajar(destinoProximo);

  cardsViajes(filtrarViajes(), vuelos);
}); */

function viajesDisponible() {
  let viajesPosibles = filtrarViajes().filter((viaje) => {
    return (
      viaje.costo <= billeteraVirtual.saldo &&
      viaje.destino != puntoDePartida.destino
    );
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
  cardsViajes(filtrarViajes(), vuelos);
});

function ordenarViajes() {
  let viajesOrdenados = filtrarViajes().sort((viaje1, viaje2) => {
    if (selectPrecio.value == "precioMasBajo") {
      return viaje1.costo - viaje2.costo;
    } else if (selectPrecio.value == "precioMasAlto") {
      return viaje2.costo - viaje1.costo;
    }
  });

  cardsViajes(viajesOrdenados, vuelos);
}

btnOrdenarViajes.addEventListener("click", () => {
  ordenarViajes();
});

function verViajesRealizados() {
  if (viajesRealizados.length == 0) {
    vuelosRealizadosContainer.innerHTML = "";
    vuelosRealizadosContainer.innerHTML = `<p class="fs-4">todavia no se han realizados vuelos</p>`;
  } else {
    let costoTotal = viajesRealizados.reduce((acumulador, viaje) => {
      return acumulador + viaje.costo;
    }, 0);

    cardsViajes(viajesRealizados, vuelosRealizadosContainer);

    vuelosRealizadosContainer.innerHTML = "";
    for (item of viajesRealizados) {
      let card = document.createElement("div");
      card.className =
        "d-flex rounded border border-dark p-2 text-dark align-items-center justify-content-between mb-2";
      card.innerHTML = `<p class="m-0">${item.destino}  $${item.costo}</p>`;
      vuelosRealizadosContainer.appendChild(card);
    }

    let gastos = document.createElement("div");
    gastos.innerHTML = "";
    gastos.innerHTML = `<p class="fs-4">gastos en viajes $${costoTotal}</p>`;

    vuelosRealizadosContainer.appendChild(gastos);
  }
}

btnVuelosRealizados.addEventListener("click", () => {
  verViajesRealizados();
});

function recuperarDatosStorage() {
  let billetera = JSON.parse(localStorage.getItem("billetera"));
  if (billetera.utilizada == true) {
    billeteraVirtual = billetera;
    verSaldo();
  }

  if (!JSON.parse(localStorage.getItem("puntoDePartida"))) {
    localStorage.setItem("puntoDePartida", JSON.stringify(puntoDePartida));
  } else {
    puntoDePartida = JSON.parse(localStorage.getItem("puntoDePartida"));
    dondeEstoy();
  }
}

btnComprarBoleto.addEventListener("click", (e) => {
  e.preventDefault();

  let boletoNuevo = new Boleto(
    inputNombre.value,
    inputApellido.value,
    inputEmail.value,
    selectOrigen.value,
    destinoProximo,
    guid()
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
  } else if (destinoProximo.destino == selectOrigen.value) {
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
    verSaldo();
    console.log(boletosArray);
  }
});

recuperarDatosStorage();

//////////////////////////////////////////////

function viajar(viaje) {
  puntoDePartida = viaje;
  viajesRealizados.push(viaje);
  localStorage.setItem("puntoDePartida", JSON.stringify(puntoDePartida));
  dondeVoy();
  dondeEstoy();
  cardsViajes(filtrarViajes(), vuelos);

  Toastify({
    style: {
      background: "#ffc107",
      color: "black",
    },
    text: `ahora te encuentras en ${puntoDePartida.destino}`,
    offset: {
      x: 50,
      y: 10,
    },
  }).showToast();
}
