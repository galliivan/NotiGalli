"use strict";
const view=document.getElementById("view"),statusEl=document.getElementById("status"),refresh=document.getElementById("refresh");
let edition=null,offline=false,loading=false,homeScroll=0;
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
const https=value=>{try{const u=new URL(value);return u.protocol==="https:"?u.href:null}catch{return null}};
const str=x=>typeof x==="string"&&x.trim().length>0;
function valid(d){return d&&d.schema===1&&Array.isArray(d.articles)&&d.articles.length<=10&&(d.articles.length===0||str(d.publishedAt)&&Number.isFinite(Date.parse(d.publishedAt)))&&new Set(d.articles.map(a=>a.id)).size===d.articles.length&&d.articles.every(a=>str(a.id)&&str(a.title)&&str(a.category)&&str(a.dek)&&Array.isArray(a.summary)&&a.summary.length===3&&a.summary.every(str)&&Array.isArray(a.body)&&a.body.length>0&&a.body.every(str)&&Array.isArray(a.sources)&&a.sources.length>=3&&new Set(a.sources.map(s=>https(s.url))).size===a.sources.length&&a.sources.every(s=>str(s.name)&&str(s.title)&&https(s.url))&&(!a.image||(https(a.image.url)&&https(a.image.sourceUrl)&&str(a.image.credit)&&str(a.image.license)&&https(a.image.licenseUrl)&&str(a.image.caption)&&typeof a.image.archive==="boolean")))}
function date(value){return new Intl.DateTimeFormat("es-AR",{dateStyle:"full",timeStyle:"short",timeZone:"America/Argentina/Buenos_Aires"}).format(new Date(value))}
function link(text,url,cls){const a=el("a",cls,text);a.href=https(url)||"#";a.target="_blank";a.rel="noopener noreferrer";return a}
function photo(a,cls,credit=true){if(!a.image)return null;const i=a.image,f=el("figure",cls),img=el("img");img.src=https(i.url);img.alt=i.caption;img.loading="lazy";img.referrerPolicy="no-referrer";img.decoding="async";img.addEventListener("error",()=>f.remove());f.append(img);if(credit){const c=el("figcaption","photo-credit",i.caption+(i.archive?" · Foto de archivo":"")+" · ");c.append(link(i.credit,i.sourceUrl),document.createTextNode(" · "),link(i.license,i.licenseUrl));f.append(c)}return f}
function readTime(a){return Math.max(1,Math.ceil((a.body.join(" ").split(/\s+/).length+a.summary.join(" ").split(/\s+/).length)/200))}
function meta(a){return el("div","meta",a.sources.length+" fuentes · "+readTime(a)+" min de lectura")}
function render(){view.replaceChildren();if(!edition){const e=el("div","empty");e.append(el("h1",null,"No se pudo cargar la edición"),el("p",null,"Revisá tu conexión y volvé a intentar."));view.append(e);return}
if(!edition.articles.length){const e=el("div","empty");e.append(el("h1",null,"La primera edición está en preparación"),el("p",null,"Las noticias aparecerán acá cuando se complete la investigación y verificación de las fuentes."));view.append(e);return}
const id=location.hash.slice(1);const a=edition.articles.find(n=>encodeURIComponent(n.id)===id);if(a){const article=el("article","article"),back=el("a","back","← Volver a la portada");back.href="#";article.append(back);const f=photo(a,"article-photo");if(f)article.append(f);article.append(el("div","category",a.category),el("h1",null,a.title),el("p","standfirst",a.dek),meta(a));const sum=el("section","summary"),ul=el("ul");sum.append(el("h2",null,"Si solo tenés dos minutos: tres puntos"));a.summary.forEach(s=>ul.append(el("li",null,s)));sum.append(ul);article.append(sum);const body=el("div","bodycopy");a.body.forEach(p=>body.append(el("p",null,p)));article.append(body);const sources=el("section","sources");sources.append(el("h2",null,"Fuentes consultadas"));a.sources.forEach(s=>{const l=link(s.name,s.url,"source");l.append(el("span",null,s.title+(s.date?" · "+s.date:"")));sources.append(l)});article.append(sources);view.append(article);return}
view.append(el("h1","edition-title","La edición de hoy"));const d=el("div","edition-meta");d.append(el("span",null,date(edition.publishedAt)),el("span",null,edition.articles.length+" noticias · "+(edition.edition||"Edición")));view.append(d);const grid=el("div","story-grid");edition.articles.forEach(a=>{const story=el("article","story"),anchor=el("a");anchor.href="#"+encodeURIComponent(a.id);anchor.addEventListener("click",()=>homeScroll=window.scrollY);const f=photo(a,"cover",false);if(f)anchor.append(f);anchor.append(el("div","category",a.category),el("h2",null,a.title),el("p","standfirst",a.dek),meta(a));story.append(anchor);if(a.image){const credit=el("div","photo-credit");credit.append(document.createTextNode(a.image.archive?"Foto de archivo · ":"Foto · "),link(a.image.credit,a.image.sourceUrl),document.createTextNode(" · "),link(a.image.license,a.image.licenseUrl));story.append(credit)}grid.append(story)});view.append(grid,el("div","end","Llegaste al final de esta edición."))}
async function load(){
  if(loading)return;
  loading=true;
  refresh.disabled=true;
  statusEl.textContent="Actualizando edición…";
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),12000);
  try {
    const response=await fetch("./edition.json",{cache:"no-store",signal:controller.signal});
    if(!response.ok)throw new Error("HTTP "+response.status);
    const d=await response.json();
    if(!valid(d))throw new Error("Edición inválida");
    offline=response.headers.get("X-NotiGalli-Offline")==="1"||!navigator.onLine;
    edition=d;
    try{localStorage.setItem("notigalli-edition",JSON.stringify(d));}catch(error){}
    statusEl.textContent=offline?"Sin conexión · última edición guardada":d.publishedAt?"Última publicación: "+date(d.publishedAt):"Argentina · próxima edición pendiente";
  } catch(error) {
    try{const saved=JSON.parse(localStorage.getItem("notigalli-edition"));if(valid(saved))edition=saved;}catch(storageError){}
    statusEl.textContent=edition?"No se pudo actualizar · última edición guardada":"Edición no disponible";
    console.warn("NotiGalli: ",error);
  } finally {
    clearTimeout(timeout);
    loading=false;
    refresh.disabled=false;
    try{render();}catch(error){statusEl.textContent="No se pudo mostrar la edición. Volvé a intentar.";console.error(error);}
  }
}
window.addEventListener("hashchange",()=>{render();window.scrollTo(0,location.hash.length>1?0:homeScroll)});
window.addEventListener("online",load);document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")load()});refresh.addEventListener("click",load);
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
load();