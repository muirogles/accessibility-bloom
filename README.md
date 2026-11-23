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
| Arco de rama | tinta, o el color de su estación | `<h1>`–`<h3>` | heading | silencio |
| Gris marchito | `#8d857a` | `<div>` sin semántica | no llega al árbol | mudo |

Kandinsky fijó tres correspondencias —círculo-azul, triángulo-amarillo,
cuadrado-rojo—. El rombo violeta, la barra cian y el arco de rama son
**extensión propia** de esta obra, y se declara para no atribuirle nada que
no dijera. El **ocre no entra nunca en la flor**: es el color de la savia,
que corre por los tallos, por las raicillas del manifiesto y por las notas
de lectura. El tronco y las ramas se trazan en tinta, y la flor de la
portada no tiene tallo de savia: la sostiene el propio tronco, que sube
hasta su cáliz.

## La portada: flor y enredadera

La portada es la primera pantalla de la obra, dentro del marco y por
encima del lienzo: el inspector no aparece en ella. Se lee con Kandinsky,
*Punto y línea sobre el plano*, sin una sola línea de texto explicativo.

- **El punto** es el corazón: el nodo, en calma, con el título.
- **Los planos** son las cinco voces de la gramática, cada una de un solo
  color limpio y con la tensión de su forma: el amarillo del enlace,
  agudo (60°), el más alto; el rojo de la casilla y el violeta del radio,
  en ángulo recto (90°), a los lados; el azul del botón y el cian del
  campo, obtusos (150°), abajo. **Los tres ángulos son los de Kandinsky**
  en *Punto y línea sobre el plano*: el agudo de 60° es amarillo, el
  recto es rojo y el obtuso de 150° es «el típico ángulo azul». **Lo
  áureo es todo lo demás:** las cinco direcciones son las del pentágono
  (72° entre voces) y las longitudes bajan por la escala áurea: φ², √5
  (= φ² − 1/φ²) y 2 (= √5 − 1/φ³). Cada pareja comparte ángulo, así que
  la flor es simétrica; lo cálido sube y lo frío baja.
- **La corona** es la flor de la vida de la primera versión: diez
  circunferencias que se entrelazan y se cruzan en h/φ y en h·φ. Cada
  pétalo de la corona mide h y es más ancho justo en el borde del
  corazón: blanco sobre cada voz y verde en cada hueco.
- **Los capítulos** son cuatro flores menores, separadas de la grande
  (arriba a h·(2φ − 1/φ²), abajo a h·2φ), con títulos cortos: *El árbol*,
  *El nodo*, *El pulso* y *El cultivo*. Cada uno es un botón desplegable
  dentro de su encabezado (patrón acordeón de la APG), con aro azul de
  botón y **tres pétalos a 36°** (el ángulo del pentágono). Cerrado, del
  pétalo central sale un tallo hasta un capullo de enlace: avisa de que
  dentro hay enlaces. Abierto, de cada pétalo **brota su enlace**:
  - los capullos van en columna, a hc·φ² del centro y a 2/φ·hc entre sí;
  - el tallo central mide exactamente hc, porque φ² − φ = 1;
  - los otros dos son arcos tangentes al eje de su pétalo en la punta que
    pasan por el capullo (medido: error 0,01 px).

  Cada estación es la misma flor de enlace que en las láminas. Al pasar o
  enfocar un enlace, su pétalo se enciende en color pleno, crece y se
  perfila.
- **Las enredaderas** son un único arco cada una, tangente a una
  circunferencia de la corona y a la circunferencia que dibuja la hoja
  del capítulo, de modo que la línea termina formando esa hoja. Todas las
  bandas de tinta van por dentro de su circunferencia, y la enredadera
  por fuera de la suya: en las tangencias, el trazo no tiene salto.
- **La línea** es el tallo: baja por el hueco de abajo y, con dos cuartos
  de círculo tangentes, se coloca en el eje del tronco justo en el borde
  de la portada, con el mismo grosor del cuello del tronco. Flor y tronco
  son un solo trazo.

Todo sale de un radio, h, con φ, √5 y trigonometría CSS: ninguna unión a
ojo. La teoría no se escribe en pantalla: la imagen tiene un nombre
(«Flor de cinco voces») y una cartela enlazada con `aria-describedby`, y
lo demás se cuenta en la charla y está en la bibliografía.

**Sonido y animaciones** nacen apagados. «Sonido» y «Animaciones» son
interruptores (`aria-pressed`, nombre fijo). Con «Animaciones», la flor
se abre una vez, de las voces frías a las cálidas; si el sonido está
activado, cada voz suena con su timbre cuando se abre su plano. Si el
sistema pide menos movimiento, nada se mueve y las voces suenan igual.

## El árbol se aprende leyéndolo

- **Del HTML al árbol, dibujado.** La cabecera real de esta página, como se
  escribe (cuatro líneas de HTML) y como se entiende (su Árbol de
  Accesibilidad), con la gramática de la obra: el punto, la línea y el plano
  de Kandinsky. La región `banner` es el **nudo** (cada lámina cuelga de un
  nudo del tronco); el encabezado, el **arco** de rama, que nace de su rama y
  se curva como el de las láminas; el botón, el **círculo azul**, vacío porque
  no está pulsado: el estado se ve. Cada línea de HTML lleva, pequeña, la
  forma del nodo en que se convierte, y el ojo las empareja sin palabras. El
  árbol de renderizado no se dibuja: es este HTML con su CSS, la portada.
