# NotiGalli

PWA pública, en modo oscuro, dedicada a un máximo de diez noticias argentinas por edición. No requiere API de pago ni backend propio. La interfaz es estática y las ediciones se publican reemplazando únicamente `edition.json` en `main`. Activar GitHub Pages desde Settings → Pages → Deploy from a branch → main → / (root). Instalar desde Chrome en Android cuando esté disponible por HTTPS.

## Contrato editorial para la tarea programada de ChatGPT

Dos ediciones diarias previstas (08:00 y 18:00 de Argentina). Investigar cada acontecimiento, verificar fechas y confirmar los hechos mediante al menos tres referencias confiables, con independencia editorial y fuentes primarias cuando corresponda. Una agencia replicada en varios medios no equivale a corroboración independiente. No generar noticias ficticias. Si no se verifican diez, publicar menos, sin rellenar; si no se verifica ninguna o hay problemas en la generación, conservar la edición previa. Separar afirmaciones de hechos, no exagerar ni presentar proyecciones como resultados. Enlaces a artículos específicos y documentos, no a portadas de medios. Texto original, sin reproducir artículos ajenos.

Fotografías documentales reales únicamente, con derecho de reutilización pública confirmado (por ejemplo, Wikimedia Commons con licencia compatible; no asumir que una fotografía de prensa es libre). Incluir autor, descripción, enlace de origen, nombre y URL de licencia; identificar archivo cuando corresponda. Si no se verifica procedencia, derechos o relación con la noticia, usar null. No fabricar fotos ni atribuciones.

### Formato JSON (schema 1)

El objeto raíz contiene:
- `schema`: número 1.
- `publishedAt`: fecha y hora ISO 8601 con desplazamiento -03:00.
- `edition`: texto "Mañana" o "Tarde".
- `articles`: arreglo de 1 a 10 noticias distintas, ordenadas por relevancia.

Cada objeto de `articles` contiene:
- `id`: identificador slug único y estable para el acontecimiento.
- `category`: categoría informativa en español.
- `title`: titular descriptivo y verificable.
- `dek`: bajada de una o dos frases.
- `summary`: exactamente tres strings con los puntos clave.
- `body`: arreglo de párrafos de redacción propia, strings sin HTML ni Markdown. Incluir contexto y atribuir afirmaciones relevantes a la fuente que las respalda.
- `sources`: arreglo de al menos tres objetos distintos con `name` (medio u organismo), `title` (título del artículo o documento), `url` (HTTPS exacta y comprobada), `date` (fecha en formato YYYY-MM-DD cuando se conozca).
- `image`: null o un objeto con `url` (HTTPS directa de la imagen real), `caption` (descripción), `credit` (autor o entidad titular), `sourceUrl` (página de procedencia y condiciones), `license` (nombre de licencia o permiso), `licenseUrl` (HTTPS de la licencia o autorización verificable), `archive` (booleano).

Antes de publicar, validar JSON, fechas, número de artículos, tres puntos por noticia, URLs y atribución. Leer primero la versión actual de `edition.json` para obtener SHA y evitar sobrescribir una edición más reciente. Publicar un commit que solo modifica ese archivo. No modificar código ni configuración. Si el conector requiere aprobación o no ofrece escritura, conservar el archivo y entregar el borrador con diagnóstico. No afirmar que la edición está en línea sin confirmar la publicación.

La portada vacía inicial es intencional: no es una edición y evita noticias de muestra. La aplicación almacena la última edición válida para lectura sin conexión; imágenes vistas pueden estar disponibles en caché. El acceso a noticias no depende de una clave API en el navegador.

Proyecto experimental de síntesis periodística asistida por IA, con enlaces a fuentes originales; no sustituye a una redacción profesional.
