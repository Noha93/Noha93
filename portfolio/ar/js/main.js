/* ==========================================================
   CONTENT — real data, bilingual (ar default / en)
   ========================================================== */
const ACCENT = { violet:'#7C3AED', pink:'#F059A4', green:'#10B981', amber:'#F59E0B', blue:'#0EA5E9', lime:'#A3E635', teal:'#2DD4BF', orange:'#FB923C' };

const PROJECTS = [
  { key:'b2pay', accent:ACCENT.violet, behance:true,
    media:{ type:'img', src:'../assets/img/b2pay/home.png' },
    ar:{ category:'منصة تمويل', tag:'فريق · DEPI', title:'B2Pay', tagline:'مشروع تخرج جماعي — صممت صفحتي "تواصل معنا" و"الموردين".', tags:['UI/UX','ويب','فريق DEPI'], cta:'عرض المشروع ←' },
    en:{ category:'Fintech Platform', tag:'Team · DEPI', title:'B2Pay', tagline:'Graduation team project — I designed the Contact Us & Supplier pages.', tags:['UI/UX','Web','DEPI Team'], cta:'View project →' } },
  { key:'colorhint', accent:ACCENT.blue, behance:true, dark:true,
    media:{ type:'img', src:'../assets/img/colorhint/splash.png' },
    ar:{ category:'تطبيق موبايل', tag:'مشروع فردي', title:'Color Hint', tagline:'تطبيق يساعد المستخدمين على اختيار لون الطلاء المثالي لمساحتهم.', tags:['iOS','مشروع فردي'], cta:'عرض المشروع ←' },
    en:{ category:'Mobile App', tag:'Solo Project', title:'Color Hint', tagline:'An app that helps users pick the perfect paint color for their space.', tags:['Mobile','Solo Project'], cta:'View project →' } },
  { key:'skyscript', accent:ACCENT.pink, behance:true,
    media:{ type:'video', src:'../assets/video/team-carousel.mp4' },
    ar:{ category:'حركة واجهات', tag:'فريق · Anorix', title:'Sky Script', tagline:'مشروع تخرج مع ورشة Anorix — صممت سيكشن الفريق المتحرك.', tags:['فريق Anorix','بروتوتايب'], cta:'عرض المشروع ←' },
    en:{ category:'UI Animation', tag:'Team · Anorix', title:'Sky Script', tagline:'Anorix workshop graduation project — I designed the animated Team section.', tags:['Anorix Team','Prototyping'], cta:'View project →' } },
  { key:'recycling', accent:ACCENT.green, behance:true, solid:'♻️',
    ar:{ category:'موقع بيئي', tag:'مشروع فردي', title:'صفحة إعادة التدوير', tagline:'تصميم يشجّع على الاستدامة والوعي البيئي.', tags:['ويب','مشروع فردي'], cta:'عرض المشروع ←' },
    en:{ category:'Eco Landing Page', tag:'Solo Project', title:'Recycling Landing Page', tagline:'Design encouraging sustainability and environmental awareness.', tags:['Web','Solo Project'], cta:'View project →' } },
  { key:'audiobooks', accent:ACCENT.amber, behance:true, solid:'🎧',
    ar:{ category:'موقع كتب صوتية', tag:'مشروع فردي', title:'صفحة الكتب الصوتية', tagline:'تجربة قراءة رقمية نظيفة وعصرية.', tags:['ويب','مشروع فردي'], cta:'عرض المشروع ←' },
    en:{ category:'Audiobooks Platform', tag:'Solo Project', title:'Audiobooks Landing Page', tagline:'A clean, modern digital reading experience.', tags:['Web','Solo Project'], cta:'View project →' } },
  { key:'gamil', accent:ACCENT.lime, behance:true,
    media:{ type:'img', src:'../assets/img/jameel/cover.jpg' },
    ar:{ category:'متجر أزياء', tag:'مشروع فردي', title:'جميل (Gamil)', tagline:'دراسة حالة كاملة — بحث، نظام تصميم، ولوحة تحكم إدارية.', tags:['UX/UI','مشروع فردي'], cta:'عرض المشروع ←' },
    en:{ category:'Fashion E-commerce', tag:'Solo Project', title:'Gamil (جميل)', tagline:'Full case study — research, design system, and admin dashboard.', tags:['UX/UI','Solo Project'], cta:'View project →' } },
  { key:'lite', accent:ACCENT.teal, pending:true, solid:'⚡',
    ar:{ category:'موقع شركة برمجيات', tag:'', title:'Lite', tagline:'قيد التصميم حاليًا — دراسة الحالة الكاملة قريبًا.', tags:[], pendingLabel:'قيد التنفيذ' },
    en:{ category:'Software Company Site', tag:'', title:'Lite', tagline:"Currently in progress — full case study coming soon.", tags:[], pendingLabel:'Work in progress' } },
  { key:'emergency', accent:ACCENT.orange, pending:true, solid:'🚑',
    ar:{ category:'تطبيق موبايل', tag:'', title:'أرقام الطوارئ', tagline:'تطبيق لأرقام الطوارئ في مصر.', tags:[], pendingLabel:'الصور قريبًا' },
    en:{ category:'Mobile App', tag:'', title:'Emergency Numbers', tagline:'A mobile app for emergency numbers in Egypt.', tags:[], pendingLabel:'Screenshots coming soon' } },
];

