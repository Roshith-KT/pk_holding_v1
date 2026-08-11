const ROOT = 'https://pkholdingindia.com/';

const intro = document.querySelector('.brand-intro');
let introSeen = false;
try { introSeen = sessionStorage.getItem('pk-intro-seen-v7') === '1'; } catch (e) {}
function closeIntro() {
  if (!intro || intro.classList.contains('intro-leaving')) return;
  intro.classList.add('intro-leaving');
  try { sessionStorage.setItem('pk-intro-seen-v7', '1'); } catch (e) {}
  setTimeout(() => {
    intro.remove();
    document.body.classList.remove('intro-active');
    document.querySelector('.brand-lockup')?.classList.add('logo-reveal');
    scheduleHeroMessageCompact();
  }, 650);
}
function scheduleHeroMessageCompact() {
  document.body.classList.remove('home-hero-compact');
}
if (intro) {
  if (introSeen) {
    intro.remove();
    requestAnimationFrame(() => {
      document.querySelector('.brand-lockup')?.classList.add('logo-reveal');
      scheduleHeroMessageCompact();
    });
  }
  else {
    document.body.classList.add('intro-active');
    const introTimer = setTimeout(closeIntro, 2000);
    intro.querySelector('.intro-skip')?.addEventListener('click', () => { clearTimeout(introTimer); closeIntro(); });
  }
} else {
  scheduleHeroMessageCompact();
}

const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('.site-header nav');
function closeMobileMenu() {
  document.body.classList.remove('mobile-menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = '☰';
}
function toggleMobileMenu() {
  const isOpen = document.body.classList.toggle('mobile-menu-open');
  menuButton?.setAttribute('aria-expanded', String(isOpen));
  if (menuButton) menuButton.textContent = isOpen ? '×' : '☰';
}
menuButton?.addEventListener('click', toggleMobileMenu);
siteNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));

const baseRows = [
  ['trojan-wpc',6,'Trojan WPC','Multiwood','assets/verified-logos/Trojan_User_Logo.png'],['thomson-multiwood',7,'Thomson Multiwood','Multiwood','assets/verified-logos/Thomson_Multiwood_HD.svg'],['eezeewood',8,'Eeezewood','Multiwood','brand/eezeewood.png'],['woodlane',9,'Woodlane','Multiwood','brand/wulane.png'],
  ['greenlam-laminates',10,'Greenlam Laminates','Laminates','assets/verified-logos/Greenlam_Laminates.png'],['merino-laminates',12,'Merino Laminates','Laminates','assets/verified-logos/Merino_Laminates.png'],['royale-touche',13,'Royale Touche','Laminates','assets/verified-logos/Royale_Touche_User_Logo.png'],['stylam-laminates',31,'Stylam Laminates','Laminates','assets/verified-logos/Stylam_User_Logo.png'],['mikasa-laminates',34,'Mikasa Laminates','Laminates','assets/verified-logos/Mikasa_Laminates_User_Logo.png'],['advance-laminates',14,'Advance Laminates','Laminates','brand/advance_laminate.png'],['sequence-surfaces',15,'Sequence Surfaces','Laminates','brand/sequence_surfaces.png'],
  ['vox-interiors',32,'VOX Interiors','Wall Panels','assets/verified-logos/VOX_User_Logo.png'],['agl-surfaces',33,'AGL Surfaces','Tiles & Surfaces','assets/verified-logos/AGL_User_Logo.png'],
  ['mikasa-decowood',16,'Mikasa Decowood','Veneers','assets/verified-logos/Mikasa_Decowood_Veneers.png'],['century-veneers',17,'Century Veneers','Veneers','brand/century_veneer.jpeg'],
  ['hafele-hardware',18,'Häfele Hardware','Hardware','assets/verified-logos/Hafele_HD.svg'],['hettich-hardware',19,'Hettich Hardware','Hardware','assets/verified-logos/Hettich_Official_Style.svg'],['ebco-hardware',20,'Ebco Hardware','Hardware','assets/verified-logos/Ebco_Official_Style.svg'],['sleek-hardware',21,'Sleek Hardware','Hardware','assets/verified-logos/Sleek_AsianPaints_Official_Style.svg'],
  ['fevicol',22,'Fevicol','Adhesives','assets/verified-logos/Fevicol_User_Logo.png'],['araldite',23,'Araldite','Adhesives','brand/araldite.png'],['flex-kwik',24,'Flex Kwik','Adhesives','brand/flexkwik.png'],
  ['acrylic-01',25,'Acrylic Collection 01','Acrylic','brand/acr1.png'],['acrylic-02',26,'Acrylic Collection 02','Acrylic','brand/acr2.png'],['acrylic-03',27,'Acrylic Collection 03','Acrylic','brand/acr3.png'],['acrylic-04',28,'Acrylic Collection 04','Acrylic','brand/acr4.png'],['acrylic-05',29,'Acrylic Collection 05','Acrylic','brand/acr5.png'],['acrylic-06',30,'Acrylic Collection 06','Acrylic','brand/acr6.png']
];
const removedProductIds = new Set(['trojan-wpc','hettich-hardware','sequence-surfaces','advance-laminates','century-veneers','eezeewood','woodlane','araldite','flex-kwik','acrylic-01','acrylic-02','acrylic-03','acrylic-04','acrylic-05','acrylic-06']);
const baseProducts = baseRows.filter(r => !removedProductIds.has(r[0])).map(r => ({ id:r[0], legacyId:r[1], name:r[2], category:r[3], brand:r[2].split(' ')[0], image:r[4].startsWith('assets/') ? r[4] : ROOT + encodeURI(r[4]) }));
const mikasaBrand = { id:'brand-mikasa-plywood', name:'Mikasa Plywood', category:'Plywood', brand:'Mikasa', image:'assets/verified-logos/Mikasa_Ply.png', isBrand:true, productCount:8 };
const plymarcBrand = { id:'brand-plymarc-complete', name:'Plymarc Plywood, PVC & WPC', category:'Plywood / Multiwood', brand:'Plymarc', image:'assets/verified-logos/Plymarc_User_Logo.png', isBrand:true, productCount:4 };
const trojanBrand = { id:'brand-trojan-complete', name:'Trojan Plywood, WPC & PVC', category:'Plywood / Multiwood', brand:'Trojan', image:'assets/verified-logos/Trojan_User_Logo.png', isBrand:true, productCount:6 };
const century08Products = window.CENTURY_CATALOGUE?.century08 || [];
const century10Products = window.CENTURY_CATALOGUE?.century10 || [];
const centuryBrand = { id:'brand-century-laminates', name:'Century Laminates', category:'Laminates', brand:'Century', collectionKey:'Century Laminates', image:'assets/verified-logos/Century_Laminates.png', isBrand:true, productCount:century08Products.length + century10Products.length };
const centuryRangeCards = [
  { id:'brand-century-1mm', name:'Century Laminates - 1.0 mm', category:'Laminates', brand:'Century', collectionKey:'Century 1.0 mm', image:'assets/century/10/page-038.jpg', isBrand:true, productCount:century10Products.length },
  { id:'brand-century-08mm', name:'Century StarLine - 0.8 mm', category:'Laminates', brand:'Century', collectionKey:'Century 0.8 mm', image:'assets/century/08/page-016.jpg', isBrand:true, productCount:century08Products.length }
];
const hettichProducts = window.HETTICH_CATALOGUE?.items || [];
const hettichBrand = { id:'brand-hettich-hardware', name:'Hettich Hardware', category:'Hardware', brand:'Hettich', image:'assets/verified-logos/Hettich_Official_Style.svg', isBrand:true, productCount:hettichProducts.length };

