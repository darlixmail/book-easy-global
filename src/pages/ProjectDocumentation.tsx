import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProjectDocumentation() {
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleExportPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = contentRef.current;
    if (!element) return;

    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: 'BookEasy_Technical_Specification.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      })
      .from(element)
      .save();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button onClick={handleExportPDF}>
            <FileDown className="h-4 w-4 mr-2" /> Export as PDF
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div ref={contentRef} className="bg-white text-black p-8 rounded-lg shadow-sm" style={{ fontFamily: 'Georgia, serif', lineHeight: 1.7 }}>
          {/* Title Page */}
          <div className="text-center mb-12 pb-8 border-b-2 border-gray-300">
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1a1a2e' }}>BookEasy</h1>
            <h2 style={{ fontSize: '1.3rem', color: '#555', marginBottom: '2rem' }}>Online Booking Service — Technical Specification</h2>
            <p style={{ color: '#777', fontSize: '0.9rem' }}>Beauty Salon MVP • Version 1.0 • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Table of Contents */}
          <div className="mb-10">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.8rem' }}>Table of Contents</h2>
            <ol style={{ paddingLeft: '1.5rem', color: '#444' }}>
              {['Project Description', 'Workflow Description', 'Technology Stack', 'Database Schema', 'Client Booking Flow', 'Admin Panel', 'Key Features & Roadmap', 'Demo Mode', 'Security', 'File Structure'].map((item, i) => (
                <li key={i} style={{ marginBottom: '0.3rem' }}>{item}</li>
              ))}
            </ol>
          </div>

          {/* 1. Project Description */}
          <Section num="1" title="Project Description">
            <p><strong>BookEasy</strong> is a web-based online booking platform designed for beauty salons and service-based businesses. It enables clients to browse available services, select preferred dates, times, and staff members, and book appointments seamlessly — all from a mobile-first responsive interface.</p>
            <p>For business owners, BookEasy provides a comprehensive admin panel to manage services, staff, schedules, and view revenue analytics. The platform is built as an MVP targeting 1–2 pilot beauty salon businesses, with a clear path to scaling.</p>

            <h4 style={{ fontWeight: 'bold', marginTop: '1rem', color: '#1a1a2e' }}>Core Value Proposition</h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li><strong>For Clients:</strong> A frictionless 4-step booking experience with real-time availability, staff selection with photos, and instant confirmation.</li>
              <li><strong>For Business Owners:</strong> A centralized dashboard with revenue tracking, calendar management, staff performance monitoring, and customer insights.</li>
            </ul>

            <h4 style={{ fontWeight: 'bold', marginTop: '1rem', color: '#1a1a2e' }}>Target Users</h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Beauty salon owners and managers</li>
              <li>Salon staff members (hairdressers, nail technicians, etc.)</li>
              <li>Salon clients seeking to book appointments online</li>
            </ul>

            <h4 style={{ fontWeight: 'bold', marginTop: '1rem', color: '#1a1a2e' }}>Success Criteria</h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Complete 3-step booking flow from service selection to confirmation</li>
              <li>Business receives notification for each new booking</li>
              <li>Calendar view accurately shows all bookings</li>
              <li>Works reliably for 1–2 pilot businesses</li>
            </ul>
          </Section>

          {/* 2. Workflow Description */}
          <Section num="2" title="Workflow Description">
            <h4 style={{ fontWeight: 'bold', color: '#1a1a2e' }}>2.1 Client Booking Workflow</h4>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e9ecef' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Step 1: Service Selection (/book)</p>
              <p>Client browses available services grouped by category (Hair, Nails, Skincare, etc.). Each service card shows name, description, duration, and price. Clicking a service proceeds to the booking flow.</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e9ecef' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Step 2: Date & Time Selection</p>
              <p>Client chooses a date via calendar or list view. Dates with no availability are disabled. Time slots are displayed in 30-minute intervals based on business operating hours. Only slots with at least one available staff member are shown.</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e9ecef' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Step 3: Staff Selection</p>
              <p>Client selects their preferred staff member. Staff photos are displayed when available. Staff members unavailable for the chosen time slot appear grayed out with an "Unavailable" badge. Only staff assigned to the selected service are shown.</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e9ecef' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Step 4: Contact Information & Confirmation</p>
              <p>Client provides name (required), phone (required), and email (optional). Upon submission, the booking is created and the client is redirected to a success/confirmation page.</p>
            </div>

            <h4 style={{ fontWeight: 'bold', color: '#1a1a2e', marginTop: '1.5rem' }}>2.2 Admin Workflow</h4>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e9ecef' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Authentication</p>
              <p>Admin logs in via email/password. A demo mode bypass is available for development testing without creating an account. Password reset functionality is included.</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e9ecef' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard Operations</p>
              <p>Upon login, the admin sees: revenue statistics with period filtering, today's bookings sorted by staff, a weekly calendar grid with per-day/per-staff booking counts, and a full calendar view. Performance metrics are color-coded — red when metrics drop ≥20% below the previous comparable period.</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e9ecef' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Management Tasks</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li><strong>Services:</strong> Create, edit, activate/deactivate services with optional images</li>
                <li><strong>Staff:</strong> Add/manage employees, assign to services, set individual schedules per day of week</li>
                <li><strong>Schedule:</strong> Configure business operating hours</li>
                <li><strong>Profile:</strong> Update business name, address, contact info</li>
              </ul>
            </div>

            <h4 style={{ fontWeight: 'bold', color: '#1a1a2e', marginTop: '1.5rem' }}>2.3 Data Flow</h4>
            <p>Client booking → Database record created → Admin dashboard updates in real-time → Revenue statistics recalculated → Calendar views refresh. All data access is scoped to the business via Row Level Security policies.</p>
          </Section>

          {/* 3. Technology Stack */}
          <Section num="3" title="Technology Stack">
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #1a1a2e' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Layer</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Technology</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Framework', 'React 18 + TypeScript'],
                  ['Build Tool', 'Vite'],
                  ['Styling', 'Tailwind CSS + shadcn/ui'],
                  ['State/Data', 'TanStack React Query'],
                  ['Routing', 'React Router v6'],
                  ['Backend', 'Lovable Cloud (Supabase)'],
                  ['Auth', 'Email/password authentication'],
                  ['Storage', 'Cloud file storage (business-assets bucket)'],
                  ['i18n', 'i18next (5 languages)'],
                  ['Charts', 'Recharts'],
                  ['Date Utils', 'date-fns'],
                ].map(([layer, tech], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{layer}</td>
                    <td style={{ padding: '0.5rem' }}>{tech}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* 4. Database Schema */}
          <Section num="4" title="Database Schema">
            <p>Six core tables with relationships enforced via foreign keys and secured with Row Level Security:</p>
            {[
              { name: 'businesses', desc: 'Business profiles linked to auth users', cols: 'id, user_id, name, description, address, contact_email, contact_phone' },
              { name: 'services', desc: 'Service catalog per business', cols: 'id, business_id, name, description, price, duration_minutes, image_url, active' },
              { name: 'employees', desc: 'Staff members per business', cols: 'id, business_id, name, email, phone, photo_url, active' },
              { name: 'service_employees', desc: 'Many-to-many: which employees perform which services', cols: 'id, service_id, employee_id' },
              { name: 'schedules', desc: 'Working hours per business and optionally per employee', cols: 'id, business_id, employee_id, day_of_week, start_time, end_time, is_available' },
              { name: 'bookings', desc: 'Client appointment records', cols: 'id, business_id, service_id, employee_id, booking_date, booking_time, client_name, client_phone, client_email, status, notes' },
            ].map((t, i) => (
              <div key={i} style={{ background: '#f8f9fa', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.5rem', border: '1px solid #e9ecef' }}>
                <p style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#1a1a2e' }}>{t.name}</p>
                <p style={{ fontSize: '0.9rem', color: '#555' }}>{t.desc}</p>
                <p style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#777' }}>{t.cols}</p>
              </div>
            ))}
          </Section>

          {/* 5. Client Booking Flow */}
          <Section num="5" title="Client Booking Flow Details">
            <h4 style={{ fontWeight: 'bold', color: '#1a1a2e' }}>Availability Logic</h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Time slots generated in 30-minute intervals within business operating hours</li>
              <li>Slots are filtered against existing bookings to prevent double-booking</li>
              <li>Service duration is considered — a 90-min service blocks 3 consecutive slots</li>
              <li>Dates with zero available slots are disabled in both calendar and list views</li>
              <li>Staff availability is cross-referenced with their individual schedules</li>
            </ul>

            <h4 style={{ fontWeight: 'bold', color: '#1a1a2e', marginTop: '1rem' }}>UI Features</h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Toggle between calendar picker and scrollable date list</li>
              <li>Staff cards with photos, showing availability status</li>
              <li>Progressive disclosure — each step revealed only after the previous is complete</li>
              <li>Mobile-first responsive design</li>
            </ul>
          </Section>

          {/* 6. Admin Panel */}
          <Section num="6" title="Admin Panel Details">
            <h4 style={{ fontWeight: 'bold', color: '#1a1a2e' }}>Revenue Tracking Definitions</h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li><strong>Received Revenue:</strong> Money paid for completed services</li>
              <li><strong>Pending Revenue:</strong> Prepaid bookings where service hasn't been delivered yet</li>
              <li><strong>Expected Revenue:</strong> Received + Pending + projected from all uncancelled future bookings</li>
            </ul>

            <h4 style={{ fontWeight: 'bold', color: '#1a1a2e', marginTop: '1rem' }}>Dashboard Components</h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Revenue Statistics Card with period filtering</li>
              <li>Today's Bookings (default: sorted by staff)</li>
              <li>Weekly Calendar Grid (Sun–Mon) with drill-down</li>
              <li>Full Calendar View</li>
              <li>Services & Staff Overview (owner-only access)</li>
              <li>Staff Management section</li>
              <li>Customer indicators: new, recurring, regular (with history modal)</li>
            </ul>
          </Section>

          {/* 7. Features Roadmap */}
          <Section num="7" title="Key Features & Roadmap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #1a1a2e' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Feature</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Priority</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Client booking flow', '✅ Done', 'MVP'],
                  ['Admin dashboard & analytics', '✅ Done', 'MVP'],
                  ['Service management (CRUD)', '✅ Done', 'MVP'],
                  ['Staff management & assignment', '✅ Done', 'MVP'],
                  ['Email/password authentication', '✅ Done', 'MVP'],
                  ['Multi-language support (5)', '✅ Done', 'MVP'],
                  ['Image uploads (services/staff)', '✅ Done', 'MVP'],
                  ['WhatsApp/SMS notifications', '⏳ Pending', 'MVP'],
                  ['QR code generation', '⏳ Pending', 'MVP'],
                  ['Mini landing page per business', '⏳ Pending', 'MVP'],
                  ['Online payments', '📋 Planned', 'Post-MVP'],
                  ['Google Calendar sync', '📋 Planned', 'Post-MVP'],
                  ['Advanced CRM/analytics', '📋 Planned', 'Post-MVP'],
                  ['Mobile app', '📋 Planned', 'Post-MVP'],
                ].map(([feature, status, priority], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem' }}>{feature}</td>
                    <td style={{ padding: '0.5rem' }}>{status}</td>
                    <td style={{ padding: '0.5rem' }}>{priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* 8. Demo Mode */}
          <Section num="8" title="Demo Mode">
            <p>Both client and admin interfaces include a fully functional demo mode powered by <code style={{ background: '#f0f0f0', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>demoData.ts</code>:</p>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li><strong>Business:</strong> "Glamour Studio" — sample beauty salon</li>
              <li><strong>Services:</strong> 5 services across 3 categories (Hair, Nails, Skincare)</li>
              <li><strong>Employees:</strong> 4 staff members with role assignments</li>
              <li><strong>Schedules:</strong> Sunday–Thursday, 09:00–18:00</li>
              <li><strong>Bookings:</strong> Sample bookings with confirmed, pending, cancelled, and completed statuses</li>
            </ul>
            <p>Demo mode is activated via a "Try Demo" button on the admin login page, setting a <code style={{ background: '#f0f0f0', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>demo_mode</code> flag in localStorage. The client booking flow auto-detects demo mode when no real services exist.</p>
          </Section>

          {/* 9. Security */}
          <Section num="9" title="Security">
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li><strong>Row Level Security (RLS):</strong> All tables enforce data isolation per business via <code style={{ background: '#f0f0f0', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>business_id</code> and <code style={{ background: '#f0f0f0', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>user_id</code> ownership checks</li>
              <li><strong>Protected Routes:</strong> Admin pages wrapped in <code style={{ background: '#f0f0f0', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>ProtectedRoute</code> component requiring authentication</li>
              <li><strong>Auth Management:</strong> Email/password with password reset capability</li>
              <li><strong>Storage:</strong> Public bucket for business assets with appropriate access policies</li>
            </ul>
          </Section>

          {/* 10. File Structure */}
          <Section num="10" title="File Structure">
            <pre style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', overflow: 'auto', border: '1px solid #e9ecef' }}>
{`src/
├── components/
│   ├── admin/              # Admin UI components
│   │   ├── BookingsView        — Booking list with staff sorting
│   │   ├── CalendarView        — Full calendar with booking overlay
│   │   ├── CustomerHistoryModal — Customer visit history
│   │   ├── ImageUpload         — Optional image upload widget
│   │   ├── RevenueStatisticsCard — Revenue analytics
│   │   ├── ServicesOverview    — Service performance stats
│   │   ├── ServicesStaffOverviewPage — Combined overview
│   │   ├── StaffManagement     — Employee CRUD
│   │   ├── StatisticsPanel     — Dashboard stats
│   │   └── WeeklyBookingsView  — Weekly calendar grid
│   └── ui/                 # shadcn/ui component library (40+)
├── data/
│   └── demoData.ts         # Demo data for both flows
├── hooks/                  # Custom React hooks
├── i18n/
│   └── config.ts           # i18next with 5 languages
├── integrations/supabase/  # Auto-generated client & types
├── pages/
│   ├── admin/              # Dashboard, Login, Services, Schedule, Profile
│   └── client/             # Home, ServiceSelection, BookingFlow, Success
└── lib/utils.ts            # Utility functions`}
            </pre>
          </Section>

          {/* Footer */}
          <div style={{ borderTop: '2px solid #e9ecef', marginTop: '2rem', paddingTop: '1rem', textAlign: 'center', color: '#999', fontSize: '0.8rem' }}>
            <p>BookEasy Technical Specification • Generated {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }} className="pdf-section">
      <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1a1a2e', borderBottom: '1px solid #ddd', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>
        {num}. {title}
      </h3>
      <div style={{ color: '#333' }}>{children}</div>
    </div>
  );
}
