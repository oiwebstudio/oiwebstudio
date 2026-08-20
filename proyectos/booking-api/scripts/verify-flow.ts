// Smoke test manual del motor de reservas: completa una conversación end-to-end
// y comprueba que una carrera por el mismo horario no produce doble reserva.
// Uso: npm run verify (requiere DATABASE_URL apuntando a una base ya migrada/seedeada).
import { prisma } from "../src/prisma.js";
import { processTurn, initialState, type ChatState } from "../src/conversation.js";

async function reachConfirmState(businessSlug: string, log: boolean) {
  const business = await prisma.business.findUniqueOrThrow({ where: { slug: businessSlug } });
  const state: ChatState = initialState();

  let result = await processTurn(business.id, state, { value: "" });
  if (log) console.log("1) GREETING ->", result.messages.map((m) => m.text).join(" | "));

  result = await processTurn(business.id, result.state, { value: "start_booking" });
  if (log) console.log("2) SELECT_SERVICE ->", result.messages[0].text, result.messages[0].quickReplies?.map((q) => q.label));
  const serviceId = result.messages[0].quickReplies![0].value;

  result = await processTurn(business.id, result.state, { value: serviceId });
  if (log) console.log("3) SELECT_DATE ->", result.messages[0].text, result.messages[0].quickReplies?.map((q) => q.label));
  const dateValue = result.messages[0].quickReplies![0].value;

  result = await processTurn(business.id, result.state, { value: dateValue });
  if (log) console.log("4) SELECT_SLOT ->", result.messages[0].text, result.messages[0].quickReplies?.map((q) => q.label));
  const slotValue = result.messages[0].quickReplies![0].value;

  result = await processTurn(business.id, result.state, { value: slotValue });
  if (log) console.log("5) COLLECT_NAME ->", result.messages[0].text);

  result = await processTurn(business.id, result.state, { value: "Ana Ejemplo" });
  if (log) console.log("6) COLLECT_PHONE ->", result.messages[0].text);

  result = await processTurn(business.id, result.state, { value: "+34 600 111 222" });
  if (log) console.log("7) CONFIRM ->", result.messages[0].text);

  return { business, stateBeforeConfirm: result.state };
}

async function runFullBooking(businessSlug: string) {
  const { business, stateBeforeConfirm } = await reachConfirmState(businessSlug, true);

  const result = await processTurn(business.id, stateBeforeConfirm, { value: "confirm" });
  console.log("8) BOOKED ->", result.messages[0].text, "| status:", result.status);

  const bookingsCount = await prisma.booking.count({ where: { businessId: business.id } });
  const customer = await prisma.customer.findFirst({ where: { businessId: business.id, phone: "+34 600 111 222" } });
  console.log(`   Reservas en BD para ${businessSlug}: ${bookingsCount}, cliente creado: ${customer?.name}`);
}

async function testDoubleBooking(businessSlug: string) {
  console.log(`\n--- Test de carrera en "${businessSlug}" (capacidad 1): dos confirmaciones simultáneas del mismo horario ---`);
  const { business, stateBeforeConfirm } = await reachConfirmState(businessSlug, false);
  const before = await prisma.booking.count({ where: { businessId: business.id } });

  const [r1, r2] = await Promise.all([
    processTurn(business.id, stateBeforeConfirm, { value: "confirm" }),
    processTurn(business.id, stateBeforeConfirm, { value: "confirm" }),
  ]);

  const after = await prisma.booking.count({ where: { businessId: business.id } });
  console.log("Resultado 1:", r1.messages[0].text);
  console.log("Resultado 2:", r2.messages[0].text);
  console.log(`Reservas antes: ${before}, después: ${after} (esperado +1, no +2)`);
}

async function main() {
  await runFullBooking("peluqueria");
  await testDoubleBooking("veterinaria");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