const mikasaProducts = [
  {id:'mikasa-sapphire',legacyId:2,name:'Sapphire',category:'Plywood',brand:'Mikasa',type:'Plywood',grade:'Structural',standard:'IS 10701',emission:'E0',warranty:'Lifetime',density:'775 kg/m³',face:'0.9 mm combined overlay',adhesive:'Phenolic',page:'Brochure pages 12–15',image:'assets/mikasa/sapphire.webp',thicknesses:[[4,5],[6,7],[9,9],[12,11],[16,13],[19,15],[25,17]],features:['Fire-retardant • IS 5509:2021','6× pressed','100% composed veneer','Vacuum-pressure treated'],applications:['Indoor & outdoor furniture','Commercial buildings','Cabinets & shelving','Marine applications','Bathroom interiors'],summary:'Structural-grade hardwood plywood with two overlaid face veneers, E0-certified resin, inherent fire resistance and exceptional impact strength.'},
  {id:'mikasa-marine-blue',name:'Marine Blue',category:'Plywood',brand:'Mikasa',type:'Plywood',grade:'BWP / Marine',standard:'IS 710',emission:'E0',warranty:'30 years',density:'700 kg/m³',face:'0.3 mm each side',adhesive:'Phenolic',page:'Brochure pages 16–19',image:'assets/mikasa/marine-blue.webp',thicknesses:[[4,5],[6,5],[9,7],[12,9],[16,11],[19,13],[25,17]],features:['Fire-retardant • IS 5509:2021','Quad-Core Press','100% composed veneer','Vacuum-pressure treated'],applications:['Indoor & outdoor furniture','Office woodwork','Partitions & panelling','Kitchen cabinets','Bathroom interiors'],summary:'Versatile BWP marine plywood made from a robust tropical-wood blend, engineered for indoor and outdoor use with E0 emissions and fire safety.'},
  {id:'mikasa-blockboard-marine-blue',name:'Blockboard Marine Blue',category:'Plywood',brand:'Mikasa',type:'Blockboard',grade:'BWP-COM',standard:'IS 1659',emission:'E0',warranty:'25 years',density:'560 kg/m³',face:'0.3 mm each side',adhesive:'Phenolic',page:'Brochure pages 20–23',image:'assets/mikasa/blockboard-marine-blue.webp',thicknesses:[[19,null],[25,null]],features:['Fire safety','Quad-Core Press','Solid wooden-strip core','Vacuum-pressure treated'],applications:['Sliding & flush doors','Wardrobe shutters','Kitchen cabinets','Bathroom vanities','Partitions & panelling'],summary:'Water-resistant BWP blockboard with a solid tropical-wood strip core, designed for stable doors, shutters, cabinets and panelling.'},
  {id:'mikasa-marine',name:'Marine',category:'Plywood',brand:'Mikasa',type:'Plywood',grade:'BWP',standard:'IS 710',emission:'E1',warranty:'25 years',density:'660 kg/m³',face:'0.3 mm each side',adhesive:'Phenolic',page:'Brochure pages 24–27',image:'assets/mikasa/marine.webp',thicknesses:[[4,5],[6,5],[9,7],[12,9],[16,11],[19,13],[25,17]],features:['Quad-Core Press','100% composed veneer','Precision calibrated','Vacuum-pressure treated'],applications:['Modular kitchens','Cabinets & shelving','Interior fittings','Moisture-prone areas','False ceilings'],summary:'Premium BWP plywood for moisture-prone environments, built to resist deformation under high pressure and deliver long-term stability.'},
  {id:'mikasa-bwp-plus',name:'BWP+',category:'Plywood',brand:'Mikasa',type:'Plywood',grade:'BWP',standard:'IS 303',emission:'E1',warranty:'20 years',density:'640 kg/m³',face:'0.3 mm each side',adhesive:'Phenolic',page:'Brochure pages 28–31',image:'assets/mikasa/bwp-plus.webp',thicknesses:[[4,5],[6,5],[9,7],[12,9],[16,11],[19,13],[25,17]],features:['Quad-Core Press','Anti-termite & anti-borer','100% calibrated','Vacuum-pressure treated'],applications:['Indoor furniture','Kitchen cabinets','Bathroom interiors','Modular furniture'],summary:'Boiling Water Proof plywood offering calibrated performance, moisture resistance and termite protection for demanding interior applications.'},
  {id:'mikasa-mr-plus',name:'MR+',category:'Plywood',brand:'Mikasa',type:'Plywood',grade:'MR',standard:'IS 303',emission:'E1',warranty:'15 years',density:'600 kg/m³',face:'0.3 mm each side',adhesive:'Amino',page:'Brochure pages 32–35',image:'assets/mikasa/mr-plus.webp',thicknesses:[[4,5],[6,5],[8,7],[12,9],[16,11],[18,13],[25,17]],features:['Moisture resistant','Quad-Core Press','100% composed veneer','Vacuum-pressure treated'],applications:['Wardrobes','TV units','Partitions & panelling','Tables, sofas & chairs','Beds'],summary:'Moisture-resistant tropical-wood plywood bonded with E1-certified resin for reliable performance in humid interior environments.'},
  {id:'mikasa-blockboard-mr-plus',name:'Blockboard MR+',category:'Plywood',brand:'Mikasa',type:'Blockboard',grade:'MR-COM',standard:'IS 1659',emission:'E1',warranty:'15 years',density:'560 kg/m³',face:'0.3 mm each side',adhesive:'Amino',page:'Brochure pages 36–39',image:'assets/mikasa/blockboard-mr-plus.webp',thicknesses:[[19,null],[25,null]],features:['Moisture resistant','Solid wooden-strip core','Quad-Core Press','Vacuum-pressure treated'],applications:['Interior doors','Cabinets','Modular furniture','Partitions & panelling','Shelving & storage'],summary:'Lighter moisture-resistant blockboard with a solid tropical-wood strip core, offering stability for doors, cabinets and modular furniture.'},
  {id:'mikasa-fire-guardian',name:'Fire Guardian',category:'Plywood',brand:'Mikasa',type:'Plywood',grade:'FR',standard:'IS 5509',emission:'E1',warranty:'30 years',density:'700 kg/m³',face:'0.3 mm each side',adhesive:'Phenolic',page:'Brochure pages 40–43',image:'assets/mikasa/fire-guardian.webp',thicknesses:[[4,5],[6,5],[9,7],[12,9],[16,11],[19,13],[25,17]],features:['Fire-retardant • IS 5509:2021','Quad-Core Press','High impact resistance','Vacuum-pressure treated'],applications:['Kitchen cabinets','Schools & hospitals','Multiplexes & exhibitions','Office woodwork','Railway coaches & vehicle bodies'],summary:'Fire-retardant plywood for safety-focused residential, commercial and institutional interiors, with high strength and calibrated construction.'}
];
const plymarcProducts = [
  {id:'plymarc-gold-pro',legacyId:1,name:'Gold Pro',category:'Plywood',brand:'Plymarc',type:'Plywood',grade:'BWP',standard:'BWP grade',emission:'E0',warranty:'Confirm with PK Holding',density:'800–850 kg/m³',face:'Gurjan surface',adhesive:'E0 phenol formaldehyde',page:'Official Plymarc interior-sector page',image:'assets/plymarc/gold-pro.jpg',brochureUrl:'https://www.plymarc.com/wp-content/uploads/2020/08/Plymarc-gold.pdf',defaultSize:'2.44 × 1.22 m',thicknesses:[['6–19 mm',null],['25 mm',null]],features:['Gurjan surface','Eucalyptus core','E0 bonding','Moisture 5–12%'],applications:['Interior-sector applications'],summary:'Officially listed as Plymarc Gold: BWP-grade plywood with a Gurjan surface, Eucalyptus core and E0 phenol-formaldehyde bonding. PK Holding stocks this product as Plymarc Gold Pro.'}
];
const mikasaPlyThicknesses = [[4,null],[6,null],[9,null],[12,null],[16,null],[19,null],[25,null]];
const trojanSource = 'https://trojanply.com/products/trojan-flagship-series/';
const trojanProducts = [
  {id:'trojan-signature',name:'Signature',category:'Plywood',brand:'Trojan',type:'Plywood',grade:'BWP',grades:['BWP'],standard:'IS 710',warranty:'Lifetime (35 years*)',image:'assets/trojan/signature.jpg',brochureUrl:trojanSource,page:'Official Trojan Flagship Series page',thicknesses:mikasaPlyThicknesses,features:['Up to 700% replacement*','Trojan Core Protection Technology','Premium high-density core veneer','Fire-retardant BWP variant**'],applications:['Ultra-luxury interiors','Humid climates','Kitchen cabinets','Bathroom cabinets','Wardrobes','Interior & exterior use'],summary:'Trojan flagship BWP calibrated plywood with premium high-density veneers, composed cores, finger-jointed panels, VPT treatment and Quad Press construction.'},
  {id:'trojan-platinum',name:'Platinum',category:'Plywood',brand:'Trojan',type:'Plywood',grade:'BWP',grades:['BWP'],standard:'IS 710',warranty:'Lifetime (35 years*)',image:'assets/trojan/platinum.jpg',brochureUrl:trojanSource,page:'Official Trojan Flagship Series page',thicknesses:mikasaPlyThicknesses,features:['Up to 500% replacement*','Premium high-density core veneer','Structurally balanced','Fire-retardant BWP variant**'],applications:['Luxury interiors','Humid areas','Kitchen cabinets','Bathroom cabinets','Wardrobes'],summary:'Calibrated BWP plywood positioned for cost-effective luxury interiors, with composed cores, premium high-density veneers, VPT treatment and Quad Press construction.'},
  {id:'trojan-classic',name:'Classic',category:'Plywood',brand:'Trojan',type:'Plywood',grade:'BWP / MR',grades:['BWP','MR'],standard:'IS 710 listed on official page',warranty:'Lifetime (35 years*)',image:'assets/trojan/classic.jpg',brochureUrl:trojanSource,page:'Official Trojan Flagship Series page',thicknesses:mikasaPlyThicknesses,features:['Up to 300% replacement*','Selected premium core veneer','BWP for humid areas; MR for dry areas','Kerala termite-warranty exclusion*'],applications:['Living rooms','Kitchens','Wardrobes','General interior applications'],summary:'Calibrated plywood offered in BWP and MR grades, using selected premium core veneers, composed cores, VPT treatment and Quad Press construction.'},
  {id:'trojan-champion',name:'Champion',category:'Plywood',brand:'Trojan',type:'Plywood',grade:'BWP',grades:['BWP'],warranty:'30 years*',image:'assets/trojan/champion.jpg',brochureUrl:trojanSource,page:'Official Trojan Flagship Series page',thicknesses:mikasaPlyThicknesses,features:['Up to 200% replacement*','Selected premium core veneer','Chemically treated','Kerala termite-warranty exclusion*'],applications:['Value-focused interiors','Furniture','Cabinetry','Growing-market projects'],summary:'A calibrated BWP value-segment plywood with selected premium core veneers, all-season construction, chemical treatment, Quad Press and Trojan Core Protection Technology.'},
  {id:'trojan-pride',name:'Pride',category:'Plywood',brand:'Trojan',type:'Plywood',grade:'BWP / MR',grades:['BWP','MR'],standard:'IS 303',warranty:'20 years BWP / 10 years MR*',image:'assets/trojan/pride.jpg',brochureUrl:trojanSource,page:'Official Trojan Flagship Series page',thicknesses:mikasaPlyThicknesses,features:['BWP is calibrated','Selected core veneer','Chemically treated','Kerala termite-warranty exclusion*'],applications:['Interior furniture','Cabinetry','Wardrobes','Dry and moisture-prone interiors'],summary:'IS 303 plywood offered in BWP and MR grades, with selected core veneers, all-season construction, chemical treatment and Trojan Core Protection Technology.'}
];
const trojanPanelProducts = [
  {id:'trojan-wpc',legacyId:6,name:'WPC & PVC Boards',category:'Multiwood',brand:'Trojan',type:'WPC / PVC',image:'assets/verified-logos/Trojan_User_Logo.png',brochureUrl:'https://trojanply.com/',page:'Trojan PLY WPC PVC catalogue card',summary:'Trojan WPC/PVC material range available through PK Holding. Final sizes, grades and availability will be confirmed during quotation.'}
];
const trustwudSource = 'https://www.plymarc.com/trustwud/';
const plymarcTrustwudProducts = [
  {id:'plymarc-pvc-foam-board',name:'PVC Foam Board',category:'Multiwood',brand:'Plymarc Trustwud',type:'PVC Board',grade:'3 density grades',grades:['Trustwud Premium — 700 kg/m³','Trustwud — 620 kg/m³','Plymarc Gold — 570 kg/m³'],density:'570–700 kg/m³',emission:'Eco-friendly',warranty:'Confirm with PK Holding',image:'assets/plymarc/trustwud.jpg',brochureUrl:trustwudSource,page:'Official Plymarc Trustwud page',thicknesses:[['Confirm availability',null]],features:['Waterproof','Termite proof','Fire retardant','Strong screw holding'],applications:['Residential interiors','Offices','Hospitality','Malls','Healthcare buildings','Interior & exterior applications'],summary:'Plymarc Trustwud PVC Foam Boards are offered in Premium 700 kg/m³, Trustwud 620 kg/m³ and Gold 570 kg/m³ densities. The official page highlights durability, screw holding and suitability for varied interior applications.'},
  {id:'plymarc-wpc-board',name:'WPC Board',category:'Multiwood',brand:'Plymarc Trustwud',type:'WPC Board',grade:'6 board variants',grades:['Three Layer Premium — 700 kg/m³','Three Layer Trustwud — 650 kg/m³','Three Layer Gold — 600 kg/m³','Three Layer Colour Gold — 600 kg/m³','Single Layer Trustwud — 600 kg/m³','Single Layer Gold — 550 kg/m³'],density:'550–700 kg/m³',emission:'Eco-friendly',warranty:'Confirm with PK Holding',image:'assets/plymarc/trustwud.jpg',brochureUrl:trustwudSource,page:'Official Plymarc Trustwud page',thicknesses:[['Confirm availability',null]],features:['Wood-plastic composite','Wood strength + PVC durability','Three-layer and single-layer variants','Laminate-finish options'],applications:['Premium interior fit-outs','Interior works','Furniture and cabinetry','Related interior applications'],summary:'Plymarc Trustwud WPC Boards combine wood powder and PVC. The range includes Three Layer, Three Layer Colour and Single Layer variants in densities from 550 to 700 kg/m³.'},
  {id:'plymarc-wpc-door-frame',name:'WPC Door Frame',category:'Multiwood',brand:'Plymarc Trustwud',type:'Door Frame',grade:'WPC Door Frame',grades:['WPC Door Frame'],density:'Not published',emission:'Eco-friendly material range',warranty:'Confirm with PK Holding',image:'assets/plymarc/trustwud.jpg',brochureUrl:trustwudSource,page:'Official Plymarc Trustwud page',thicknesses:[['Confirm availability',null]],features:['Official Trustwud product category','WPC construction','Dimensions to be confirmed','Availability on quotation'],applications:['Interior door frames','Exterior door frames'],summary:'Plymarc lists WPC Door Frames in its Trustwud range. The official page does not publish frame dimensions or grade details, so PK Holding will confirm the available profile and size during quotation.'}
];
const plymarcCombinedProducts = [...plymarcProducts, ...plymarcTrustwudProducts];
const trojanCombinedProducts = [...trojanProducts, ...trojanPanelProducts];
const brandCollections = { Hettich:hettichProducts, Mikasa:mikasaProducts, Plymarc:plymarcCombinedProducts, Trojan:trojanCombinedProducts, 'Century Laminates':centuryRangeCards, 'Century 1.0 mm':century10Products, 'Century 0.8 mm':century08Products };
const brandLabels = { Hettich:'Hettich Hardware', Mikasa:'Mikasa Plywood', Plymarc:'Plymarc Plywood, PVC & WPC', Trojan:'Trojan Plywood, WPC & PVC', 'Century Laminates':'Century Laminates', 'Century 1.0 mm':'Century Laminates - 1.0 mm', 'Century 0.8 mm':'Century StarLine - 0.8 mm' };
const brandCatalogueLinks = {
  Hettich:[{label:'Download catalogue',url:'assets/hettich/hettich-catlogue.pdf',download:'Hettich-catalogue.pdf'}],
  Mikasa:[{label:'Download brochure',url:'assets/mikasa/Mikasa-Plywood-Brochure.pdf',download:'Mikasa-Plywood-Brochure.pdf'}],
  Plymarc:[
    {label:'Download Gold Pro PDF',url:'https://www.plymarc.com/wp-content/uploads/2020/08/Plymarc-gold.pdf'},
    {label:'Open PVC/WPC catalogue',url:'https://www.plymarc.com/trustwud/'}
  ],
  Trojan:[{label:'Open flagship series',url:trojanSource}],
  'Century Laminates':[
    {label:'Download 1 mm catalogue',url:'assets/century/Century-Laminates-LookBook-1mm-2026.pdf',download:'Century-Laminates-1mm.pdf'},
    {label:'Download 0.8 mm catalogue',url:'assets/century/Century-StarLine-0.8mm-2026.pdf',download:'Century-StarLine-0.8mm.pdf'}
  ],
  'Century 1.0 mm':[{label:'Download 1 mm catalogue',url:'assets/century/Century-Laminates-LookBook-1mm-2026.pdf',download:'Century-Laminates-1mm.pdf'}],
  'Century 0.8 mm':[{label:'Download 0.8 mm catalogue',url:'assets/century/Century-StarLine-0.8mm-2026.pdf',download:'Century-StarLine-0.8mm.pdf'}]
};
const displayPriority = ['hafele-hardware','sleek-hardware','ebco-hardware','fevicol'];
const displayFirstProducts = displayPriority.map(id => baseProducts.find(p => p.id === id)).filter(Boolean);
const remainingBaseProducts = baseProducts.filter(p => !displayPriority.includes(p.id));
const remainingLaminateProducts = remainingBaseProducts.filter(p => p.category === 'Laminates');
const remainingOtherProducts = remainingBaseProducts.filter(p => p.category !== 'Laminates');
const plywoodBrandCards = [mikasaBrand,plymarcBrand,trojanBrand];
const laminateBrandCards = [centuryBrand];
const otherBrandCards = [];
const brandCards = [hettichBrand,...displayFirstProducts,...plywoodBrandCards,...laminateBrandCards,...remainingLaminateProducts,...otherBrandCards];
const products = [...hettichProducts, ...displayFirstProducts, ...mikasaProducts, ...plymarcCombinedProducts, ...trojanCombinedProducts, ...century10Products, ...century08Products, ...remainingBaseProducts];