const CONTENT = {
  ar: {
    dir:'rtl', lang:'ar', langBtn:'English',
    nav:{ links:[['أعمالي','#work'],['عني','#about'],['منهجيتي','#process'],['تواصل','#contact']], cta:'تعاون معي' },
    hero:{ badge:'متاحة لمشاريع جديدة', l1:'أُصمِّم', grad:'تجارب رقمية', em:'لا تُنسى.',
      desc:'مصممة UI/UX انتقلت من عالم الصيدلة والتغذية الإكلينيكية إلى تصميم الواجهات عبر برنامج DEPI — أبني تجارب واضحة وجذابة للتطبيقات والمواقع، من الفكرة حتى التسليم.',
      btnWork:'شاهد أعمالي ←', btnContact:'تواصل معي', cue:'انزل',
      stats:[ {n:'٦+',l:'مشاريع مصممة'}, {n:'٣',l:'برامج تدريبية'}, {n:'٢',l:'مشاريع جماعية'}, {n:'٢٠٢٥',l:'خريجة DEPI'} ] },
    marquee:['Figma','Photoshop','Illustrator','Sketch','HTML5','CSS3','تصميم واجهات','تجربة المستخدم','النماذج الأولية','هوية بصرية'],
    about:{ eyebrow:'/ عني', titleA:'تصميم يتواصل مع الناس،', titleB:'لا يُبهر فحسب.',
      p1:'أنا نهى — مصممة UI/UX جئت من خلفية مختلفة: بكالوريوس صيدلة، ودبلومتا تغذية إكلينيكية وصيدلة إكلينيكية. انتقلت إلى عالم التصميم عبر برنامج رواد مصر الرقمية (DEPI)، وأعمل على Figma وPhotoshop وIllustrator وSketch.',
      p2:'كل مشروع يبدأ بفهم المستخدم الحقيقي، وينتهي بتجربة بصرية واضحة تخدم هدف العمل. أتقن العربية والإنجليزية بطلاقة، وأقدّر العمل الجماعي والتواصل الواضح.',
      tools:[{icon:'🎨',name:'Figma'},{icon:'🖌️',name:'Photoshop'},{icon:'✒️',name:'Illustrator'},{icon:'✏️',name:'Sketch'}],
      stats:[{n:6,suf:'+',l:'مشاريع مصممة'},{n:3,suf:'',l:'برامج تدريبية'},{n:2,suf:'',l:'مشاريع جماعية'},{n:3,suf:'',l:'مؤهلات دراسية'}],
      cardName:'نهى أبو يوسف', cardRole:'مصممة UI/UX · مصر',
      floatNum:'٢٠٢٥', floatLabel:'سنة التخرج من DEPI', floatNum2:'من الصيدلة', floatLabel2:'إلى تصميم الواجهات' },
    work:{ eyebrow:'/ أعمال مختارة', titleA:'مشاريع', titleB:'من الفكرة للتسليم.', hint:'اسحب للاستكشاف', arrow:'←' },
    mockups:{ eyebrow:'/ نماذج من أعمالي', titleA:'مُصمَّم بشغف', titleB:'حقيقي.',
      phone:{ greetSub:'مرحبًا،', greetName:'لنختر لونًا ✦', pickedLabel:'اللون المختار', pickedName:'بنفسجي عميق', pickedHex:'#7C3AED',
        stats:[{icon:'🎨',val:'٢٤',label:'لوح ألوان'},{icon:'❤️',val:'١٢',label:'محفوظ'},{icon:'📸',val:'٨',label:'مسح'}],
        weekly:'النشاط الأسبوعي', days:['ح','ن','ث','ر','خ','ج','س'], captionName:'Color Hint', captionSub:'تطبيق موبايل · اختيار الألوان' },
      browser:{ url:'gamil.design', navCta:'تسوّقي الآن', navLinks:['المجموعة','عن العلامة','تواصل'], brand:'جميل',
        eyebrow:'مجموعة ٢٠٢٥', h2a:'أناقة', h2b:'تُلبس.', heroP:'أزياء نسائية عصرية بلمسة بسيطة وحضور مميز.', ctaPink:'تسوّقي ←', ctaGhost:'لوك بوك',
        productsLabel:'القطع المميزة',
        products:[{name:'فستان صيفي',price:'٩٥٠ ج.م',tag:'جديد',emoji:'👗'},{name:'عباءة أنيقة',price:'١٢٥٠ ج.م',tag:'الأكثر مبيعًا',emoji:'🥻'},{name:'حقيبة يد',price:'٦٨٠ ج.م',tag:'',emoji:'👜'}],
        captionName:'Gamil (جميل)', captionSub:'موقع إلكتروني · متجر أزياء' },
      dash:{ headTitle:'نظرة عامة', headSub:'آخر ٣٠ يومًا', range:['٣٠ي','٩٠ي','سنة'],
        kpis:[{l:'الفواتير المدفوعة',v:'٤,٦٣٧',d:'+١٨٪',c:ACCENT.violet,up:true},{l:'الموردون النشطون',v:'٣٢٤',d:'+٦٪',c:ACCENT.green,up:true},{l:'متوسط وقت السداد',v:'يومان',d:'-١٢٪',c:ACCENT.amber,up:false},{l:'معدل الرضا',v:'٩٦٪',d:'+٤٪',c:ACCENT.pink,up:true}],
        panelBadge:'+١٢٪', panelTitle:'اتجاه المدفوعات', panelSub:'الحجم الشهري المصروف',
        sourcesTitle:'أبرز مصادر الموردين',
        sources:[{src:'موردون مباشرون',pct:44,c:ACCENT.violet},{src:'شركاء',pct:30,c:ACCENT.green},{src:'إحالات',pct:16,c:ACCENT.pink},{src:'أخرى',pct:10,c:ACCENT.amber}],
        sidebarBrand:'B2Pay', nav:[{icon:'◉',label:'نظرة عامة',a:true},{icon:'◈',label:'الفواتير',a:false},{icon:'◎',label:'الموردون',a:false},{icon:'◇',label:'التقارير',a:false},{icon:'◻',label:'الإعدادات',a:false}],
        revenueLabel:'إجمالي المدفوعات الشهرية', revenueVal:'٣١٢ ألف ج.م', revenueDelta:'↑ ١٢٪ هذا الشهر',
        captionName:'B2Pay', captionSub:'منصة تمويل سلسلة التوريد · لوحة تحكم' } },
    process:{ eyebrow:'/ المنهجية', titleA:'كيف يُصنع التصميم', titleB:'الجيد.',
      steps:[
        { n:'٠١', title:'البحث والاستكشاف', desc:'فهم عميق لاحتياجات المستخدم وأهداف المشروع قبل رسم أي شاشة.', tools:['مقابلات المستخدمين','تحليل تنافسي','استبيانات'], icon:'🔍', color:ACCENT.violet },
        { n:'٠٢', title:'التحديد والهيكلة', desc:'تحويل البحث إلى تدفقات مستخدم واضحة وهيكل معلومات منطقي.', tools:['خرائط الرحلة','هيكلة المعلومات','قصص المستخدم'], icon:'🗺️', color:ACCENT.pink },
        { n:'٠٣', title:'التصميم والنمذجة', desc:'من الرسوم الأولية إلى نماذج عالية الدقة بنماذج أولية تفاعلية.', tools:['Figma','Photoshop','Illustrator','Sketch'], icon:'✦', color:ACCENT.green },
        { n:'٠٤', title:'المراجعة والتسليم', desc:'مراجعة مع الفريق، تكرار سريع، وتسليم جاهز للمطورين.', tools:['اختبار قابلية الاستخدام','مراجعة الفريق','تسليم للمطورين'], icon:'◎', color:ACCENT.amber },
      ] },
    journey:{ eyebrow:'/ رحلتي التدريبية',
      items:[
        { program:'برنامج رواد مصر الرقمية (DEPI)', text:'برنامج مكثف لمدة ٦ أشهر تحت مظلة وزارة الاتصالات وتكنولوجيا المعلومات — تعلمت أساسيات UI/UX من بحث المستخدم للنماذج الأولية، مع تطبيق عملي في Photoshop وXD وFigma.', role:'يونيو – ديسمبر ٢٠٢٥ · تصميم UI/UX', badge:'🎓', color:ACCENT.violet },
        { program:'برنامج سفراء مصر المستدامة للذكاء الاصطناعي', text:'برنامج تدريبي مع المعهد القومي للاتصالات (NTI) ركّز على التنمية المستدامة والذكاء الاصطناعي.', role:'أبريل – يونيو ٢٠٢٥ · NTI مصر', badge:'🌱', color:ACCENT.green },
        { program:'ورشة تصميم UI/UX — Anorix', text:'ورشة عملية لمدة شهر بالتعاون مع Anorix، عزّزت خلالها سير العمل التصميمي عبر الإرشاد والمراجعة وحل المشكلات الجماعي — صممت خلالها سيكشن الفريق المتحرك لمشروع Sky Script.', role:'شهر واحد · بإشراف م. رحمة أحمد', badge:'🛠️', color:ACCENT.pink },
      ] },
    contact:{ eyebrow:'/ لنعمل معًا', titleA:'عندك مشروع', titleB:'في ذهنك؟',
      desc:'أقبل عددًا محدودًا من المشاريع كل ربع سنة. لو بتبني حاجة تستحق الاهتمام، يسعدني أسمعك.',
      send:'راسليني ←', placeholder:'بريدك الإلكتروني',
      socials:[{l:'Behance',icon:'◈',href:'https://www.behance.net/nohaaboyoussef'},{l:'LinkedIn',icon:'◉',href:'https://www.linkedin.com/in/noha-mohamed-8ba65b378'}] },
    footer:{ note:'© 2026 نهى أبو يوسف · مُصمَّم بشغف', loc:'مصر' },
  },
  en: {
    dir:'ltr', lang:'en', langBtn:'العربية',
    nav:{ links:[['Work','#work'],['About','#about'],['Process','#process'],['Contact','#contact']], cta:'Work with me' },
    hero:{ badge:'Available for new projects', l1:'I design', grad:'digital experiences', em:'worth remembering.',
      desc:"A UI/UX designer who transitioned from pharmacy and clinical nutrition into interface design through Egypt's DEPI program — building clear, engaging experiences for apps and websites, from idea to handoff.",
      btnWork:'See my work →', btnContact:'Get in touch', cue:'Scroll',
      stats:[ {n:'6+',l:'Projects designed'}, {n:'3',l:'Training programs'}, {n:'2',l:'Team capstones'}, {n:'2025',l:'DEPI graduate'} ] },
    marquee:['Figma','Photoshop','Illustrator','Sketch','HTML5','CSS3','UI Design','UX Research','Prototyping','Branding'],
    about:{ eyebrow:'/ About', titleA:'Design that connects with people,', titleB:'not just impresses.',
      p1:"I'm Noha — a UI/UX designer with a bit of a different background: a Bachelor's in Pharmaceutical Industry, plus diplomas in Clinical Nutrition and Clinical Pharmacy. I moved into design through Egypt's Digital Pioneers Initiative (DEPI), working across Figma, Photoshop, Illustrator, and Sketch.",
      p2:'Every project starts with understanding the real user and ends with a clear visual experience that serves the business goal. Fluent in Arabic and English, I value teamwork and clear communication.',
      tools:[{icon:'🎨',name:'Figma'},{icon:'🖌️',name:'Photoshop'},{icon:'✒️',name:'Illustrator'},{icon:'✏️',name:'Sketch'}],
      stats:[{n:6,suf:'+',l:'Projects designed'},{n:3,suf:'',l:'Training programs'},{n:2,suf:'',l:'Team capstones'},{n:3,suf:'',l:'Academic degrees'}],
      cardName:'Noha Aboyoussef', cardRole:'UI/UX Designer · Egypt',
      floatNum:'2025', floatLabel:'DEPI graduate', floatNum2:'Pharmacy', floatLabel2:'→ UI/UX Design' },
    work:{ eyebrow:'/ Selected Work', titleA:'Projects,', titleB:'from idea to handoff.', hint:'Drag to explore', arrow:'→' },
    mockups:{ eyebrow:'/ Work Showcase', titleA:'Designed with real', titleB:'passion.',
      phone:{ greetSub:'Hi,', greetName:'Pick a color ✦', pickedLabel:'Selected Color', pickedName:'Deep Violet', pickedHex:'#7C3AED',
        stats:[{icon:'🎨',val:'24',label:'Palettes'},{icon:'❤️',val:'12',label:'Saved'},{icon:'📸',val:'8',label:'Scans'}],
        weekly:'Weekly Activity', days:['S','M','T','W','T','F','S'], captionName:'Color Hint', captionSub:'Mobile App · Color Selector' },
      browser:{ url:'gamil.design', navCta:'Shop Now', navLinks:['Collection','About','Contact'], brand:'Gamil',
        eyebrow:'2025 Collection', h2a:'Elegance', h2b:'you wear.', heroP:'Modern womenswear with a simple touch and standout presence.', ctaPink:'Shop →', ctaGhost:'Lookbook',
        productsLabel:'Featured Pieces',
        products:[{name:'Summer Dress',price:'EGP 950',tag:'New',emoji:'👗'},{name:'Elegant Abaya',price:'EGP 1,250',tag:'Best Seller',emoji:'🥻'},{name:'Handbag',price:'EGP 680',tag:'',emoji:'👜'}],
        captionName:'Gamil (جميل)', captionSub:'Website · Fashion Store' },
      dash:{ headTitle:'Overview', headSub:'Last 30 days', range:['30D','90D','Year'],
        kpis:[{l:'Invoices Paid',v:'4,637',d:'+18%',c:ACCENT.violet,up:true},{l:'Active Suppliers',v:'324',d:'+6%',c:ACCENT.green,up:true},{l:'Avg. Payout Time',v:'2 days',d:'-12%',c:ACCENT.amber,up:false},{l:'Satisfaction',v:'96%',d:'+4%',c:ACCENT.pink,up:true}],
        panelBadge:'+12%', panelTitle:'Payments Trend', panelSub:'Monthly disbursed volume',
        sourcesTitle:'Top Supplier Sources',
        sources:[{src:'Direct suppliers',pct:44,c:ACCENT.violet},{src:'Partners',pct:30,c:ACCENT.green},{src:'Referrals',pct:16,c:ACCENT.pink},{src:'Other',pct:10,c:ACCENT.amber}],
        sidebarBrand:'B2Pay', nav:[{icon:'◉',label:'Overview',a:true},{icon:'◈',label:'Invoices',a:false},{icon:'◎',label:'Suppliers',a:false},{icon:'◇',label:'Reports',a:false},{icon:'◻',label:'Settings',a:false}],
        revenueLabel:'Total Monthly Disbursed', revenueVal:'EGP 312K', revenueDelta:'↑ 12% this month',
        captionName:'B2Pay', captionSub:'Supply Chain Finance · Dashboard' } },
    process:{ eyebrow:'/ Methodology', titleA:'How great design', titleB:'gets made.',
      steps:[
        { n:'01', title:'Research & Discovery', desc:'Deep understanding of user needs and project goals before drawing a single screen.', tools:['User interviews','Competitive analysis','Surveys'], icon:'🔍', color:ACCENT.violet },
        { n:'02', title:'Define & Structure', desc:'Turning research into clear user flows and a logical information structure.', tools:['Journey maps','Information architecture','User stories'], icon:'🗺️', color:ACCENT.pink },
        { n:'03', title:'Design & Prototype', desc:'From early sketches to high-fidelity, fully interactive prototypes.', tools:['Figma','Photoshop','Illustrator','Sketch'], icon:'✦', color:ACCENT.green },
        { n:'04', title:'Review & Handoff', desc:'Team review, quick iteration, and a handoff developers can build from.', tools:['Usability testing','Team review','Developer handoff'], icon:'◎', color:ACCENT.amber },
      ] },
    journey:{ eyebrow:'/ My Training Journey',
      items:[
        { program:'Digital Egypt Pioneers Initiative (DEPI)', text:"A 6-month intensive program under Egypt's Ministry of Communications and Information Technology — I learned core UI/UX principles from user research to prototyping, with hands-on practice in Photoshop, XD, and Figma.", role:'Jun – Dec 2025 · UI/UX Design', badge:'🎓', color:ACCENT.violet },
        { program:'Sustainable Egypt AI Ambassadors Program', text:"A training program with Egypt's National Telecommunication Institute (NTI), focused on sustainable development and artificial intelligence.", role:'Apr – Jun 2025 · NTI, Egypt', badge:'🌱', color:ACCENT.green },
        { program:'UI/UX Design Workshop — Anorix', text:'A one-month hands-on workshop with Anorix, strengthening my design workflow through mentorship, critique, and collaborative problem solving — I designed the animated Team section for the Sky Script project.', role:'1 month · mentored by Eng. Rahma Ahmed', badge:'🛠️', color:ACCENT.pink },
      ] },
    contact:{ eyebrow:"/ Let's work together", titleA:'Got a project', titleB:'in mind?',
      desc:"I take on a limited number of projects each quarter. If you're building something worth caring about, I'd love to hear from you.",
      send:'Email me →', placeholder:'Your email',
      socials:[{l:'Behance',icon:'◈',href:'https://www.behance.net/nohaaboyoussef'},{l:'LinkedIn',icon:'◉',href:'https://www.linkedin.com/in/noha-mohamed-8ba65b378'}] },
    footer:{ note:'© 2026 Noha Aboyoussef · Designed with passion', loc:'Egypt' },
  },
};

