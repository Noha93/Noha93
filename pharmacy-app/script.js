/* ===== DATA ===== */
const products = [
  {id:1,name:'باراسيتامول 500',active:'Paracetamol',strength:'500 مجم',category:'medicine',condition:'pain',price:18,stock:240,rx:false,icon:'💊',desc:'خافض حرارة ومسكن للألم — 20 قرص'},
  {id:2,name:'أوجمنتين 1 جم',active:'Amoxicillin + Clavulanic Acid',strength:'1 جم',category:'medicine',condition:'infection',price:64,stock:4,rx:true,icon:'💊',desc:'مضاد حيوي — 14 قرص'},
  {id:3,name:'فيتامين سي 1000',active:'Ascorbic Acid',strength:'1000 مجم',category:'medicine',condition:'vitamins',price:75,stock:58,rx:false,icon:'🍊',desc:'مكمل غذائي فوار — 20 قرص'},
  {id:4,name:'بانادول إكسترا',active:'Paracetamol + Caffeine',strength:'500 مجم',category:'medicine',condition:'pain',price:22,stock:300,rx:false,icon:'💊',desc:'مسكن سريع المفعول — 24 قرص'},
  {id:5,name:'كلافوريل 1 جم',active:'Amoxicillin + Clavulanic Acid',strength:'1 جم',category:'medicine',condition:'infection',price:58,stock:40,rx:true,icon:'💊',desc:'مضاد حيوي — بديل اقتصادي لنفس المادة الفعالة'},
  {id:6,name:'ميتفورمين 500',active:'Metformin',strength:'500 مجم',category:'medicine',condition:'chronic',price:30,stock:150,rx:true,icon:'💊',desc:'لعلاج السكري من النوع الثاني'},
  {id:7,name:'كريم ترطيب نيفيا',active:'Moisturizing Cream',strength:'',category:'care',condition:'skincare',price:95,stock:0,rx:false,icon:'🧴',desc:'كريم ترطيب يومي لكل أنواع البشرة'},
  {id:8,name:'سيروم فيتامين سي',active:'Vitamin C Serum',strength:'10%',category:'cosmetic',condition:'skincare',price:210,oldPrice:260,stock:58,rx:false,icon:'✨',desc:'سيروم مضاد للأكسدة لإشراقة البشرة'},
  {id:9,name:'سيروم النياسيناميد',active:'Niacinamide Serum',strength:'10%',category:'cosmetic',condition:'skincare',price:180,oldPrice:220,stock:30,rx:false,icon:'✨',desc:'ينظم إفراز الدهون ويقلل المسام الواسعة'},
  {id:10,name:'مكمل أوميغا 3',active:'Omega-3 Fatty Acids',strength:'1000 مجم',category:'care',condition:'vitamins',price:140,stock:45,rx:false,icon:'🐟',desc:'دعم صحة القلب والمفاصل — 60 كبسولة'},
  {id:11,name:'شامبو أطفال',active:'Baby Shampoo',strength:'',category:'care',condition:'baby',price:65,stock:80,rx:false,icon:'🍼',desc:'تركيبة لطيفة خالية من الدموع'},
  {id:12,name:'كونجستال',active:'Paracetamol + Chlorpheniramine + Phenylephrine',strength:'',category:'medicine',condition:'cold',price:20,stock:120,rx:false,icon:'🤧',desc:'لعلاج أعراض نزلات البرد والإنفلونزا — 20 قرص'},
  {id:13,name:'أنتينال',active:'Nifuroxazide',strength:'200 مجم',category:'medicine',condition:'digestive',price:35,stock:90,rx:false,icon:'🍽️',desc:'لعلاج الإسهال والاضطرابات المعوية'},
  {id:14,name:'كلاريتين',active:'Loratadine',strength:'10 مجم',category:'medicine',condition:'allergy',price:40,stock:70,rx:false,icon:'🤧',desc:'مضاد هيستامين لعلاج الحساسية الموسمية'},
  {id:15,name:'كونكور 5',active:'Bisoprolol',strength:'5 مجم',category:'medicine',condition:'chronic',price:48,stock:60,rx:true,icon:'❤️',desc:'لعلاج ضغط الدم المرتفع وأمراض القلب'},
  {id:16,name:'أنتيفلو-ديس',active:'Paracetamol + Pheniramine + Phenylephrine',strength:'',category:'medicine',condition:'cold',price:25,stock:200,rx:false,icon:'🤧',desc:'لعلاج أعراض البرد والإنفلونزا الشائعة — 10 أكياس'},
  {id:17,name:'كومتركس',active:'Paracetamol + Chlorpheniramine + Dextromethorphan',strength:'',category:'medicine',condition:'cold',price:28,stock:90,rx:false,icon:'🤧',desc:'يخفف أعراض البرد والسعال والاحتقان'},
  {id:18,name:'فيفادول كولد',active:'Paracetamol + Phenylephrine',strength:'',category:'medicine',condition:'cold',price:19,stock:150,rx:false,icon:'🤧',desc:'خافض حرارة ومزيل احتقان للبرد'},
  {id:19,name:'بروفين 400',active:'Ibuprofen',strength:'400 مجم',category:'medicine',condition:'pain',price:15,stock:260,rx:false,icon:'💊',desc:'مسكن ومضاد للالتهاب — 20 قرص'},
  {id:20,name:'فولتارين 50',active:'Diclofenac Sodium',strength:'50 مجم',category:'medicine',condition:'pain',price:24,stock:110,rx:true,icon:'💊',desc:'مسكن قوي للألم والالتهاب المفصلي'},
  {id:21,name:'كيتوفان',active:'Ketoprofen',strength:'100 مجم',category:'medicine',condition:'pain',price:26,stock:70,rx:true,icon:'💊',desc:'لعلاج آلام المفاصل والعضلات'},
  {id:22,name:'زيثروماكس 500',active:'Azithromycin',strength:'500 مجم',category:'medicine',condition:'infection',price:85,stock:35,rx:true,icon:'💊',desc:'مضاد حيوي واسع المجال — 3 أقراص'},
  {id:23,name:'فلاجيل 500',active:'Metronidazole',strength:'500 مجم',category:'medicine',condition:'infection',price:32,stock:100,rx:true,icon:'💊',desc:'مضاد للبكتيريا والطفيليات'},
  {id:24,name:'سيبروباي 500',active:'Ciprofloxacin',strength:'500 مجم',category:'medicine',condition:'infection',price:45,stock:80,rx:true,icon:'💊',desc:'مضاد حيوي لعلاج التهابات المسالك البولية'},
  {id:25,name:'جلوكوفاج 850',active:'Metformin',strength:'850 مجم',category:'medicine',condition:'chronic',price:28,stock:180,rx:true,icon:'❤️',desc:'لعلاج السكري من النوع الثاني — تركيز أعلى'},
  {id:26,name:'أملور 5',active:'Amlodipine',strength:'5 مجم',category:'medicine',condition:'chronic',price:40,stock:95,rx:true,icon:'❤️',desc:'لعلاج ضغط الدم المرتفع'},
  {id:27,name:'كابوتين 25',active:'Captopril',strength:'25 مجم',category:'medicine',condition:'chronic',price:18,stock:130,rx:true,icon:'❤️',desc:'لعلاج ضغط الدم وقصور القلب'},
  {id:28,name:'زيرتك',active:'Cetirizine',strength:'10 مجم',category:'medicine',condition:'allergy',price:22,stock:140,rx:false,icon:'🌸',desc:'مضاد هيستامين لعلاج الحساسية وسيلان الأنف'},
  {id:29,name:'فنتولين استنشاق',active:'Salbutamol',strength:'100 ميكروجرام',category:'medicine',condition:'allergy',price:35,stock:45,rx:true,icon:'🌸',desc:'بخاخ موسع للشعب الهوائية لعلاج الربو'},
  {id:30,name:'ريابل',active:'Prifinium Bromide',strength:'30 مجم',category:'medicine',condition:'digestive',price:30,stock:85,rx:false,icon:'🍽️',desc:'مضاد تشنج لعلاج آلام المعدة والقولون'},
  {id:31,name:'نيكسيوم 20',active:'Esomeprazole',strength:'20 مجم',category:'medicine',condition:'digestive',price:55,stock:60,rx:true,icon:'🍽️',desc:'لعلاج الحموضة وقرحة المعدة'},
  {id:32,name:'سملاك',active:'Diosmectite',strength:'3 جم',category:'medicine',condition:'digestive',price:38,stock:100,rx:false,icon:'🍽️',desc:'لعلاج الإسهال الحاد عند الكبار والأطفال'},
  {id:33,name:'سنتروم',active:'Multivitamin',strength:'',category:'care',condition:'vitamins',price:195,stock:50,rx:false,icon:'🍊',desc:'فيتامينات ومعادن متكاملة للاستخدام اليومي'},
  {id:34,name:'كالسيوم د³',active:'Calcium + Vitamin D3',strength:'600 مجم',category:'care',condition:'vitamins',price:85,stock:70,rx:false,icon:'🍊',desc:'لدعم صحة العظام والأسنان'},
  {id:35,name:'زنك بلس',active:'Zinc',strength:'15 مجم',category:'care',condition:'vitamins',price:60,stock:90,rx:false,icon:'🍊',desc:'يدعم المناعة ويسرّع التئام الجروح'},
  {id:36,name:'واقي شمس أوسيرين',active:'Sunscreen SPF50',strength:'SPF50',category:'cosmetic',condition:'skincare',price:250,oldPrice:300,stock:40,rx:false,icon:'✨',desc:'حماية عالية من أشعة الشمس لكل أنواع البشرة'},
  {id:37,name:'غسول وجه سيتافيل',active:'Facial Cleanser',strength:'',category:'cosmetic',condition:'skincare',price:165,oldPrice:195,stock:55,rx:false,icon:'✨',desc:'غسول لطيف للبشرة الحساسة'},
  {id:38,name:'بنادول أطفال شراب',active:'Paracetamol Suspension',strength:'120مجم/5مل',category:'medicine',condition:'baby',price:24,stock:110,rx:false,icon:'🍼',desc:'خافض حرارة للأطفال بطعم الفراولة'},
  {id:39,name:'انفاكول نقط',active:'Simethicone',strength:'40 مجم/مل',category:'care',condition:'baby',price:45,stock:60,rx:false,icon:'🍼',desc:'لعلاج المغص وتجمع الغازات عند الرضع'},
  {id:40,name:'كريم بيبانثين',active:'Dexpanthenol',strength:'5%',category:'care',condition:'baby',price:78,stock:65,rx:false,icon:'🍼',desc:'لعلاج والوقاية من التهابات الحفاض'},
  {id:41,name:'قطرة سيستين للعين',active:'Artificial Tears',strength:'',category:'care',condition:'eye_ear',price:55,stock:70,rx:false,icon:'👁️',desc:'قطرة مرطبة للعين الجافة'},
  {id:42,name:'أوتوكالم قطرة أذن',active:'Ear Drops Solution',strength:'',category:'medicine',condition:'eye_ear',price:32,stock:40,rx:false,icon:'👁️',desc:'لتنظيف وتليين شمع الأذن'},
  {id:43,name:'معجون سنسوداين',active:'Sensitivity Toothpaste',strength:'',category:'care',condition:'dental',price:95,stock:85,rx:false,icon:'🦷',desc:'لعلاج حساسية الأسنان'},
  {id:44,name:'غسول هيكسيتول',active:'Antiseptic Mouthwash',strength:'0.1%',category:'care',condition:'dental',price:60,stock:70,rx:false,icon:'🦷',desc:'غسول مطهر للفم واللثة'},
  {id:45,name:'بيتادين محلول',active:'Povidone Iodine',strength:'10%',category:'medicine',condition:'first_aid',price:35,stock:90,rx:false,icon:'🩹',desc:'مطهر للجروح البسيطة والحروق'},
  {id:46,name:'مرهم فلامازين',active:'Silver Sulfadiazine',strength:'1%',category:'medicine',condition:'first_aid',price:48,stock:40,rx:true,icon:'🩹',desc:'لعلاج الحروق ومنع العدوى'},
  {id:47,name:'حمض الفوليك',active:'Folic Acid',strength:'5 مجم',category:'care',condition:'women',price:40,stock:100,rx:false,icon:'🌷',desc:'مكمل أساسي للحوامل ومخطّطات الحمل'},
  {id:48,name:'كانستين كريم مهبلي',active:'Clotrimazole',strength:'2%',category:'medicine',condition:'women',price:42,stock:55,rx:false,icon:'🌷',desc:'لعلاج الالتهابات الفطرية'},
  {id:49,name:'ميلاتونين',active:'Melatonin',strength:'3 مجم',category:'care',condition:'sleep',price:110,stock:60,rx:false,icon:'😴',desc:'يساعد على تنظيم النوم الطبيعي'},
  {id:50,name:'فاليريان',active:'Valerian Root Extract',strength:'500 مجم',category:'care',condition:'sleep',price:95,stock:50,rx:false,icon:'😴',desc:'مهدئ عشبي طبيعي للتوتر والأرق'},
  {id:51,name:'أدول 500',active:'Paracetamol',strength:'500 مجم',category:'medicine',condition:'pain',price:16,stock:180,rx:false,icon:'💊',desc:'مسكن وخافض حرارة — نفس تركيز باراسيتامول 500'},
  {id:52,name:'سيدوفاج 500',active:'Metformin',strength:'500 مجم',category:'medicine',condition:'chronic',price:25,stock:140,rx:true,icon:'❤️',desc:'لعلاج السكري من النوع الثاني — نفس تركيز ميتفورمين 500'},
  {id:53,name:'نيوروفين 400',active:'Ibuprofen',strength:'400 مجم',category:'medicine',condition:'pain',price:17,stock:200,rx:false,icon:'💊',desc:'مسكن ومضاد التهاب — نفس تركيز بروفين 400'},
];
/* تصنيف الأدوية حسب الحالة/نوع العلاج — الأسهل للعميل العادي مقارنة بالفئة الدوائية أو الترتيب الأبجدي */
const conditions = [
  {key:'all',icon:'🗂️',label:'الكل'},
  {key:'cold',icon:'🤧',label:'نزلات البرد والإنفلونزا'},
  {key:'pain',icon:'💊',label:'المسكنات وخافضات الحرارة'},
  {key:'infection',icon:'🦠',label:'المضادات الحيوية'},
  {key:'chronic',icon:'❤️',label:'القلب والضغط والسكري'},
  {key:'allergy',icon:'🌸',label:'الحساسية والجهاز التنفسي'},
  {key:'digestive',icon:'🍽️',label:'الجهاز الهضمي'},
  {key:'vitamins',icon:'🍊',label:'الفيتامينات والمكملات'},
  {key:'skincare',icon:'✨',label:'العناية والتجميل'},
  {key:'baby',icon:'🍼',label:'صحة الطفل والأم'},
  {key:'eye_ear',icon:'👁️',label:'العين والأذن'},
  {key:'dental',icon:'🦷',label:'الفم والأسنان'},
  {key:'first_aid',icon:'🩹',label:'الجروح والإسعافات الأولية'},
  {key:'women',icon:'🌷',label:'صحة المرأة'},
  {key:'sleep',icon:'😴',label:'النوم والاسترخاء'},
];
let cart = [];
let currentScreenId = 'splash';
let lastScreenBeforeDetail = 'home';
let currentDetailId = null;
let searchMode = 'trade';
let activeCategoryFilter = 'all';
let adminCategoryFilter = 'all';
let newProdCat = 'medicine';
const chatSeed = [{who:'them', text:'أهلاً، إزاي أقدر أساعدك؟ 🙂'}];
let chatLog = [...chatSeed];

