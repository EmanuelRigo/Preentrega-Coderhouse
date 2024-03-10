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

/* alert(
  "bienvenido a un viaje en avion usaremos una billetera virtual para viajar, el punto de partida es Buenos Aires"
); */

//////////////////////////////////////////////
////////////Funciones para la tercer Preentrega/////////////
//////////////////////////////////////////////

function dondeEstoy() {
  ubicacionActual.innerHTML = "";
  const div = document.createElement("div");

  div.innerHTML = `
  <h3>ubicacion</h3>
  <p>${puntoDePartida.destino}</p>`;

  ubicacionActual.appendChild(div);
}

dondeEstoy();

function sumarSaldo() {
  if (inputCargaSaldo.value <= 0) alert("por favor numeros mayores a 0");
  else {
    billeteraVirtual.saldo += parseInt(inputCargaSaldo.value);
    billeteraVirtual.utilizada = true;
    console.log(billeteraVirtual);
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
  ${billeteraVirtual.saldo}`;
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
    card.className = "card__viaje";
    card.id = item.id;
    card.innerHTML = `<button class="btn__viaje" id=${item.id}>${item.destino}</button> <p>$
    ${item.costo}</p>`;
    container.appendChild(card);
  }

  const btnsViajes = document.querySelectorAll(".btn__viaje");

  btnsViajes.forEach((btnViaje) => {
    btnViaje.addEventListener("click", () => {
      destinoProximo = viajes.find((viaje) => {
        return parseInt(btnViaje.id) === viaje.id;
      });
      console.log(destino);
      dondeVoy();
      console.log(destinoProximo);
    });
  });
}

cardsViajes(filtrarViajes(), vuelos);

function dondeVoy() {
  destinoDom.innerHTML = "";
  const div = document.createElement("div");

  if (destinoProximo) {
    div.innerHTML = `
  <h3>destino</h3>
  <p>${destinoProximo.destino}</p>`;
  } else {
    div.innerHTML = `
  <h3>destino</h3>
  <p>no hay destino</p>`;
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

  console.log(viajesPosibles);

  if (viajesPosibles.length == 0) {
    vuelos.innerHTML = "";
    let card = document.createElement("div");
    card.innerHTML = "<p>no hay viajes disponibles con tu saldo actual</p>";
  } else {
    vuelos.innerHTML = "";
    console.log(viajesDisponible);

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
  console.log(selectPrecio.value);
  console.log(viajesOrdenados);

  cardsViajes(viajesOrdenados, vuelos);
}

btnOrdenarViajes.addEventListener("click", () => {
  ordenarViajes();
});

function verViajesRealizados() {
  if (viajesRealizados.length == 0) {
    vuelos.innerHTML = "";
    vuelos.innerHTML = "<p>todavia no se han realizados vuelos</p>";
  } else {
    let costoTotal = viajesRealizados.reduce((acumulador, viaje) => {
      return acumulador + viaje.costo;
    }, 0);

    cardsViajes(viajesRealizados, vuelos);
    let divcard = document.createElement("div");
    divcard.innerHTML = "";

    divcard.innerHTML = `<p>gastos en viajes${costoTotal}</p>`;

    vuelos.appendChild(divcard);
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
      dondeVoy();
      dondeEstoy();
      verSaldo();
      cardsViajes(filtrarViajes(), vuelos);
      localStorage.setItem("billetera", JSON.stringify(billeteraVirtual));

      alert(
        "gracias por el viaje le quedan $" +
          billeteraVirtual.saldo +
          " en su billetera virtual"
      );
      alert("ahora te encuentras en " + puntoDePartida.destino);
    } else {
      alert("no cuenta con el cinero suficiente");
    }
  }
}

/* function opciones() {
  let opcion1 = parseInt(prompt("desea hacer algo mas? \n -1 si \n -2 no"));
  if (opcion1 == 2) {
    alert("que tenga un buen dia");
    opcion = false;
  } else if (opcion1 == 1) {
    alert("ok prosigamos");
  } else {
    alert("por favor elijar una opcion correcta");
  }
}

do {
  let primerOpcion = parseInt(
    prompt(
      "que desea hacer? \n -1 sumar dinero para viajes \n -2 viajar \n -3 ver dinero \n -4 ver destinos a los que puedo viajar segun mi billetera \n -5 ver los vuelos segun su precio \n -6 ver cuanto voy gastado en viajes \n -7 ver los viajes realizados"
    )
  );
  switch (primerOpcion) {
    case 1:
      const carga = parseInt(prompt("cuanto dinero quiere cargar?"));

      //aca investigue como poner para que no se puedan poner numero 'isNaN'

      if (isNaN(carga) || carga <= 0) {
        alert("por favor agregue solo numeros mayor a 0");
        opciones();
      } else {
        billeteraVirtual += carga;
        alert("tu saldo es $" + billeteraVirtual);
        opciones();
      }
      break;
    case 2:
      let filtroViajes = viajes.filter(
        (viaje) => viaje.destino != puntoDePartida.destino
      );
      let opcionesDeVuelo = "Seleccione una opción:\n";
      filtroViajes.forEach((viaje, index) => {
        opcionesDeVuelo += `${index + 1}. ${viaje.destino} $${viaje.costo}\n`;
      });

      let destino = parseInt(prompt(opcionesDeVuelo));
      viajar(filtroViajes[destino - 1]);

      opciones();
      break;
    case 3:
      alert("el saldo de tu billetera virtual es $" + billeteraVirtual);
      opciones();
      break;
    case 4:
      let viajesPosibles = viajes.filter((viaje) => {
        return (
          viaje.costo <= billeteraVirtual &&
          viaje.destino != puntoDePartida.destino
        );
      });

      if (viajesPosibles.length == 0) {
        alert("no hay viajes posibles con el saldo de tu billetera");
      } else {
        let alertViajes = "Puedes viajar a :\n";
        viajesPosibles.forEach((viaje) => {
          alertViajes += ` ${viaje.destino} $${viaje.costo}\n`;
        });

        alert(alertViajes);
      }

      opciones();
      break;
    case 5:
      let viajesOrdenados = viajes.sort((viaje1, viaje2) => {
        return viaje1.costo - viaje2.costo;
      });

      let alertViajes2 = "Aqui hay una lista de todos los viajes ordenados :\n";
      viajesOrdenados.forEach((viaje) => {
        alertViajes2 += ` ${viaje.destino} $${viaje.costo}\n`;
      });

      alert(alertViajes2);
      opciones();
      break;
    case 6:
      if (gastoEnViajes == 0) {
        alert("todavia no gastaste naada");
      } else {
        alert(`vas gastando en viajes $${gastoEnViajes}`);
      }
      opciones();
      break;
    case 7:
      if (viajesRealizados.length == 0) {
        alert("todavia no realizaste viajes");
      } else {
        let costoTotal = viajesRealizados.reduce((acumulador, viaje) => {
          return acumulador + viaje.costo;
        }, 0);
        let alertViajes3 =
          "Aqui hay una lista de todos los viajes realizados :\n";
        viajesRealizados.forEach((viaje, index) => {
          alertViajes3 += `${index + 1}  ${viaje.destino} $${viaje.costo}\n`;
        });

        alert(alertViajes3);
        alert("El total de lo gastado en todos los viajes fue $" + costoTotal);
      }

      opciones();
      break;

    default:
      alert("elija una opcion de entre las dadas");
      opciones();
      break;
  }
} while (opcion);
 */
