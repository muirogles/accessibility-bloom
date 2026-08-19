# Accessibility Bloom · El florecer de la accesibilidad

Lección magistral interactiva y objeto de arte digital sobre el **Árbol de
Accesibilidad**, pintada solo con **HTML y CSS** —ni una imagen, ni un SVG—.
La estructura botánica **es** la estructura semántica: el `<main>` es el
tronco, cada `<section>` una rama, cada elemento interactivo una flor que
florece cuando su estado es cierto. El lienzo entero es el árbol que el
navegador construye a partir del DOM.

No es un escáner de fallos: es un **cuaderno de patrones explicados**. Cada
decisión lleva su razón y su efecto en la experiencia de alguien; los
antipatrones se exponen como espécimen, nunca activos en la página.

## La gramática: una forma, un color, un timbre

| Forma | Color | Etiqueta HTML | Nodo del árbol | Timbre |
| --- | --- | --- | --- | --- |
| Círculo | azul `#0047ab` | `<button aria-pressed>` | button + pressed | seno |
| Triángulo | amarillo `#f2b705` | `<a href>` | link + destino | triangular |
| Cuadrado | rojo `#d81e3f` | `<input type="checkbox">` | checkbox + checked | cuadrada |
| Rombo | violeta `#4b2e83` | `<input type="radio">` en `<fieldset>` | group + radio | seno agudo |
| Barra | cian `#0f7f8c` | campo de texto | textbox + invalid | sierra |
| Arco de corteza | ocre `#8a5a00` | encabezados, tronco y ramas | heading | silencio |
| Gris marchito | `#8d857a` | `<div>` sin semántica | no llega al árbol | mudo |

Kandinsky fijó tres correspondencias —círculo-azul, triángulo-amarillo,
cuadrado-rojo—. El rombo violeta, la barra cian y el arco de corteza son
**extensión propia** de esta obra, y se declara para no atribuirle nada que
no dijera. El **ocre no entra nunca en la flor**: es el color de la savia,
del tronco y de las ramas.

## El mandala de la portada: una sola ley, cero rotaciones

Ninguna forma está girada. Todo sale de **veinte círculos del mismo radio**,
`r = 12,6` (medidas en `cqw` del cuadrado que contiene el mandala, así que
la geometría es la misma a cualquier tamaño):

- **Diez generadores** con el centro en `R = 30,2` y paso de 36°.
- **Diez más centrados justo en los cruces externos** de los primeros, en
  `37,19`. Con eso la malla se cierra sobre sí misma —la trama de la Flor de
  la Vida— y la densidad no es un adorno: es la construcción.
- **Los círculos se ven enteros.** El trazo completo de los veinte queda a la
  vista: es la construcción, no un andamio que se esconde.
- **El pétalo ES el cruce.** Cada pétalo ocupa todo el cuadro y se recorta
  con las dos máscaras circulares de sus dos generadores vecinos, puestas en
  las coordenadas reales de sus centros (`mask-composite: intersect`). La
  lente que queda es exactamente el solape. Sin una sola rotación: solo las
  coordenadas de la construcción.
- **Los cruces mandan todo lo demás.** Dos vecinos se cortan a
  `R·cos18° ± √(r² − (R·sin18°)²)` = `28,72 ± 8,47`:
  - **20,26** (cruce interno) → es el radio del **aro del corazón**, y de su
    borde inferior nace el tallo. Diez **cuentas** se enhebran ahí, una por
    cruce, para que se vea que el aro pasa por ellos.
  - **37,19** (cruce externo) → el centro de la segunda familia de círculos.
- **Dos órdenes de pétalos.** La segunda familia de círculos también se corta
  entre vecinos, y ese solape es otra lente: la que queda **entre** dos
  pétalos grandes, sobre la línea que une el centro con cada forma de la
  gramática. Sus puntas caen en `30,2` —el centro de un generador, justo
  donde está la forma— y en `40,54`. Se rellenan con el color de esa forma
  rebajado con lino, así son el eco del pétalo grande y no compiten con él.
  Veinte pétalos en total, y ni una coordenada nueva.
