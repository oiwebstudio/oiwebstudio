import fs from 'fs';
import path from 'path';

const SEO_DATA = {
  gimnasio: {
    keywords: 'gimnasio Tolosa, fitness, entrenamiento, clases, pesas, cardio, crossfit, HIIT',
    ogImage: '/og-gimnasio.jpg',
    canonical: 'https://ironpulse-tolosa.com',
    businessType: 'HealthAndBeautyBusiness',
    url: 'https://ironpulse-tolosa.com'
  },
  panaderia: {
    keywords: 'panadería Tolosa, pan artesano, masa madre, pan tradicional, repostería, encargos',
    ogImage: '/og-panaderia.jpg',
    canonical: 'https://errotaberri-panaderia.com',
    businessType: 'LocalBusiness',
    url: 'https://errotaberri-panaderia.com'
  },
  floristeria: {
    keywords: 'florería Tolosa, flores, ramos, bodas, eventos, arreglos florales, envíos',
    ogImage: '/og-floristeria.jpg',
    canonical: 'https://lore-floristeria.com',
    businessType: 'LocalBusiness',
    url: 'https://lore-floristeria.com'
  },
  cafeteria: {
    keywords: 'cafetería Tolosa, café, desayunos, tostadas, wifi, espacio tranquilo',
    ogImage: '/og-cafeteria.jpg',
    canonical: 'https://maderapcafe.com',
    businessType: 'CafeOrCoffeeShop',
    url: 'https://maderapcafe.com'
  },
  restaurante: {
    keywords: 'restaurante Tolosa, comida vasca, menú, reservas, eventos, gastronomía',
    ogImage: '/og-restaurante.jpg',
    canonical: 'https://fuegosyal.com',
    businessType: 'Restaurant',
    url: 'https://fuegosyal.com'
  },
  peluqueria: {
    keywords: 'peluquería Tolosa, corte, color, peinado, tratamientos, estilista',
    ogImage: '/og-peluqueria.jpg',
    canonical: 'https://studionoir-peluqueria.com',
    businessType: 'BeautySalon',
    url: 'https://studionoir-peluqueria.com'
  },
  taller: {
    keywords: 'taller mecánico Tolosa, reparación coches, presupuesto, mantenimiento, piezas',
    ogImage: '/og-taller.jpg',
    canonical: 'https://garajenorte.com',
    businessType: 'AutoRepair',
    url: 'https://garajenorte.com'
  },
  veterinaria: {
    keywords: 'veterinaria Tolosa, veterinario, mascotas, urgencias, vacunas, consultas',
    ogImage: '/og-veterinaria.jpg',
    canonical: 'https://vetcare-tolosa.com',
    businessType: 'VeterinaryCare',
    url: 'https://vetcare-tolosa.com'
  }
};

const BUSINESS_NAMES = {
  gimnasio: 'IRONPULSE',
  panaderia: 'Errotaberri',
  floristeria: 'Lore Floristería',
  cafeteria: 'Madera Café',
  restaurante: 'Fuego & Sal',
  peluqueria: 'Studio Noir',
  taller: 'Garaje Norte',
  veterinaria: 'VetCare'
};

function generateSchemaMarkup(business, title, description, address, phone, hours, seo) {
  return `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "${seo.businessType}",
    "name": "${BUSINESS_NAMES[business]}",
    "description": "${description.replace(/"/g, '\\"')}",
    "url": "${seo.url}",
    "telephone": "${phone}",
    "image": "${seo.ogImage}",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "${address}",
      "addressCountry": "ES",
      "addressRegion": "Gipuzkoa",
      "addressLocality": "Tolosa"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "43.2008",
      "longitude": "-1.8042"
    }
  }
  </script>`;
}

function injectSEO(filePath, business) {
  const seo = SEO_DATA[business];
  if (!seo) return false;

  let html = fs.readFileSync(filePath, 'utf8');

  // Extract title and description
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  const phoneMatch = html.match(/\+?\d{3}[\s-]?\d{2,3}[\s-]?\d{2,3}[\s-]?\d{2,3}/);
  const addressMatch = html.match(/📍\s*([^<\n]+)/);

  if (!titleMatch || !descMatch) return false;

  const title = titleMatch[1];
  const description = descMatch[1];
  const phone = phoneMatch ? phoneMatch[0].replace(/[\s-]/g, '') : '600000000';
  const address = addressMatch ? addressMatch[1].trim() : 'Tolosa, Gipuzkoa';

  // Check if SEO tags already exist
  if (html.includes('name="keywords"')) return false;

  // Build SEO tags to inject
  const seoTags = `<meta name="keywords" content="${seo.keywords}"/>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="${seo.canonical}"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${description}"/>
<meta property="og:image" content="${seo.ogImage}"/>
<meta property="og:url" content="${seo.url}"/>
<meta property="og:type" content="website"/>
<meta property="og:locale" content="es_ES"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${title}"/>
<meta name="twitter:description" content="${description}"/>
<meta name="twitter:image" content="${seo.ogImage}"/>`;

  // Inject after description meta tag
  const insertPoint = html.indexOf('</head>');
  const newHead = html.slice(0, insertPoint) + '\n' + seoTags + '\n' + generateSchemaMarkup(business, title, description, address, phone, '', seo) + '\n' + html.slice(insertPoint);

  fs.writeFileSync(filePath, newHead, 'utf8');
  console.log(`✅ SEO mejorado: ${business}`);
  return true;
}

// Main
const businesses = Object.keys(BUSINESS_NAMES);
const basePath = './webs-clientes';

for (const business of businesses) {
  const filePath = path.join(basePath, business, 'index.html');
  try {
    if (injectSEO(filePath, business)) {
      // Success
    }
  } catch (err) {
    console.log(`❌ ${business}: ${err.message}`);
  }
}

console.log('\n✨ SEO inyectado en todas las webs');
