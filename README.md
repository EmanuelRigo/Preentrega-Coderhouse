# Simulador de Viajes

Este es un proyecto de frontend que simula un sistema de reserva de viajes. La aplicación permite a los usuarios gestionar un presupuesto, explorar destinos, comprar boletos y realizar un seguimiento de sus viajes. Está construido con HTML, CSS y JavaScript puro, y utiliza varias bibliotecas y API para mejorar la funcionalidad.

## Características Principales

- **Gestión de Billetera Virtual:** Los usuarios pueden añadir fondos a su billetera virtual para comprar boletos de viaje.
- **Catálogo de Viajes:** Muestra una lista de destinos de viaje disponibles cargados desde un archivo JSON local.
- **Filtros y Búsqueda:** Permite a los usuarios ordenar los viajes por precio y filtrar los destinos que pueden pagar con su saldo actual.
- **Compra de Boletos:** Un formulario permite a los usuarios comprar boletos, validando que tengan fondos suficientes y que el origen y el destino sean diferentes.
- **Seguimiento de Viajes:** Los usuarios pueden ver los boletos que han comprado y "viajar" a un nuevo destino, lo que actualiza su ubicación actual.
- **Clima y Hora en Tiempo Real:** Muestra la hora actual y las condiciones meteorológicas del destino actual del usuario utilizando la API de OpenWeatherMap y Moment.js.
- **Historial de Viajes:** Mantiene un registro de todos los viajes completados.
- **Persistencia de Datos:** Utiliza `localStorage` para guardar el saldo de la billetera, los boletos comprados, la ubicación actual y el historial de viajes, para que los datos persistan entre sesiones.

## Tecnologías Utilizadas

- **Lenguajes:** HTML, CSS, JavaScript
- **Frameworks/Librerías:**
  - [Bootstrap](https://getbootstrap.com/): Para el diseño y los componentes de la interfaz de usuario.
  - [Toastify-js](https://apvarun.github.io/toastify-js/): Para notificaciones no intrusivas.
  - [Moment.js](https://momentjs.com/): Para la manipulación y visualización de fechas y horas.
  - [Font Awesome](https://fontawesome.com/): Para los iconos.
- **APIs:**
  - [OpenWeatherMap API](https://openweathermap.org/api): Para obtener datos meteorológicos en tiempo real.

## Prerrequisitos

- Un navegador web moderno (por ejemplo, Chrome, Firefox, Edge).
- Una conexión a Internet para cargar las bibliotecas externas y obtener los datos de la API del clima.

## Instalación

No se requiere un proceso de instalación complejo. Simplemente clona el repositorio o descarga los archivos.

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/EmanuelRigo/Preentrega-Coderhouse.git
    ```
2.  **Navegar al directorio del proyecto:**
    ```bash
    cd Preentrega-Coderhouse
    ```

## Cómo Ejecutar la Aplicación

Simplemente abre el archivo `index.html` en tu navegador web.

```bash
# En Windows
start index.html

# En macOS
open index.html

# En Linux
xdg-open index.html
```

## Estructura del Proyecto

```
.
├── image/
│   └── Logo.ico      # Favicon de la aplicación
├── js/
│   ├── script.js     # Lógica principal de la aplicación
│   └── viajes.json   # Datos de los destinos de viaje
├── index.html        # Estructura principal de la página web
├── style.css         # Estilos personalizados
└── README.md         # Este archivo
```

- **`/image`**: Contiene los recursos de imagen para el proyecto.
- **`/js`**: Contiene los archivos de JavaScript. `script.js` maneja toda la lógica de la aplicación, mientras que `viajes.json` sirve como una base de datos local para los destinos.
- **`index.html`**: El punto de entrada de la aplicación.
- **`style.css`**: Contiene los estilos CSS personalizados para complementar Bootstrap.
