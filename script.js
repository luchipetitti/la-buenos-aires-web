// ---- WhatsApp ----
// Número con código de país, sin "+", espacios ni guiones (ej. Villa María: "549353XXXXXXX").
// Mientras esté vacío se usa el link corto de WhatsApp Business, que NO permite mensaje personalizado.
const WHATSAPP_NUMBER = "5493534762384"; // 0353 476-2384 (sucursal Buenos Aires, número principal)
const WHATSAPP_SHORT_LINK = "https://wa.me/message/WEBZSM4QSNFXI1";

const WA_MSG = {
  general: "Hola, me comunico desde la página web y quisiera realizar una consulta.",
  producto: (nombre)=> `Hola, me comunico desde la página web y quisiera realizar una consulta sobre ${nombre}.`,
  consulta: (texto)=> `Hola, me comunico desde la página web y quisiera realizar una consulta: ${texto}`,
};

function waLink(msg = WA_MSG.general){
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    : WHATSAPP_SHORT_LINK;
}
const WHATSAPP_LINK = waLink();

document.querySelectorAll(".js-wa-generic").forEach(el=>{
  el.href = WHATSAPP_LINK;
  el.target = "_blank";
  el.rel = "noopener";
});

document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const burger = document.getElementById("burgerBtn");
const panel = document.getElementById("mobilePanel");
panel.inert = true;
burger.addEventListener("click", ()=>{
  const open = panel.classList.toggle("open");
  panel.inert = !open;
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
panel.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>{
  panel.classList.remove("open");
  panel.inert = true;
  burger.setAttribute("aria-expanded","false");
}));

// ---- Catálogo ----
const PRODUCTS = [
  { name:"Asado de tira", cat:"vacuno", desc:"Corte transversal con hueso, ideal para brasa lenta y para compartir.", img:"img/cortes/asado-de-tira.jpg" },
  { name:"Vacío", cat:"vacuno", desc:"Con su clásica capa de grasa, queda jugoso y crocante al punto.", img:"img/cortes/vacio.jpg" },
  { name:"Bife de chorizo", cat:"vacuno", desc:"El corte insignia de la parrilla, tierno y con marmoleo parejo.", img:"img/cortes/bife-de-chorizo.jpg" },
  { name:"Colita de cuadril", cat:"vacuno", desc:"Versátil y magra, perfecta para horno o para la plancha.", img:"img/cortes/colita-de-cuadril.jpg" },
  { name:"Matambre arrollado", cat:"vacuno", desc:"Preparado y atado a mano en nuestro mostrador, listo para hornear. También lo hacemos de cerdo.", img:"img/cortes/matambre-arrollado.jpg" },
  { name:"Bondiola", cat:"cerdo", desc:"Infiltrada y tierna, ideal para cocciones lentas o a la parrilla.", img:"img/cortes/bondiola.jpg" },
  { name:"Costillar de cerdo", cat:"cerdo", desc:"Con hueso, para brasa suave y prolongada, hasta que la carne se despegue sola del hueso.", img:"img/cortes/costillar-de-cerdo.jpg" },
  { name:"Carré de cerdo", cat:"cerdo", desc:"Con hueso limpio, ideal para hornear entero con hierbas.", img:"img/cortes/carre-de-cerdo.jpg" },
  { name:"Pechuga de pollo", cat:"pollo", desc:"Limpia y sin grasa, perfecta para cocina diaria o milanesas.", img:"img/cortes/pechuga-de-pollo.jpg" },
  { name:"Muslo con piel", cat:"pollo", desc:"Jugoso y con más sabor, ideal para horno o parrilla suave.", img:"img/cortes/muslo-con-piel.jpg" },
  { name:"Alitas", cat:"pollo", desc:"Para picadas y parrilla rápida: se marinan y se cocinan en minutos.", img:"img/cortes/alitas.jpg" },
  { name:"Pollo relleno", cat:"pollo", desc:"Preparado y atado en el local, listo para el horno. Queda dorado por fuera y jugoso por dentro.", img:"img/cortes/pollo-relleno.jpg" },
  { name:"Salame tipo chacra", cat:"embutidos", desc:"Nuestro producto estrella: receta familiar con carne de cerdo, carne vacuna y tocino, curado en tripa natural y madurado en cámara propia.", img:"img/salame.jpg" },
  { name:"Chorizo criollo", cat:"embutidos", desc:"Receta casera hecha en el local, con el punto justo de condimento. Ideal para arrancar el asado.", img:"img/chorizos.jpg" },
  { name:"Morcilla", cat:"embutidos", desc:"Cremosa por dentro. A brasa suave se dora sin abrirse.", img:"img/cortes/morcilla.jpg" },
  { name:"Mollejas", cat:"embutidos", desc:"Limpias y prolijas, listas para dorar de los dos lados.", img:"img/cortes/mollejas.jpg" },
  { name:"Chinchulines", cat:"embutidos", desc:"Trenzados a mano, para hacer a brasa lenta hasta que queden crocantes.", img:"img/cortes/chinchulines.jpg" },
];
const CAT_LABELS = { vacuno:"Vacuno", cerdo:"Cerdo", pollo:"Pollo", embutidos:"Embutidos y achuras" };

const gridEl = document.getElementById("productGrid");

function normalize(s){
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
}

// Se muestran todos los productos juntos; la etiqueta de cada tarjeta indica la categoría
function renderProducts(){
  const items = PRODUCTS;

  if (!items.length){
    gridEl.innerHTML = `<p class="no-results">Sin cortes cargados en esta categoría por ahora. Consultanos directo por WhatsApp.</p>`;
    return;
  }

  gridEl.innerHTML = items.map(p=>`
    <article class="product-card" data-name="${p.name}">
      <div class="thumb"><img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async"></div>
      <div class="body">
        <span class="cat-tag">${CAT_LABELS[p.cat]}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <a class="btn btn-outline btn-small" href="${waLink(WA_MSG.producto(p.name))}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      </div>
    </article>
  `).join("");
}


renderProducts();

