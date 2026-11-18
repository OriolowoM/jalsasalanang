const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedZones() {
  console.log('Seeding ZoneTraffic for Jamia Ahmadiyya Ilaro...');

  // Clear existing zone traffic data to prevent duplicate keys
  await prisma.zoneTraffic.deleteMany({});

  // 1. Auxiliary Dining Marquee B (Male)
  const auxDining = await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'aux-dining-male',
      name: 'Auxiliary Dining Marquee B (Men)',
      type: 'DINING',
      status: 'GREEN',
      currentOccupancy: 380,
      maxCapacity: 1500,
      alternateNote: 'Directly behind Administrative Block; spacious seating available.',
      mapCoordinates: { x: 38, y: 48, label: 'Aux Dining B' },
      lastUpdatedBy: 'Logistics Command',
    },
  });

  // 2. Main Dining Hall (Male) -> points to auxDining as alternate
  await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'main-dining-male',
      name: 'Main Dining Hall (Men)',
      type: 'DINING',
      status: 'RED',
      currentOccupancy: 2450,
      maxCapacity: 2500,
      alternateZoneId: auxDining.id,
      alternateNote: 'Capacity reached. Delegates redirected to Auxiliary Dining Marquee B (3 min walk).',
      mapCoordinates: { x: 32, y: 42, label: 'Main Dining (Men)' },
      lastUpdatedBy: 'Food Committee Lead',
    },
  });

  // 3. Lajna Annex Dining (Female)
  const lajnaAnnex = await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'lajna-dining-annex',
      name: 'Lajna Annex Dining Pavilion',
      type: 'DINING',
      status: 'GREEN',
      currentOccupancy: 290,
      maxCapacity: 1200,
      alternateNote: 'Situated adjacent to Lajna Guest Lodge.',
      mapCoordinates: { x: 74, y: 38, label: 'Lajna Dining Annex' },
      lastUpdatedBy: 'Lajna Welfare Team',
    },
  });

  // 4. Lajna Main Dining
  await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'lajna-dining-main',
      name: 'Lajna Main Dining Complex',
      type: 'DINING',
      status: 'ORANGE',
      currentOccupancy: 1820,
      maxCapacity: 2200,
      alternateZoneId: lajnaAnnex.id,
      alternateNote: 'Fast moving queues; Annex Dining available for nursing mothers and elders.',
      mapCoordinates: { x: 68, y: 32, label: 'Lajna Main Dining' },
      lastUpdatedBy: 'Lajna Food Sec.',
    },
  });

  // 5. West Registration Hub (Gate 2)
  const gateWest = await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'gate-west-2',
      name: 'West Registration Hub & Gate 2',
      type: 'ENTRANCE',
      status: 'GREEN',
      currentOccupancy: 1800,
      maxCapacity: 6000,
      alternateNote: '8 high-speed biometric scanning lanes active; zero queue delay.',
      mapCoordinates: { x: 18, y: 65, label: 'Gate 2 (West)' },
      lastUpdatedBy: 'Security Protocol',
    },
  });

  // 6. North Main Gate 1 -> points to West Gate 2
  await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'gate-north-1',
      name: 'North Expressway Gate 1',
      type: 'ENTRANCE',
      status: 'RED',
      currentOccupancy: 4850,
      maxCapacity: 5000,
      alternateZoneId: gateWest.id,
      alternateNote: 'Heavy arrival influx on expressway. Follow marshals to Gate 2 (West Entrance).',
      mapCoordinates: { x: 22, y: 15, label: 'Gate 1 (North)' },
      lastUpdatedBy: 'Traffic Marshall',
    },
  });

  // 7. Ablution Complex B (Behind Minaret)
  const ablutionB = await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'sanitary-men-b',
      name: 'Ablution Complex B (Behind Minaret)',
      type: 'SANITARY',
      status: 'GREEN',
      currentOccupancy: 85,
      maxCapacity: 350,
      alternateNote: '120 running water taps open with instant access.',
      mapCoordinates: { x: 46, y: 28, label: 'Ablution B' },
      lastUpdatedBy: 'Sanitation Corps',
    },
  });

  // 8. Main Sanitary & Ablution A -> points to B
  await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'sanitary-men-a',
      name: 'Main Ablution Complex A (Front Courtyard)',
      type: 'SANITARY',
      status: 'RED',
      currentOccupancy: 395,
      maxCapacity: 400,
      alternateZoneId: ablutionB.id,
      alternateNote: 'Peak prayer rush. Proceed 50 meters east to Ablution Complex B.',
      mapCoordinates: { x: 42, y: 22, label: 'Ablution A (Front)' },
      lastUpdatedBy: 'Sanitation Corps',
    },
  });

  // 9. Lajna Sanitary & Ablution Complex
  await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'sanitary-women-a',
      name: 'Lajna Ablution & Sanitary Complex',
      type: 'SANITARY',
      status: 'GREEN',
      currentOccupancy: 210,
      maxCapacity: 500,
      alternateNote: 'Comfortable capacity with full utility services.',
      mapCoordinates: { x: 80, y: 44, label: 'Lajna Sanitary' },
      lastUpdatedBy: 'Lajna Sanitation',
    },
  });

  // 10. Main Convention Prayer Marquee (Men)
  await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'main-prayer-hall',
      name: 'Main Convention Prayer Marquee (Men)',
      type: 'PRAYER',
      status: 'GREEN',
      currentOccupancy: 8400,
      maxCapacity: 15000,
      alternateNote: 'Front rows filling; Center and rear aisles open with high-definition audio monitors.',
      mapCoordinates: { x: 48, y: 55, label: 'Main Prayer Marquee' },
      lastUpdatedBy: 'Protocol Desk',
    },
  });

  // 11. Lajna Main Prayer Pavilion
  await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'lajna-prayer-pavilion',
      name: 'Lajna Main Prayer Pavilion',
      type: 'PRAYER',
      status: 'GREEN',
      currentOccupancy: 6900,
      maxCapacity: 12000,
      alternateNote: 'Ample seating in sections C through F with live video stream projection.',
      mapCoordinates: { x: 72, y: 62, label: 'Lajna Prayer Pavilion' },
      lastUpdatedBy: 'Lajna Protocol',
    },
  });

  // 12. Central Medical Clinic & Emergency Post
  await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'medical-center',
      name: 'Central Ahmadiyya Medical Clinic',
      type: 'CLINIC',
      status: 'GREEN',
      currentOccupancy: 18,
      maxCapacity: 120,
      alternateNote: 'Doctors on duty 24/7. First aid, triage, and pharmacy fully stocked.',
      mapCoordinates: { x: 55, y: 35, label: 'Medical Clinic' },
      lastUpdatedBy: 'Ahmadiyya Medical Guild',
    },
  });

  // 13. West Parking & Convoy Terminal
  await prisma.zoneTraffic.create({
    data: {
      zoneKey: 'parking-west',
      name: 'West Convoy & Bus Terminal',
      type: 'PARKING',
      status: 'GREEN',
      currentOccupancy: 540,
      maxCapacity: 1200,
      alternateNote: 'Sectors 1 to 4 open for interstate buses and chartered vehicles.',
      mapCoordinates: { x: 12, y: 78, label: 'West Parking' },
      lastUpdatedBy: 'Traffic Marshals',
    },
  });

  console.log('Successfully seeded 13 ZoneTraffic nodes with active capacity metrics and alternate reroutes.');
  await prisma.$disconnect();
}

seedZones().catch((e) => {
  console.error(e);
  process.exit(1);
});
