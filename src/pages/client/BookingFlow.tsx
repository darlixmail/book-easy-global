import { useState } from 'react';
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
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, ArrowLeft } from 'lucide-react';

export default function BookingFlow() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');

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

  const { data: availableSlots } = useQuery({
    queryKey: ['available-slots', service?.business_id, selectedDate],
    enabled: !!service?.business_id && !!selectedDate,
    queryFn: async () => {
      if (!selectedDate) return [];
      
      const dayOfWeek = selectedDate.getDay();
      const { data: schedule } = await supabase
        .from('schedules')
        .select('*')
        .eq('business_id', service?.business_id)
        .eq('day_of_week', dayOfWeek)
        .eq('is_available', true)
        .single();

      if (!schedule) return [];

      // Generate time slots (simplified - every hour)
      const slots = [];
      const startHour = parseInt(schedule.start_time.split(':')[0]);
      const endHour = parseInt(schedule.end_time.split(':')[0]);

      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
      }

      return slots;
    },
  });

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

    if (!selectedDate || !selectedTime || !clientName || !clientPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    bookingMutation.mutate({
      service_id: serviceId,
      business_id: service?.business_id,
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl shadow-medium">
          <CardHeader>
            <CardTitle className="text-2xl">{t('booking.title')}</CardTitle>
            {service && (
              <CardDescription className="text-base">
                {service.name} - {service.duration_minutes} {t('common.duration')} - ${service.price}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {t('booking.selectDate')}
                </Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              {/* Time Selection */}
              {selectedDate && availableSlots && availableSlots.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('booking.selectTime')}
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={selectedTime === slot ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Information */}
              <div className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="notes">{t('booking.notes')}</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={bookingMutation.isPending}
              >
                {bookingMutation.isPending ? t('common.loading') : t('booking.confirm')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