// "Nuestros cortes": cerrado muestra las primeras tarjetas (2 en celular, la primera fila en compu);
// el botón de abajo despliega el resto deslizándolo hacia abajo
const cortesToggle = document.getElementById("cortesToggle");
const cortesPanel = document.getElementById("cortesPanel");
let cortesOpen = false;
// Cuántas tarjetas se ven cerrado: la primera fila, y como mínimo 2
function previewCount(){
  const cards = [...gridEl.querySelectorAll(".product-card")];
  if (!cards.length) return 0;
  const top = cards[0].offsetTop;
  const enFila = cards.filter(c => c.offsetTop === top).length;
  return Math.min(cards.length, Math.max(2, enFila));
}
// Alto del panel cerrado: hasta el final de la última tarjeta visible
function closedHeight(){
  const cards = gridEl.querySelectorAll(".product-card"), n = previewCount();
  if (!n) return 0;
  const last = cards[n-1];
  return last.offsetTop + last.offsetHeight - gridEl.offsetTop;
}
function markExtras(){
  const n = previewCount();
  gridEl.querySelectorAll(".product-card").forEach((c,i)=>{ c.classList.toggle("is-extra", i >= n); c.inert = !cortesOpen && i >= n; });
}
function setCortesOpen(open, { scroll = true } = {}){
  const wasOpen = cortesOpen;
  cortesOpen = open;
  markExtras();
  const extras = [...gridEl.querySelectorAll(".product-card.is-extra")];
  // Las tarjetas extra bajan una detrás de otra; después se limpia la demora para que el hover responda al instante
  extras.forEach((c,i)=> c.style.transitionDelay = open ? `${Math.min(i,12)*40}ms` : "0ms");
  clearTimeout(setCortesOpen.t);
  setCortesOpen.t = setTimeout(()=> extras.forEach(c=> c.style.transitionDelay = ""), 1400);
  // Animación de alto: parte del alto actual (fijo) y va al de destino
  cortesPanel.style.maxHeight = cortesPanel.getBoundingClientRect().height + "px";
  void cortesPanel.offsetHeight;
  cortesPanel.classList.toggle("open", open);
  cortesPanel.style.maxHeight = (open ? gridEl.scrollHeight : closedHeight()) + "px";
  clearTimeout(setCortesOpen.h);
  if (open) setCortesOpen.h = setTimeout(()=> { if (cortesOpen) cortesPanel.style.maxHeight = "none"; }, 750);
  cortesToggle.setAttribute("aria-expanded", String(open));
  cortesToggle.querySelector(".cortes-hint").textContent = open ? "Tocá para ocultar" : "Tocá para ver todos los cortes";
  // Al ocultar, si la sección quedó arriba fuera de pantalla, volver a ella
  if (!open && wasOpen && scroll){
    const sec = document.getElementById("productos");
    if (sec.getBoundingClientRect().top < 0) sec.scrollIntoView({ behavior:"smooth" });
  }
}
setCortesOpen(false);
cortesToggle.addEventListener("click", ()=> setCortesOpen(!cortesOpen));
// Si cambia el tamaño de pantalla (girar el celular), recalcular cuántas se ven
let cortesResize;
window.addEventListener("resize", ()=>{ clearTimeout(cortesResize); cortesResize = setTimeout(()=> { if (!cortesOpen) setCortesOpen(false, { scroll:false }); }, 150); });
// Recalcular cuando cargan las fotos (cambian el alto de las tarjetas)
gridEl.querySelectorAll("img").forEach(img => img.addEventListener("load", ()=> { if (!cortesOpen) cortesPanel.style.maxHeight = closedHeight() + "px"; }, { once:true }));
// "Productos" del menú lleva a la sección ya abierta
document.querySelectorAll('a[href="#productos"]').forEach(a=> a.addEventListener("click", ()=> setCortesOpen(true)));

// ---- Guía de cortes ----
const GUIDE = {
  parrilla:{ label:"A la parrilla", items:[
    { name:"Entraña", time:"12–15 min", diff:"Fácil", dots:"●○○", tip:"Fuego fuerte y rápido: 6–7 minutos por lado, y dala vuelta una sola vez para no perder jugos.", img:"img/cortes/entrana.jpg" },
    { name:"Asado de tira", time:"40–50 min", diff:"Media", dots:"●●○", tip:"Fuego suave y constante, alejado de la brasa directa para que se cocine parejo.", img:"img/cortes/asado-de-tira.jpg" },
    { name:"Vacío", time:"35–40 min", diff:"Media", dots:"●●○", tip:"Empezá del lado de la grasa: queda crocante y protege la carne.", img:"img/cortes/vacio.jpg" },
    { name:"Chorizo criollo", time:"20–25 min", diff:"Fácil", dots:"●○○", tip:"Fuego medio y sin apuro. No lo pinches: así conserva los jugos adentro.", img:"img/chorizos.jpg" },
  ]},
  horno:{ label:"Al horno", items:[
    { name:"Colita de cuadril", time:"50–60 min", diff:"Media", dots:"●●○", tip:"Sellala en sartén antes de hornear para lograr un dorado parejo.", img:"img/cortes/colita-de-cuadril.jpg" },
    { name:"Matambre arrollado", time:"70–90 min", diff:"Alta", dots:"●●●", tip:"Atalo bien firme para que no pierda la forma al cortarlo en fetas.", img:"img/cortes/matambre-arrollado.jpg" },
    { name:"Carré de cerdo", time:"60–70 min", diff:"Media", dots:"●●○", tip:"Regalo con su jugo cada 15 minutos para que no se seque durante la cocción.", img:"img/cortes/carre-de-cerdo.jpg" },
    { name:"Pollo relleno", time:"90–100 min", diff:"Fácil", dots:"●○○", tip:"Horno medio, tapado con papel aluminio durante la primera hora; destapalo al final para que se dore.", img:"img/cortes/pollo-relleno.jpg" },
  ]},
  diaria:{ label:"Cocina diaria", items:[
    { name:"Bife de nalga", time:"8–10 min", diff:"Fácil", dots:"●○○", tip:"Ideal para milanesas finas. No lo cocines de más, así no queda seco.", img:"img/cortes/bife-de-nalga.jpg" },
    { name:"Pechuga de pollo", time:"10–12 min", diff:"Fácil", dots:"●○○", tip:"Golpeala pareja antes de cocinar para que el grosor sea uniforme.", img:"img/cortes/pechuga-de-pollo.jpg" },
    { name:"Falda", time:"1 h 30 – 2 h", diff:"Media", dots:"●●○", tip:"Perfecta para guisos: cocción lenta y húmeda hasta que se ablande del todo.", img:"img/cortes/falda.jpg" },
    { name:"Bondiola en cubos", time:"18–20 min", diff:"Fácil", dots:"●○○", tip:"Sellala primero a fuego fuerte para que conserve los jugos al saltear.", img:"img/cortes/bondiola-en-cubos.jpg" },
  ]},
};

const modeSelectEl = document.getElementById("modeSelect");
const guideGridEl = document.getElementById("guideGrid");
let activeMode = "parrilla";

// Íconos animados de los botones de la guía: fuego (parrilla) y humo (horno)
const MODE_FX = {
  parrilla:`<svg class="fx-fire" viewBox="0 0 20 24" width="18" height="22" aria-hidden="true">
    <path class="f-out" d="M10 1c1 4 6 6.5 6 12a6 6 0 0 1-12 0c0-3 1.5-4.5 2.5-6 .3 2 1.2 3 2.2 3.4C8 7.5 8.5 4 10 1Z"/>
    <path class="f-in" d="M10 11c.6 2 3 3 3 5.5a3 3 0 0 1-6 0c0-1.6 1-2.6 1.6-3.4.3 1 .8 1.4 1.4 1.5-.2-1.2-.3-2.3 0-3.6Z"/></svg>`,
  horno:`<svg class="fx-smoke" viewBox="0 0 24 26" width="20" height="22" aria-hidden="true">
    <path d="M6 24c-2.2-2.2 2.2-4.4 0-6.6s2.2-4.4 0-6.6"/><path d="M12 24c-2.4-2.6 2.4-5 0-7.6s2.4-5 0-7.6"/><path d="M18 24c-2.2-2.2 2.2-4.4 0-6.6s2.2-4.4 0-6.6"/></svg>`,
};

function renderModes(){
  modeSelectEl.innerHTML = Object.keys(GUIDE).map(m=>
    `<button class="mode-btn ${m===activeMode?'active':''}" data-mode="${m}">${GUIDE[m].label}</button>`
  ).join("");
  modeSelectEl.querySelectorAll(".mode-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{ activeMode = btn.dataset.mode; renderModes(); renderGuide(); });
  });
}