- **Un nodo, cuatro lecturas.** Del botón «Sonido» beben, por líneas de
  savia (no de tinta: no son nodos, son sus lectores), el lector de pantalla
  («Sonido, botón de alternar, no pulsado»), la línea braille (⠨⠎⠕⠝⠊⠙⠕), el
  control por voz («pulsa Sonido») y el agente de IA, con «Ver el árbol».
- **Lo que se lleva un agente.** Bajo la nota, a la vista y sin pliegue, la
  ruta de un agente de IA por la página, en el orden en que la recorre:
  `rel="ard"` (**la encuentra**: un enlace de la cabecera anuncia su guía
  para agentes) → `JSON-LD` (**sabe qué es**: una obra y una lección) →
  `llms.txt` (**lee el resumen**) → el árbol (**lee cada nodo**: rol,
  nombre, estado y acción) → `WebMCP` (**actúa**: herramientas con nombre).
  Cada paso es una pastilla con su fuente sobre un solo tallo, un verbo que
  se lee desde la sala y una línea. Los cuatro que leen van en contorno; el
  que actúa, relleno, y ahí acaba el tallo.
- **«Ver el árbol».** La lectura del agente abre un `<dialog>` modal (el
  mismo patrón que la capa de la estación 9) con el árbol de la página como
  datos, en JSON a 16 px para que lo lea la sala: rol, nombre, origen del
  nombre, estado y acción de cada nodo. Se desplaza dentro (con el teclado
  también) y lleva «Descargar JSON». Lo que se lleva un agente, lo ve y se
  lo lleva quien mira.
- **`disabled` frente a `aria-disabled`.** La estación del estado explica
  ahora lo que hace la casilla «Audiodescripción»: con `disabled` nativo sale
  del orden de foco —tabulando no se llega a ella—, pero el árbol la sigue
  mostrando; si hubiera que descubrirla con el teclado se usaría
  `aria-disabled="true"`, enfocable, anunciada como no disponible e inerte.
- **Coherencia de estados.** Revisado elemento a elemento: los interruptores
  de la portada («Sonido», «Animaciones») mantienen su nombre y dicen su
  estado con `aria-pressed`; los capítulos de la portada son
  desplegables con `aria-expanded`; los botones de la estación del rol
  también son conmutadores con `aria-pressed`; las casillas, `checked` nativo; los radios, agrupados en
  `fieldset`; el riego, `aria-invalid` solo mientras el error existe y
  `aria-describedby` hacia ayuda y error; la corona, `aria-current` en la
  sección visible.

## La escalera del nombre

El nombre accesible se calcula bajando una escalera: `aria-labelledby` ›
`aria-label` › `<label>` o `<figcaption>` › su texto › `title`, y gana el
primer peldaño que da un nombre. En la estación 5 el tallo del ramillete **es**
esa escalera: una lista ordenada (`<ol>`) de cinco peldaños. Un peldaño en
tinta es un paso que aquí nadie usa; el que nombra a un enlace es más grueso y
de savia, lleva escrito el nombre que da, y el enlace cuelga de él. «Al suelo»
gana en el peldaño 2 (`aria-label`); «Ir al inspector» baja hasta el 4 (su
texto). Arriba a abajo es también el orden del DOM y del foco, y la nota más
aguda (Do5) queda encima de la más grave (La4), como en el pentagrama. El color
nunca va solo: el peldaño encendido también es más grueso y lleva texto, así
que en colores forzados se sigue leyendo.

Con espacio (una columna de 440 px o más), el peldaño cruza el capullo de su
flor; en columnas estrechas y en el móvil, el peldaño va encima y la flor cuelga
debajo. El inspector (`tree-ax.js`, `nameOf`) sigue el mismo orden: antes
miraba `aria-label` antes que `aria-labelledby`, al revés que el estándar, y no
llegaba a `title`.

## El acorde

Los tres botones de la estación del rol suenan Do, Mi y Sol: un acorde mayor.
Ahora cuelgan uno al lado del otro de una vara de savia, cada uno de un hilo
cuya longitud es inversamente proporcional a su nota —cuanto más largo el tubo,
más grave la nota, como en las campanas tubulares o los tubos de órgano—:
`hilo = longitud de la raíz × 262 Hz / Hz de la flor` (Do 1 · Mi 0,79 · Sol
0,67). Sus alturas dibujan el acorde que se oye, y la nota más grave es también
la flor más grande. De izquierda a derecha, Do, Mi, Sol: el orden visual es el
del DOM y el del foco. En el móvil la misma ley gira 90°: cada flor en su fila,
a una distancia del tallo proporcional a su hilo.

La cartela de cada flor es **la ficha de su nodo**: el estado, en savia, y
cuando cambia destella una vez en tinta, en el mismo instante en que su nodo
destella en el inspector (con movimiento reducido no destella: el texto ya ha
cambiado).

## Quita un canal: por qué Kandinsky

Kandinsky contaba que veía sonidos y oía colores: una misma idea le llegaba por varios
sentidos a la vez. La accesibilidad es esa sinestesia **construida a
propósito**: un significado, varios canales, ninguno imprescindible. La
estación 2 lo demuestra en vez de decirlo. Una sola flor, el botón Do4,
cuelga del nudo de su rama, y cinco interruptores `aria-pressed` apagan, uno a
uno, una manera de percibirla:

| canal apagado | qué le pasa a la flor | lo que sigue contándolo | WCAG |
|---|---|---|---|
| Color | conserva su luminosidad y pierde el tono | la forma y el texto | 1.4.1 |
| Forma | se disuelve en una nube de color, sin borde | el color y el texto | 1.3.3 |
| Sonido | calla, y lo que sonaría se escribe | el subtítulo | 1.1.1 |
| Texto | su nombre visible se desvanece | el nombre, en el árbol | 4.1.2 |
| Píxeles | no se dibuja nada salvo el marco del nodo | el nodo | 1.3.1 |