- **Las cinco formas de la gramática van en el HUECO** que queda sobre la
  línea del centro de cada generador: el tramo vacío entre el aro del corazón
  (`20,26`) y la punta interior del pétalo menor (`30,2`, que es también el
  centro del generador). Se colocan en el medio exacto de ese hueco, `25,23`,
  así que no pisan el color de ningún pétalo. Dos veces cada una: diez formas,
  simetría exacta de 72°. Van en su propia capa, **por encima del tallo y del
  collar**: el color manda sobre el trazo.
- **Cada pétalo lleva el color de la forma que hay en el centro del círculo
  que lo engendra** —azul, amarillo, rojo, violeta, cian, dos vueltas—, así
  que la gramática entera está en la flor.
- **La envolvente** de todo es `37,19 + 12,6 = 49,79`, dibujada con un trazo
  fino de tinta de la misma familia que los círculos. En ella se enhebran
  **veinte piezas menudas** cada 18° —rombos y triángulos alternos que
  recorren los cinco colores—: la orla que convierte el mandala en guirnalda.
- **El latido mueve los centros**, no las formas: al respirar, los solapes
  crecen y decrecen, así que son los pétalos los que abren y cierran. Y son
  **dos respiraciones**: cada familia de círculos tiene la suya —el mismo
  periodo de catorce segundos con un tercio de ciclo de diferencia,
  `@property --open` y `--open2`, de 0,982 a 1,018, con curva senoidal—, y
  cada pétalo sigue exactamente a los círculos que lo engendran. Por eso un
  orden de pétalos parece salir del otro sin que la geometría deje de ser
  cierta en ningún fotograma.
- Encima de ese latido corren dos compases más que **no tocan la geometría**:
  un **brillo que gira** —cada pétalo entra 1,3 s después del anterior, así
  la luz recorre la flor sin parpadear— y el **pulso de la orla**, escalonado
  cada 0,55 s.
  Los tres se paran juntos con «Pausar latido», congelados en su fotograma, y
  ninguno arranca si el sistema pide `prefers-reduced-motion`.

Todas las formas son geometría real: el rombo es un rombo (`clip-path`), no
un cuadrado girado; los triángulos van siempre rectos —la posición es
trigonometría, la forma nunca se gira—. La única rotación que queda en la
obra es la de las **flores marchitas**, donde el capullo caído significa
precisamente eso: que se ha marchitado.

## Un solo eje

El tronco, las ramas, las raíces y la portada leen **una sola variable**,
`--axis-x`; en el pie, `--root-x` la prolonga y de él arrancan también las
raicillas del manifiesto, que antes nacían despegadas. El tallo baja por el centro del mandala y un **codo de vid** lo
lleva hasta ese eje: un trazo continuo, sin muñones ni líneas paralelas.
Desde 1024 px el tronco pasa al centro exacto y el codo desaparece —el trazo
cae recto y la ayuda de teclado y los mandos se reparten a un lado y otro—.
Medido a 360, 768, 1024 y 1440 px: eje del tronco y eje del codo coinciden,
y el centro del aro, el del título y el del tallo comparten vertical.

## El contrato de estados

La regla que lo ordena todo: **la flor se abre cuando es verdad que está
abierta**. Nada de floraciones decorativas.

| Situación | Qué se ve |
| --- | --- |
| Reposo | capullo cerrado, a su tamaño pleno |
| Puntero | el capullo **crece** y se aclara. No abre: invita |
| Foco | lo mismo que el puntero, más halo de trazo discontinuo, el mismo en toda la obra |
| Estado cierto | **floración plena** y el aro se rellena del color de la forma: `aria-pressed="true"`, `:checked`, `.flower-open` |
| Desactivado | trazo discontinuo y **ningún** cambio al puntero: si no se puede, no se insinúa |

