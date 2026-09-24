import type { Locale } from "@/lib/i18n";
import { stores, type Store } from "@/lib/stores";

/**
 * Preguntas frecuentes de la home. Cada una responde a una búsqueda real de la
 * zona ("panadería abierta domingo Tolosa", "dónde tomar un café en Tolosa"…).
 *
 * Horarios y teléfonos salen de stores.ts, no se escriben a mano: si cambia un
 * horario, cambia aquí también y el FAQ nunca contradice al resto de la web.
 */
export type FaqItem = { q: string; a: string };

const byId = (id: string) => stores.find((s) => s.id === id)!;

/** "7:30–14:00 / 16:00–20:30" → "7:30–14:00 y 16:00–20:30" */
function shifts(schedule: string | undefined, and: string): string {
  return (schedule ?? "").split("/").map((s) => s.trim()).join(` ${and} `);
}

function opensAt(store: Store): string {
  return (store.hours?.weekday ?? "").split(/[–-]/)[0].trim();
}

export function buildFaq(locale: Locale): FaqItem[] {
  const andia = byId("tolosa-andia");
  const sf = byId("tolosa-san-frantzisko");
  const anoeta = byId("anoeta");

  if (locale === "eu") {
    return [
      {
        q: "Non dago okindegi bat Tolosan?",
        a: `Errotatxok bi denda ditu Tolosan: ${andia.street}, Alde Zaharrean, eta ${sf.street}, ibaiaren ondoan, kafetegia ere badena. Hirugarrena Anoetan dago, ${anoeta.street}.`,
      },
      {
        q: "Ba al dago okindegirik irekita igandean Tolosan?",
        a: `Bai. Errotatxoren hiru dendak larunbat eta igande goizetan irekitzen dira: Andia ${andia.hours?.weekend}, San Frantzisko ${sf.hours?.weekend} eta Anoeta ${anoeta.hours?.weekend}.`,
      },
      {
        q: "Non hartu kafe bat Tolosan?",
        a: `Errotatxoren San Frantziskoko kafetegian (${sf.street}): kafea barran edo mahaian, eguneko ogi eta opilekin. Astelehenetik ostiralera ${shifts(sf.hours?.weekday, "eta")}, eta asteburuetan ${sf.hours?.weekend}.`,
      },
      {
        q: "Zer ordutan irekitzen da okindegia goizean?",
        a: `${opensAt(andia)}etan Andian (Tolosa) eta Anoetan, eta ${opensAt(sf)}etan San Frantziskon.`,
      },
      {
        q: "Ba al dago okindegirik Anoetan?",
        a: `Bai, Errotatxok denda du ${anoeta.street}. Astelehenetik ostiralera ${shifts(anoeta.hours?.weekday, "eta")}, eta larunbat eta igandeetan ${anoeta.hours?.weekend}. Telefonoa: ${anoeta.phone}.`,
      },
      {
        q: "Pastelgintza ere baduzue?",
        a: "Bai: Errotatxo okindegia eta gozotegia da. Ogiaz gain, opilak, galletak, pastak eta gozokiak daude, baita oparitzeko kaxetan ere.",
      },
      {
        q: "Nola egin enkargu bat?",
        a: `Hurbilen duzun dendara deituta: Andia ${andia.phone}, San Frantzisko ${sf.phone}, Anoeta ${anoeta.phone}.`,
      },
    ];
  }

  return [
    {
      q: "¿Dónde hay una panadería en Tolosa?",
      a: `Errotatxo tiene dos tiendas en Tolosa: ${andia.street}, en el casco viejo, y ${sf.street}, junto al río, que además es cafetería. La tercera está en Anoeta, en ${anoeta.street}.`,
    },
    {
      q: "¿Hay alguna panadería abierta el domingo en Tolosa?",
      a: `Sí. Las tres tiendas de Errotatxo abren los sábados y domingos por la mañana: Andia de ${andia.hours?.weekend}, San Frantzisko de ${sf.hours?.weekend} y Anoeta de ${anoeta.hours?.weekend}.`.replace(/de (\d+:\d+)–(\d+:\d+)/g, "de $1 a $2"),
    },
    {
      q: "¿Dónde tomar un café en Tolosa?",
      a: `En la cafetería de Errotatxo en ${sf.street}: café en la barra o en mesa, con el pan y la bollería del día. Abre de lunes a viernes, ${shifts(sf.hours?.weekday, "y")}, y los fines de semana, ${sf.hours?.weekend}.`,
    },
    {
      q: "¿A qué hora abre la panadería por la mañana?",
      a: `A las ${opensAt(andia)} en Andia (Tolosa) y en Anoeta, y a las ${opensAt(sf)} en San Frantzisko.`,
    },
    {
      q: "¿Hay panadería en Anoeta?",
      a: `Sí, Errotatxo tiene tienda en ${anoeta.street}. Abre de lunes a viernes, ${shifts(anoeta.hours?.weekday, "y")}, y sábados y domingos, ${anoeta.hours?.weekend}. Teléfono: ${anoeta.phone}.`,
    },
    {
      q: "¿Tenéis pastelería además de pan?",
      a: "Sí: Errotatxo es panadería y pastelería, okindegia y gozotegia. Además del pan hay bollería, galletas, pastas y dulces, también en caja para regalar.",
    },
    {
      q: "¿Cómo puedo hacer un encargo?",
      a: `Llamando a la tienda que te quede más cerca: Andia ${andia.phone}, San Frantzisko ${sf.phone}, Anoeta ${anoeta.phone}.`,
    },
  ];
}