function escapeHtml(value='') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function productByAnyId(id) { return products.find(p => p.id === id || p.legacyId === Number(id)); }
function loadCart() {
  let raw = {};
  try { raw = JSON.parse(localStorage.getItem('pk-quote-cart') || '{}'); } catch (e) {}
  const normalized = {};
  Object.entries(raw).forEach(([key,value]) => {
    if (typeof value === 'number') {
      const p = productByAnyId(key);
      if (p && value > 0) normalized[`legacy-${key}`] = { productId:p.id, qty:value };
    } else if (value && value.productId && Number(value.qty) > 0 && productByAnyId(value.productId)) {
      normalized[key] = { ...value, qty:Number(value.qty) };
    }
  });
  return normalized;
}
let cart = loadCart();
let activeCategory = 'All';
let activeSpecProduct = null;
const grid = document.querySelector('#product-grid');
const filters = document.querySelector('.filters');
const search = document.querySelector('#product-search');
const categories = ['All','Hettich','Hardware','Adhesives','Mikasa','Plymarc','Trojan','Century Laminates','Laminates',...new Set(baseProducts.map(p => p.category).filter(c => !['Hardware','Adhesives','Laminates'].includes(c)))];
const cartEntries = () => Object.entries(cart).filter(([,item]) => item && item.qty > 0);
const productInCart = id => cartEntries().some(([,item]) => item.productId === id);

