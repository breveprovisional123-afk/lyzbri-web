# Respaldos de producción — Lyzbri

Regla obligatoria: antes de cualquier cambio en la landing (`despliegue-lyzbri/index.html`),
se guarda aquí una copia de la versión estable que está en producción, con el nombre
`AAAA-MM-DD_index-produccion.html`.

Esta carpeta está fuera de `despliegue-lyzbri/`, así que Netlify no la publica: las copias
quedan solo en el repositorio, como historial para comparar o restaurar.

## Cómo restaurar una versión
1. Abrir el archivo de respaldo que se quiere recuperar.
2. Copiar su contenido en `despliegue-lyzbri/index.html` (en una rama nueva, con PR).
3. Revisar la vista previa de Netlify y fusionar.

## Bloque SEO protegido
En `despliegue-lyzbri/index.html` el `<head>` tiene un bloque marcado
"BLOQUE SEO PROTEGIDO". Ningún cambio de la landing puede modificarlo ni borrarlo sin
aprobación de Liza. Antes de fusionar cualquier PR se compara ese bloque con la versión
anterior: debe quedar idéntico.

## Registro
| Fecha | Archivo | Qué contiene |
|---|---|---|
| 2026-10-02 | 2026-10-02_index-produccion.html | Landing en producción antes del PR #2 (pago con Bold + SEO). Título anterior: "Lyzbri \| Plataforma Legal Digital: Deudas, TEA y Marcas en Colombia". |
