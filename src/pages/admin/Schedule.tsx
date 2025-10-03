import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function Schedule() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: business } = useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: schedules } = useQuery({
    queryKey: ['schedules', business?.id],
    enabled: !!business?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('business_id', business?.id)
        .order('day_of_week');

      if (error) throw error;
      return data || [];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (scheduleData: any) => {
      const { error } = await supabase.from('schedules').upsert([scheduleData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Schedule updated successfully');
    },
    onError: () => {
      toast.error('Failed to update schedule');
    },
  });

  const handleScheduleChange = (dayOfWeek: number, field: string, value: any) => {
    const existingSchedule = schedules?.find((s) => s.day_of_week === dayOfWeek);

    if (!business?.id) return;

    const scheduleData = {
      business_id: business.id,
      day_of_week: dayOfWeek,
      start_time: existingSchedule?.start_time || '09:00',
      end_time: existingSchedule?.end_time || '17:00',
      is_available: existingSchedule?.is_available ?? true,
      [field]: value,
    };

    if (existingSchedule) {
      scheduleData.id = existingSchedule.id;
    }

    upsertMutation.mutate(scheduleData);
  };

  const getScheduleForDay = (dayOfWeek: number) => {
    return schedules?.find((s) => s.day_of_week === dayOfWeek);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('admin.dashboard')}
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">{t('admin.schedule')}</h1>

        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysOfWeek.map((day) => {
              const schedule = getScheduleForDay(day.value);
              return (
                <div key={day.value} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="w-32">
                    <p className="font-medium">{day.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={schedule?.is_available ?? false}
                      onCheckedChange={(checked) =>
                        handleScheduleChange(day.value, 'is_available', checked)
                      }
                    />
                    <Label>Available</Label>
                  </div>
                  {schedule?.is_available && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={schedule?.start_time || '09:00'}
                        onChange={(e) =>
                          handleScheduleChange(day.value, 'start_time', e.target.value)
                        }
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={schedule?.end_time || '17:00'}
                        onChange={(e) =>
                          handleScheduleChange(day.value, 'end_time', e.target.value)
                        }
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