Solo cambia la presentación: rol, nombre y estado no cambian nunca, y el botón
sigue funcionando en cualquier combinación, con ratón o con teclado. El foco
nunca se apaga: pertenece a quien navega, no a un canal. Con los cinco
apagados queda **lo que lee una máquina** —el lector de pantalla, el control
por voz, un agente de IA—: el nodo en JSON y la frase que diría la voz. Se
calculan en vivo con las mismas funciones que el inspector (`tree-ax.js`), así
que nunca pueden contradecir al árbol. Sin píxeles, el tallo termina en el
borde del marco del nodo: nada flota, ni siquiera una ausencia.

La lámina se lee en dos filas, cada idea frente a su imagen: la nota (el
porqué) frente a la flor, y los interruptores frente a la partitura (el cómo
suena). En la radiografía, cada chip vive dentro de su propio marco: los
cinco interruptores se ven como cinco fichas de nodo.

## La partitura en pentagrama

La partitura de la estación 2 ya no es una leyenda: es un **pentagrama**, y
cada voz de la gramática está en la nota en que suena de verdad (la mediana de
las notas distintas que declaran sus flores). Forma, color, timbre **y altura**
se leen en un solo dibujo, en clave de sol, con índice de octava científico
(Do4 = Do central, 261,6 Hz; en la nomenclatura franco-belga sería Do3):

| voz | nota | Hz (temperado) | en el pentagrama |
|---|---|---|---|
| `button` | Do4 | 261,6 | línea adicional inferior |
| `checkbox` | Re4 | 293,7 | bajo la primera línea |
| campo de texto | Mi4 | 329,6 | primera línea |
| `radio` | Re5 | 587,3 | cuarta línea |
| `a` | Fa5 | 698,5 | quinta línea |

`button`, casilla y campo suben **Do, Re, Mi**. El radio es una casilla que
vive en grupo: canta **su misma nota, una octava más alta**, al doble exacto de
frecuencia (293,665 × 2 = 587,33); por eso comparte nombre y se distingue por
el índice (Re4 / Re5), por su sitio en el pentagrama y por la marca «2 × Re4».
Al marcarse, la casilla sube justo a esa octava: abre en la nota del radio. El
enlace es la voz que viaja: las doce estaciones de la portada son los doce
semitonos de Do5 a Si5, y la mediana de todos los enlaces de la obra es Fa5.

La afinación es una sola (`js/notes.js`): temperamento igual, La4 = 440 Hz.
Las flores declaran Hz redondeados en `data-freq` y el sintetizador los lleva a
su nota temperada, así que las octavas son exactas; los intervalos de cada
gesto (5/4, 3/2…) son proporciones justas sobre esa raíz: acordes puros sobre
una afinación pareja. Todo gesto que abre empieza en su raíz: el rombo ya no
salta una octava (sonaba Re6 mientras la partitura decía Re5); es «agudo»
porque sus flores viven arriba (Si4–Mi5). Los subtítulos nombran la nota que
suena («desde Mi4, 330 Hz»). En desarrollo, `js/score-check.js` recalcula la
partitura desde las flores y avisa en la consola si algo no coincide; no entra
en el build. El arco del encabezado es un **silencio**, en medio del pentagrama, y el
`div`, que no llega al árbol, **tampoco llega a la partitura**: su casilla no
tiene pentagrama y queda caído debajo.

Toda la geometría sale de dos tokens, la separación entre líneas y el medio
paso: el pentagrama mide 19 medios pasos, la línea de abajo está en el 13 y una
nota en `13 − paso`. En móvil cada voz es una fila con su trozo de pentagrama
(8 px entre líneas); desde 64 rem las voces son las columnas de un pentagrama
continuo (16 px). En colores forzados las líneas son estructura, en el color de
texto del sistema.

## Radiografía: el árbol sobre la obra

En el inspector, un botón `aria-pressed` —**Radiografía**— superpone el Árbol
de Accesibilidad sobre la propia obra. Lo que se ve (los píxeles) se vela y lo
que se entiende aparece encima: cada elemento con significado muestra su nodo,
`rol «nombre» estado`, con el color de su forma en la gramática —azul el
botón, amarillo el enlace, rojo la casilla, violeta el radio, cian el campo,
tinta el encabezado— y el estado en savia. Los puntos de referencia y las
regiones son marcos discontinuos; los controles, marcos sólidos.

- Es la estación 1 hecha visible: el Árbol de Accesibilidad encima de lo
  que se ve, sobre el mismo DOM.
- Lee rol, nombre y estado con **las mismas funciones** que el inspector
  (`tree-ax.js`): los dos no pueden contradecirse. Se redibuja al cambiar un
  estado, el tamaño o las fuentes: al pulsar «Do» su chip pasa a
  `pressed=true` en el acto.
- Lo que está oculto a la vista pero presente en el árbol —el encabezado de la
  corona, solo para lectores de pantalla— se marca **«solo en el árbol»**.
- Los chips son `aria-hidden` (el árbol de verdad ya está en el inspector y en
  la tecnología de apoyo), no reciben el puntero —la obra sigue operable
  debajo— y nunca se solapan: se colocan en orden del documento y el que
  choca con otro baja lo justo.

## Una estación, una pantalla

La obra se presenta en sala (un portátil a pantalla completa por HDMI, un
televisor 4K u 8K), y en una pantalla así **cada estación ocupa exactamente
una pantalla**: nada queda cortado por abajo.