function renderFilters() {
  filters.innerHTML = categories.map(c => `<button class="filter ${c===activeCategory?'active':''}" data-category="${escapeHtml(c)}">${escapeHtml(brandLabels[c]||c)}</button>`).join('');
}
function renderCatalogueLinks(links=[]) {
  return links.map(link => `<a class="catalogue-download" href="${escapeHtml(link.url)}" ${link.download?`download="${escapeHtml(link.download)}"`:'target="_blank" rel="noopener"'}>${escapeHtml(link.label)} ↓</a>`).join('');
}
function renderProducts() {
  const q = search.value.trim().toLowerCase();
  const brandView = Boolean(brandCollections[activeCategory]);
  const source = brandView ? brandCollections[activeCategory] : [...brandCards,...remainingOtherProducts];
  const shown = source.filter(p => (brandView || activeCategory==='All' || p.category===activeCategory) && (`${p.name} ${p.category} ${p.brand} ${p.grade||''}`).toLowerCase().includes(q));
  const resultsBar=document.querySelector('.brand-results-bar'); resultsBar.hidden=!brandView;
  if(brandView){resultsBar.querySelector('strong').textContent=brandLabels[activeCategory]||activeCategory;resultsBar.querySelector('span').textContent=activeCategory==='Century Laminates'?'Choose 1.0 mm or 0.8 mm':'Select products for quotation';resultsBar.querySelector('.brand-downloads').innerHTML=renderCatalogueLinks(brandCatalogueLinks[activeCategory]||[]);}
  grid.innerHTML = shown.map(p => {
    if(p.isBrand){return `<article class="product-card brand-card"><div class="product-image"><span>${escapeHtml(p.category)}</span><img loading="lazy" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}"></div><div class="product-info"><h3>${escapeHtml(p.name)}</h3><button class="add-button" data-brand="${escapeHtml(p.collectionKey||p.brand)}">View products →</button></div></article>`;}
    const configured = Boolean(p.thicknesses);
    const productClass=p.brand.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    return `<article class="product-card ${configured?`${productClass}-product mikasa-product`:''} ${p.brand==='Hettich'?'hettich-item-card':''}">
      <div class="product-image"><span>${escapeHtml(configured?p.brand:p.category)}</span><img loading="lazy" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23eef0ec%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23333%22 font-family=%22Arial%22%3EPK HOLDING%3C/text%3E%3C/svg%3E'"></div>
      <div class="product-info">${configured?`<div class="product-meta-line"><small class="mikasa-grade">${escapeHtml(p.grade)}</small><b>${escapeHtml(p.warranty)}</b></div>`:'<small>Price on request</small>'}<h3>${escapeHtml(configured?`${p.brand} ${p.name}`:p.name)}</h3>
      <button class="add-button ${productInCart(p.id)?'added':''}" ${configured?`data-configure="${p.id}"`:`data-add="${p.id}"`}>${configured?(productInCart(p.id)?'Select another option ✓':'Select specifications →'):(productInCart(p.id)?'Added ✓':'Add to quotation +')}</button></div></article>`;
  }).join('');
  document.querySelector('.empty-state').hidden = shown.length > 0;
}
function save() { localStorage.setItem('pk-quote-cart', JSON.stringify(cart)); updateCount(); renderCart(); }
function updateCount() { const count = cartEntries().reduce((sum,[,item]) => sum + item.qty, 0); document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = count); }
function showToast(text='Added to quotation') { const toast=document.querySelector('.toast'); toast.textContent=text; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1400); }
function clearCart() {
  cart = {};
  localStorage.removeItem('pk-quote-cart');
  updateCount();
  renderCart();
  renderProducts();
  showToast('Quotation list cleared');
}
function addQuick(id) {
  const key = `product-${id}`;
  cart[key] = cart[key] || { productId:id, qty:0 };
  cart[key].qty += 1; save(); renderProducts(); showToast();
}
function addConfigured(product, grade, thickness, size, qty, notes) {
  const match = cartEntries().find(([,item]) => item.productId===product.id && (item.grade||product.grade)===grade && item.thickness===thickness && (item.size||'')===size && (item.notes||'')===notes);
  if (match) cart[match[0]].qty += qty;
  else cart[`spec-${Date.now()}-${Math.random().toString(36).slice(2,7)}`] = { productId:product.id, grade, thickness, size, notes, qty };
  save(); renderProducts(); showToast(`${product.name} added to quotation`);
}
function renderCart() {
  const entries = cartEntries();
  const wrap=document.querySelector('.cart-items'), empty=document.querySelector('.cart-empty'), form=document.querySelector('.drawer-form');
  wrap.innerHTML = entries.map(([key,item]) => {
    const p=productByAnyId(item.productId); if(!p) return '';
    const specs=[(item.grade||p.grade)?`Grade: ${item.grade||p.grade}`:'',item.thickness?`Thickness: ${item.thickness}`:'',item.size?`Size: ${item.size}`:'',item.notes?`Notes: ${item.notes}`:''].filter(Boolean).join(' · ');
    return `<div class="cart-item"><img src="${escapeHtml(p.image)}" alt=""><div>${p.thicknesses?`<div class="cart-brand">${escapeHtml(p.brand)} ${escapeHtml(p.type)}</div>`:''}<h4>${escapeHtml(p.name)}</h4>${specs?`<p class="cart-specs">${escapeHtml(specs)}</p>`:''}<div class="qty"><button data-qty="${escapeHtml(key)}" data-change="-1">−</button><span>${item.qty}</span><button data-qty="${escapeHtml(key)}" data-change="1">+</button></div></div><button class="remove" data-remove="${escapeHtml(key)}" aria-label="Remove ${escapeHtml(p.name)}">×</button></div>`;
  }).join('');
  empty.style.display=entries.length?'none':'block'; form.style.display=entries.length?'grid':'none';
}
function openCart(open=true) { document.body.classList.toggle('cart-open',open); document.querySelector('.quote-drawer').setAttribute('aria-hidden',String(!open)); if(open) renderCart(); }

