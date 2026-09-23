import { db } from './db';

async function main() {
  const utesa = await db.orm.public.Branch.upsert({
    create: {
      name: 'Utesa',
      address: 'UTESA, Av. Isabel Aguiar, Santo Domingo Oeste',
      notes: 'Piscina semiolímpica con carriles oficiales',
    },
    update: {},
    conflictOn: { name: 'Utesa' },
  });

  const vivirmas = await db.orm.public.Branch.upsert({
    create: {
      name: 'VivirMás',
      address: 'VivirMás, Sector El Millón, Santo Domingo',
      notes: 'Piscina adaptada para iniciación infantil y desarrollo acuático',
    },
    update: {},
    conflictOn: { name: 'VivirMás' },
  });

  const utesaSchedules = [
    {
      day: 'Lunes',
      ageGroup: 'Niños de 4 años en adelante y adultos',
      time: '5:00 PM',
      category: 'Infantil / Adultos',
      notes: 'Grupo mixto de niños y adultos',
    },
    {
      day: 'Lunes',
      ageGroup: 'Niños de 4 años en adelante y adultos',
      time: '6:00 PM',
      category: 'Infantil / Adultos',
      notes: 'Grupo mixto de niños y adultos',
    },
    {
      day: 'Viernes',
      ageGroup: 'Adultos',
      time: '8:00 PM',
      category: 'Adultos',
      notes: 'Turno nocturno exclusivo para adultos',
    },
    {
      day: 'Sábados',
      ageGroup: 'Adultos',
      time: '2:00 PM',
      category: 'Adultos',
      notes: 'Turno vespertino exclusivo para adultos',
    },
    {
      day: 'Domingo',
      ageGroup: 'Niños de 4 años en adelante y adultos',
      time: '8:00 AM',
      category: 'Infantil / Adultos',
      notes: 'Grupo mixto de niños y adultos',
    },
  ];

  const vivirmasSchedules = [
    {
      day: 'Viernes',
      ageGroup: '4 años en adelante',
      time: '4:00 PM',
      category: 'Infantil / Juvenil',
      notes: 'Nivel principiante e intermedio',
    },
    {
      day: 'Viernes',
      ageGroup: '4 años en adelante',
      time: '5:00 PM',
      category: 'Infantil / Juvenil',
      notes: 'Técnica y resistencia acuática',
    },
    {
      day: 'Sábados',
      ageGroup: 'Desde 2 años',
      time: '2:00 PM',
      category: 'Iniciación Temprana',
      notes: 'Piscina adaptada poco profunda',
    },
    {
      day: 'Sábados',
      ageGroup: 'Desde 2 años',
      time: '3:00 PM',
      category: 'Iniciación Temprana',
      notes: 'Estimulación y confianza en el agua',
    },
    {
      day: 'Sábados',
      ageGroup: '4 años en adelante',
      time: '4:00 PM',
      category: 'Infantil y Grupal',
      notes: 'Perfeccionamiento de estilos',
    },
  ];

  const existingClasses = await db.orm.public.SwimClass.all();
  if (existingClasses.length > 0) {
    console.log('SwimClass ya tiene datos, se omite la siembra de horarios.');
  } else {
    for (const item of utesaSchedules) {
      await db.orm.public.SwimClass.create({ branchId: utesa.id, ...item });
    }
    for (const item of vivirmasSchedules) {
      await db.orm.public.SwimClass.create({ branchId: vivirmas.id, ...item });
    }
    console.log(`Sembrados ${utesaSchedules.length + vivirmasSchedules.length} horarios.`);
  }

  console.log('Seed completado.');
  await db.close();
}

main().catch(async (error) => {
  console.error(error);
  await db.close();
  process.exit(1);
});