let LANG = 'ar';

/* ==========================================================
   HELPERS
   ========================================================== */
function el(tag, className, html){ const e=document.createElement(tag); if(className) e.className=className; if(html!==undefined) e.innerHTML=html; return e; }
function clear(node){ while(node.firstChild) node.removeChild(node.firstChild); }
function setRevealSide(selector, side){
  const node = document.querySelector(selector);
  if (!node) return;
  node.classList.remove('reveal-left','reveal-right');
  node.classList.add(side);
}

/* ==========================================================
   RENDER
   ========================================================== */
function render(lang){
  LANG = lang;
  const C = CONTENT[lang];
  document.documentElement.lang = C.lang;
  document.documentElement.dir = C.dir;

  /* Reveal-in direction: these two-column rows mirror with dir (grid auto-flips
     start/end), so the "enter from screen-right" vs "enter from screen-left"
     class has to follow which physical side each element actually lands on —
     it can't stay hardcoded like the rest of the markup. */
  const ar = lang === 'ar';
  setRevealSide('.about__visual', ar ? 'reveal-right' : 'reveal-left');
  setRevealSide('#phoneMockup', ar ? 'reveal-right' : 'reveal-left');
  setRevealSide('#browserMockup', ar ? 'reveal-left' : 'reveal-right');

  renderNav(C);
  renderHero(C);
  renderMarquee(C);
  renderAbout(C);
  renderWork(C);
  renderMockups(C);
  renderProcess(C);
  renderJourney(C);
  renderContact(C);
  renderFooter(C);

  initScrollReveal();
  initHeroStatsReveal();
}