function openSpec(id) {
  const p=products.find(x=>x.id===id); if(!p) return; activeSpecProduct=p;
  document.querySelector('.spec-image').src=p.image; document.querySelector('.spec-image').alt=`${p.brand} ${p.name} product image`;
  document.querySelector('.spec-brand-name').textContent=`${p.brand} ${p.type}`;
  const sourceLink=document.querySelector('.spec-source-link'); sourceLink.href=p.brochureUrl||'assets/mikasa/Mikasa-Plywood-Brochure.pdf'; sourceLink.textContent=p.brand==='Century'?'View original catalogue ↗':p.brand==='Mikasa'?'View original brochure ↗':'View official product page ↗';
  document.querySelector('.spec-title').textContent=p.name; document.querySelector('.spec-summary').textContent=p.summary; document.querySelector('.spec-page').textContent=p.page;
  document.querySelector('.spec-badges').innerHTML=[p.grade,p.emission,p.warranty,...p.features.slice(0,2)].filter(Boolean).map(x=>`<span>${escapeHtml(x)}</span>`).join('');
  document.querySelector('.spec-facts').innerHTML=[['Product',p.type],['Standard',p.standard],['Density',p.density],['Face veneer',p.face],['Adhesive',p.adhesive],['Calibration',p.brand==='Mikasa'?'100% precision calibrated':'']].filter(([,v])=>v).map(([k,v])=>`<div><small>${escapeHtml(k)}</small><strong>${escapeHtml(v)}</strong></div>`).join('');
  document.querySelector('.spec-applications').innerHTML=p.applications.map(x=>`<span>${escapeHtml(x)}</span>`).join('');
  const grades=p.grades||[p.grade]; document.querySelector('#spec-grade').innerHTML=grades.map(grade=>`<option value="${escapeHtml(grade)}">${escapeHtml(grade)}</option>`).join('');
  document.querySelector('#spec-thickness').innerHTML='<option value="">Select thickness</option>'+p.thicknesses.map(([mm,plies])=>{const label=typeof mm==='number'?`${mm} mm`:String(mm);return `<option value="${escapeHtml(label)}">${escapeHtml(label)}${plies?` · ${plies} plies`:''}</option>`;}).join('');
  document.querySelector('#spec-size').value=p.defaultSize||''; document.querySelector('#spec-qty').value=1; document.querySelector('#spec-notes').value='';
  document.querySelector('.spec-disclaimer').textContent=p.brand==='Trojan'?'*Warranty and replacement conditions apply. Trojan states termite warranty does not apply to Classic, Champion and Pride in Kerala. Fire-retardant claims apply to BWP variants from 01.04.2026. Final availability will be confirmed by PK Holding.':'Final availability and specifications will be confirmed by PK Holding.';
  document.body.classList.add('spec-open'); document.querySelector('.spec-modal').setAttribute('aria-hidden','false');
}
function closeSpec() { document.body.classList.remove('spec-open'); document.querySelector('.spec-modal').setAttribute('aria-hidden','true'); activeSpecProduct=null; }