La excepción razonada es el **enlace**: un `<a>` no guarda estado, así que
nunca tendría un momento «verdadero» en el que abrirse. Su verdad es la
atención, y por eso florece pleno al puntero y al foco. Y como sí hay un
estado real —en qué sección estás—, la flor de la sección actual queda
florecida con `aria-current`: al pulsar y navegar, **la floración se ve al
llegar**. Ninguna flor se encoge nunca al recibir atención: solo crece.

## El recorrido · catorce estaciones

| # | Estación | Qué enseña |
| --- | --- | --- |
| 1 | La estructura y sus lectores (`#structure`) | qué es el árbol y en qué se diferencia del de renderizado |
| 2 | La sinestesia de la obra (`#synesthesia`) | la clave de lectura: cinco canales para el mismo dato |
| 3 | Lo que leen las máquinas (`#machines`) | quién más lo lee: buscadores y agentes |
| 4 | El rol (`#role`) | qué es esto · primera regla de ARIA |
| 5 | El nombre (`#name`) | el algoritmo *accname* |
| 6 | El estado (`#state`) | `checked`, `pressed`, `disabled` nativos |
| 7 | Relaciones y agrupación (`#relations`) | `fieldset` + `legend`, jerarquía y landmarks |
| 8 | El foco (`#focus`) | el orden lo pone el DOM; foco visible |
| 9 | El error (`#errors`) | `aria-describedby`, `aria-invalid`, `aria-live` |
| 10 | El color (`#color`) | contraste medido y color nunca como canal único |
| 11 | Las flores marchitas (`#wilted`) | el div-botón y el falso control |
| 12 | Patrones de diseño accesible (`#patterns`) | cuaderno de decisiones: razón e impacto |
| 13 | El suelo (`#ground`) | lo que aún no es rama: AOM y HTML in Canvas |
| 14 | Las raíces (pie) | manifiesto WCAG 2.2 AA de la propia obra |

La corona de enlaces cubre un arco de **316°** (trece puestos, doce pasos de
26,3333°) y deja libres los **44°** de abajo para que salga el tronco.
Su aro arranca denso en la estación 1 y se aclara hasta la 13: se ve por
dónde empieza y hacia dónde va. Desde 1440 px rodea la flor sin costar un
píxel de alto; por debajo, los trece cuelgan en dos columnas a los lados del
tallo.

## Patrón y antipatrón, con la prueba delante

En las estaciones del foco y del error, cada caso se muestra por pares: el
código, la razón, el coste **y el trozo de Árbol de Accesibilidad que ese
código genera de verdad**, dibujado como lo dibuja el inspector. La
diferencia deja de ser una opinión: en un lado hay nodos con rol, nombre y
estado; en el otro, huecos. Ninguno de los antipatrones está activo en la
página.

## Contraste medido contra el lino `#f3ead6`

| Color | Razón | Para qué sirve |
| --- | --- | --- |
| Tinta `#17150f` | 15,3:1 | texto, líneas, tronco |
| Violeta `#4b2e83` | 8,7:1 | forma y texto |
| Azul `#0047ab` | 7,1:1 | forma, enlaces y texto |
| Ocre `#8a5a00` | 5,0:1 | ramas y notas al margen |
| Rojo `#d81e3f` | 4,2:1 | forma y texto grande |
| Cian `#0f7f8c` | 4,0:1 | solo grafismo |
| Amarillo `#f2b705` | 1,5:1 | relleno con contorno de tinta; **jamás** texto |

Cuando el rojo o el verde tienen que ser texto pequeño, la obra usa un paso
más oscuro: `--rojo-texto #b3132f` (5,8:1) y `--brote-texto #3d6129` (6,0:1).

## Preparada para agentes

- **JSON-LD** en la cabecera: un `@graph` con `VisualArtwork` +
  `LearningResource` —`teaches`, `accessMode`, `accessibilityFeature`,
  `accessibilitySummary`, `timeRequired`— y un `BreadcrumbList` con las
  trece estaciones.
- **`llms.txt`**: el resumen de la obra en texto plano, con su índice, su
  gramática, sus contrastes y sus garantías.