- **Escenas.** Con el viewport de 90 × 56 rem o más (1440 × 896 px), cada
  rama, los brotes y las raíces miden `100dvh` y el desplazamiento se asienta
  al principio de cada una (`scroll-snap-type: y proximity`: nunca atrapa,
  se puede parar entre dos; AvPág cae justo en la siguiente). Con movimiento
  reducido no hay imán. El umbral está pensado para la ventana real de quien
  presenta —Chrome maximizado, 1707 × 900, o con la barra de marcadores,
  1707 × 917—, no solo para la pantalla completa: medido ahí, a 1707 × 1067,
  1920 × 1080, 2560 × 1440 y 3840 × 2160, las doce escenas caben.
- **La lámina Kandinsky.** Cada escena es una lámina compuesta para leerse
  desde el fondo de la sala, con una jerarquía fija: el **numeral** de la
  estación, grande (el mismo aro con arco de rama de siempre, en el color de
  la estación: el ancla geométrica de la lámina) · el **título** a 40/48 ·
  la **entradilla**, el primer párrafo, a 24/32: la frase que la lámina
  afirma · el cuerpo a 16/24 · **lo que la sala tiene que leer** también a
  16/24: la invitación de cada lámina (qué probar ahora, en savia), los pies
  de figura y las cartelas que cambian en vivo · y solo el detalle de
  consulta (referencias WCAG, frecuencias, etiquetas de la partitura, el
  inspector) a 12/16. **Un papel, un estilo:** el nombre de algo (rótulos,
  flores, leyendas) en Space Grotesk seminegrita; la etiqueta de categoría
  («Lector de pantalla», «Se anuncia») igual pero más suave; el título de un
  paso a 20 seminegrita; lo que recibe un lector a 20 regular; la letra mono
  solo para código, regular y al tamaño de su línea; sin mayúsculas ni
  cursivas de adorno. De 48 estilos de texto distintos se pasa a 27, y cada
  lámina usa entre 7 y 16. El numeral no lleva una forma de la gramática: círculo,
  triángulo, cuadrado y rombo están reservados para los tipos de elemento
  HTML, y un número no es un elemento.
- **El zoom manda.** Al 200 % un portátil de 1707 px se queda en 853 × 533:
  la consulta deja de cumplirse y la obra vuelve a su flujo de siempre, que
  reajusta sin cortes (1.4.10). La escena nunca se impone a quien amplía.
- **Las dos orillas.** El tronco parte cada lámina en dos: **la afirmación
  en una orilla** (la nota) y **la evidencia en la otra** (flores, código,
  árbol). Donde la evidencia no cabe en una orilla, su primera pieza —lo que
  se prueba, como el riego de «Lo que cambia»— pasa a la otra orilla en el
  orden pruébalo → lo que se oye → prueba. Solo se disuelven envoltorios `div`
  sin semántica (`display: contents`): ni el orden del DOM ni el árbol de
  accesibilidad cambian (comparado nodo a nodo, dentro y fuera de escena).
  **Cada orilla se apila sola:** las filas solo alinean el arranque de las
  dos orillas, y una pieza nunca espera a que acabe la otra orilla (en «La
  estructura» el árbol y sus cuatro lecturas forman una sola figura; en «La
  sinestesia» los interruptores quedan justo bajo la flor que apagan).
- **La rama se curva bajo su carga.** En las escenas con poca carga, la
  carga no se queda arriba con media pantalla vacía: la rama se curva más
  (más caída) y la baja consigo. Cada estación declara cuánto mide su carga
  y la caída crece un 45 % del hueco que sobra.
- **Pantallas de sala.** Por encima de 1920 px de ancho la letra base crece
  con la pantalla —24 px en 4K, 40 px en 8K—, con dos topes: por alto (cada
  escena sigue cabiendo) y por abajo (nunca menos que la letra que elige quien
  lee). Solo la mitad del cuerpo depende del ancho (`50 % + 100vw / 240`,
  que añade justo un módulo a 1920 px), así el zoom sigue agrandando: al
  300 % en un 4K, el doble exacto de letra.

## El sistema de diseño: retícula de 8 y tres capas de tokens

Ningún valor del CSS vive fuera de las variables, y las variables van en
tres capas: **primitivas** (colores medidos, la retícula, la escala de letra,
los trazos, el tiempo) → **semánticas** (para qué sirve: texto de cuerpo,
título, hueco entre orillas, línea del tronco, colores forzados…) →
**de componente** (`--branch-*`, `--note-*`, `--flower-*`…, declaradas
al principio de cada componente y que solo citan las anteriores).

- **Espacios**, siempre múltiplos de 8 px, escritos en rem (`--unit:
  0.5rem`), para que el zoom lo agrande todo a la vez.
- **Letra**, en la escala 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80, y
  **todo interlineado en la retícula** (16, 24, 32…): cada línea ocupa un
  número entero de módulos.
- **Trazos**, fracciones del módulo en potencias de 2 (`--unit` / 8, / 4,
  / 2 y el módulo entero: 1 · 2 · 4 · 8 px con la raíz a 16 px). Son
  relativos como todo lo demás: crecen con la letra de quien lee. El foco
  es `--stroke-4`.
- **Cero**: se escribe 0 una sola vez, en la primitiva `--space-0`,
  registrada con `@property` como longitud para que siga valiendo dentro
  de `calc()`, `min()` y `max()`. Ningún componente escribe px ni 0rem.
- **Tiempo**, en pasos dobles (120 · 240 · 480 · 960 ms).
- Los colores del sistema (`canvas`, `canvastext`…) también son tokens
  (`--sys-*`), con su papel en colores forzados (`--forced-*`).
- La geometría que tiene que encontrarse —nudos, tallos, uniones— se escribe
  como una fórmula entre tokens, nunca como un número medido a ojo.