function renderNav(C){
  const links = document.getElementById('navLinks');
  clear(links);
  C.nav.links.forEach(([label,href])=>{ const a=el('a',null,label); a.href=href; links.appendChild(a); });
  document.getElementById('navCta').textContent = C.nav.cta;
  document.getElementById('langToggle').textContent = C.langBtn;

  const mobile = document.getElementById('navMobile');
  clear(mobile);
  C.nav.links.forEach(([label,href])=>{ const a=el('a',null,label); a.href=href; a.addEventListener('click',()=>mobile.classList.remove('open')); mobile.appendChild(a); });
  const cta = el('a',null,C.nav.cta); cta.href='#contact'; cta.addEventListener('click',()=>mobile.classList.remove('open')); mobile.appendChild(cta);
}

function renderHero(C){
  const h = C.hero;
  document.getElementById('heroBadge').textContent = h.badge;
  document.getElementById('heroTitle').innerHTML = `${h.l1}<br><span class="grad">${h.grad}</span><br><em>${h.em}</em>`;
  document.getElementById('heroDesc').textContent = h.desc;
  document.getElementById('heroBtnWork').textContent = h.btnWork;
  document.getElementById('heroBtnContact').textContent = h.btnContact;
  document.getElementById('heroCue').textContent = h.cue;

  const stats = document.getElementById('heroStats');
  clear(stats);
  h.stats.forEach(s=>{
    const card = el('div','hero__stat');
    card.appendChild(el('div','hero__stat-n',s.n));
    card.appendChild(el('div','hero__stat-l',s.l));
    stats.appendChild(card);
  });
}

function renderMarquee(C){
  const track = document.getElementById('marqueeTrack');
  clear(track);
  const doubled = [...C.marquee, ...C.marquee];
  doubled.forEach(s=>{
    const item = el('div','marquee__item');
    item.appendChild(el('span',null,s));
    item.appendChild(el('em',null,'◆'));
    track.appendChild(item);
  });
}

