---
name: accessibility-bloom
description: Recorre Accessibility Bloom, una obra de arte accesible que enseña el Árbol de Accesibilidad. Úsala para explicar qué lee un agente o una tecnología de apoyo de una página (rol, nombre, estado y acción de cada nodo), para visitar sus doce estaciones o para probar cómo se ve la obra con daltonismo.
---

# Accessibility Bloom · cómo recorrerla un agente

Accessibility Bloom es una obra en HTML semántico, CSS y Web Audio sobre el
Árbol de Accesibilidad. Un agente la lee igual que un lector de pantalla:
por su árbol. Cada control tiene rol, nombre, estado y una acción.

## Primero, leer

- Lee [llms.txt](llms.txt): el resumen, la gramática y el recorrido.
- El recorrido son doce estaciones en cuatro capítulos. Cada estación es
  una `section` con nombre (región) y un `h2`.

## Después, pedir (WebMCP)

Si el navegador expone WebMCP (`document.modelContext`), la obra registra
estas herramientas:

- `list_stations` (solo lectura): las doce estaciones, con su número, su
  capítulo, su título y su ancla.
- `read_station_tree` (solo lectura): los nodos interactivos de una
  estación, con rol, nombre, estado y acción, calculados con las mismas
  funciones que el inspector de la obra.
- `go_to_station`: lleva la vista y el foco a una estación.
- `set_vision`: elige cómo mirar la obra (visión típica, protanopia,
  deuteranopia, tritanopia o sin color). Marca el mismo botón de opción
  que una persona y se anuncia en la región viva.
- `water_garden` (formulario declarativo): comprueba la forma de un correo
  en el riego de demostración. No envía nada.

## Reglas

- El sonido y las animaciones nacen apagados. Ninguna herramienta los
  enciende: es una decisión de la persona.
- Todo lo que hace un agente se anuncia en la región viva de la obra, para
  que quien está delante lo sepa.
- Licencia CC BY-NC-SA 4.0: cita la autoría.