function renderGuide(){
  guideGridEl.innerHTML = GUIDE[activeMode].items.map(it=>`
    <div class="cut-card" data-name="${it.name}">
      <div class="thumb"><img src="${it.img}" alt="${it.name}" loading="lazy" decoding="async"></div>
      <div class="cut-body">
        <h3>${it.name}</h3>
        <div class="cut-meta">
          <span>⏱ <b>${it.time}</b></span>
          <span>Nivel: <b>${it.diff}</b> <span class="dots">${it.dots}</span></span>
        </div>
        <p class="cut-tip"><b>Tip del carnicero</b>${it.tip}</p>
      </div>
    </div>
  `).join("");
}

renderModes();
renderGuide();

// ---- Blog ----
const ARTICLES = [
  { tag:"Técnica", time:"4 min", title:"Los 3 secretos para un fuego parejo y sin apuros",
    excerpt:"El fuego es la mitad del asado. Estos tres hábitos evitan las brasas irregulares y los apurones de último momento.",
    full:"1. Encendé con 45–60 minutos de anticipación: el carbón necesita tiempo para formar una brasa pareja, sin llama viva. 2. Distribuí la brasa en una capa uniforme y dejá una zona de menor calor para cortes gruesos que necesiten más tiempo. 3. No apures el fuego echando carbón nuevo sobre las brasas: prendelo aparte y sumalo cuando ya esté hecho brasa.",
    img:"img/tips/tip1.jpg" },
  { tag:"Planificación", time:"3 min", title:"Cómo calcular la carne por persona para que no sobre ni falte",
    excerpt:"Una cuenta simple para no quedarte corto ni tirar comida, ajustada según los cortes y los acompañamientos.",
    full:"Como referencia general, calculá entre 400 y 500 gramos de carne con hueso por persona (300–350 g si es sin hueso). Si servís varios cortes y achuras como entrada, podés bajar el cálculo del plato principal en un 20%. Ajustá siempre según el perfil del grupo: reuniones con mucha guarnición permiten calcular un poco menos por comensal.",
    img:"img/tips/tip2.jpg" },
  { tag:"Cocción", time:"5 min", title:"Guía de puntos: jugoso, a punto o cocido",
    excerpt:"Señales visuales y táctiles para identificar cada punto de cocción sin depender solo del reloj.",
    full:"Jugoso (rojo/inglés): centro rojo intenso, superficie firme pero con mucha elasticidad al tacto, jugos rojos visibles al cortar. A punto: centro rosado parejo, firmeza media, jugos rosados. Cocido: sin tono rosado, superficie firme, jugos claros. Un truco simple sin termómetro es comparar la firmeza de la carne al presionarla con la base del pulgar de tu mano relajada (jugoso), semicerrada (a punto) y en puño (cocido).",
    img:"img/tips/tip3.jpg" },
  { tag:"Del mostrador", time:"3 min", title:"Cómo armamos un matambre arrollado a pedido",
    excerpt:"Lo preparamos, condimentamos y atamos en el momento, con la mezcla que elijas.",
    full:"Partimos de un matambre limpio, lo estiramos parejo sobre la mesada y lo condimentamos con sal, ajo y especias antes de sumar el relleno que pidas (verdura, huevo, morrón). Lo enrollamos firme y lo atamos con hilo para que no pierda la forma en la cocción. Si lo vas a hornear, calculá entre 70 y 90 minutos a temperatura media, regando con su jugo cada 15 minutos.",
    img:"img/tips/tip4.jpg" },
];

const blogGridEl = document.getElementById("blogGrid");
blogGridEl.innerHTML = ARTICLES.map((a,i)=>`
  <article class="blog-card" id="blog-${i}">
    <div class="thumb"><img src="${a.img}" alt="${a.title}" loading="lazy" decoding="async"></div>
    <div class="blog-body">
      <h3>${a.title}</h3>
      <p class="blog-excerpt">${a.excerpt}</p>
      <button class="blog-toggle" data-i="${i}" aria-expanded="false">Leer nota completa <span class="arrow">▾</span></button>
      <div class="blog-full"><div><p>${a.full}</p></div></div>
    </div>
  </article>
`).join("");

blogGridEl.querySelectorAll(".blog-toggle").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const card = btn.closest(".blog-card");
    const open = card.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    btn.firstChild.textContent = open ? "Cerrar nota " : "Leer nota completa ";
  });
});

// ---- Buscador: palabras clave + preguntas frecuentes + tolerancia a errores de tipeo ----

// Sinónimos y formas coloquiales → palabras que sí aparecen en la web
const SYNONYMS = {
  chori:"chorizo criollo", choripan:"chorizo criollo", chorizos:"chorizo", morci:"morcilla", chinchu:"chinchulines", chinchulin:"chinchulines",
  molleja:"mollejas", chancho:"cerdo", porcino:"cerdo", pechito:"costillar", costilla:"costillar asado tira",
  costillas:"costillar asado tira", tira:"asado tira", vaca:"vacuno", ternera:"vacuno", novillo:"vacuno", res:"vacuno",
  carne:"vacuno", ala:"alitas", alas:"alitas", pata:"muslo", suprema:"pechuga", pechugas:"pechuga", pollos:"pollo",
  spiedo:"pollo", rotiseria:"pollo", relleno:"relleno arrollado", rellenos:"relleno arrollado", milanesa:"milanesas nalga pechuga", milanesas:"nalga pechuga",
  mila:"milanesas nalga pechuga", milas:"milanesas nalga pechuga", guiso:"falda guisos", puchero:"falda guisos",
  estofado:"falda guisos", parrilla:"parrilla asado", parri:"parrilla", asador:"parrilla", brasa:"parrilla",
  fuego:"fuego brasa", carbon:"fuego brasa", leña:"fuego brasa", lena:"fuego brasa", horno:"horno", hornear:"horno",
  arrollado:"matambre arrollado", matambrito:"matambre", picada:"picadas alitas", achura:"achuras embutidos",
  achuras:"achuras embutidos", embutido:"embutidos", fiambre:"salame embutidos", salamin:"salame", salame:"salame",
  personas:"persona calcular", invitados:"persona calcular", cantidad:"calcular persona",
  jugoso:"punto jugoso coccion", cocido:"punto coccion", termino:"punto coccion", coccion:"coccion punto",
};

// Cortes que no están cargados en la web → categoría para sugerir opciones parecidas
const CUT_ALIASES = {
  vacuno:["lomo","peceto","nalga","cuadrada","bola de lomo","osobuco","roast beef","tapa de asado","tapa de nalga","entraña",
          "picanha","tapa de cuadril","ojo de bife","bife ancho","bife angosto","matambre vacuno","carne picada","picada comun",
          "picada especial","paleta","aguja","cuadril","palomita","tortuguita","falda","marucha","azotillo"],
  cerdo:["solomillo","matambrito de cerdo","pechito de cerdo","paleta de cerdo","pernil","jamon","churrasquito de cerdo","cerdo picado"],
  pollo:["pata muslo","menudos","higado de pollo","pollo deshuesado","patamuslo","filet de pollo"],
  embutidos:["salchicha parrillera","salchicha","riñon","riñones","higado","lengua","tripa gorda","salame","salamin","longaniza","queso de cerdo"],
};

