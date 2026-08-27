# Origen de Datos

Este documento detalla el origen y las licencias de los conjuntos de datos externos y assets locales utilizados en la aplicación.

## Límite administrativo de Aragón

*   **Organismo de origen**: OpenStreetMap (OSM) / Comunidad global de mapeadores.
*   **Dataset exacto**: Relación OSM `349047` (Límite administrativo de la Comunidad Autónoma de Aragón).
*   **URL de la fuente**: API de Nominatim OpenStreetMap (`https://nominatim.openstreetmap.org/search?state=Aragón&country=Spain&polygon_geojson=1&format=json`)
*   **Fecha aproximada de descarga**: 25 de agosto de 2026.
*   **Licencia**: ODbL (Open Data Commons Open Database License).
*   **Formato original**: JSON estructurado de Nominatim, conteniendo la propiedad `geojson` interna.
*   **Proceso de conversión a GeoJSON**: Se extrajo el objeto GeoJSON interior de la respuesta de Nominatim mediante un script temporal en Node.js, empaquetándolo en un `Feature` estándar.
*   **¿Se simplificó la geometría?**: El servicio Nominatim proporciona automáticamente versiones optimizadas y pre-simplificadas de los límites cuando se consultan con `polygon_geojson=1`. No se aplicó ninguna simplificación adicional manual ni con herramientas externas; se confió en la optimización por defecto de la API.
*   **Herramientas utilizadas**: Script de extracción nativo con `fetch` en Node.js.
*   **Modificaciones realizadas**: Ninguna alteración a la geometría. Solo se envolvió en `{ type: 'Feature', properties: { name: 'Aragón' }, geometry: [...] }`.
*   **Nombre del archivo final usado por la app**: `src/data/aragon.json`

## Máscara exterior de Aragón (Polígono Invertido)

*   **Nombre del archivo final usado por la app**: `src/data/aragon_mask.json`
*   **Origen**: Archivo derivado localmente a partir del límite OSM existente (`aragon.json`).
*   **Proceso realizado**: Se generó un GeoJSON de tipo `FeatureCollection` mediante un script de desarrollo. Contiene un polígono mundial que utiliza el contorno exterior de Aragón (anillo 0) como hueco interior. Los enclaves de otras comunidades dentro de Aragón (anillos interiores originales 1 y 2) se convirtieron en polígonos sólidos para quedar atenuados junto con el resto del exterior.
*   **Licencia**: Conserva la misma atribución y licencia ODbL aplicable al archivo original de OpenStreetMap.
*   **Uso en la app**: Se utiliza para atenuar visualmente el exterior de Aragón sin realizar procesamiento geométrico pesado en tiempo de ejecución.
