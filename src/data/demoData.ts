export const demoBusiness = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Glamour Studio Tel Aviv',
  description: 'Premium hair and beauty salon in the heart of Tel Aviv',
  address: 'Dizengoff 123, Tel Aviv',
  contact_email: 'info@glamourstudio.co.il',
  contact_phone: '+972-3-555-0123',
  user_id: 'demo-user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoEmployees = [
  { id: 'emp-1', business_id: demoBusiness.id, name: 'Maya Cohen', email: 'maya@glamourstudio.co.il', phone: '+972-50-111-1111', photo_url: null, active: true, role: 'Hair Master', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'emp-2', business_id: demoBusiness.id, name: 'Yael Levi', email: 'yael@glamourstudio.co.il', phone: '+972-50-222-2222', photo_url: null, active: true, role: 'Hair Master', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'emp-3', business_id: demoBusiness.id, name: 'Noa Shapira', email: 'noa@glamourstudio.co.il', phone: '+972-50-333-3333', photo_url: null, active: true, role: 'Hair Master', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'emp-4', business_id: demoBusiness.id, name: 'Dana Mizrahi', email: 'dana@glamourstudio.co.il', phone: '+972-50-444-4444', photo_url: null, active: true, role: 'Nail Master', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'emp-5', business_id: demoBusiness.id, name: 'Shira Goldberg', email: 'shira@glamourstudio.co.il', phone: '+972-50-555-5555', photo_url: null, active: true, role: 'Nail Master', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'emp-6', business_id: demoBusiness.id, name: 'Tamar Avraham', email: 'tamar@glamourstudio.co.il', phone: '+972-50-666-6666', photo_url: null, active: true, role: 'Cosmetic Specialist', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const demoServices = [
  { id: 'srv-1', business_id: demoBusiness.id, name: 'Haircut - Women', description: 'Professional haircut', price: 180, duration_minutes: 45, active: true, category: 'Hair', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'srv-2', business_id: demoBusiness.id, name: 'Haircut - Men', description: 'Men\'s haircut', price: 100, duration_minutes: 30, active: true, category: 'Hair', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'srv-3', business_id: demoBusiness.id, name: 'Hair Coloring', description: 'Full coloring', price: 350, duration_minutes: 120, active: true, category: 'Hair', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'srv-4', business_id: demoBusiness.id, name: 'Highlights', description: 'Highlights', price: 450, duration_minutes: 150, active: true, category: 'Hair', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'srv-5', business_id: demoBusiness.id, name: 'Blowout', description: 'Blowout styling', price: 120, duration_minutes: 40, active: true, category: 'Hair', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'srv-6', business_id: demoBusiness.id, name: 'Manicure', description: 'Classic manicure', price: 80, duration_minutes: 30, active: true, category: 'Nails', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'srv-7', business_id: demoBusiness.id, name: 'Gel Manicure', description: 'Gel manicure', price: 120, duration_minutes: 45, active: true, category: 'Nails', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'srv-8', business_id: demoBusiness.id, name: 'Pedicure', description: 'Pedicure', price: 100, duration_minutes: 45, active: true, category: 'Nails', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'srv-9', business_id: demoBusiness.id, name: 'Facial Treatment', description: 'Facial', price: 250, duration_minutes: 60, active: true, category: 'Cosmetics', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'srv-10', business_id: demoBusiness.id, name: 'Eyebrow Shaping', description: 'Eyebrows', price: 60, duration_minutes: 20, active: true, category: 'Cosmetics', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'srv-11', business_id: demoBusiness.id, name: 'Lash Extensions', description: 'Lashes', price: 400, duration_minutes: 90, active: true, category: 'Cosmetics', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export type CustomerType = 'new' | 'recurring' | 'regular';

export interface DemoCustomer {
  id: string; name: string; phone: string; email: string; type: CustomerType; totalVisits: number; totalSpent: number; notes: string;
  visits: Array<{ date: string; service: string; employee: string; amount: number; status: 'completed' | 'cancelled' | 'no-show'; review?: { rating: number; comment: string } }>;
  cancellations: Array<{ date: string; service: string; reason?: string }>;
}

export const demoCustomers: DemoCustomer[] = [
  { id: 'cust-1', name: 'Ronit Azulay', phone: '+972-52-111-1111', email: 'ronit@email.com', type: 'regular', totalVisits: 24, totalSpent: 5800, notes: 'Prefers Maya for haircuts.', visits: [{ date: '2024-11-15', service: 'Haircut - Women', employee: 'Maya Cohen', amount: 180, status: 'completed', review: { rating: 5, comment: 'Amazing!' } }], cancellations: [] },
  { id: 'cust-2', name: 'Yossi Biton', phone: '+972-52-222-2222', email: 'yossi@email.com', type: 'regular', totalVisits: 18, totalSpent: 1800, notes: 'Morning appointments.', visits: [{ date: '2024-11-10', service: 'Haircut - Men', employee: 'Yael Levi', amount: 100, status: 'completed' }], cancellations: [] },
  { id: 'cust-3', name: 'Liora Katz', phone: '+972-52-333-3333', email: 'liora@email.com', type: 'recurring', totalVisits: 6, totalSpent: 980, notes: '', visits: [], cancellations: [{ date: '2024-09-20', service: 'Pedicure', reason: 'Sick' }] },
  { id: 'cust-4', name: 'Michal Stern', phone: '+972-52-444-4444', email: 'michal@email.com', type: 'new', totalVisits: 1, totalSpent: 250, notes: '', visits: [{ date: '2024-11-20', service: 'Facial Treatment', employee: 'Tamar Avraham', amount: 250, status: 'completed', review: { rating: 4, comment: 'Great!' } }], cancellations: [] },
  { id: 'cust-5', name: 'David Peretz', phone: '+972-52-555-5555', email: 'david@email.com', type: 'recurring', totalVisits: 4, totalSpent: 400, notes: '', visits: [], cancellations: [{ date: '2024-10-15', service: 'Haircut - Men', reason: 'Work emergency' }] },
  { id: 'cust-6', name: 'Shelly Dahan', phone: '+972-52-666-6666', email: 'shelly@email.com', type: 'regular', totalVisits: 30, totalSpent: 8500, notes: 'VIP client.', visits: [{ date: '2024-11-18', service: 'Lash Extensions', employee: 'Tamar Avraham', amount: 400, status: 'completed', review: { rating: 5, comment: 'Best!' } }], cancellations: [] },
  { id: 'cust-7', name: 'Avi Nahum', phone: '+972-52-777-7777', email: 'avi@email.com', type: 'new', totalVisits: 0, totalSpent: 0, notes: 'First-time visitor.', visits: [], cancellations: [] },
  { id: 'cust-8', name: 'Orit Levy', phone: '+972-52-888-8888', email: 'orit@email.com', type: 'recurring', totalVisits: 8, totalSpent: 1440, notes: 'Sensitive skin.', visits: [], cancellations: [{ date: '2024-09-28', service: 'Facial Treatment', reason: 'Skin irritation' }] },
];

export interface DemoBooking {
  id: string; business_id: string; service_id: string; employee_id: string; client_name: string; client_phone: string; client_email: string;
  booking_date: string; booking_time: string; status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'; notes: string | null;
  created_at: string; updated_at: string; customer_id: string; customer_type: CustomerType; is_prepaid: boolean; prepaid_amount?: number; cancellation_reason?: string; services?: typeof demoServices[0];
}

const generateBookings = (): DemoBooking[] => {
  const bookings: DemoBooking[] = [];
  const today = new Date();
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(today); date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const bookingsPerDay = isWeekend ? Math.floor(Math.random() * 8) + 5 : Math.floor(Math.random() * 12) + 10;
    const usedSlots: Set<string> = new Set();
    
    for (let i = 0; i < bookingsPerDay; i++) {
      const employee = demoEmployees[Math.floor(Math.random() * demoEmployees.length)];
      const service = demoServices[Math.floor(Math.random() * demoServices.length)];
      const customer = demoCustomers[Math.floor(Math.random() * demoCustomers.length)];
      let time: string; let slotKey: string; let attempts = 0;
      do { time = times[Math.floor(Math.random() * times.length)]; slotKey = `${employee.id}-${time}`; attempts++; } while (usedSlots.has(slotKey) && attempts < 20);
      if (attempts >= 20) continue;
      usedSlots.add(slotKey);
      const isPast = day === 0 && parseInt(time.split(':')[0]) < new Date().getHours();
      const statuses: Array<'pending' | 'confirmed' | 'completed' | 'cancelled'> = isPast ? ['completed', 'completed', 'completed', 'cancelled'] : ['pending', 'confirmed', 'confirmed', 'confirmed'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const isPrepaid = Math.random() > 0.6;
      bookings.push({
        id: `booking-${day}-${i}`, business_id: demoBusiness.id, service_id: service.id, employee_id: employee.id, client_name: customer.name, client_phone: customer.phone, client_email: customer.email,
        booking_date: dateStr, booking_time: time, status, notes: Math.random() > 0.7 ? 'Customer requested specific stylist' : null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        customer_id: customer.id, customer_type: customer.type, is_prepaid: isPrepaid, prepaid_amount: isPrepaid ? service.price : undefined,
        cancellation_reason: status === 'cancelled' ? ['Schedule conflict', 'Feeling unwell', 'Emergency', 'Changed plans'][Math.floor(Math.random() * 4)] : undefined, services: service,
      });
    }
  }
  return bookings.sort((a, b) => { const dc = a.booking_date.localeCompare(b.booking_date); return dc !== 0 ? dc : a.booking_time.localeCompare(b.booking_time); });
};

export const demoBookings = generateBookings();
export const getEmployeeById = (id: string) => demoEmployees.find(e => e.id === id);
export const getServiceById = (id: string) => demoServices.find(s => s.id === id);
export const getCustomerById = (id: string) => demoCustomers.find(c => c.id === id);
export const calculateRevenue = (bookings: DemoBooking[]) => bookings.reduce((t, b) => b.status === 'cancelled' || b.status === 'no-show' ? t : t + (getServiceById(b.service_id)?.price || 0), 0);
export const calculatePrepaidRevenue = (bookings: DemoBooking[]) => bookings.reduce((t, b) => b.is_prepaid && b.prepaid_amount ? t + b.prepaid_amount : t, 0);