filters.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;activeCategory=b.dataset.category;renderFilters();renderProducts();});
grid.addEventListener('click',e=>{const brand=e.target.closest('[data-brand]'),config=e.target.closest('[data-configure]'),add=e.target.closest('[data-add]');if(brand){activeCategory=brand.dataset.brand;search.value='';renderFilters();renderProducts();document.querySelector('#catalogue').scrollIntoView({behavior:'smooth'});}else if(config)openSpec(config.dataset.configure);else if(add)addQuick(add.dataset.add);});
document.querySelector('[data-all-brands]').addEventListener('click',()=>{activeCategory='All';search.value='';renderFilters();renderProducts();});
search.addEventListener('input',renderProducts);
document.querySelectorAll('[data-open-cart]').forEach(b=>b.addEventListener('click',()=>openCart(true)));
document.querySelectorAll('a[href="#why-us"]').forEach(link=>link.addEventListener('click',e=>{const target=document.querySelector('#why-us');if(!target)return;e.preventDefault();history.replaceState(null,'','#why-us');window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY,behavior:'smooth'});setTimeout(settleWhyUsScroll,220);setTimeout(settleWhyUsScroll,720);}));
document.querySelectorAll('[data-close-cart]').forEach(b=>b.addEventListener('click',()=>openCart(false)));
document.querySelectorAll('[data-clear-cart]').forEach(b=>b.addEventListener('click',clearCart));
document.querySelectorAll('[data-close-spec]').forEach(b=>b.addEventListener('click',closeSpec));
document.querySelector('.spec-add').addEventListener('click',()=>{
  if(!activeSpecProduct)return; const thickness=document.querySelector('#spec-thickness').value; if(!thickness){document.querySelector('#spec-thickness').focus();showToast('Please select a thickness');return;}
  addConfigured(activeSpecProduct,document.querySelector('#spec-grade').value,thickness,document.querySelector('#spec-size').value.trim(),Math.max(1,Number(document.querySelector('#spec-qty').value)||1),document.querySelector('#spec-notes').value.trim()); closeSpec();
});
document.querySelector('.cart-items').addEventListener('click',e=>{const q=e.target.closest('[data-qty]'),r=e.target.closest('[data-remove]');if(q){const key=q.dataset.qty;if(cart[key]){cart[key].qty=Math.max(0,cart[key].qty+Number(q.dataset.change));if(!cart[key].qty)delete cart[key];save();renderProducts();}}if(r){delete cart[r.dataset.remove];save();renderProducts();}});
document.querySelector('.whatsapp-button').addEventListener('click',()=>{
  const entries=cartEntries(); if(!entries.length)return;
  const name=document.querySelector('#customer-name').value.trim()||'Customer', notes=document.querySelector('#quote-notes').value.trim();
  const lines=entries.map(([,item],i)=>{const p=productByAnyId(item.productId);const specs=[(item.grade||p.grade)?`Grade: ${item.grade||p.grade}`:'',item.thickness?`Thickness: ${item.thickness}`:'',item.size?`Sheet size: ${item.size}`:'',`Qty: ${item.qty}`,item.notes?`Notes: ${item.notes}`:''].filter(Boolean).join(' | ');return `${i+1}. ${p.thicknesses?`${p.brand} `:''}${p.name} (${p.category})\n   ${specs}`;});
  const message=`Hello PK Holding, I would like a quotation.\n\nName / Company: ${name}\n\nPRODUCT REQUIREMENTS\n${lines.join('\n\n')}\n\nProject details: ${notes||'Please contact me for specifications.'}\n\nPlease confirm pricing, availability and delivery.`;
  window.open(`https://wa.me/917736210236?text=${encodeURIComponent(message)}`,'_blank','noopener');
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(document.body.classList.contains('mobile-menu-open'))closeMobileMenu();else if(document.body.classList.contains('spec-open'))closeSpec();else openCart(false);}});

