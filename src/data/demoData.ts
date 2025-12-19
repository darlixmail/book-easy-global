// Demo data for Glamour Studio Tel Aviv hair salon

export const demoBusiness = {
  id: 'demo-business-1',
  name: 'Glamour Studio Tel Aviv',
  description: 'Premium hair salon & beauty center in the heart of Tel Aviv',
  address: 'Dizengoff 123, Tel Aviv',
  contact_email: 'info@glamourstudio.co.il',
  contact_phone: '+972-3-555-1234',
  user_id: 'demo-user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoEmployees = [
  {
    id: 'emp-1',
    name: 'Maya Cohen',
    email: 'maya@glamourstudio.co.il',
    phone: '+972-50-111-1111',
    photo_url: null,
    business_id: 'demo-business-1',
    active: true,
    role: 'Hair Master',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'emp-2',
    name: 'Yael Levi',
    email: 'yael@glamourstudio.co.il',
    phone: '+972-50-222-2222',
    photo_url: null,
    business_id: 'demo-business-1',
    active: true,
    role: 'Hair Master',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'emp-3',
    name: 'Noa Goldberg',
    email: 'noa@glamourstudio.co.il',
    phone: '+972-50-333-3333',
    photo_url: null,
    business_id: 'demo-business-1',
    active: true,
    role: 'Hair Master',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'emp-4',
    name: 'Shira Azulay',
    email: 'shira@glamourstudio.co.il',
    phone: '+972-50-444-4444',
    photo_url: null,
    business_id: 'demo-business-1',
    active: true,
    role: 'Nail Master',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'emp-5',
    name: 'Tamar Mizrahi',
    email: 'tamar@glamourstudio.co.il',
    phone: '+972-50-555-5555',
    photo_url: null,
    business_id: 'demo-business-1',
    active: true,
    role: 'Nail Master',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'emp-6',
    name: 'Dana Ben-David',
    email: 'dana@glamourstudio.co.il',
    phone: '+972-50-666-6666',
    photo_url: null,
    business_id: 'demo-business-1',
    active: true,
    role: 'Cosmetic Specialist',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const demoServices = [
  // Hair services
  {
    id: 'svc-1',
    name: 'Women\'s Haircut',
    description: 'Professional haircut with consultation and styling',
    price: 180,
    duration_minutes: 45,
    business_id: 'demo-business-1',
    active: true,
    category: 'Hair',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-2',
    name: 'Men\'s Haircut',
    description: 'Classic or modern men\'s haircut',
    price: 80,
    duration_minutes: 30,
    business_id: 'demo-business-1',
    active: true,
    category: 'Hair',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-3',
    name: 'Hair Coloring',
    description: 'Full hair coloring with premium products',
    price: 350,
    duration_minutes: 120,
    business_id: 'demo-business-1',
    active: true,
    category: 'Hair',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-4',
    name: 'Highlights',
    description: 'Partial or full highlights',
    price: 280,
    duration_minutes: 90,
    business_id: 'demo-business-1',
    active: true,
    category: 'Hair',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-5',
    name: 'Blowout & Styling',
    description: 'Professional blowout and styling',
    price: 120,
    duration_minutes: 45,
    business_id: 'demo-business-1',
    active: true,
    category: 'Hair',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Nail services
  {
    id: 'svc-6',
    name: 'Gel Manicure',
    description: 'Long-lasting gel polish manicure',
    price: 120,
    duration_minutes: 60,
    business_id: 'demo-business-1',
    active: true,
    category: 'Nails',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-7',
    name: 'Pedicure',
    description: 'Relaxing spa pedicure treatment',
    price: 150,
    duration_minutes: 75,
    business_id: 'demo-business-1',
    active: true,
    category: 'Nails',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-8',
    name: 'Nail Art',
    description: 'Custom nail art and designs',
    price: 80,
    duration_minutes: 45,
    business_id: 'demo-business-1',
    active: true,
    category: 'Nails',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Cosmetic services
  {
    id: 'svc-9',
    name: 'Facial Treatment',
    description: 'Deep cleansing facial with premium products',
    price: 250,
    duration_minutes: 60,
    business_id: 'demo-business-1',
    active: true,
    category: 'Cosmetic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-10',
    name: 'Eyebrow Shaping',
    description: 'Professional eyebrow threading and shaping',
    price: 60,
    duration_minutes: 20,
    business_id: 'demo-business-1',
    active: true,
    category: 'Cosmetic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'svc-11',
    name: 'Lash Extensions',
    description: 'Full set of premium lash extensions',
    price: 400,
    duration_minutes: 120,
    business_id: 'demo-business-1',
    active: true,
    category: 'Cosmetic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Generate upcoming bookings for the next 7 days
const generateUpcomingBookings = () => {
  const bookings = [];
  const today = new Date();
  const clientNames = [
    'Sarah Abramov', 'Rachel Green', 'Michal Stern', 'Yonit Katz',
    'Liora Shapiro', 'Efrat Weiss', 'Orly Peretz', 'Gila Friedman',
    'Hadas Rosen', 'Tali Avraham', 'Ronit Ben-Ari', 'Dikla Segal',
  ];
  const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  
  let bookingId = 1;
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const bookingDate = new Date(today);
    bookingDate.setDate(today.getDate() + dayOffset);
    const dateStr = bookingDate.toISOString().split('T')[0];
    
    // 3-5 bookings per day
    const numBookings = Math.floor(Math.random() * 3) + 3;
    const usedTimes = new Set<string>();
    
    for (let i = 0; i < numBookings; i++) {
      let time = times[Math.floor(Math.random() * times.length)];
      while (usedTimes.has(time)) {
        time = times[Math.floor(Math.random() * times.length)];
      }
      usedTimes.add(time);
      
      const employee = demoEmployees[Math.floor(Math.random() * demoEmployees.length)];
      const service = demoServices[Math.floor(Math.random() * demoServices.length)];
      const client = clientNames[Math.floor(Math.random() * clientNames.length)];
      
      bookings.push({
        id: `booking-${bookingId++}`,
        booking_date: dateStr,
        booking_time: time,
        client_name: client,
        client_phone: `+972-50-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        client_email: `${client.toLowerCase().replace(' ', '.')}@gmail.com`,
        service_id: service.id,
        service: service,
        employee_id: employee.id,
        employee: employee,
        business_id: 'demo-business-1',
        status: dayOffset === 0 && Math.random() > 0.7 ? 'confirmed' : 'pending',
        notes: Math.random() > 0.7 ? 'First time customer' : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }
  
  return bookings.sort((a, b) => {
    if (a.booking_date !== b.booking_date) {
      return a.booking_date.localeCompare(b.booking_date);
    }
    return a.booking_time.localeCompare(b.booking_time);
  });
};

export const demoBookings = generateUpcomingBookings();

export const demoSchedules = demoEmployees.flatMap(employee => {
  return [0, 1, 2, 3, 4, 5].map(dayOfWeek => ({
    id: `schedule-${employee.id}-${dayOfWeek}`,
    business_id: 'demo-business-1',
    employee_id: employee.id,
    day_of_week: dayOfWeek,
    start_time: dayOfWeek === 5 ? '09:00' : '09:00',
    end_time: dayOfWeek === 5 ? '14:00' : '19:00',
    is_available: dayOfWeek !== 6, // Saturday off
    created_at: new Date().toISOString(),
  }));
});
