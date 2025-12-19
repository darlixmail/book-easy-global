import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { toast } from 'sonner';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, ArrowLeft, List, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function BookingFlow() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const { data: service } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*, businesses(*)')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch employees who can provide this service
  const { data: serviceEmployees } = useQuery({
    queryKey: ['service-employees', serviceId],
    enabled: !!serviceId,
    queryFn: async () => {
      const { data: seData, error: seError } = await supabase
        .from('service_employees')
        .select('employee_id')
        .eq('service_id', serviceId);

      if (seError) throw seError;

      if (!seData || seData.length === 0) return [];

      const employeeIds = seData.map(se => se.employee_id);
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('*')
        .in('id', employeeIds)
        .eq('active', true);

      if (empError) throw empError;
      return employees || [];
    },
  });

  // Fetch schedules for all employees
  const { data: schedules } = useQuery({
    queryKey: ['employee-schedules', service?.business_id],
    enabled: !!service?.business_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('business_id', service?.business_id)
        .eq('is_available', true);

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch existing bookings
  const { data: existingBookings } = useQuery({
    queryKey: ['existing-bookings', service?.business_id, selectedDate],
    enabled: !!service?.business_id && !!selectedDate,
    queryFn: async () => {
      const dateStr = format(selectedDate!, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('business_id', service?.business_id)
        .eq('booking_date', dateStr)
        .neq('status', 'cancelled');

      if (error) throw error;
      return data || [];
    },
  });

  // Generate available time slots
  const availableSlots = useMemo(() => {
    if (!selectedDate || !schedules) return [];

    const dayOfWeek = selectedDate.getDay();
    const daySchedules = schedules.filter(s => s.day_of_week === dayOfWeek);

    if (daySchedules.length === 0) return [];

    // Get the business schedule (employee_id is null)
    const businessSchedule = daySchedules.find(s => !s.employee_id);
    if (!businessSchedule) return [];

    const slots: string[] = [];
    const startHour = parseInt(businessSchedule.start_time.split(':')[0]);
    const endHour = parseInt(businessSchedule.end_time.split(':')[0]);

    // Generate 30-minute slots
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return slots;
  }, [selectedDate, schedules]);

  // Check if an employee is available for a specific time slot
  const isEmployeeAvailable = (employeeId: string, timeSlot: string) => {
    if (!selectedDate || !existingBookings || !schedules) return false;

    const dayOfWeek = selectedDate.getDay();

    // Check if employee has a schedule for this day
    const employeeSchedule = schedules.find(
      s => s.employee_id === employeeId && s.day_of_week === dayOfWeek
    );

    // If no specific schedule, check business schedule
    const businessSchedule = schedules.find(
      s => !s.employee_id && s.day_of_week === dayOfWeek
    );

    const schedule = employeeSchedule || businessSchedule;
    if (!schedule) return false;

    // Check if time is within schedule
    const slotHour = parseInt(timeSlot.split(':')[0]);
    const scheduleStart = parseInt(schedule.start_time.split(':')[0]);
    const scheduleEnd = parseInt(schedule.end_time.split(':')[0]);

    if (slotHour < scheduleStart || slotHour >= scheduleEnd) return false;

    // Check if employee already has a booking at this time
    const hasBooking = existingBookings.some(
      b => b.employee_id === employeeId && b.booking_time === timeSlot
    );

    return !hasBooking;
  };

  // Generate list of upcoming dates
  const upcomingDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  }, []);

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const { error } = await supabase.from('bookings').insert([bookingData]);
      if (error) throw error;
    },
    onSuccess: () => {
      navigate('/booking/success');
    },
    onError: () => {
      toast.error('Failed to create booking. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedEmployee || !clientName || !clientPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    bookingMutation.mutate({
      service_id: serviceId,
      business_id: service?.business_id,
      employee_id: selectedEmployee,
      client_name: clientName,
      client_phone: clientPhone,
      client_email: clientEmail || null,
      booking_date: format(selectedDate, 'yyyy-MM-dd'),
      booking_time: selectedTime,
      notes: notes || null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/book')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-3xl shadow-medium">
          <CardHeader>
            <CardTitle className="text-2xl">{t('booking.title')}</CardTitle>
            {service && (
              <CardDescription className="text-base">
                {service.name} - {service.duration_minutes} min - ₪{service.price}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Date Selection */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-lg font-semibold">
                  <CalendarIcon className="h-5 w-5" />
                  1. {t('booking.selectDate')}
                </Label>

                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'calendar' | 'list')}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="calendar" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Calendar
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      List
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="calendar">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime('');
                        setSelectedEmployee('');
                      }}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </TabsContent>

                  <TabsContent value="list">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {upcomingDates.map((date) => (
                        <Button
                          key={date.toISOString()}
                          type="button"
                          variant={selectedDate && isSameDay(selectedDate, date) ? 'default' : 'outline'}
                          className="flex flex-col h-auto py-3"
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedTime('');
                            setSelectedEmployee('');
                          }}
                        >
                          <span className="text-xs text-muted-foreground">
                            {format(date, 'EEE')}
                          </span>
                          <span className="text-lg font-bold">{format(date, 'd')}</span>
                          <span className="text-xs">{format(date, 'MMM')}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Step 2: Time Selection */}
              {selectedDate && availableSlots.length > 0 && (
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-lg font-semibold">
                    <Clock className="h-5 w-5" />
                    2. {t('booking.selectTime')}
                  </Label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={selectedTime === slot ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSelectedTime(slot);
                          setSelectedEmployee('');
                        }}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Master/Staff Selection */}
              {selectedDate && selectedTime && serviceEmployees && serviceEmployees.length > 0 && (
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-lg font-semibold">
                    <User className="h-5 w-5" />
                    3. {t('booking.selectMaster')}
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {serviceEmployees.map((employee) => {
                      const available = isEmployeeAvailable(employee.id, selectedTime);
                      const isSelected = selectedEmployee === employee.id;

                      return (
                        <button
                          key={employee.id}
                          type="button"
                          disabled={!available}
                          onClick={() => available && setSelectedEmployee(employee.id)}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all text-center
                            ${isSelected 
                              ? 'border-primary bg-primary/10 shadow-md' 
                              : available 
                                ? 'border-border hover:border-primary/50 hover:shadow-sm' 
                                : 'border-border/50 cursor-not-allowed'
                            }
                          `}
                        >
                          <div className={`transition-all ${!available ? 'opacity-30 grayscale' : ''}`}>
                            <Avatar className="h-20 w-20 mx-auto mb-3">
                              <AvatarImage src={employee.photo_url || ''} alt={employee.name} />
                              <AvatarFallback className="text-2xl bg-primary/20">
                                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium">{employee.name}</p>
                          </div>
                          {!available && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="bg-destructive/90 text-destructive-foreground text-xs px-2 py-1 rounded">
                                Unavailable
                              </span>
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Client Information */}
              {selectedEmployee && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">4. {t('booking.yourDetails')}</Label>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('booking.name')} *</Label>
                      <Input
                        id="name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('booking.phone')} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('booking.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="notes">{t('booking.notes')}</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              {selectedEmployee && (
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? t('common.loading') : t('booking.confirm')}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