// ---- Tienda online (Pedix): ahí se hacen los pedidos ----
const PEDIX_URL = "https://pedix.app/labuenosaires";
// Lo que está en Pedix y no tiene tarjeta en la web (los demás ya salen del catálogo o la guía)
const PEDIX_PRODUCTS = [
  { name:"Lomo", cat:"Carne vacuna", keys:"bife lomo" },
  { name:"Peceto", cat:"Carne vacuna", keys:"vitel tone horno" },
  { name:"Nalga", cat:"Carne vacuna", keys:"milanesa bife nalga" },
  { name:"Tapa de nalga", cat:"Carne vacuna", keys:"horno parrilla" },
  { name:"Bola de lomo", cat:"Carne vacuna", keys:"milanesa bife" },
  { name:"Cuadril", cat:"Carne vacuna", keys:"bife milanesa" },
  { name:"Roast beef", cat:"Carne vacuna", keys:"rosbif horno olla" },
  { name:"Tapa de asado", cat:"Carne vacuna", keys:"parrilla horno" },
  { name:"Paleta", cat:"Carne vacuna", keys:"guiso estofado" },
  { name:"Falda deshuesada", cat:"Carne vacuna", keys:"puchero guiso" },
  { name:"Bife americano", cat:"Carne vacuna", keys:"bife parrilla plancha" },
  { name:"Carne dulce", cat:"Carne vacuna", keys:"" },
  { name:"Cogotera", cat:"Carne vacuna", keys:"guiso" },
  { name:"Costeletas", cat:"Carne vacuna", keys:"bife parrilla" },
  { name:"Carré de ternera", cat:"Carne vacuna", keys:"carre ternera" },
  { name:"Oferta aguja 2 kg", cat:"Ofertas", keys:"aguja oferta promo" },
  { name:"Oferta carne molida 2 kg", cat:"Ofertas", keys:"molida picada oferta promo" },
  { name:"Oferta puchero 2 kg", cat:"Ofertas", keys:"puchero oferta promo" },
  { name:"Lomito de cerdo", cat:"Carne porcina", keys:"solomillo cerdo" },
  { name:"Matambre de cerdo", cat:"Carne porcina", keys:"matambrito cerdo pizza" },
  { name:"Vacío de cerdo", cat:"Carne porcina", keys:"vacio cerdo" },
  { name:"Pulpa de cerdo", cat:"Carne porcina", keys:"cerdo pulpa" },
  { name:"Marucha de cerdo", cat:"Carne porcina", keys:"cerdo" },
  { name:"Costilla de cerdo", cat:"Carne porcina", keys:"cerdo costillas" },
  { name:"Costeletas de cerdo", cat:"Carne porcina", keys:"cerdo chuleta" },
  { name:"Panceta salada en plancha", cat:"Carne porcina", keys:"panceta tocino bacon" },
  { name:"Pollo entero", cat:"Pollo", keys:"pollo spiedo horno" },
  { name:"Pata y muslo", cat:"Pollo", keys:"patamuslo pata muslo pollo" },
  { name:"Milanesas de carne", cat:"Elaborados por La Buenos Aires", keys:"milanesa milanesas carne" },
  { name:"Milanesas de pollo", cat:"Elaborados por La Buenos Aires", keys:"milanesa milanesas pollo" },
  { name:"Milanesa de cerdo", cat:"Elaborados por La Buenos Aires", keys:"milanesa milanesas cerdo" },
  { name:"Hamburguesa Buenos Aires", cat:"Elaborados por La Buenos Aires", keys:"hamburguesa hamburguesas burger medallon" },
  { name:"Hamburguesa de pollo", cat:"Elaborados por La Buenos Aires", keys:"hamburguesa hamburguesas pollo medallon" },
  { name:"Chorizo especial", cat:"Embutidos y chacinados", keys:"chorizo chorizos" },
  { name:"Salchicha parrillera", cat:"Embutidos y chacinados", keys:"salchicha parrillera" },
  { name:"Corazón", cat:"Achuras", keys:"corazon achura" },
  { name:"Hígado 2 kg", cat:"Achuras", keys:"higado achura" },
  { name:"Riñones", cat:"Achuras", keys:"riñon rinon rinones achura" },
  { name:"Tripa gorda", cat:"Achuras", keys:"tripa achura" },
  { name:"Rabo", cat:"Achuras", keys:"cola achura" },
  { name:"Pescadito", cat:"Achuras", keys:"achura" },
  { name:"Media res vacuna", cat:"Media res", keys:"media res vaca vacuna freezer entera" },
  { name:"Media res de cerdo", cat:"Media res", keys:"media res cerdo chancho freezer entera" },
  { name:"Grasa vacuna", cat:"Grasa", keys:"grasa vaca sebo mayorista minorista" },
  { name:"Grasa de cerdo", cat:"Grasa", keys:"grasa cerdo chancho manteca mayorista minorista" },
];

// Preguntas frecuentes. "go" lleva a una parte de la web; "cta" agrega un botón.
// Info que no está confirmada en la web (envíos, pagos) se deriva a WhatsApp en vez de inventarla.
// ---- Datos de las sucursales (horarios oficiales y WhatsApp de cada una) ----
const SUCURSALES = [
  { nombre:"Buenos Aires 1399", corto:"Buenos Aires", wa:"5493534762384", tel:"0353 476-2384",
    maps:"https://www.google.com/maps/search/?api=1&query=Buenos+Aires+1399%2C+Villa+Mar%C3%ADa%2C+C%C3%B3rdoba" },
  { nombre:"Av. Perón 1198", corto:"Perón", wa:"5493534445257", tel:"0353 444-5257",
    maps:"https://www.google.com/maps/search/?api=1&query=Av.+Per%C3%B3n+1198%2C+Villa+Mar%C3%ADa%2C+C%C3%B3rdoba" },
];
// Franjas en minutos desde las 00:00. Lunes a sábado: 08:30–13:00 y 17:00–20:30 (ambas). Domingo: solo Perón 09:00–13:00.
const HORARIOS = {
  semana:  [{ desde:510, hasta:780, donde:"las dos sucursales" }, { desde:1020, hasta:1230, donde:"las dos sucursales" }],
  domingo: [{ desde:540, hasta:780, donde:"la sucursal de Av. Perón" }],
};
const HORARIOS_TEXTO = "<b>Lunes a sábado:</b> de 08:30 a 13:00 y de 17:00 a 20:30, en las dos sucursales y todo el año.<br><b>Domingos:</b> abre la sucursal de Av. Perón, de 09:00 a 13:00.";

const hhmm = m => `${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;
const DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
// "¿Están abiertos ahora?" según la hora real de Villa María (Córdoba, Argentina)
function estadoAhora(){
  const now = new Date(new Date().toLocaleString("en-US", { timeZone:"America/Argentina/Cordoba" }));
  const dia = now.getDay(), min = now.getHours()*60 + now.getMinutes();
  const franjas = d => d === 0 ? HORARIOS.domingo : HORARIOS.semana;
  const abierta = franjas(dia).find(f => min >= f.desde && min < f.hasta);
  if (abierta) return `🟢 <b>Sí, ahora estamos abiertos</b> en ${abierta.donde}, hasta las ${hhmm(abierta.hasta)}.`;
  for (let i = 0; i < 8; i++){
    const d = (dia + i) % 7;
    const prox = franjas(d).find(f => i > 0 || f.desde > min);
    if (prox){
      const cuando = i === 0 ? "hoy" : i === 1 ? "mañana" : `el ${DIAS[d]}`;
      return `🔴 <b>Ahora estamos cerrados.</b> Volvemos a abrir ${cuando} a las ${hhmm(prox.desde)} en ${prox.donde}.`;
    }
  }
}
const waSucursal = (s, msg = WA_MSG.general) => `https://wa.me/${s.wa}?text=${encodeURIComponent(msg)}`;

