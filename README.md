# NotiGalli

PWA pública, en modo oscuro, dedicada a exactamente diez noticias argentinas por edición. No requiere API de pago ni backend propio. La interfaz es estática y las ediciones se publican reemplazando únicamente `edition.json` en `main`. Activar GitHub Pages desde Settings → Pages → Deploy from a branch → main → / (root). Instalar desde Chrome en Android cuando esté disponible por HTTPS.

## Contrato editorial para la tarea programada de ChatGPT

Dos ediciones diarias previstas (08:00 y 18:00 de Argentina). Investigar cada acontecimiento, verificar fechas y procurar tres referencias confiables, con independencia editorial y fuentes primarias cuando corresponda. Si hay una o dos fuentes fiables que sustentan el núcleo de la noticia, publicar atribuyendo lo conocido y explicando el límite en verificationNote. Una agencia replicada en varios medios no equivale a corroboración independiente. No generar noticias ficticias. Publicar exactamente diez noticias por edición. Si faltan novedades sustentadas dentro del intervalo, completar con noticias anteriores relevantes, marcando la fecha y la ausencia de novedades confirmadas en verificationNote y sin presentarlas como nuevas. Nunca inventar hechos, fuentes ni horas. Si hay un fallo técnico real, conservar los datos publicados y comunicar el error específico. Separar afirmaciones de hechos, no exagerar ni presentar proyecciones como resultados. Enlaces a artículos específicos y documentos, no a portadas de medios. Texto original, sin reproducir artículos ajenos.

Fotografías documentales reales únicamente, con derecho de reutilización pública confirmado (por ejemplo, Wikimedia Commons con licencia compatible; no asumir que una fotografía de prensa es libre). Incluir autor, descripción, enlace de origen, nombre y URL de licencia; identificar archivo cuando corresponda. Si no se verifica procedencia, derechos o relación con la noticia, usar null. No fabricar fotos ni atribuciones.

### Formato JSON (schema 1)

El objeto raíz contiene:
- `schema`: número 1.
- `publishedAt`: fecha y hora ISO 8601 con desplazamiento -03:00.
- `edition`: texto "Mañana" o "Tarde".
- `articles`: arreglo de exactamente 10 noticias distintas, ordenadas por relevancia.

Cada objeto de `articles` contiene:
- `id`: identificador slug único y estable para el acontecimiento.
- `category`: categoría informativa en español.
- `title`: titular descriptivo y verificable.
- `dek`: bajada de una o dos frases.
- `summary`: exactamente tres strings con los puntos clave.
- `body`: arreglo de párrafos de redacción propia, strings sin HTML ni Markdown. Incluir contexto y atribuir afirmaciones relevantes a la fuente que las respalda.
- `sources`: arreglo de al menos un objeto fiable, idealmente tres referencias distintas con `name` (medio u organismo), `title` (título del artículo o documento), `url` (HTTPS exacta y comprobada), `date` (fecha en formato YYYY-MM-DD cuando se conozca).
- `verificationNote`: string opcional, obligatorio si hay menos de tres referencias, independencia limitada, hora incierta, confirmación parcial o una noticia de una edición anterior; indicar la limitación concreta y fecha cuando corresponda. Se muestra después del artículo y las fuentes. No ocultar incertidumbre esencial en el cuerpo ni en el titular.
- `image`: null o un objeto con `url` (HTTPS directa de la imagen real), `caption` (descripción), `credit` (autor o entidad titular), `sourceUrl` (página de procedencia y condiciones), `license` (nombre de licencia o permiso), `licenseUrl` (HTTPS de la licencia o autorización verificable), `archive` (booleano).

Antes de publicar, validar JSON, fechas, número de artículos, tres puntos por noticia, URLs y atribución. Leer primero la versión actual de `edition.json` para obtener SHA y evitar sobrescribir una edición más reciente. Publicar un commit que solo modifica ese archivo. No modificar código ni configuración. Si el conector requiere aprobación o no ofrece escritura, conservar el archivo y entregar el borrador con diagnóstico. No afirmar que la edición está en línea sin confirmar la publicación.

La portada vacía inicial es intencional: no es una edición y evita noticias de muestra. La aplicación almacena la última edición válida para lectura sin conexión; imágenes vistas pueden estar disponibles en caché. El acceso a noticias no depende de una clave API en el navegador.

Proyecto experimental de síntesis periodística asistida por IA, con enlaces a fuentes originales; no sustituye a una redacción profesional.