- **El árbol, exportable**: desde la estación 3 se descarga en JSON el rol,
  el nombre, el origen del nombre y el estado de cada nodo, con la misma
  poda que aplica el navegador.
- **Región `aria-live="polite"`** con el relato de cada cambio de estado.

## Inspector en vivo

Reproduce el flujo de DevTools (Chrome/Edge: Elementos → Accesibilidad;
Firefox: Inspector de Accesibilidad) con los niveles reales del árbol
—`list → listitem`, `figure → caption`, `group → radio`, `form → textbox`—.
Y con los **nodos de texto**: un `listitem`, una región o un grupo no tienen
nombre accesible, así que su contenido llega al árbol como un nodo
`StaticText` —lo que de verdad lee en voz alta la tecnología de apoyo—. Solo
se añade donde falta el nombre: si el nodo lo tiene, ese nombre ya sale de su
texto y repetirlo sería ruido. La poda también es real: lo `aria-hidden` y lo
presentacional no entran. La
ficha del nodo da rol, nombre y su origen, descripción, estados,
propiedades, nodo padre y **orden de foco dinámico (Xº de Y)**. En móvil es
un `<dialog>` modal; desde 1024 px, columna lateral. Como DevTools, no se
inspecciona a sí mismo.

## Estructura

```
accessibility-bloom/
├── index.html          # la obra
├── llms.txt            # resumen legible por máquinas
├── css/
│   ├── tokens.css      # paleta y tokens semánticos
│   ├── base.css        # reset, tipografía, foco, preferencias del sistema
│   ├── artwork.css     # composición: mandala, eje, ramas, patrones
│   ├── flowers.css     # flores por etiqueta y contrato de estados
│   └── panel.css       # inspector del árbol
├── js/
│   ├── main.js         # cableado de flores, corona, riego y exportación
│   ├── synesthesia-map.js  # forma ↔ etiqueta ↔ color ↔ timbre
│   ├── synesthesia.js  # motor de audio one-shot
│   ├── tree-ax.js      # inspector y serialización del árbol
│   └── sprouts.js      # aparición al hacer scroll (mejora progresiva)
├── README.md
├── docs/                   # propuesta, guion de la charla y guion de demo
└── LICENSE             # CC BY-NC-SA 4.0
```

Los módulos ES requieren HTTP: sirve la carpeta con cualquier servidor
estático (`npx serve`, `python -m http.server`), nunca por `file://`.

## El código, en inglés

Clases, atributos `data-*`, identificadores de `id`, variables CSS, nombres
de función y nombres de archivo están **en inglés** —`.mandala`, `.petal`,
`.branch__arc`, `--axis-x`, `data-heartbeat`, `#structure`, `tree-ax.js`—
para que cualquiera pueda leer y reutilizar el código. Los **comentarios y
todo el contenido visible siguen en español**: la obra se lee en español y
sus decisiones se explican en español.

## Accesibilidad (WCAG 2.2 AA)

- Contraste ≥ 4,5:1 en texto normal y ≥ 3:1 en texto grande y en las formas
  que llevan significado; el color nunca es el único canal.
- 100 % teclado, sin trampas, con foco visible incluso cuando el control
  real está oculto dentro de su `<label>`. Enlaces de salto que no se
  escapan de la pantalla a 320 px.
- Rol, nombre y estado nativos en cada flor; toda figura lleva cartela.
- Objetivos ≥ 44×44 px; reflow al 400 % y a 320 px sin scroll horizontal.
- `prefers-reduced-motion`, `prefers-contrast` y `forced-colors` respetados.
  El latido se pausa **en el fotograma exacto**, sin reiniciarse.
- Sonido solo tras interacción, silenciable, con la preferencia persistida.
- Pétalos y adornos con `aria-hidden`: pintura, no información.

## Licencia

© 2026 María Rogles · [CC BY-NC-SA 4.0](LICENSE) — Reconocimiento, no
comercial, compartir igual.