const FAQS = [
  { q:"¿Están abiertos ahora?", keys:"ahora abierto abiertos abierta abren cerrado cerrados cierran hoy momento atienden",
    answer:()=> `${estadoAhora()}<br><br>${HORARIOS_TEXTO}` },
  { q:"¿Qué horarios tienen?", keys:"horario horarios hora horas abren abre cierran cierra atencion dias semana sabado domingo domingos feriado feriados manana tarde noche mediodia siesta",
    answer:()=> `${HORARIOS_TEXTO}<br><br>${estadoAhora()}` },
  { q:"¿Abren los domingos?", keys:"domingo domingos finde fin semana",
    answer:"Sí: los <b>domingos abre la sucursal de Av. Perón, de 09:00 a 13:00</b>. La de Buenos Aires abre de lunes a sábado.", cta:"sucursales" },
  { q:"¿Dónde están?", keys:"donde ubicacion ubicados direccion sucursal sucursales local locales llegar queda quedan mapa villa maria cordoba buenos aires 1399 peron 1198",
    answer:()=> `Tenemos dos sucursales en Villa María, Córdoba:<br>` + SUCURSALES.map(s=>
      `📍 <b>${s.nombre}</b> · <a href="${s.maps}" target="_blank" rel="noopener">Cómo llegar</a> · <a href="${waSucursal(s)}" target="_blank" rel="noopener">💬 ${s.tel}</a>`).join("<br>") },
  { q:"¿Cuál es el teléfono?", keys:"telefono telefonos numero numeros celular llamar contacto contactar whatsapp wsp wpp escribir",
    answer:()=> `Escribinos al WhatsApp de la sucursal que te quede más cómoda:<br>` + SUCURSALES.map(s=>
      `💬 <b>${s.nombre}:</b> <a href="${waSucursal(s)}" target="_blank" rel="noopener">${s.tel}</a>`).join("<br>") },
  { q:"¿Cómo hago un pedido?", keys:"pedido pedir comprar compra encargar encargo reservar reserva ordenar quiero online pedix tienda app catalogo",
    answer:"Hacelo online en nuestra <b>tienda de Pedix</b>: elegís los cortes y cómo los querés, y listo. Si preferís, también podés escribirnos por WhatsApp a la sucursal donde lo vas a retirar.", cta:["pedix","sucursales"] },
  { q:"¿Cuánto salen los cortes?", keys:"precio precios cuanto cuesta cuestan vale valen sale salen cotiza cotizacion lista barato caro kilo kg plata",
    answer:"Los precios van cambiando según la disponibilidad del día, así que <b>consultanos por WhatsApp</b> y te pasamos el precio actualizado. Vendemos a <b>precio mayorista para todos, sin límite de compra</b>.", cta:["sucursales"] },
  { q:"¿Tienen ofertas?", keys:"oferta ofertas promo promos promocion promociones descuento descuentos off rebaja",
    answer:"Sí: las ofertas del momento las encontrás en nuestra <b>tienda de Pedix</b>, y van cambiando seguido.", cta:["pedix"] },
  { q:"¿Venden media res?", keys:"media res medias reses vaca entera cerdo entero chancho freezer grasa sebo",
    answer:"Sí: vendemos <b>media res vacuna y de cerdo</b>, y también grasa vacuna y de cerdo. Las encontrás en nuestra tienda de Pedix.", cta:["pedix","whatsapp"] },
  { q:"¿Me lo preparan como quiero?", keys:"cortado cortar corte fileteado filete cubos milanesa fino envasado vacio congelado porcionado bandeja freezer preparan",
    answer:"Sí. Al pedir en Pedix, según el producto, elegís el corte (<b>fileteado, en cubos, a la milanesa o como viene</b>) y la presentación (<b>bandeja con film, envasado al vacío o porcionado y congelado</b>).", cta:["pedix"] },
  { q:"¿Hacen envíos a domicilio?", keys:"envio envios delivery domicilio reparto llevan mandan traen casa",
    answer:"Consultanos por WhatsApp si hacemos envíos a tu zona y te pasamos todos los detalles.", cta:"sucursales" },
  { q:"¿Qué formas de pago aceptan?", keys:"pago pagos pagar tarjeta tarjetas debito credito efectivo transferencia mercado pago mercadopago qr cuotas",
    answer:"Escribinos por WhatsApp y te confirmamos los medios de pago disponibles en cada sucursal.", cta:"sucursales" },
  { q:"¿Venden por mayor?", keys:"mayor mayorista mayoristas mayoreo reventa revender revendedor comercio negocio almacen fiambreria restaurante gastronomia distribuidor factura",
    answer:"Sí. Vendemos a precio mayorista para todos, y además tenemos venta para comercios, gastronomía y distribuidores, con nuestro Salame tipo chacra como producto estrella.", cta:"whatsapp", go:{ type:"page", href:"historia.html#mayorista" } },
  { q:"¿Hay límite de compra?", keys:"limite minimo cantidad maxima maximo kilos",
    answer:"No: llevás lo que necesites, ya sea un solo corte o para llenar el freezer. Precio mayorista para todos, <b>sin límite de compra</b>.", cta:"whatsapp" },
  { q:"¿Cuánta carne compro por persona?", keys:"cuanta carne persona personas calcular calculo invitados gramos comensales cumple cumpleaños reunion evento sobre falte",
    answer:"Calculá entre <b>400 y 500 g de carne con hueso por persona</b> (300–350 g si es sin hueso). Si hay achuras de entrada, podés calcular un 20% menos.", go:{ type:"article", index:1 } },
  { q:"¿Cómo sé el punto de la carne?", keys:"punto jugoso cocido jugosa medio termino coccion rojo rosado sangre",
    answer:"Jugoso: centro rojo y mucha elasticidad. A punto: centro rosado parejo. Cocido: sin rosado y firme. Te dejamos la guía completa.", go:{ type:"article", index:2 } },
  { q:"¿Cómo prendo un buen fuego?", keys:"fuego prender encender brasa brasas carbon leña lena parejo",
    answer:"Encendé con 45–60 minutos de anticipación y distribuí la brasa pareja. Mirá los 3 secretos para un fuego sin apuros.", go:{ type:"article", index:0 } },
  { q:"¿Qué corte llevo para la parrilla?", keys:"parrilla asado asar corte cortes recomendas recomiendan recomendacion mejor que llevo",
    answer:"Para la parrilla te recomendamos entraña, asado de tira, vacío y chorizo criollo.", go:{ type:"guide", mode:"parrilla" } },
  { q:"¿Qué corte llevo para el horno?", keys:"horno hornear horneado corte cortes recomendas asado al horno",
    answer:"Para el horno van muy bien la colita de cuadril, el matambre arrollado, el carré de cerdo y el pollo relleno.", go:{ type:"guide", mode:"horno" } },
  { q:"¿Qué corte llevo para milanesas o guiso?", keys:"milanesa milanesas guiso guisos diaria dia semana rapido plancha salteado puchero estofado",
    answer:"Para milanesas: bife de nalga o pechuga. Para guisos: falda. Para saltear: bondiola en cubos.", go:{ type:"guide", mode:"diaria" } },
  { q:"¿Los embutidos son caseros?", keys:"casero caseros casera embutidos chorizo chorizos elaboracion propia receta hacen ustedes",
    answer:"Sí: los chorizos y embutidos los elaboramos en el local con recetas propias de la familia.", go:{ type:"page", href:"historia.html#salame" } },
  { q:"¿Preparan cortes a pedido?", keys:"pedido medida cortar corte especial arrollado preparan preparado relleno rellenos atado pollo",
    answer:"Sí. El matambre arrollado (vacuno o de cerdo) lo armamos en el momento con el relleno que elijas, y también preparamos pollo relleno listo para el horno. Pedilo por WhatsApp.", cta:"sucursales", go:{ type:"article", index:3 } },
  { q:"¿Quiénes son?", keys:"historia quienes somos son familia farias origen fundador desde cuando año barcia 1986 2001",
    answer:"Somos una empresa familiar de Villa María: la familia Farias, con un oficio que viene de generaciones.", go:{ type:"page", href:"historia.html" } },
  { q:"¿Tienen Instagram?", keys:"instagram redes sociales ig fotos seguir",
    answer:"Sí, seguinos en Instagram: <b>@carnesbuenosaires</b>.", cta:"instagram" },
];

