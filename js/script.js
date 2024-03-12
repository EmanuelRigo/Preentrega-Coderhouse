let viajes = [
  {
    id: 1001,
    destino: "París, Francia",
    duracion: 7,
    costo: 1500,
  },
  {
    id: 1002,
    destino: "Tokio, Japón",
    duracion: 10,
    costo: 2500,
  },
  {
    id: 1003,
    destino: "Roma, Italia",
    duracion: 5,
    costo: 1200,
  },
  {
    id: 1004,
    destino: "Nueva York, EE. UU.",
    duracion: 6,
    costo: 1800,
  },
  {
    id: 1005,
    destino: "Sídney, Australia",
    duracion: 8,
    costo: 2200,
  },
  {
    id: 1006,
    destino: "Barcelona, España",
    duracion: 4,
    costo: 1000,
  },
  {
    id: 1007,
    destino: "Machu Picchu, Perú",
    duracion: 3,
    costo: 800,
  },
  {
    id: 1008,
    destino: "Ciudad del Cabo, Sudáfrica",
    duracion: 9,
    costo: 2800,
  },
  {
    id: 1009,
    destino: "Bangkok, Tailandia",
    duracion: 7,
    costo: 2700,
  },
  {
    id: 1010,
    destino: "Buenos Aires, Argentina",
    duracion: 7,
    costo: 2000,
  },
];

const ubicacionActual = document.getElementById("ubicacion");
const saldoDOM = document.getElementById("saldo");
const btnSumarSaldo = document.getElementById("btn__sumarSaldo");
const btnViajesDisponibles = document.getElementById("btn__disponibles");
const btnViajesTodos = document.getElementById("btn__viajesTodos");
const btnOrdenarViajes = document.getElementById("btn__ordenarPrecio");
const btnViajar = document.getElementById("viajar");
const btnVuelosRealizados = document.getElementById("btnVuelosRealizados");
const selectPrecio = document.getElementById("select__precio");
const inputCargaSaldo = document.getElementById("input__sumarSaldo");
const vuelos = document.getElementById("vuelos");
const destinoDom = document.getElementById("destino");
const vuelosRealizadosContainer = document.getElementById(
  "vuelosRealizadosContainer"
);

let billeteraVirtual = {
  saldo: 2000,
  utilizada: false,
};
let gastoEnViajes = 0;
let viajesRealizados = [];
let destinoProximo = null;

let opcion = false;

let puntoDePartida = {
  destino: "Buenos Aires, Argentina",
  duracion: "7 días",
  costo: 2000,
};

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
  if (inputCargaSaldo.value <= 0) alert("por favor numeros mayores a 0");
  else {
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

function dondeVoy() {
  destinoDom.innerHTML = "";
  const div = document.createElement("div");

  if (destinoProximo) {
    div.innerHTML = `
  <h3 class="display-6">Destino</h3>
  <p class="fs-5 mb-1">${destinoProximo.destino} - $${destinoProximo.costo}</p>`;
  } else {
    div.innerHTML = `
  <h3 class="display-6">Destino</h3>
  <p class="fs-5 mb-1">no hay destino</p>`;
  }

  destinoDom.appendChild(div);
}

dondeVoy();

btnViajar.addEventListener("click", () => {
  viajar(destinoProximo);

  cardsViajes(filtrarViajes(), vuelos);
});

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

  cardsViajes(filtrarViajes(), vuelos);
}

recuperarDatosStorage();

//////////////////////////////////////////////

function viajar(viaje) {
  if (viaje == null) {
    alert("elija un destino");
  } else {
    if (
      billeteraVirtual.saldo >= viaje.costo &&
      puntoDePartida.destino != viaje.destino
    ) {
      puntoDePartida = viaje;

      billeteraVirtual.saldo -= viaje.costo;
      viajesRealizados.push(viaje);

      gastoEnViajes = gastoEnViajes += viaje.costo;
      destinoProximo = null;
      localStorage.setItem("puntoDePartida", JSON.stringify(puntoDePartida));
      dondeVoy();
      dondeEstoy();
      verSaldo();
      cardsViajes(filtrarViajes(), vuelos);
      localStorage.setItem("billetera", JSON.stringify(billeteraVirtual));

      alert("ahora te encuentras en " + puntoDePartida.destino);
    } else {
      alert("no cuenta con el cinero suficiente");
    }
  }
}