const heroVideos=[...document.querySelectorAll('.why-video-showcase .hero-sequence-video')],heroVideoDots=[...document.querySelectorAll('.why-video-showcase .video-showcase-dots i')],heroSoundButton=document.querySelector('.why-video-showcase [data-video-sound]');let heroVideoIndex=0,heroSoundOn=false;
function syncHeroSound(){heroVideos.forEach(video=>{video.volume=1;if(heroSoundOn){video.muted=false;video.defaultMuted=false;video.removeAttribute('muted');}else{video.muted=true;video.defaultMuted=true;video.setAttribute('muted','');}});if(heroSoundButton){heroSoundButton.classList.toggle('sound-on',heroSoundOn);heroSoundButton.textContent=heroSoundOn?'Sound on':'Click to unmute';}}
function playHeroVideo(index=0){if(!heroVideos.length)return;heroVideoIndex=(index+heroVideos.length)%heroVideos.length;heroVideos.forEach((video,i)=>{const active=i===heroVideoIndex;video.classList.toggle('active',active);video.muted=!heroSoundOn;video.volume=1;video.playsInline=true;video.loop=false;if(active){video.currentTime=0;video.play().catch(()=>{});}else{video.pause();}});heroVideoDots.forEach((dot,i)=>dot.classList.toggle('active',i===heroVideoIndex));syncHeroSound();}
heroVideos.forEach((video,i)=>{video.addEventListener('ended',()=>playHeroVideo(i+1));video.addEventListener('error',()=>playHeroVideo(i+1));});
function unlockHeroSound(){heroSoundOn=true;syncHeroSound();if(heroVideos[heroVideoIndex])heroVideos[heroVideoIndex].play().catch(()=>{});}
if(heroSoundButton)heroSoundButton.addEventListener('click',unlockHeroSound);
document.querySelector('.why-video-showcase [data-video-next]')?.addEventListener('click',e=>{e.stopPropagation();playHeroVideo(heroVideoIndex+1);});
document.querySelector('.why-video-showcase [data-video-prev]')?.addEventListener('click',e=>{e.stopPropagation();playHeroVideo(heroVideoIndex-1);});
document.querySelector('.why-video-showcase')?.addEventListener('click',e=>{if(e.target.closest('[data-video-sound]'))return;unlockHeroSound();});
document.addEventListener('pointerdown',e=>{if(e.target.closest('.why-video-showcase'))unlockHeroSound();},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&heroVideos[heroVideoIndex])heroVideos[heroVideoIndex].play().catch(()=>{});});
playHeroVideo(0);
renderFilters();renderProducts();updateCount();renderCart();
function settleWhyUsScroll(){const target=document.querySelector('#why-us');if(!target||location.hash!=='#why-us')return;window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY,behavior:'auto'});}
requestAnimationFrame(settleWhyUsScroll);
setTimeout(settleWhyUsScroll,180);
setTimeout(settleWhyUsScroll,650);
window.addEventListener('hashchange',()=>setTimeout(settleWhyUsScroll,80));