/* ===== MODE SWITCH ===== */
function setMode(mode){
  document.getElementById('stage-app').classList.toggle('hidden', mode!=='app');
  document.getElementById('stage-admin').classList.toggle('hidden', mode!=='admin');
  document.getElementById('btn-mode-app').classList.toggle('active', mode==='app');
  document.getElementById('btn-mode-admin').classList.toggle('active', mode==='admin');
}

/* ===== MOBILE SCREEN NAV ===== */
function showScreen(id){
  document.querySelectorAll('.app-screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById('scr-'+id);
  if(el) el.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const navBtn = document.querySelector('.nav-btn[data-nav="'+id+'"]');
  if(navBtn) navBtn.classList.add('active');
  currentScreenId = id;
  if(id==='home') renderHome();
  if(id==='categories') renderCategories();
  if(id==='cart') renderCart();
  if(id==='search') renderSearchResults();
  if(id==='chat') renderChat();
}
function openDetail(id){
  lastScreenBeforeDetail = currentScreenId;
  currentDetailId = id;
  renderDetail(id);
  showScreen('detail');
}
function goBackFromDetail(){ showScreen(lastScreenBeforeDetail); }

/* ===== PRODUCT CARD ===== */
function productCardHtml(p){
  return `<div class="product-card" onclick="openDetail(${p.id})">
    <div class="product-img" style="background:#eef6f2">${p.icon}</div>
    <b>${p.name}</b>
    <div class="sub">${p.active}</div>
    <div class="price">${p.price} ج.م</div>
    ${p.stock===0?'<div class="sub" style="color:#e0575a">غير متاح</div>':''}
    ${p.rx?'<span class="rx-badge">يتطلب روشتة</span>':''}
  </div>`;
}
function offerCardHtml(p){
  const discount = Math.round((1 - p.price/p.oldPrice)*100);
  return `<div class="product-card offer-card" onclick="openDetail(${p.id})">
    <span class="offer-badge">خصم ${discount}%</span>
    <div class="product-img" style="background:#eef6f2">${p.icon}</div>
    <b>${p.name}</b>
    <div class="sub">${p.active}</div>
    <div class="price"><span class="old-price">${p.oldPrice} ج.م</span>${p.price} ج.م</div>
  </div>`;
}

/* ===== HOME ===== */
function renderHome(){
  const shortLabel = {cold:'برد وإنفلونزا',pain:'مسكنات',chronic:'مزمنة',vitamins:'فيتامينات',skincare:'عناية وتجميل'};
  const quick = conditions.filter(c=>['cold','pain','chronic','vitamins','skincare'].includes(c.key));
  document.getElementById('home-cats').innerHTML = quick.map(c=>`<div class="app-cat-chip" onclick="goCategory('${c.key}')">${c.icon}<br>${shortLabel[c.key]}</div>`).join('');

  const offers = products.filter(p=>p.oldPrice && p.stock>0);
  document.getElementById('home-offers').innerHTML = offers.map(offerCardHtml).join('');

  document.getElementById('home-products').innerHTML = [1,4,19,22].map(id=>productCardHtml(products.find(p=>p.id===id))).join('');

  const byCondition = (cond,n) => products.filter(p=>p.condition===cond).slice(0,n).map(productCardHtml).join('');
  document.getElementById('home-cold').innerHTML = byCondition('cold',6);
  document.getElementById('home-chronic').innerHTML = byCondition('chronic',6);
  document.getElementById('home-vitamins').innerHTML = byCondition('vitamins',6);
  document.getElementById('home-baby').innerHTML = byCondition('baby',6);
}
function goCategory(cond){ activeCategoryFilter = cond; showScreen('categories'); }

/* ===== CATEGORIES ===== */
function renderCategories(){
  let html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px">';
  conditions.forEach(c=>{
    const active = activeCategoryFilter===c.key;
    html += `<div class="app-cat-chip ${active?'active':''}" style="width:auto;min-width:0;margin:0;flex-direction:row;justify-content:flex-start;gap:8px;text-align:right;padding:10px 12px" onclick="setCategoryFilter('${c.key}')"><span style="font-size:16px">${c.icon}</span><span style="font-size:11px">${c.label}</span></div>`;
  });
  html += '</div><div class="product-grid" id="cat-products" style="margin-top:14px"></div>';
  document.getElementById('cat-list').innerHTML = html;
  const list = products.filter(p=>activeCategoryFilter==='all'||p.condition===activeCategoryFilter);
  list.sort((a,b)=>a.name.localeCompare(b.name,'ar'));
  document.getElementById('cat-products').innerHTML = list.length
    ? list.map(productCardHtml).join('')
    : '<p style="grid-column:1/-1;text-align:center;color:var(--app-text-muted);font-size:12px;margin-top:20px">مفيش منتجات في القسم ده حاليًا</p>';
}
function setCategoryFilter(cond){ activeCategoryFilter = cond; renderCategories(); }

/* ===== SEARCH (trade name / active ingredient + alphabetical) ===== */
function setSearchMode(mode){
  searchMode = mode;
  document.getElementById('tab-search-trade').classList.toggle('active', mode==='trade');
  document.getElementById('tab-search-active').classList.toggle('active', mode==='active');
  document.getElementById('search-input').placeholder = mode==='trade' ? 'مثال: أوجمنتين، بانادول...' : 'مثال: Amoxicillin, Paracetamol...';
  renderSearchResults();
}
function renderSearchResults(){
  const q = (document.getElementById('search-input').value||'').trim().toLowerCase();
  let list = products.filter(p=>{
    const field = searchMode==='trade' ? p.name : p.active;
    return field.toLowerCase().includes(q);
  });
  list.sort((a,b)=>{
    const fa = searchMode==='trade'?a.name:a.active, fb = searchMode==='trade'?b.name:b.active;
    return fa.localeCompare(fb,'ar');
  });
  document.getElementById('search-count').textContent = list.length + ' نتيجة';
  let html='', lastLetter='';
  list.forEach(p=>{
    const field = searchMode==='trade'?p.name:p.active;
    const letter = field[0];
    if(letter!==lastLetter){ html += `<div class="alpha-tag">${letter}</div>`; lastLetter=letter; }
    html += `<div class="list-row" onclick="openDetail(${p.id})"><span style="font-size:12px">${p.name}</span><span style="font-size:10px;color:var(--app-text-muted)">${p.active}</span></div>`;
  });
  if(list.length===0) html = '<p style="text-align:center;color:var(--app-text-muted);font-size:12px;margin-top:30px">مفيش نتائج مطابقة</p>';
  document.getElementById('search-results').innerHTML = html;
}

/* ===== PRODUCT DETAIL ===== */
function renderDetail(id){
  const p = products.find(x=>x.id===id);
  const alts = products.filter(x=>x.id!==p.id && x.active===p.active && p.strength && x.strength===p.strength);
  let altHtml = alts.length ? `<div class="app-h" style="font-size:13px">💊 بدائل بنفس المادة الفعالة والتركيز</div>` +
    alts.map(a=>`<div class="list-row" onclick="openDetail(${a.id})"><span style="font-size:12px">${a.name} <span style="color:var(--app-text-muted);font-size:10px">(${a.strength})</span></span><span style="font-size:11.5px;color:var(--app-primary)">${a.price} ج.م</span></div>`).join('') : '';
  document.getElementById('detail-content').innerHTML = `
    <div style="height:150px;background:var(--app-surface);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:46px;margin-top:2px">${p.icon}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">
      <b style="font-size:15px">${p.name}</b>${p.rx?'<span class="rx-badge">يتطلب روشتة</span>':''}
    </div>
    <div style="font-size:11px;color:var(--app-text-muted);margin-top:6px">الاسم التجاري: <b style="color:var(--app-text)">${p.name}</b></div>
    <div style="font-size:11px;color:var(--app-text-muted);margin-top:2px">الاسم العلمي (المادة الفعالة): <b style="color:var(--app-primary)">${p.active}</b></div>
    ${p.strength?`<div style="font-size:11px;color:var(--app-text-muted);margin-top:2px">التركيز: <b style="color:var(--app-text)">${p.strength}</b></div>`:''}
    <div style="font-size:12px;color:var(--app-text-muted);margin-top:8px">${p.desc}</div>
    <div style="font-size:18px;font-weight:800;color:var(--app-primary);margin-top:10px">${p.price} ج.م</div>
    ${p.stock===0?'<div style="color:#e0575a;font-size:12px;margin-top:6px">⚠️ غير متاح حاليًا بالمخزون</div>':''}
    ${altHtml}
    <button class="app-btn app-btn-primary" style="margin-top:16px" ${p.stock===0?'disabled':''} onclick="addToCart(${p.id})">${p.stock===0?'غير متاح حاليًا':'إضافة للسلة'}</button>
    ${p.rx?'<button class="app-btn app-btn-secondary" style="margin-top:8px" onclick="showScreen(\'rx\')">رفع الروشتة أولاً</button>':''}
    <button class="app-btn app-btn-wa" style="margin-top:8px" onclick="openWhatsApp()">💬 اسأل الصيدلية عن هذا المنتج</button>
  `;
}

/* ===== CART ===== */
function addToCart(id){
  const item = cart.find(c=>c.id===id);
  if(item) item.qty++; else cart.push({id,qty:1});
  updateCartBadge();
  showToast('تمت الإضافة للسلة ✅');
}
function updateCartBadge(){
  document.getElementById('cart-count').textContent = cart.reduce((s,c)=>s+c.qty,0);
}
function changeQty(id,delta){
  const item = cart.find(c=>c.id===id);
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(c=>c.id!==id);
  updateCartBadge();
  renderCart();
}
function renderCart(){
  const wrap = document.getElementById('cart-items');
  const empty = document.getElementById('cart-empty');
  if(cart.length===0){ wrap.innerHTML=''; empty.style.display='block'; document.getElementById('cart-summary').innerHTML=''; return; }
  empty.style.display='none';
  let total=0;
  wrap.innerHTML = cart.map(c=>{
    const p = products.find(x=>x.id===c.id); total += p.price*c.qty;
    return `<div class="list-row"><span style="font-size:12px">${p.name} × ${c.qty}</span>
      <div style="display:flex;align-items:center;gap:8px">
        <button class="qty-btn" onclick="changeQty(${p.id},-1)">−</button>
        <button class="qty-btn" onclick="changeQty(${p.id},1)">+</button>
        <span style="font-size:12px;font-weight:700">${p.price*c.qty} ج.م</span>
      </div></div>`;
  }).join('');
  document.getElementById('cart-summary').innerHTML = `
    <div style="border-top:1px solid var(--app-border);padding-top:12px;display:flex;justify-content:space-between;font-weight:800;font-size:14px"><span>الإجمالي</span><span>${total} ج.م</span></div>
    <button class="app-btn app-btn-primary" style="margin-top:14px" onclick="goCheckout()">إتمام الطلب</button>
    <button class="app-btn app-btn-wa" style="margin-top:8px" onclick="openWhatsApp()">💬 تواصل مع الصيدلية قبل الطلب</button>`;
}
function goCheckout(){
  if(cart.length===0) return;
  let total=0;
  let html = cart.map(c=>{
    const p=products.find(x=>x.id===c.id); total+=p.price*c.qty;
    return `<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px"><span>${p.name} × ${c.qty}</span><span>${p.price*c.qty} ج.م</span></div>`;
  }).join('');
  html += `<div style="border-top:1px solid var(--app-border);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:800"><span>الإجمالي</span><span>${total} ج.م</span></div>`;
  document.getElementById('checkout-summary').innerHTML = html;
  showScreen('checkout');
}
function confirmOrder(){
  cart = [];
  updateCartBadge();
  showScreen('success');
}

/* ===== PRESCRIPTION / CHAT / WHATSAPP ===== */
function mockUploadRx(){
  document.getElementById('rx-box').innerHTML = '✅ تم رفع الصورة بنجاح';
  showToast('جاري إرسالها لمراجعة الصيدلي...');
  setTimeout(()=>{ showScreen('home'); showToast('تمت مراجعة الروشتة، تقدر تكمل طلبك ✅'); }, 1400);
}
function renderChat(){
  document.getElementById('chat-log').innerHTML = chatLog.map(m=>`<div class="chat-bubble ${m.who==='them'?'them':'me'}">${m.text}</div>`).join('');
}
function sendChat(){
  const input = document.getElementById('chat-input');
  const val = input.value.trim();
  if(!val) return;
  chatLog.push({who:'me',text:val});
  renderChat(); input.value='';
  setTimeout(()=>{ chatLog.push({who:'them',text:'تمام، هراجعلك المعلومة وأرد عليك حالاً ✅'}); renderChat(); }, 700);
}
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}
function openWhatsApp(){
  window.open('https://wa.me/201001234567?text=' + encodeURIComponent('مرحبًا، عندي استفسار من تطبيق صيدليتي'), '_blank');
}