- Las únicas cifras sueltas son los cortes de `@media` y `@container`:
  CSS no admite variables ahí. Todas caen en la retícula.

Al pasar al sistema aparecieron cinco formas que contradecían la regla de la
obra («ninguna forma está girada»): el rombo de la partitura y el de la
paleta eran cuadrados girados, y el arco de rama de la partitura, un aro
girado. Ahora el rombo es un `clip-path` y el arco se dibuja como se dibuja
una rama. La única rotación que queda sigue siendo la del capullo marchito.

### Controles: la gramática también en los botones

Todos los controles de la obra son **un solo componente** (`.control`) y
hablan la misma gramática que las flores:

- **Un botón es el círculo azul**: una píldora (el círculo estirado para que
  quepan sus palabras), con borde y letra azules, `Space Grotesk` seminegrita
  de 16 px y 48 px de alto. El que encabeza su escena o su diálogo va
  relleno (`.control--primary`: «Ver árbol», «Regar», «Abrir una capa»,
  «Descargar JSON»). Los demás —«Ver el árbol», «Cerrar», «Contraer todo»,
  «Expandir todo»— son la misma píldora sin relleno.
- **No disponible ahora** (`aria-disabled="true"`): el gris de la flor
  desactivada, sin lavado al pasar y con el puntero de no permitido; sigue
  siendo enfocable y se anuncia «no disponible». Lo usan «Contraer todo» y
  «Expandir todo» del inspector cuando no tienen nada que hacer (todo
  plegado o todo desplegado): el patrón que enseña la estación 6.
- **Variantes, nunca rellenos sueltos.** Solo hay dos modificadores:
  `--primary` y `--compact` (relleno corto, para los controles que comparten
  una fila estrecha: los cinco canales y las dos acciones del inspector).
  Ningún componente redefine `--control-pad` por su cuenta, y dentro de un
  control solo hay un tamaño de letra (la coletilla de «Radiografía» sigue en
  su nombre accesible, oculta a la vista: el nombre empieza por la etiqueta
  visible, WCAG 2.5.3).
- **Un interruptor** (`<button aria-pressed>`: «Sonido» y «Animaciones» en
  la portada, los cinco canales de «Quita un canal», «Mover con CSS» y la
  Radiografía) y **un desplegable** (`<summary class="control">`: «Leer de
  cerca», «Para saber más»), porque los dos tienen estado, llevan el propio
  círculo como marca, con el
  contrato de estados de la obra: **aro vacío** mientras es falso, **aro
  lleno** y el lavado azul de la flor mientras es cierto. La forma dice el
  estado; el color solo lo acompaña.
- **Un enlace nunca es una píldora**: son palabras subrayadas o su triángulo
  amarillo. Hasta los enlaces de salto son una pestaña amarilla con las
  palabras subrayadas en tinta: lo que te lleva a un sitio nunca parece lo
  que hace algo.
- El paso del puntero lava el botón de azul (sobre blanco: mezclado con el
  lino, el azul se vuelve gris y el gris parece desactivado). El foco es el
  mismo trazo discontinuo en toda la obra.

## Un trazo que engorda hacia la tierra

Tallo, codo, tronco y raíz son **un solo trazo** que se ensancha como una
planta: fino en el cáliz (0,44 T), 0,6 T en el cuello, T en la tierra y
afinándose otra vez hasta 0,24 T en la raíz. Cada tramo acaba con el ancho
con que empieza el siguiente: medido píxel a píxel, ninguna unión cambia de
grosor (antes el tronco nacía a 7 px bajo un codo de 20). El codo recto se
pinta como fondo, igual que tallo y tronco, porque un borde se redondea al
píxel del dispositivo y un fondo no.

**La carga cuelga del nudo.** El nudo del extremo de cada arco es «donde el
arco entrega su carga», y lo es al pie de la letra: en las ramas que llevan
un ramillete o un ramo, el arco acaba exactamente sobre el tallo de savia, en
el punto en que su curva ya cae en vertical, y el tallo sigue esa vertical.
Tinta hasta el nudo, savia desde él. El tramo de tallo se calcula —relleno de
la rama más relleno de la carga menos la altura del nudo—, no se estima: antes
los tallos asomaban 23–28 px por encima de su arco en escritorio y en móvil
empezaban en el aire. En el ramo, el tallo descuenta el alto de la leyenda del
`<fieldset>`, que baja el filete hasta su mitad, y acaba justo sobre él.

## Un solo eje

El tronco, las ramas, las raíces y la portada leen **una sola variable**,
`--axis-x`; en el pie, `--root-x` la prolonga y de él arrancan también las
raicillas del manifiesto, que antes nacían despegadas. El tallo baja desde el cáliz, en la vertical del centro del mandala, y un **codo de vid** lo
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

La floración habla la lengua del mandala: **dos órdenes de pétalos** —color
pleno y el mismo color rebajado con lino, la receta de los pétalos del
recorrido en reposo—, contorno de tinta en cada pétalo y, en el instante en que el estado
se vuelve cierto, **una onda** con la forma de la flor que se expande y se
apaga una vez. En el inspector, el estado que acaba de cambiar destella en
tinta: la savia une el píxel con su nodo. Sin movimiento no hay onda ni
destello, y el estado se lee igual.

## El recorrido · doce estaciones

Cuatro capítulos de tres, en el mismo orden que la portada, el HTML y el
tabulador. Las ramas se alternan a derecha e izquierda; la primera de
cada capítulo sale del tronco con el trazo grueso. Se pasó de 16 a 12
fusionando lo que contaba lo mismo:
- Estructura y Quién lee forman una sola estación: los lectores;
- La ruta absorbe Relaciones: grupos y listas;
- Rol absorbe Acciones: el rol decide el verbo;
- Ignorado y Patrones forman «Patrón y antipatrón».