function renderAbout(C){
  const a = C.about;
  document.getElementById('aboutEyebrow').textContent = a.eyebrow;
  document.getElementById('aboutTitle').innerHTML = `${a.titleA}<br><span>${a.titleB}</span>`;
  document.getElementById('aboutP1').textContent = a.p1;
  document.getElementById('aboutP2').textContent = a.p2;
  document.getElementById('aboutCardName').textContent = a.cardName;
  document.getElementById('aboutCardRole').textContent = a.cardRole;
  document.getElementById('aboutFloatNum').textContent = a.floatNum;
  document.getElementById('aboutFloatLabel').textContent = a.floatLabel;
  document.getElementById('aboutFloatNum2').textContent = a.floatNum2;
  document.getElementById('aboutFloatLabel2').textContent = a.floatLabel2;

  const tools = document.getElementById('aboutTools');
  clear(tools);
  a.tools.forEach(t=>{
    const chip = el('span','about__tool');
    chip.innerHTML = `<span>${t.icon}</span>${t.name}`;
    tools.appendChild(chip);
  });

  const stats = document.getElementById('aboutStats');
  clear(stats);
  a.stats.forEach(s=>{
    const box = el('div','about__stat');
    box.appendChild(el('div','about__stat-n stat-count','0'+s.suf));
    box.lastChild.dataset.target = s.n;
    box.lastChild.dataset.suffix = s.suf;
    box.appendChild(el('div','about__stat-l',s.l));
    stats.appendChild(box);
  });
  aboutCounted = false;
}
let aboutCounted = false;

function renderWork(C){
  document.getElementById('workEyebrow').textContent = C.work.eyebrow;
  document.getElementById('workTitle').innerHTML = `${C.work.titleA}<br><span>${C.work.titleB}</span>`;
  document.getElementById('workHint').innerHTML = `${C.work.hint}<br><em>${C.work.arrow}</em>`;

  const carousel = document.getElementById('workCarousel');
  clear(carousel);
  PROJECTS.forEach(p=>{
    const d = p[LANG];
    const card = el('div','pcard'); card.dataset.card='';

    if (p.media && p.media.type === 'img'){
      const img = el('img', p.dark ? 'pcard__media pcard__media--contain' : 'pcard__media');
      img.src = p.media.src; img.alt = d.title; img.loading='lazy';
      card.appendChild(img);
    } else if (p.media && p.media.type === 'video'){
      const v = document.createElement('video');
      v.className='pcard__media'; v.autoplay=true; v.muted=true; v.loop=true; v.playsInline=true; v.src=p.media.src;
      card.appendChild(v);
    } else if (p.solid){
      const bg = el('div','pcard__media'); bg.style.background = `linear-gradient(160deg, ${p.accent}, #0f0f1a)`;
      bg.style.display='flex'; bg.style.alignItems='center'; bg.style.justifyContent='center'; bg.style.fontSize='72px'; bg.style.opacity='.9';
      bg.textContent = p.solid;
      card.appendChild(bg);
    }

    card.appendChild(el('div','pcard__scrim'));

    const cat = el('span','pcard__cat', d.category);
    cat.style.background = `${p.accent}20`; cat.style.border = `1px solid ${p.accent}40`; cat.style.color = p.accent;
    card.appendChild(cat);

    if (p.pending){
      card.appendChild(el('span','pcard__pending', d.pendingLabel));
    } else if (d.tag) {
      const teamTag = el('span','pcard__year', d.tag);
      card.appendChild(teamTag);
    }

    const body = el('div','pcard__body');
    body.appendChild(el('h3','pcard__title', d.title));
    body.appendChild(el('p','pcard__tagline', d.tagline));
    const tagsWrap = el('div','pcard__tags');
    (d.tags||[]).forEach(t=> tagsWrap.appendChild(el('span','pcard__tag',t)));
    body.appendChild(tagsWrap);

    if (!p.pending && p.behance){
      const ctaWrap = el('div','pcard__cta-wrap');
      const cta = el('span','pcard__cta', d.cta);
      cta.style.background = p.accent;
      ctaWrap.appendChild(cta);
      body.appendChild(ctaWrap);
      card.style.cursor='pointer';
      card.addEventListener('click', ()=> window.open('https://www.behance.net/nohaaboyoussef','_blank','noopener'));
    }

    card.appendChild(body);
    carousel.appendChild(card);
  });

  const dots = document.getElementById('workDots');
  clear(dots);
  PROJECTS.forEach((_,i)=>{
    const dot = el('button','work__dot'); dot.type='button';
    if (i===0) dot.classList.add('active');
    dot.addEventListener('click', ()=>{
      const cards = carousel.querySelectorAll('[data-card]');
      cards[i].scrollIntoView({behavior:'smooth', block:'nearest', inline: LANG==='ar' ? 'end' : 'start'});
    });
    dots.appendChild(dot);
  });

  initCarouselInteractions(carousel, dots);
}

function renderMockups(C){
  const m = C.mockups;
  document.getElementById('mockupsEyebrow').textContent = m.eyebrow;
  document.getElementById('mockupsTitle').innerHTML = `${m.titleA} <span>${m.titleB}</span>`;
  renderPhoneMockup(m.phone);
  renderBrowserMockup(m.browser);
  renderDashboardMockup(m.dash);
}