const POPULAR = ["¿Están abiertos ahora?","¿Dónde están?","¿Cómo hago un pedido?","¿Cuánta carne compro por persona?","¿Qué corte llevo para el horno?","¿Venden por mayor?"];

const STOPWORDS = new Set(("a al algo con como de del el en es esta este esto eso hay la las le les lo los me mi mis muy no o para pero por puedo pueden que q se si sin sobre su sus te tengo tienen tenes tu un una unas unos y ya yo hola buenas buen buenos dias gracias favor quisiera necesito busco buscando saber consulta consultar ustedes vos che").split(" "));

function escapeHTML(s){
  return s.replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
function tokenize(s){
  return normalize(s).replace(/[^a-z0-9ñ\s]/g," ").split(/\s+/).filter(Boolean);
}
function queryTokens(q){
  const out = [];
  tokenize(q).filter(t => !STOPWORDS.has(t)).forEach(t=>{
    out.push(t);
    if (SYNONYMS[t]) out.push(...SYNONYMS[t].split(" "));
  });
  return [...new Set(out)];
}
function stem(w){ return w.length > 4 ? w.replace(/(es|s)$/,"") : w; }
function lev(a, b){
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length:a.length+1 }, (_,i)=> [i, ...Array(b.length).fill(0)]);
  for (let j=1; j<=b.length; j++) d[0][j] = j;
  for (let i=1; i<=a.length; i++) for (let j=1; j<=b.length; j++)
    d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + (a[i-1]===b[j-1] ? 0 : 1));
  return d[a.length][b.length];
}
// Qué tan bien coincide una palabra buscada con una palabra del contenido
function wordScore(qt, w){
  if (qt === w || stem(qt) === stem(w)) return 3;
  if (qt.length >= 2 && w.startsWith(qt)) return 2.3;          // mientras escribe: "bon" → bondiola
  if (qt.length >= 4 && w.includes(qt)) return 1.4;
  // Errores de tipeo ("vasio" → vacío). Misma primera letra, para no confundir "lomo" con "como".
  const tol = qt.length >= 7 ? 2 : qt.length >= 4 ? 1 : 0;
  if (tol && qt[0] === w[0] && lev(stem(qt), stem(w)) <= tol) return 1.8;
  return 0;
}
function fieldScore(qt, words){
  let best = 0;
  for (const w of words){ const s = wordScore(qt, w); if (s > best){ best = s; if (s === 3) break; } }
  return best;
}
function scoreItem(item, tokens){
  if (!tokens.length) return 0;
  let total = 0, hit = 0;
  for (const t of tokens){
    const s = Math.max(fieldScore(t, item._label)*3, fieldScore(t, item._keys)*2.2, fieldScore(t, item._text));
    if (s > 0){ total += s; hit++; }
  }
  return hit ? total * Math.pow(hit / tokens.length, 1.3) : 0;
}

function buildSearchIndex(){
  const idx = [];
  PRODUCTS.forEach(p=>idx.push({
    type:"product", icon:"🥩", label:p.name, sub:`${CAT_LABELS[p.cat]} · Ver en el catálogo`,
    keys:`${CAT_LABELS[p.cat]} ${p.cat} corte cortes`, text:p.desc, cat:p.cat
  }));
  Object.keys(GUIDE).forEach(mode=>{
    GUIDE[mode].items.forEach(it=>idx.push({
      type:"guide", icon:"🔥", label:it.name, sub:`Guía · ${GUIDE[mode].label}`,
      keys:`${GUIDE[mode].label} ${mode} ${it.time} ${it.diff}`, text:it.tip, mode
    }));
  });
  ARTICLES.forEach((a,i)=>idx.push({
    type:"article", icon:"📰", label:a.title, sub:`Tip · ${a.tag}`,
    keys:a.tag, text:`${a.excerpt} ${a.full}`, index:i
  }));
  PEDIX_PRODUCTS.forEach(p=>idx.push({
    type:"pedix", icon:"🛒", label:p.name, sub:`${p.cat} · Pedilo online`,
    keys:`${p.cat} ${p.keys} corte cortes pedix`, text:""
  }));
  idx.push(
    { type:"pedix", icon:"🛒", label:"Tienda online", sub:"Hacé tu pedido en Pedix",
      keys:"pedix tienda online pedido pedidos pedir comprar app catalogo ofertas", text:"" },
    { type:"page", icon:"📖", label:"Nuestra historia", sub:"Familia Farias · Villa María", href:"historia.html",
      keys:"historia familia farias origen quienes somos fundador barcia 1986 2001 primer local", text:"" },
    { type:"page", icon:"⭐", label:"Salame tipo chacra", sub:"Nuestro producto estrella", href:"historia.html#salame",
      keys:"salame salamin chacra fiambre embutido casero receta familiar producto estrella", text:"" },
    { type:"page", icon:"📦", label:"Venta mayorista", sub:"Comercios, gastronomía y distribuidores", href:"historia.html#mayorista",
      keys:"mayorista mayor reventa comercio almacen fiambreria distribuidor gastronomia restaurante", text:"" },
  );
  idx.forEach(it=>{ it._label = tokenize(it.label); it._keys = tokenize(it.keys); it._text = tokenize(it.text); });
  return idx;
}
const SEARCH_INDEX = buildSearchIndex();
// Las respuestas que se calculan en el momento (horario actual) no se indexan por su texto
FAQS.forEach(f=>{ f._label = tokenize(f.q); f._keys = tokenize(f.keys); f._text = typeof f.answer === "string" ? tokenize(f.answer.replace(/<[^>]+>/g," ")) : []; });

const globalSearch = document.getElementById("globalSearch");
const searchResultsEl = document.getElementById("searchResults");
searchResultsEl.inert = true;
let currentResults = [];   // lo que se puede elegir con teclado/click en el desplegable
let activeIndex = -1;

function highlightEl(el){
  if (!el) return;
  el.scrollIntoView({ behavior:"smooth", block:"center" });
  el.classList.add("search-hit");
  setTimeout(()=>el.classList.remove("search-hit"), 1400);
}

function closeSearch(){
  searchResultsEl.classList.remove("open");
  searchResultsEl.inert = true;
  globalSearch.setAttribute("aria-expanded","false");
  activeIndex = -1;
}

