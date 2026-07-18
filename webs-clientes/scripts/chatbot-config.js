// Configuración del chatbot para cada negocio
const CHATBOT_CONFIG = {
  gimnasio: {
    nombre: 'IRONPULSE',
    tipo: 'Gimnasio',
    color: '#d7ff3e',
    colorBg: '#0b0b0d',
    emoji: '💪',
    telefono: '+34600000000',
    whatsapp: '34600000000',
    ubicacion: 'Polígono Apattaerreka, s/n, 20400 Tolosa',
    horario: '24 horas',
    email: 'hola@ironpulse.eus',
    respuestas: {
      saludo: '¡Hola! 👋 Soy el asistente de IRONPULSE. ¿Cómo puedo ayudarte? Puedo contarte sobre nuestros planes, clases o agendar tu prueba gratis.',
      planes: 'Tenemos 3 planes:\n💚 Flex: 29€/mes - Acceso a sala\n💛 Pulse: 45€/mes - Flex + clases ilimitadas\n🔴 Iron: 69€/mes - Todo incluido con entrenador personal',
      horario: '⏰ Abrimos 24 horas, 365 días. ¡Entrena cuando quieras!',
      ubicacion: '📍 Polígono Apattaerreka, s/n\n20400 Tolosa, Gipuzkoa',
      contacto: '📞 +34 600 00 00 00\n📧 hola@ironpulse.eus'
    }
  },
  panaderia: {
    nombre: 'Errotaberri',
    tipo: 'Panadería',
    color: '#c07a35',
    colorBg: '#f5f0e8',
    colorText: '#2c231b',
    emoji: '🥖',
    telefono: '+34943000000',
    whatsapp: '34943000000',
    ubicacion: 'Calle Principal, Tolosa',
    horario: 'Lunes a Sábado: 7:00-14:00 y 17:00-20:30',
    email: 'info@errotaberri.eus',
    respuestas: {
      saludo: '¡Hola! 👋 Bienvenido a Errotaberri. ¿En qué puedo ayudarte? Contamos sobre nuestros panes artesanos, horarios o encargos especiales.',
      productos: 'Nuestras especialidades:\n🥖 Pan de masa madre\n🍞 Pan integral fermentación lenta\n🥐 Croissants artesanos\n🎂 Tartas y repostería',
      horario: '⏰ Lunes a Sábado: 7:00-14:00 y 17:00-20:30\n(Domingos cerrado)',
      ubicacion: '📍 Calle Principal, Tolosa',
      contacto: '📞 +34 943 00 00 00\n📧 info@errotaberri.eus'
    }
  },
  floristeria: {
    nombre: 'Florística',
    tipo: 'Floristería',
    color: '#d97a9f',
    colorBg: '#f9f2f0',
    colorText: '#43373a',
    emoji: '🌹',
    telefono: '+34943111111',
    whatsapp: '34943111111',
    ubicacion: 'Calle Flores, Tolosa',
    horario: 'Lunes a Sábado: 9:00-14:00 y 16:00-19:30',
    email: 'flores@floristica.eus',
    respuestas: {
      saludo: '¡Hola! 👋 Bienvenido a Florística. ¿Necesitas un ramo especial o arreglo floral? Te ayudo encantado.',
      servicios: 'Ofrecemos:\n🌹 Ramos personalizados\n💐 Arreglos florales\n💍 Flores para bodas\n🎉 Decoración eventos\n🚚 Envíos a domicilio',
      horario: '⏰ Lunes a Sábado: 9:00-14:00 y 16:00-19:30\n(Domingos previa cita)',
      ubicacion: '📍 Calle Flores, Tolosa',
      contacto: '📞 +34 943 11 11 11\n📧 flores@floristica.eus'
    }
  },
  cafeteria: {
    nombre: 'Café & Co',
    tipo: 'Cafetería',
    color: '#8b6f47',
    colorBg: '#faf6f0',
    colorText: '#2f2119',
    emoji: '☕',
    telefono: '+34943222222',
    whatsapp: '34943222222',
    ubicacion: 'Calle Café, Tolosa',
    horario: 'Lunes a Viernes: 8:00-21:00 | Sábado y Domingo: 10:00-22:00',
    email: 'info@cafeandco.eus',
    respuestas: {
      saludo: '¡Hola! ☕ Bienvenido a Café & Co. ¿Qué puedo ofrecerte hoy? Tenemos café, desayunos y comidas caseras.',
      menu: 'Nuestras especialidades:\n☕ Cafés artesanales\n🥐 Desayunos completos\n🍽️ Comidas caseras\n🍰 Repostería casera\n🥤 Bebidas refrescantes',
      horario: '⏰ L-V: 8:00-21:00\nS-D: 10:00-22:00',
      ubicacion: '📍 Calle Café, Tolosa',
      contacto: '📞 +34 943 22 22 22\n📧 info@cafeandco.eus'
    }
  },
  restaurante: {
    nombre: 'ElXoko',
    tipo: 'Restaurante',
    color: '#d4a574',
    colorBg: '#161210',
    emoji: '🍽️',
    telefono: '+34943333333',
    whatsapp: '34943333333',
    ubicacion: 'Plaza Mayor, Tolosa',
    horario: 'Martes a Domingo: 13:00-16:00 y 19:30-23:00 | Lunes cerrado',
    email: 'reservas@elxoko.eus',
    respuestas: {
      saludo: '¡Hola! 🍽️ Bienvenido a ElXoko. ¿Deseas conocer nuestro menú, hacer una reserva o consultar horarios?',
      menu: 'Nuestra cocina:\n🥩 Carnes de primera calidad\n🐟 Pescados frescos\n🥘 Platos tradicionales\n🍷 Selección de vinos',
      horario: '⏰ Martes a Domingo: 13:00-16:00 y 19:30-23:00\n(Lunes cerrado)',
      ubicacion: '📍 Plaza Mayor, Tolosa',
      contacto: '📞 +34 943 33 33 33\n📧 reservas@elxoko.eus'
    }
  },
  peluqueria: {
    nombre: 'StyLe',
    tipo: 'Peluquería',
    color: '#e08fa5',
    colorBg: '#111013',
    emoji: '✂️',
    telefono: '+34943444444',
    whatsapp: '34943444444',
    ubicacion: 'Avenida Central, Tolosa',
    horario: 'Martes a Viernes: 10:00-20:00 | Sábado: 9:00-19:00 | Domingo y Lunes: Cerrado',
    email: 'citas@style.eus',
    respuestas: {
      saludo: '¡Hola! ✂️ Bienvenido a StyLe. ¿Necesitas un corte, tratamiento o reservar cita? Estamos aquí para ti.',
      servicios: 'Nuestros servicios:\n✂️ Corte y peinado\n💇 Tintes profesionales\n💆 Tratamientos capilar\n💅 Manicura\n🧖 Tratamientos belleza',
      horario: '⏰ Martes a Viernes: 10:00-20:00\nSábado: 9:00-19:00\n(Dom-Lun cerrado)',
      ubicacion: '📍 Avenida Central, Tolosa',
      contacto: '📞 +34 943 44 44 44\n📧 citas@style.eus'
    }
  },
  taller: {
    nombre: 'MecaTaller',
    tipo: 'Taller Mecánico',
    color: '#4a90e2',
    colorBg: '#101418',
    emoji: '🔧',
    telefono: '+34943555555',
    whatsapp: '34943555555',
    ubicacion: 'Polígono Industrial, Tolosa',
    horario: 'Lunes a Viernes: 9:00-13:30 y 15:30-19:30 | Sábado: 9:00-13:00',
    email: 'info@mecataller.eus',
    respuestas: {
      saludo: '¡Hola! 🔧 Bienvenido a MecaTaller. ¿En qué puedo ayudarte? Revisionamos, reparamos y mantenemos todo tipo de vehículos.',
      servicios: 'Nuestros servicios:\n🔧 Reparaciones generales\n🛢️ Cambios de aceite\n⚙️ Revisiones técnicas\n🔩 Mantenimiento\n🛞 Cambio de neumáticos',
      horario: '⏰ Lunes a Viernes: 9:00-13:30 y 15:30-19:30\nSábado: 9:00-13:00',
      ubicacion: '📍 Polígono Industrial, Tolosa',
      contacto: '📞 +34 943 55 55 55\n📧 info@mecataller.eus'
    }
  },
  veterinaria: {
    nombre: 'VetCare',
    tipo: 'Clínica Veterinaria',
    color: '#2ba8a4',
    colorBg: '#e4f4f3',
    colorText: '#1a1a1a',
    emoji: '🐾',
    telefono: '+34943666666',
    whatsapp: '34943666666',
    ubicacion: 'Calle Animales, Tolosa',
    horario: 'Lunes a Viernes: 9:00-14:00 y 16:00-20:00 | Sábado: 10:00-14:00',
    email: 'contacto@vetcare.eus',
    respuestas: {
      saludo: '¡Hola! 🐾 Bienvenido a VetCare. Cuidamos de tus mascotas como si fueran propias. ¿Cómo podemos ayudarte?',
      servicios: 'Nuestros servicios:\n🐾 Consultas veterinarias\n💊 Tratamientos y medicinas\n🦷 Limpieza dental\n💉 Vacunaciones\n🏥 Cirugías',
      horario: '⏰ Lunes a Viernes: 9:00-14:00 y 16:00-20:00\nSábado: 10:00-14:00',
      ubicacion: '📍 Calle Animales, Tolosa',
      contacto: '📞 +34 943 66 66 66\n📧 contacto@vetcare.eus'
    }
  }
};