function renderPhoneMockup(p){
  const host = document.getElementById('phoneMockup');
  clear(host);
  const wrap = el('div','mock mock--phone');
  const screen = el('div','phone-screen');

  const topbar = el('div','phone-topbar');
  topbar.innerHTML = `<span>9:41</span><div style="width:76px;height:19px;background:#111;border-radius:9px;border:1px solid #1f1f2a"></div><span style="font-size:11px">🔋📶</span>`;
  screen.appendChild(topbar);

  const body = el('div','phone-body');
  const greet = el('div','phone-greet');
  greet.innerHTML = `<div class="phone-greet-icon">🎨</div><div style="text-align:${LANG==='ar'?'right':'left'}"><div class="phone-greet-sub">${p.greetSub}</div><div style="font-size:16px;font-weight:800">${p.greetName}</div></div>`;
  body.appendChild(greet);

  const swatchColors = [ACCENT.violet, ACCENT.pink, ACCENT.blue, ACCENT.green, ACCENT.amber];
  const swatches = el('div','phone-swatches');
  swatchColors.forEach((c,i)=>{
    const sw = el('div','phone-swatch'+(i===0?' active':'')); sw.style.background = c;
    swatches.appendChild(sw);
  });
  body.appendChild(swatches);

  const picked = el('div','phone-picked');
  picked.innerHTML = `<div class="phone-picked-label">${p.pickedLabel}</div><div class="phone-picked-name">${p.pickedName}</div><div class="phone-picked-hex">${p.pickedHex}</div>`;
  body.appendChild(picked);

  const stats = el('div','phone-stats');
  p.stats.forEach(s=>{
    const box = el('div','phone-stat');
    box.innerHTML = `<div class="phone-stat-icon">${s.icon}</div><div class="phone-stat-val">${s.val}</div><div class="phone-stat-label">${s.label}</div>`;
    stats.appendChild(box);
  });
  body.appendChild(stats);

  const weekly = el('div','',''); weekly.style.background='rgba(255,255,255,.028)'; weekly.style.borderRadius='14px'; weekly.style.padding='11px 13px';
  weekly.innerHTML = `<div style="font-size:9px;color:rgba(240,238,248,.38);margin-bottom:9px;text-transform:uppercase;letter-spacing:.08em">${p.weekly}</div>`;
  const bars = el('div',''); bars.style.display='flex'; bars.style.gap='4px'; bars.style.alignItems='flex-end'; bars.style.height='44px';
  [0.58,0.82,0.44,0.88,0.72,0.52,0.76].forEach((h,i)=>{
    const bar = el('div',''); bar.style.flex='1'; bar.style.borderRadius='3px'; bar.style.height=(h*100)+'%';
    bar.style.background = i===4 ? ACCENT.violet : 'rgba(124,58,237,.22)';
    bars.appendChild(bar);
  });
  weekly.appendChild(bars);
  const dayRow = el('div',''); dayRow.style.display='flex'; dayRow.style.justifyContent='space-between'; dayRow.style.marginTop='5px';
  p.days.forEach((d,i)=>{ const s=el('span',null,d); s.style.fontSize='8.5px'; s.style.flex='1'; s.style.textAlign='center'; s.style.color = i===4?'#A78BFA':'rgba(240,238,248,.22)'; dayRow.appendChild(s); });
  weekly.appendChild(dayRow);
  body.appendChild(weekly);

  const nav = el('div','phone-nav');
  ['🏠','🎨','📸','👤'].forEach((icon,i)=>{ const d=el('div',null,icon); if(i===0){ d.style.background='rgba(124,58,237,.2)'; } nav.appendChild(d); });
  body.appendChild(nav);

  screen.appendChild(body);
  wrap.appendChild(screen);
  const caption = el('div','mock__caption');
  caption.innerHTML = `<div class="mock__caption-name">${p.captionName}</div><div class="mock__caption-sub">${p.captionSub}</div>`;
  wrap.appendChild(caption);
  host.appendChild(wrap);
}

function renderBrowserMockup(b){
  const host = document.getElementById('browserMockup');
  clear(host);
  const wrap = el('div','mock mock--browser');
  const chrome = el('div','browser-chrome');

  const bar = el('div','browser-bar');
  const dots = el('div','browser-dots');
  ['#FF5F56','#FFBD2E','#27C93F'].forEach(c=>{ const d=el('span'); d.style.background=c; dots.appendChild(d); });
  bar.appendChild(dots);
  const url = el('div','browser-url'); url.innerHTML = `<span>🔒</span><span>${b.url}</span>`;
  bar.appendChild(url);
  chrome.appendChild(bar);

  const siteWrap = el('div',''); siteWrap.style.background='#0a0a10';
  const nav = el('div','browser-nav');
  const navCta = el('div','browser-nav-cta', b.navCta);
  const navLinks = el('div','browser-nav-links');
  b.navLinks.forEach(n=> navLinks.appendChild(el('span',null,n)));
  const brand = el('span','browser-brand', b.brand);
  nav.appendChild(navCta); nav.appendChild(navLinks); nav.appendChild(brand);
  siteWrap.appendChild(nav);

  const hero = el('div','browser-hero');
  const text = el('div','browser-hero-text');
  text.innerHTML = `<div class="browser-eyebrow">${b.eyebrow}</div><h2 class="browser-h2">${b.h2a}<br><span>${b.h2b}</span></h2><p class="browser-hero-p">${b.heroP}</p>
    <div class="browser-hero-btns"><div class="browser-hero-btn browser-hero-btn--pink">${b.ctaPink}</div><div class="browser-hero-btn browser-hero-btn--ghost">${b.ctaGhost}</div></div>`;
  hero.appendChild(text);
  const img = el('div','browser-hero-img','👗');
  hero.appendChild(img);
  siteWrap.appendChild(hero);

  const products = el('div','browser-products');
  products.appendChild(el('div','browser-products-label', b.productsLabel));
  const grid = el('div','browser-products-grid');
  b.products.forEach(p=>{
    const card = el('div','browser-product');
    const imgBox = el('div','browser-product-img', p.emoji);
    imgBox.style.background = 'linear-gradient(135deg,#1a0d2e,#1a1a2e)';
    if (p.tag) imgBox.appendChild(el('div','browser-product-tag', p.tag));
    card.appendChild(imgBox);
    const info = el('div','browser-product-info');
    info.innerHTML = `<div class="browser-product-name">${p.name}</div><div class="browser-product-price">${p.price}</div>`;
    card.appendChild(info);
    grid.appendChild(card);
  });
  products.appendChild(grid);
  siteWrap.appendChild(products);

  chrome.appendChild(siteWrap);
  wrap.appendChild(chrome);
  const caption = el('div','mock__caption');
  caption.innerHTML = `<div class="mock__caption-name">${b.captionName}</div><div class="mock__caption-sub">${b.captionSub}</div>`;
  wrap.appendChild(caption);
  host.appendChild(wrap);
}