| Capítulo | # | Estación | Qué enseña |
| --- | --- | --- | --- |
| I · El árbol | 1 | La estructura y sus lectores (`#structure`) | del HTML al árbol, dibujado; un nodo, cuatro lecturas (lector, braille, voz, IA); lo que se lleva un agente |
|  | 2 | La sinestesia de la obra (`#synesthesia`) | cinco canales para el mismo dato; la partitura; «Quita un canal» |
|  | 3 | La ruta: regiones, grupos y listas (`#route`) | landmarks y niveles leídos en vivo; `fieldset` + `legend`; «lista, N elementos» |
| II · El nodo | 4 | Rol y acciones (`#role`) | qué es esto, primera regla de ARIA y el verbo que ofrece cada rol |
|  | 5 | El nombre (`#name`) | el algoritmo *accname* |
|  | 6 | Estado y valor (`#state`) | estados nativos; `invalid` también es un estado |
| III · El pulso | 7 | El foco (`#focus`) | el orden del foco sigue el HTML, no el dibujo |
|  | 8 | Lo que cambia (`#live`) | regiones vivas; el error se ata al campo y devuelve el foco |
|  | 9 | Capas (`#layers`) | `<dialog>` con `showModal()` e `inert` |
| IV · El cultivo | 10 | Patrón y antipatrón (`#patterns`) | lo que vive y lo que se marchita; las decisiones de la obra |
|  | 11 | Percepción (`#color`) | contraste medido; protanopia, deuteranopia, tritanopia y sin color |
|  | 12 | Brotes (`#sprouts`) | referencias ARIA con elementos, HTML en canvas, nodos virtuales |

**Las raíces** (`#roots`) son el pie, no una estación. Las alcanzan el
tallo, que se hace tronco, y el tercer enlace de salto.

**Doce estaciones, doce semitonos.** Cada enlace de la portada suena en
su semitono, de Do5 (Estructura) a Si5 (Brotes): el recorrido es una
escala cromática completa, y la partitura de la estación 2 lo comprueba.

**La acción del árbol.** El rol decide el verbo que expone el árbol. La
ficha del inspector lo muestra para cada nodo, con los casos verificados
en el código de Chromium (`AXObject::Action()`, en
`third_party/blink/renderer/modules/accessibility/ax_object.cc`):
- un campo, `activate`;
- lo que se marca, `check` o `uncheck`;
- un botón o un `summary`, `press`;
- un enlace, `jump`;
- un `select`, `open`.

**Daltonismo sin SVG.** «Mirar como» (Percepción) cambia los colores
primitivos de toda la obra por sus versiones con protanopia,
deuteranopia o tritanopia. Las calcula `tools/cvd-palette.mjs` con las
matrices de Machado, Oliveira y Fernandes (2009), severidad 1,0,
aplicadas en RGB lineal (decisión nuestra: la página de los autores no lo
dice). El resultado queda escrito como tokens en `tokens.css`.

**El color va después de la sinestesia, y es a propósito.** La sinestesia
(2) enseña la gramática y «Quita un canal» la prueba sobre **una** flor.
Percepción (11), en «El cultivo», prueba cómo la perciben otros ojos sobre
**toda** la obra.

**Leer de cerca.** El código y los fragmentos del árbol no se leen desde
el fondo de una sala. En las estaciones 7, 8 y 10 aún se pliegan en un
`<details>` «Leer de cerca», a un clic para quien lee en su mesa. La
estación 1 ya no pliega nada: lo que se lleva un agente se ve entero, como
una ruta visual; el resto irá saliendo del pliegue del mismo modo.

## Patrón y antipatrón, con la prueba delante

En las estaciones del foco y de «Lo que cambia», cada caso se muestra por pares: el
código, la razón, el coste **y el trozo de Árbol de Accesibilidad que ese
código genera de verdad**, dibujado como lo dibuja el inspector. La
diferencia deja de ser una opinión: en un lado hay nodos con rol, nombre y
estado; en el otro, huecos. Ninguno de los antipatrones está activo en la
página.

## Contraste medido contra el lino `#f3ead6`

| Color | Razón | Para qué sirve |
| --- | --- | --- |
| Tinta `#17150f` | 15,3:1 | texto, líneas, tronco y ramas |
| Violeta `#4b2e83` | 8,7:1 | forma y texto |
| Azul `#0047ab` | 7,1:1 | forma, enlaces y texto |
| Ocre `#855600` | 5,3:1 | savia: tallos, raicillas y notas de lectura |
| Rojo `#d81e3f` | 4,2:1 | forma y texto grande |
| Cian `#0f7f8c` | 4,0:1 | solo grafismo |
| Amarillo `#f2b705` | 1,5:1 | relleno con contorno de tinta; **jamás** texto |

Cuando el rojo o el verde tienen que ser texto pequeño, la obra usa un paso
más oscuro: `--red-text #b3132f` (5,8:1) y `--sprout-text #3d6129` (6,0:1).

En la página, cada muestra de la paleta lleva la **silueta de lo que pinta**
—círculo, triángulo, cuadrado, rombo, barra; el tronco y el tallo de savia
para tinta y ocre—, y **«Mirar como»** en Percepción (un grupo de botones de
opción) cambia el color de toda la obra a protanopia, deuteranopia,
tritanopia o sin color para comprobarlo: la paleta y las flores se siguen
leyendo por la forma.