/* ===== ADMIN ===== */
function adminLogin(){
  document.getElementById('admin-login-wrap').classList.add('hidden');
  document.getElementById('admin-dash-shell').classList.remove('hidden');
  renderAdminProducts(''); renderInventory(); renderHomeOrders();
}
function adminLogout(){
  document.getElementById('admin-dash-shell').classList.add('hidden');
  document.getElementById('admin-login-wrap').classList.remove('hidden');
}
function showAdminView(view){
  document.querySelectorAll('.dash-view').forEach(v=>v.classList.remove('active'));
  document.getElementById('adm-'+view).classList.add('active');
  document.querySelectorAll('.side-item[data-adm]').forEach(b=>b.classList.remove('active'));
  const btn = document.querySelector('.side-item[data-adm="'+view+'"]');
  if(btn) btn.classList.add('active');
  if(view==='products') renderAdminProducts('');
  if(view==='inventory') renderInventory();
}
const catLabel = {medicine:'دواء',cosmetic:'تجميل',care:'عناية'};
function filterAdminCategory(cat){
  adminCategoryFilter = cat;
  renderAdminProducts(document.querySelector('#adm-products input').value);
}
function renderAdminProducts(query){
  query = (query||'').toLowerCase();
  let list = products.filter(p=> (adminCategoryFilter==='all'||p.category===adminCategoryFilter) &&
    (p.name.toLowerCase().includes(query)||p.active.toLowerCase().includes(query)));
  list.sort((a,b)=>a.name.localeCompare(b.name,'ar'));
  let html = '<tr><th>المنتج</th><th>الفئة</th><th>المادة الفعالة</th><th>التركيز</th><th>السعر</th><th>المخزون</th><th>روشتة</th></tr>';
  list.forEach(p=>{
    html += `<tr><td>${p.icon} ${p.name}</td><td>${catLabel[p.category]}</td><td style="font-size:11px;color:var(--adm-text-muted)">${p.active}</td><td style="font-size:11px;color:var(--adm-text-muted)">${p.strength||'—'}</td><td>${p.price} ج.م</td><td>${p.stock}</td><td>${p.rx?'✅':'—'}</td></tr>`;
  });
  document.getElementById('admin-products-table').innerHTML = html;
}
function renderInventory(){
  let html='<tr><th>المنتج</th><th>الفئة</th><th>الكمية</th><th>الحالة</th></tr>';
  const sorted = [...products].sort((a,b)=>a.name.localeCompare(b.name,'ar'));
  sorted.forEach(p=>{
    let status = p.stock===0?'<span class="status-pill bad">نفدت</span>':p.stock<10?'<span class="status-pill warn">منخفض</span>':'<span class="status-pill ok">متوفر</span>';
    html+=`<tr><td>${p.name}</td><td>${catLabel[p.category]}</td><td>${p.stock}</td><td>${status}</td></tr>`;
  });
  document.getElementById('inventory-table').innerHTML=html;
}
function renderHomeOrders(){
  document.getElementById('home-orders-table').innerHTML = `
    <tr><th>رقم الطلب</th><th>العميل</th><th>الحالة</th></tr>
    <tr><td>#4821</td><td>مريم حسين</td><td><span class="status-pill ok">في الطريق</span></td></tr>
    <tr><td>#4822</td><td>رجب سيد</td><td><span class="status-pill warn">معلّق</span></td></tr>
    <tr><td>#4823</td><td>سارة عادل</td><td><span class="status-pill ok">تم التسليم</span></td></tr>`;
}
function setNewProdCat(cat, btn){
  newProdCat = cat;
  document.querySelectorAll('#new-prod-cat button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}
function saveNewProduct(){
  const trade = document.getElementById('np-trade').value.trim();
  const active = document.getElementById('np-active').value.trim();
  const strength = document.getElementById('np-strength').value.trim();
  const price = parseFloat(document.getElementById('np-price').value)||0;
  const stock = parseInt(document.getElementById('np-stock').value)||0;
  const rx = document.getElementById('np-rx-toggle').classList.contains('on');
  if(!trade){ alert('من فضلك اكتب اسم المنتج التجاري'); return; }
  const icon = newProdCat==='medicine'?'💊':newProdCat==='cosmetic'?'✨':'🧴';
  products.push({id: Date.now(), name:trade, active: active||'—', strength: strength||'', category:newProdCat, condition:'all', price, stock, rx, icon, desc:'منتج مضاف حديثًا'});
  document.getElementById('np-trade').value=''; document.getElementById('np-active').value='';
  document.getElementById('np-strength').value='';
  document.getElementById('np-price').value=''; document.getElementById('np-stock').value='';
  document.getElementById('np-rx-toggle').classList.remove('on');
  showAdminView('products');
  alert('تمت إضافة المنتج ونشره بنجاح ✅');
}
function approveRx(){ alert('تمت الموافقة على الروشتة، وتحويل الطلب لمرحلة التجهيز ✅'); }

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', ()=>{
  renderHome();
  const d = document.getElementById('today-date');
  if(d) d.textContent = new Date().toLocaleDateString('ar-EG', {weekday:'long', day:'numeric', month:'long'});
});