function renderDashboardMockup(d){
  const host = document.getElementById('dashboardMockup');
  clear(host);
  const wrap = el('div','mock mock--dash');
  const shell = el('div','dash-shell');

  const main = el('div','dash-main');
  const head = el('div','dash-head');
  const title = el('div',''); title.innerHTML = `<div class="dash-head-title">${d.headTitle}</div><div class="dash-head-sub">${d.headSub}</div>`;
  const range = el('div','dash-range');
  d.range.forEach((r,i)=>{ const s=el('span',null,r); if(i===0){ s.style.background='rgba(16,185,129,.14)'; s.style.color=ACCENT.green; s.style.border='1px solid rgba(16,185,129,.2)'; } else { s.style.color='rgba(240,238,248,.32)'; } range.appendChild(s); });
  head.appendChild(title); head.appendChild(range);
  main.appendChild(head);

  const kpis = el('div','dash-kpis');
  d.kpis.forEach(k=>{
    const box = el('div','dash-kpi');
    box.innerHTML = `<div class="dash-kpi-label">${k.l}</div><div class="dash-kpi-val">${k.v}</div>
      <div class="dash-kpi-delta"><span style="color:${k.up?ACCENT.green:ACCENT.pink}">${k.d}</span></div>`;
    kpis.appendChild(box);
  });
  main.appendChild(kpis);

  const panels = el('div','dash-panels');
  const trend = el('div','dash-panel');
  const chartPts=[[0,72],[60,52],[120,62],[180,36],[240,52],[300,28],[360,40],[420,18],[480,30],[540,12]];
  const linePath = chartPts.map((p,i)=>`${i===0?'M':'L'} ${p[0]} ${p[1]}`).join(' ');
  const areaPath = linePath + ' L 540 100 L 0 100 Z';
  trend.innerHTML = `<div class="dash-panel-head"><div class="dash-panel-badge">${d.panelBadge}</div><div><div class="dash-panel-title">${d.panelTitle}</div><div class="dash-panel-sub">${d.panelSub}</div></div></div>
    <svg width="100%" height="72" viewBox="0 0 540 100" preserveAspectRatio="none">
      <defs><linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${ACCENT.green}" stop-opacity="0.28"/><stop offset="100%" stop-color="${ACCENT.green}" stop-opacity="0"/></linearGradient></defs>
      <path d="${areaPath}" fill="url(#cg2)"/><path d="${linePath}" fill="none" stroke="${ACCENT.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="480" cy="30" r="4" fill="${ACCENT.green}"/><circle cx="480" cy="30" r="9" fill="rgba(16,185,129,.18)"/>
    </svg>`;
  panels.appendChild(trend);

  const sources = el('div','dash-panel');
  sources.appendChild(el('div','dash-panel-title', d.sourcesTitle));
  const srcList = el('div',''); srcList.style.marginTop='14px';
  d.sources.forEach(s=>{
    const row = el('div','dash-source-row');
    row.innerHTML = `<div class="dash-source-top"><span>${s.pct}%</span><span style="color:rgba(240,238,248,.45)">${s.src}</span></div>
      <div class="dash-source-bar"><div class="dash-source-fill" style="width:${s.pct}%;background:${s.c}"></div></div>`;
    srcList.appendChild(row);
  });
  sources.appendChild(srcList);
  panels.appendChild(sources);
  main.appendChild(panels);
  shell.appendChild(main);

  const sidebar = el('div','dash-sidebar');
  sidebar.appendChild(el('div','dash-brand', d.sidebarBrand));
  d.nav.forEach(item=>{
    const row = el('div','dash-nav-item'+(item.a?' active':''));
    row.innerHTML = `<span>${item.label}</span><span style="color:${item.a?ACCENT.green:'rgba(240,238,248,.22)'}">${item.icon}</span>`;
    sidebar.appendChild(row);
  });
  const rev = el('div','dash-revenue');
  const box = el('div','dash-revenue-box');
  box.innerHTML = `<div class="dash-revenue-label">${d.revenueLabel}</div><div class="dash-revenue-val">${d.revenueVal}</div><div class="dash-revenue-delta">${d.revenueDelta}</div>`;
  rev.appendChild(box);
  sidebar.appendChild(rev);
  shell.appendChild(sidebar);

  wrap.appendChild(shell);
  const caption = el('div','mock__caption');
  caption.innerHTML = `<div class="mock__caption-name">${d.captionName}</div><div class="mock__caption-sub">${d.captionSub}</div>`;
  wrap.appendChild(caption);
  host.appendChild(wrap);
}

function renderProcess(C){
  document.getElementById('processEyebrow').textContent = C.process.eyebrow;
  document.getElementById('processTitle').innerHTML = `${C.process.titleA}<br><span>${C.process.titleB}</span>`;
  const grid = document.getElementById('processGrid');
  clear(grid);
  C.process.steps.forEach((s,i)=>{
    const card = el('div',`pstep reveal-up d${i+1}`);
    card.style.setProperty('--stepcolor', s.color);
    const icon = el('div','pstep__icon', s.icon);
    icon.style.background = `${s.color}18`; icon.style.border = `1px solid ${s.color}28`;
    card.appendChild(el('div','pstep__n', s.n));
    card.lastChild.style.color = s.color;
    card.appendChild(icon);
    card.appendChild(el('h3','pstep__title', s.title));
    card.appendChild(el('p','pstep__desc', s.desc));
    const tools = el('div','pstep__tools');
    s.tools.forEach(t=>{
      const row = el('div','pstep__tool');
      const dot = el('i'); dot.style.background = s.color;
      row.innerHTML = `<span>${t}</span>`;
      row.appendChild(dot);
      tools.appendChild(row);
    });
    card.appendChild(tools);
    card.addEventListener('mouseenter', ()=>{ card.style.borderColor = `${s.color}3a`; card.style.background = `${s.color}09`; });
    card.addEventListener('mouseleave', ()=>{ card.style.borderColor = 'rgba(255,255,255,.065)'; card.style.background = 'rgba(255,255,255,.028)'; });
    grid.appendChild(card);
  });
}

let journeyState = { idx:0, timer:null };
function renderJourney(C){
  document.getElementById('journeyEyebrow').textContent = C.journey.eyebrow;
  const body = document.getElementById('journeyBody');
  const dotsWrap = document.getElementById('journeyDots');

  function paint(idx){
    const item = C.journey.items[idx];
    clear(body);
    const q = el('div','journey__quote');
    q.innerHTML = `<div class="journey__program" style="color:${item.color}">${item.program}</div>
      <p class="journey__text">${item.text}</p>
      <div class="journey__meta">
        <div class="journey__badge" style="background:linear-gradient(135deg, ${item.color}, ${item.color}88)">${item.badge}</div>
        <div class="journey__meta-text"><div class="journey__meta-role">${item.role}</div></div>
      </div>`;
    body.appendChild(q);
    clear(dotsWrap);
    C.journey.items.forEach((_,i)=>{
      const d = el('button','journey__dot'+(i===idx?' active':'')); d.type='button';
      d.addEventListener('click', ()=> goTo(i));
      dotsWrap.appendChild(d);
    });
  }

  function goTo(idx){
    const q = body.querySelector('.journey__quote');
    if (q) q.classList.add('out');
    setTimeout(()=>{ journeyState.idx = idx; paint(idx); }, 380);
  }

  clearInterval(journeyState.timer);
  journeyState.idx = 0;
  paint(0);
  journeyState.timer = setInterval(()=>{ goTo((journeyState.idx + 1) % C.journey.items.length); }, 6200);
}