El contorno de tinta del amarillo es real en todas partes. Triángulos y
rombos se recortan con `clip-path`, que se aplica **después** de `filter`:
un `drop-shadow` en el mismo elemento quedaría recortado. Por eso el
contorno lo pone el contenedor (`.flower__petals`, `.crown__flower`,
`.shapes`) o una capa de tinta bajo una silueta de color algo menor (el
cáliz del mandala, los capullos de la corona, los pétalos del recorrido, la
partitura y la paleta).

## Preparada para agentes: leer, descubrir, actuar

Un agente de IA lee la obra como un lector de pantalla: por su Árbol de
Accesibilidad. Es la misma sinestesia, con un lector más. Lo que la obra
le ofrece, por orden:

1. **Leer.** El árbol, con rol, nombre, estado y acción en cada nodo; el
   JSON-LD de la cabecera (`VisualArtwork` + `LearningResource` y un
   `BreadcrumbList` con las doce estaciones), y el árbol en JSON, que se ve
   y se descarga desde «Ver el árbol», en la estación 1. Esa estación dibuja la
   ruta entera, «Lo que se lleva un agente», de encontrar la página a actuar.
2. **Descubrir.**
   - `public/llms.txt`, en el formato de llmstxt.org: H1, resumen en cita
     y listas de enlaces a cada estación.
   - `public/agent-skill.md`, una habilidad para agentes con frontmatter
     `name` y `description`.
   - `public/ard.json`, el manifiesto *Agentic Resource Discovery*,
     también publicado como `ai-catalog.json` (su nombre anterior), con
     `<link rel="ard">` y `<link rel="ai-catalog">` en el `<head>`.

   Van enlazados desde el HTML porque en GitHub Pages la obra vive en una
   subruta, no en la raíz del dominio. Llevan `"specVersion": "1.0"` en la
   raíz: Lighthouse 13.5 (`ai-catalog.json`) lo exige y Lighthouse 13.6
   (ARD 0.91, `ard.json`) lo acepta. Los dos validadores dan 0 errores y
   0 avisos.
3. **Actuar (WebMCP).** `js/agent.js` registra, solo si el navegador
   expone `document.modelContext`, cuatro herramientas:
   - `list_stations` y `read_station_tree`, de solo lectura. El árbol se
     calcula con las mismas funciones que el inspector.
   - `go_to_station` y `set_vision`, que actúan pulsando los mismos
     controles que una persona.

   El riego es además una herramienta declarativa (`<form toolname
   tooldescription>`), y su `submit` devuelve al agente la misma frase
   que ve y oye la persona (`agentInvoked`, `respondWith`). Todo lo que
   hace un agente se anuncia en la región viva. El sonido y el movimiento
   nunca los toca un agente. Mientras un agente rellena el formulario, el
   navegador lo marca con `:tool-form-active`, y la obra lo dibuja con su
   propio anillo continuo.

**Medido (2026-11-22, Lighthouse 13.6.0, Chrome 158, escritorio,
`--enable-features=WebMCP`).** Rendimiento 1, accesibilidad 1, buenas
prácticas 1, SEO 1 y *agentic browsing* 1:
- árbol de accesibilidad válido;
- CLS 0;
- `llms.txt` y manifiesto ARD válidos (el ARD, sin errores ni avisos en
  el validador del propio Lighthouse);
- cinco herramientas WebMCP registradas, con esquemas válidos.

El único aviso informativo es que el `<form method="dialog">` de Capas no
está anotado. Es a propósito: solo cierra la capa, y anunciarlo como
herramienta sería falso.

**WebMCP en producción** necesita el token de la prueba de origen (desde
Chrome 149) para `https://muirogles.github.io`. Para probarlo en local,
`chrome://flags/#enable-webmcp-testing` o `--enable-features=WebMCP`.

## Inspector en vivo

Reproduce el flujo de DevTools (Chrome/Edge: Elementos → Accesibilidad;
Firefox: Inspector de Accesibilidad) con los niveles reales del árbol
—`list → listitem`, `figure → caption`, `group → radio`, `form → textbox`—.
Y con los **nodos de texto**: un `listitem`, una región o un grupo no tienen
nombre accesible, así que su contenido llega al árbol como un nodo
`StaticText` —lo que de verdad lee en voz alta la tecnología de apoyo—. Solo
se añade donde falta el nombre: si el nodo lo tiene, ese nombre ya sale de su
texto y repetirlo sería ruido. La poda también es real: lo `aria-hidden` y lo
presentacional no entran, ni lo que no se pinta: un elemento con `hidden`,
con `display: none` o dentro de un `<details>` cerrado. Cuando un
desplegable muestra u oculta contenido, el árbol se reconstruye. La
ficha del nodo da rol, nombre y su origen, descripción, estados,
propiedades, nodo padre y **orden de foco dinámico (Xº de Y)**. En móvil es
un `<dialog>` modal; desde 1024 px, columna lateral. Como DevTools, no se
inspecciona a sí mismo.

**Seleccionar, como DevTools.** Pulsar un nodo del panel lo selecciona, lo
resalta en la obra (una caja azul sobre su caja real) y lo trae a la vista,
sin mover el foco del documento: inspeccionar no cambia lo inspeccionado.
Si el control real está oculto dentro de su flor (un `input` visualmente
oculto), se resalta lo que se ve: su etiqueta o su flor. Pulsar en la obra
selecciona el nodo más cercano a lo pulsado, como el selector de elementos.
La línea de foco sigue diciendo la verdad: al pulsar texto, el foco va a
`<main tabindex="-1">`, el destino del enlace de salto.

## Estructura