function goTo(target){
  closeSearch();
  globalSearch.value = "";
  globalSearch.blur();
  if (target.type === "product"){
    setCortesOpen(true);
    document.getElementById("productos").scrollIntoView({ behavior:"smooth" });
    setTimeout(()=> highlightEl(gridEl.querySelector(`[data-name="${CSS.escape(target.label)}"]`)), 650);
  } else if (target.type === "guide"){
    activeMode = target.mode;
    renderModes(); renderGuide();
    const card = target.label && guideGridEl.querySelector(`[data-name="${CSS.escape(target.label)}"]`);
    if (card) setTimeout(()=> highlightEl(card), 100);
    else document.getElementById("modeSelect").scrollIntoView({ behavior:"smooth", block:"center" });
  } else if (target.type === "article"){
    const card = document.getElementById(`blog-${target.index}`);
    if (card && !card.classList.contains("open")) card.querySelector(".blog-toggle").click();
    setTimeout(()=> highlightEl(card), 100);
  } else if (target.type === "page"){
    window.location.href = target.href;
  } else if (target.type === "pedix"){
    window.open(PEDIX_URL, "_blank", "noopener");
  }
}

// Resalta en el título las palabras que coinciden con lo buscado
function highlightLabel(label, tokens){
  return label.split(/(\s+)/).map(part=>{
    const w = tokenize(part)[0];
    return w && tokens.some(t => wordScore(t, w) >= 1.8) ? `<mark>${escapeHTML(part)}</mark>` : escapeHTML(part);
  }).join("");
}

function botMsg(html){
  return `<div class="chat-msg"><span class="chat-avatar">🥩</span><div class="chat-bubble">${html}</div></div>`;
}
function waButton(msg, label = "Consultar por WhatsApp"){
  return `<a class="btn btn-primary btn-small" href="${waLink(msg)}" target="_blank" rel="noopener">${label}</a>`;
}
function ctaButton(type, query){
  if (type === "pedix") return `<a class="btn btn-primary btn-small" href="${PEDIX_URL}" target="_blank" rel="noopener">🛒 Hacer mi pedido online</a>`;
  if (type === "whatsapp") return waButton(query ? WA_MSG.consulta(query) : WA_MSG.general);
  // Un botón de WhatsApp por sucursal, con la pregunta del cliente ya escrita
  if (type === "sucursales") return SUCURSALES.map(s=>
    `<a class="btn btn-primary btn-small" href="${waSucursal(s, query ? WA_MSG.consulta(query) : WA_MSG.general)}" target="_blank" rel="noopener">WhatsApp ${s.corto}</a>`).join("");
  if (type === "instagram") return `<a class="btn btn-outline btn-small" href="https://instagram.com/carnesbuenosaires" target="_blank" rel="noopener">Ver Instagram</a>`;
  return "";
}
function goLabel(go){
  if (go.type === "article") return "Leer la nota";
  if (go.type === "guide") return "Ver la guía de cortes";
  if (go.type === "page") return go.href.includes("mayorista") ? "Ver venta mayorista" : go.href.includes("salame") ? "Conocer el salame" : "Conocer nuestra historia";
  return "Ver más";
}

// Un corte que existe en la carnicería pero no está cargado en la web
function findCutAlias(q){
  const nq = normalize(q);
  for (const [cat, names] of Object.entries(CUT_ALIASES)){
    const name = names.find(n => nq.includes(normalize(n)) || tokenize(nq).some(t => t.length >= 4 && lev(t, normalize(n)) <= 1));
    if (name) return { cat, name };
  }
  return null;
}

function resultButton(item, tokens){
  const i = currentResults.push({ kind:"item", item }) - 1;
  return `<button type="button" class="sr-item" role="option" id="sr-${i}" data-i="${i}">
      <span class="sr-ic">${item.icon}</span>
      <span class="sr-text"><b>${highlightLabel(item.label, tokens)}</b><small>${escapeHTML(item.sub)}</small></span>
      <span class="sr-go" aria-hidden="true">→</span>
    </button>`;
}
function questionChip(text){
  const i = currentResults.push({ kind:"question", text }) - 1;
  return `<button type="button" class="sr-chip" role="option" id="sr-${i}" data-i="${i}">${escapeHTML(text)}</button>`;
}

function showPanel(html){
  searchResultsEl.innerHTML = html;
  searchResultsEl.querySelectorAll("[data-i]").forEach(btn=>{
    btn.addEventListener("click", ()=> choose(Number(btn.dataset.i)));
  });
  searchResultsEl.classList.add("open");
  searchResultsEl.inert = false;
  globalSearch.setAttribute("aria-expanded","true");
  activeIndex = -1;
}

// Buscador vacío: preguntas populares
function renderSuggestions(){
  currentResults = [];
  showPanel(
    botMsg(`<p>¡Hola! ¿En qué te ayudo? Buscá un corte, una receta o hacé tu pregunta.</p>`) +
    `<div class="chat-results-label">Preguntas frecuentes</div>
     <div class="sr-chips">${POPULAR.map(questionChip).join("")}</div>`
  );
}

function renderSearchResults(query){
  const raw = query.trim();
  if (raw.length < 2){ renderSuggestions(); return; }

  const tokens = queryTokens(raw);
  currentResults = [];

  const rankedFaqs = FAQS.map(f=>({ f, s:scoreItem(f, tokens) })).filter(x=>x.s > 0).sort((a,b)=>b.s-a.s);
  // Un mismo corte puede estar en el catálogo y en la guía: se muestra una sola vez (gana el de mayor puntaje)
  const seen = new Set();
  const ranked = SEARCH_INDEX.map(it=>({ it, s:scoreItem(it, tokens) })).filter(x=>x.s > 0).sort((a,b)=>b.s-a.s)
    .filter(x=>{ const k = normalize(x.it.label); if (seen.has(k)) return false; seen.add(k); return true; });
  const topFaq = rankedFaqs[0];
  const topItem = ranked[0];
  const strong = ranked.filter(x=> x.s >= 2.5).slice(0, 6).map(x=>x.it);
  const isQuestion = /[?¿]|^(como|cuando|cuanto|cuanta|donde|que|cual|hacen|tienen|venden|puedo|aceptan|hay)\b/.test(normalize(raw));
  // La pregunta frecuente gana si coincide bien, o si la búsqueda tiene forma de pregunta
  const faqWins = topFaq && topFaq.s >= 4 && (isQuestion || !topItem || topFaq.s >= topItem.s * 0.8);

  let html = "";

  if (faqWins){
    const f = topFaq.f;
    const buttons = [f.go ? `<button type="button" class="btn btn-outline btn-small" data-i="${currentResults.push({ kind:"go", go:f.go }) - 1}">${goLabel(f.go)} →</button>` : "",
                     ...[].concat(f.cta || []).map(c=> ctaButton(c, raw))].join("");
    const answer = typeof f.answer === "function" ? f.answer() : f.answer;
    html += botMsg(`<p>${answer}</p><div class="chat-actions">${buttons}</div>`);
    if (strong.length){
      html += `<div class="chat-results-label">También te puede servir</div>` + strong.slice(0, 4).map(it=>resultButton(it, tokens)).join("");
    }
    const others = rankedFaqs.slice(1, 3).filter(x=>x.s >= 3).map(x=>x.f.q);
    if (others.length) html += `<div class="chat-results-label">Preguntas relacionadas</div><div class="sr-chips">${others.map(questionChip).join("")}</div>`;
  }
  else if (strong.length){
    html += botMsg(`<p>Esto encontré para <b>"${escapeHTML(raw)}"</b>:</p>`);
    html += strong.map(it=>resultButton(it, tokens)).join("");
    const qs = rankedFaqs.slice(0, 2).filter(x=>x.s >= 2.5).map(x=>x.f.q);
    if (qs.length) html += `<div class="chat-results-label">Preguntas relacionadas</div><div class="sr-chips">${qs.map(questionChip).join("")}</div>`;
    html += `<div class="sr-footer"><span>¿No es lo que buscabas? Preguntanos:</span><div class="chat-actions">${ctaButton("sucursales", raw)}</div></div>`;
  }
  else {
    // Sin coincidencia clara: opciones parecidas + WhatsApp con la pregunta ya escrita
    const alias = findCutAlias(raw);
    let similar, intro;
    if (alias){
      similar = SEARCH_INDEX.filter(it=> it.type === "product" && it.cat === alias.cat).slice(0, 4);
      intro = `<p>Todavía no tenemos <b>${escapeHTML(alias.name)}</b> cargado en la web, pero fijate en nuestra tienda de Pedix o preguntanos. Mientras tanto, mirá estas opciones de <b>${CAT_LABELS[alias.cat]}</b>:</p>`;
    } else {
      similar = ranked.slice(0, 4).map(x=>x.it);
      intro = similar.length
        ? `<p>No encontré exactamente <b>"${escapeHTML(raw)}"</b>, pero tenemos estas opciones parecidas:</p>`
        : `<p>No encontré nada sobre <b>"${escapeHTML(raw)}"</b>, pero te respondemos al toque por WhatsApp.</p>`;
    }
    html += botMsg(`${intro}<div class="chat-actions">${alias ? ctaButton("pedix") : ""}${ctaButton("sucursales", raw)}</div>`);
    if (similar.length) html += `<div class="chat-results-label">Opciones similares</div>` + similar.map(it=>resultButton(it, tokens)).join("");
    html += `<div class="chat-results-label">O probá con</div><div class="sr-chips">${POPULAR.slice(0, 4).map(questionChip).join("")}</div>`;
  }

  showPanel(html);
}