function renderContact(C){
  const c = C.contact;
  document.getElementById('contactEyebrow').textContent = c.eyebrow;
  document.getElementById('contactTitle').innerHTML = `${c.titleA}<br><span>${c.titleB}</span>`;
  document.getElementById('contactDesc').textContent = c.desc;
  document.getElementById('contactSend').textContent = c.send;
  document.getElementById('contactEmail').placeholder = c.placeholder;

  const socials = document.getElementById('contactSocials');
  clear(socials);
  c.socials.forEach(s=>{
    const a = el('a','contact__social'); a.href = s.href; a.target='_blank'; a.rel='noopener';
    a.innerHTML = `<span>${s.icon}</span>${s.l}`;
    socials.appendChild(a);
  });
  const emailItem = el('a','contact__social'); emailItem.href = 'mailto:dr.noha.aboyoussef@gmail.com';
  emailItem.innerHTML = `<span>✉</span>Email`;
  socials.appendChild(emailItem);

  const form = document.getElementById('contactForm');
  form.onsubmit = (e)=>{
    e.preventDefault();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = encodeURIComponent(LANG==='ar' ? 'تواصل من موقعك' : 'Hello from your portfolio');
    const body = encodeURIComponent((LANG==='ar' ? 'بريدي للتواصل: ' : 'My email: ') + email);
    window.location.href = `mailto:dr.noha.aboyoussef@gmail.com?subject=${subject}&body=${body}`;
  };
}

function renderFooter(C){
  document.getElementById('footerNote').textContent = C.footer.note;
  document.getElementById('footerLoc').textContent = C.footer.loc;
}

/* ==========================================================
   INTERACTIONS
   ========================================================== */
document.getElementById('year');

/* Custom cursor */
(function(){
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const mouse = { x:-200, y:-200 };
  const ringPos = { x:-200, y:-200 };
  window.addEventListener('mousemove', (e)=>{
    mouse.x = e.clientX; mouse.y = e.clientY;
    dot.style.left = e.clientX+'px'; dot.style.top = e.clientY+'px';
  });
  function loop(){
    ringPos.x += (mouse.x - ringPos.x) * 0.11;
    ringPos.y += (mouse.y - ringPos.y) * 0.11;
    ring.style.left = ringPos.x+'px'; ring.style.top = ringPos.y+'px';
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  document.addEventListener('mouseover', (e)=>{
    if (e.target.closest('a,button,[data-hover]')){ dot.classList.add('hover'); ring.classList.add('hover'); }
  });
  document.addEventListener('mouseout', (e)=>{
    if (e.target.closest('a,button,[data-hover]')){ dot.classList.remove('hover'); ring.classList.remove('hover'); }
  });
})();

/* Nav scroll state + burger */
const navEl = document.getElementById('nav');
window.addEventListener('scroll', ()=>{ navEl.classList.toggle('scrolled', window.scrollY > 60); }, {passive:true});

document.getElementById('burger').addEventListener('click', ()=>{
  document.getElementById('navMobile').classList.toggle('open');
});

document.getElementById('langToggle').addEventListener('click', ()=>{
  render(LANG === 'ar' ? 'en' : 'ar');
});

/* Hero parallax (mouse + scroll) */
(function(){
  const hero = document.getElementById('hero');
  const orbs = [
    { el: hero.querySelector('.hero__orb--1'), fx:24, fy:12, sy:0.07 },
    { el: hero.querySelector('.hero__orb--2'), fx:-16, fy:-10, sy:-0.05 },
    { el: hero.querySelector('.hero__orb--3'), fx:-8, fy:8, sy:0.02 },
  ];
  const grid = hero.querySelector('.hero__grid');
  let mx=0, my=0, sy=0;
  window.addEventListener('mousemove', (e)=>{
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  });
  window.addEventListener('scroll', ()=>{ sy = window.scrollY; }, {passive:true});
  function raf(){
    orbs.forEach(o=>{ if(o.el) o.el.style.transform = `translate(${mx*o.fx + sy*o.sy}px, ${my*o.fy + sy*o.sy*0.8}px)`; });
    if (grid) grid.style.transform = `translateY(${sy*0.09}px)`;
    requestAnimationFrame(raf);
  }
  raf();
  setTimeout(()=>{
    hero.querySelector('.hero__badge').style.opacity=1; hero.querySelector('.hero__badge').style.transform='none';
    hero.querySelector('.hero__title').style.opacity=1; hero.querySelector('.hero__title').style.transform='none';
    hero.querySelector('.hero__foot').style.opacity=1; hero.querySelector('.hero__foot').style.transform='none';
    document.getElementById('heroStats').classList.add('in');
    document.querySelector('.hero__cue').classList.add('in');
  }, 60);
})();

/* Scroll reveal (IntersectionObserver) */
let revealObserver = null;
function initScrollReveal(){
  if (revealObserver) revealObserver.disconnect();
  const els = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale');
  const obs = revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.13 });
  els.forEach(e=> obs.observe(e));
}

/* About counters */
let statsObserver = null;
function initHeroStatsReveal(){
  if (statsObserver) statsObserver.disconnect();
  const countEls = document.querySelectorAll('.stat-count');
  if (!countEls.length) return;
  const obs = statsObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting && !aboutCounted){
        aboutCounted = true;
        countEls.forEach(elx=>{
          const target = parseInt(elx.dataset.target, 10);
          const suffix = elx.dataset.suffix || '';
          const dur = 1800, start = Date.now();
          function tick(){
            const t = Math.min((Date.now()-start)/dur, 1);
            const ease = 1 - Math.pow(1-t, 3);
            elx.textContent = Math.round(ease*target) + suffix;
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const anchor = document.getElementById('aboutStats');
  if (anchor) obs.observe(anchor);
}

/* Carousel drag + tilt */
function initCarouselInteractions(carousel, dotsWrap){
  let isDown=false, startX=0, scrollStart=0;
  carousel.addEventListener('mousedown', (e)=>{ isDown=true; carousel.classList.add('dragging'); startX=e.pageX; scrollStart=carousel.scrollLeft; });
  window.addEventListener('mouseup', ()=>{ isDown=false; carousel.classList.remove('dragging'); });
  window.addEventListener('mousemove', (e)=>{ if(!isDown) return; e.preventDefault(); carousel.scrollLeft = scrollStart - (e.pageX - startX) * 1.6; });

  carousel.addEventListener('scroll', ()=>{
    const cards = [...carousel.querySelectorAll('[data-card]')];
    const center = carousel.scrollLeft + carousel.clientWidth/2;
    let closest=0, minDist=Infinity;
    cards.forEach((c,i)=>{ const dist = Math.abs((c.offsetLeft + c.clientWidth/2) - center); if(dist<minDist){minDist=dist; closest=i;} });
    [...dotsWrap.children].forEach((d,i)=> d.classList.toggle('active', i===closest));
  }, { passive:true });

  carousel.querySelectorAll('.pcard').forEach(card=>{
    card.addEventListener('mouseenter', ()=> card.classList.add('hover'));
    card.addEventListener('mouseleave', ()=>{ card.classList.remove('hover'); card.style.transform='perspective(1200px) scale(1)'; });
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top)/r.height - 0.5) * -13;
      const ry = ((e.clientX - r.left)/r.width - 0.5) * 13;
      card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.025)`;
    });
  });
}

/* ==========================================================
   INIT
   ========================================================== */
render('ar');