```
accessibility-bloom/
├── index.html          # la obra
├── public/
│   ├── llms.txt        # resumen para agentes (formato llmstxt.org)
│   ├── agent-skill.md  # habilidad para agentes: cómo recorrer la obra
│   ├── ard.json        # manifiesto ARD (y ai-catalog.json, su nombre anterior)
│   └── robots.txt
├── css/
│   ├── tokens.css      # paleta, tokens semánticos y colores de estación
│   ├── base.css        # reset, tipografía, saltos, foco, preferencias del sistema
│   ├── cover.css       # la portada: flor, corona entrelazada, enredaderas y capítulos
│   ├── artwork.css     # composición: eje, ramas, escenas, controles
│   ├── flowers.css     # flores por etiqueta y contrato de estados
│   ├── panel.css       # inspector del árbol
│   └── xray.css        # radiografía: el árbol sobre la obra
├── js/
│   ├── main.js         # cableado de flores, sonido, animaciones, riego y exportación
│   ├── cover.js        # capítulos desplegables de la portada y su florecer sonoro
│   ├── stations.js     # la ruta, el orden del foco, el eco, la capa y «Mirar como»
│   ├── agent.js        # herramientas WebMCP: el agente lee el árbol y actúa
│   ├── tree-ax.js      # inspector y serialización del árbol (rol, nombre, estado)
│   ├── xray.js         # chips de la radiografía, con el mismo cálculo que el inspector
│   ├── channels.js     # «Quita un canal»: los cinco interruptores de la estación 2
│   ├── lesson.js       # ejemplares vivos de las láminas y «lo que entrega el árbol»
│   ├── synesthesia-map.js  # forma ↔ etiqueta ↔ color ↔ timbre
│   ├── synesthesia.js  # motor de audio one-shot
│   ├── notes.js        # notas temperadas ↔ altura en el pentagrama
│   └── score-check.js  # comprobación (solo en desarrollo) de la partitura
├── .github/workflows/
│   └── deploy.yml      # build con Vite y publicación de dist/ en GitHub Pages
├── package.json        # scripts dev, build y preview (Vite)
├── vite.config.js      # base relativa para Pages
├── README.md
├── tools/
│   └── cvd-palette.mjs # genera las paletas de daltonismo (Machado et al., 2009)
└── LICENSE             # CC BY-NC-SA 4.0
```

Para trabajar: `npm install` y `npm run dev` (Vite). `npm run build` deja la
obra en `dist/`, que es lo único que publica GitHub Pages. Los módulos ES
requieren HTTP: sin Vite, sirve la carpeta con cualquier servidor estático
(`npx serve`, `python -m http.server`), nunca por `file://`.

## El código, en inglés

Clases (BEM), valores de los atributos `data-*` (`data-shape="circle"`),
identificadores de `id`, variables CSS y de JavaScript, nombres de función y
nombres de archivo están **en inglés**, también en los ejemplos de código que
la obra muestra (`<div class="active">`). Solo el texto visible va en
español. Los estilos en línea se reservan para datos propios de cada pieza
(la altura de una nota en el pentagrama, la de una flor en el acorde); el
índice de cada pétalo, estación o enlace es un modificador BEM explícito
(`flower__petal--3`, `station--5`): añadir otro elemento nunca descoloca nada.
`nth-child` solo se usa para alternar (filas pares e impares) —`.rose`, `.lens`,
`.branch__arc`, `--axis-x`, `data-shape`, `#structure`, `tree-ax.js`—
para que cualquiera pueda leer y reutilizar el código, y **los comentarios
del código también están en inglés**. El contenido visible, esta guía y
`llms.txt` siguen en español: la obra se lee en español.

## Accesibilidad (WCAG 2.2 AA)

- Contraste ≥ 4,5:1 en texto normal y ≥ 3:1 en texto grande y en las formas
  que llevan significado; el color nunca es el único canal.
- 100 % teclado, sin trampas, con foco visible incluso cuando el control
  real está oculto dentro de su `<label>`. Enlaces de salto que no se
  escapan de la pantalla a 320 px.
- Rol, nombre y estado nativos en cada flor; toda figura lleva cartela.
- Objetivos ≥ 44×44 px; reflow al 400 % y a 320 px sin scroll horizontal.
- `prefers-reduced-motion`, `prefers-contrast` y `forced-colors` respetados.
  Sonido y animaciones nacen apagados; el foco es un anillo continuo.
- **Colores forzados** (Alto contraste de Windows): el sistema borra los
  fondos, y casi todo el árbol —tallo, tronco, nudos, ramitas de savia,
  brotes, suelo y raíz— se dibuja con fondos. Sin cuidarlo, las ramas
  flotarían sin tronco. Así que la estructura pasa al color de texto del
  sistema (`CanvasText`) y la gramática conserva su color: flores,
  capullos, formas, muestras y la flor de la portada, cuyo lino pasa a
  `Canvas`. Comprobado en tema claro y oscuro.
- Las casillas de la estación del estado dicen la verdad: **Alto
  contraste** aplica las mismas reglas que `prefers-contrast: more` (y nace
  marcada si el sistema lo pide) y **Subtítulos** escribe en pantalla cada
  sonido que suena —timbre, gesto y frecuencia—, sin irse solo antes del
  siguiente y sin tapar nunca lo enfocado. En Percepción, **«Mirar como»**
  muestra toda la obra con daltonismo o sin color para comprobar que la
  forma basta.
- Sonido y animaciones apagados al llegar: solo empiezan si la persona los activa, y la elección de cada uno se recuerda.
- Pétalos y adornos con `aria-hidden`: pintura, no información.

## Licencia

© 2026 María Rogles · [CC BY-NC-SA 4.0](LICENSE) — Reconocimiento, no
comercial, compartir igual.