function choose(i){
  const r = currentResults[i];
  if (!r) return;
  if (r.kind === "item") goTo(r.item);
  else if (r.kind === "go") goTo(r.go);
  else if (r.kind === "question"){ globalSearch.value = r.text; renderSearchResults(r.text); globalSearch.focus(); }
}

function setActive(i){
  const opts = [...searchResultsEl.querySelectorAll(".sr-item, .sr-chip")];
  if (!opts.length) return;
  activeIndex = (i + opts.length) % opts.length;
  opts.forEach((o,k)=> o.classList.toggle("active", k === activeIndex));
  opts[activeIndex].scrollIntoView({ block:"nearest" });
  globalSearch.setAttribute("aria-activedescendant", opts[activeIndex].id);
}

let searchTimer;
globalSearch.setAttribute("role","combobox");
globalSearch.setAttribute("aria-controls","searchResults");
globalSearch.setAttribute("aria-expanded","false");
globalSearch.setAttribute("autocomplete","off");
searchResultsEl.setAttribute("role","listbox");

globalSearch.addEventListener("input", ()=>{
  clearTimeout(searchTimer);
  searchTimer = setTimeout(()=> renderSearchResults(globalSearch.value), 120);
});
globalSearch.addEventListener("focus", ()=> renderSearchResults(globalSearch.value));
globalSearch.addEventListener("keydown", (e)=>{
  const opts = searchResultsEl.querySelectorAll(".sr-item, .sr-chip");
  if (e.key === "ArrowDown"){ e.preventDefault(); setActive(activeIndex + 1); }
  else if (e.key === "ArrowUp"){ e.preventDefault(); setActive(activeIndex - 1); }
  else if (e.key === "Enter"){
    e.preventDefault();
    const pick = activeIndex >= 0 ? opts[activeIndex] : searchResultsEl.querySelector(".sr-item");
    if (pick) choose(Number(pick.dataset.i));
  }
  else if (e.key === "Escape"){ closeSearch(); globalSearch.blur(); }
});
document.addEventListener("click", (e)=>{
  // Si el elemento tocado ya no existe (el panel se redibujó al elegir una pregunta), no cerrar
  if (!e.target.isConnected) return;
  if (!e.target.closest(".nav-search")) closeSearch();
});

// ---- Hero video: plays immediately ----
document.querySelectorAll("video[data-autoplay]").forEach(v=>{
  v.muted = true;
  const tryPlay = () => v.play().catch(()=>{});
  if (v.readyState >= 2) tryPlay();
  else v.addEventListener("loadeddata", tryPlay, { once:true });
});

// ---- Lazy video (tips): load and play only near viewport, pause off-screen ----
const lazyVideos = document.querySelectorAll("video[data-lazy]");
const lazyIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const v = entry.target;
    if (entry.isIntersecting){
      if (!v.dataset.loaded){
        const source = v.querySelector("source[data-src]");
        source.src = source.dataset.src;
        v.load();
        v.dataset.loaded = "1";
      }
      v.play().catch(()=>{});
    } else {
      v.pause();
    }
  });
}, { rootMargin:"200px 0px", threshold:0.15 });
lazyVideos.forEach(v=>lazyIO.observe(v));

// ---- Scroll reveal ----
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  // El catálogo desplegable tiene su propia animación: no se incluye acá para que no se pisen
  const revealTargets = document.querySelectorAll("section .wrap > *:not(.cortes-panel), .cut-card, .blog-card");
  revealTargets.forEach(el=>el.classList.add("reveal","pre"));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.remove("pre"); io.unobserve(entry.target); }
    });
  }, { threshold:0.1, rootMargin:"0px 0px -60px 0px" });
  revealTargets.forEach(el=>io.observe(el));
}

// ---- 4) Buscador: el texto de ayuda se escribe solo con ejemplos de preguntas ----
(function(){
  const input = document.getElementById("globalSearch");
  const box = input.closest(".search-box");
  // Lupa que late mientras se escribe
  let typingT;
  input.addEventListener("input", ()=>{ box.classList.remove("typing"); void box.offsetWidth; box.classList.add("typing"); clearTimeout(typingT); typingT = setTimeout(()=> box.classList.remove("typing"), 650); });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const base = input.getAttribute("placeholder");
  const frases = ["¿Están abiertos ahora?", "Buscá un corte: vacío, bondiola…", "¿Cuánta carne por persona?", "¿Dónde quedan las sucursales?", base];
  let fi = 0, ci = 0, borrando = false, timer;
  function paso(){
    if (document.activeElement === input || input.value){ input.setAttribute("placeholder", base); timer = setTimeout(paso, 1500); return; }
    const f = frases[fi];
    if (!borrando){
      ci++; input.setAttribute("placeholder", f.slice(0, ci));
      if (ci >= f.length){ borrando = true; timer = setTimeout(paso, 2200); return; }
      timer = setTimeout(paso, 55);
    } else {
      ci--; input.setAttribute("placeholder", f.slice(0, ci) || " ");
      if (ci <= 0){ borrando = false; fi = (fi + 1) % frases.length; timer = setTimeout(paso, 350); return; }
      timer = setTimeout(paso, 25);
    }
  }
  timer = setTimeout(paso, 2600);
  input.addEventListener("focus", ()=> input.setAttribute("placeholder", base));
})();

// ---- 5) Globito "¿Te ayudamos con tu pedido?": una sola vez por visita, a los 5 s, y se va solo ----
(function(){
  const b = document.getElementById("waBubble");
  if (!b) return;
  let visto = false;
  try { visto = sessionStorage.getItem("waBubble") === "1"; } catch(e){}
  if (visto) return;
  setTimeout(()=>{
    b.classList.add("show");
    try { sessionStorage.setItem("waBubble", "1"); } catch(e){}
    setTimeout(()=> b.classList.remove("show"), 7000);
  }, 5000);
  b.addEventListener("click", ()=> b.classList.remove("show"));
})();
