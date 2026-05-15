import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  business_id: string;
}

interface Schedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface Booking {
  booking_time: string;
  // service duration not stored; assume 30-min granular for blocking
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const fromMinutes = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

const formatDateISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const BookingPage = () => {
  const { slug, serviceId } = useParams<{ slug: string; serviceId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Load service + schedules
  useEffect(() => {
    if (!serviceId || !slug) return;
    (async () => {
      try {
        const { data: svc, error: svcErr } = await supabase
          .from("services")
          .select("id, name, duration_minutes, price, business_id")
          .eq("id", serviceId)
          .eq("active", true)
          .single();

        if (svcErr || !svc) {
          toast.error("Service not found");
          setLoading(false);
          return;
        }
        setService(svc as Service);

        const { data: sch } = await supabase
          .from("schedules")
          .select("day_of_week, start_time, end_time, is_available")
          .eq("business_id", svc.business_id)
          .eq("is_available", true);

        setSchedules((sch as Schedule[]) || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceId, slug]);

  // Build next 14 days, only those with a schedule
  const availableDates = useMemo(() => {
    const result: { iso: string; label: string; weekday: string }[] = [];
    const daysWithSchedule = new Set(schedules.map((s) => s.day_of_week));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (!daysWithSchedule.has(d.getDay())) continue;
      result.push({
        iso: formatDateISO(d),
        label: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
        weekday: d.toLocaleDateString(undefined, { weekday: "short" }),
      });
    }
    return result;
  }, [schedules]);

  // When date changes, fetch bookings for that date
  useEffect(() => {
    if (!selectedDate || !service) return;
    setSelectedTime(null);
    (async () => {
      const { data } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("business_id", service.business_id)
        .eq("booking_date", selectedDate)
        .neq("status", "cancelled");
      setBookedTimes(((data as Booking[]) || []).map((b) => b.booking_time.slice(0, 5)));
    })();
  }, [selectedDate, service]);

  // Generate time slots
  const timeSlots = useMemo(() => {
    if (!selectedDate || !service) return [];
    const date = new Date(selectedDate + "T00:00:00");
    const dow = date.getDay();
    const daySchedules = schedules.filter((s) => s.day_of_week === dow);
    const duration = service.duration_minutes;
    const slots: { time: string; available: boolean }[] = [];
    const bookedSet = new Set(bookedTimes);
    const now = new Date();
    const isToday = formatDateISO(now) === selectedDate;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    daySchedules.forEach((sc) => {
      const start = toMinutes(sc.start_time);
      const end = toMinutes(sc.end_time);
      for (let t = start; t + duration <= end; t += 30) {
        const time = fromMinutes(t);
        const inPast = isToday && t <= nowMinutes;
        slots.push({ time, available: !bookedSet.has(time) && !inPast });
      }
    });
    return slots;
  }, [selectedDate, service, schedules, bookedTimes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !selectedDate || !selectedTime) return;
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    setSubmitting(true);
    try {
      const { error: bErr } = await supabase.from("bookings").insert({
        business_id: service.business_id,
        service_id: service.id,
        booking_date: selectedDate,
        booking_time: selectedTime,
        client_name: name.trim(),
        client_phone: phone.trim(),
        notes: notes.trim() || null,
        status: "pending",
        source: "public_page",
      });
      if (bErr) throw bErr;

      // Upsert client (best effort)
      const { data: existing } = await supabase
        .from("clients")
        .select("id")
        .eq("business_id", service.business_id)
        .eq("phone", phone.trim())
        .maybeSingle();
      if (!existing) {
        await supabase.from("clients").insert({
          business_id: service.business_id,
          name: name.trim(),
          phone: phone.trim(),
        });
      }

      navigate("/booking/success");
    } catch (err) {
      console.error(err);
      toast.error("Could not complete booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="text-xl font-semibold mb-4">Service not found</h1>
        <Button variant="outline" onClick={() => navigate(`/b/${slug}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Sticky header with service info */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-muted-foreground"
            onClick={() => navigate(`/b/${slug}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-semibold text-foreground truncate">{service.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{service.duration_minutes} min</span>
              </div>
            </div>
            <span className="font-semibold text-foreground shrink-0">₪{service.price}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Step 1: Date */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-3">Select date</h2>
          {availableDates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No availability in the next 14 days.</p>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {availableDates.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  className={`flex flex-col items-center justify-center min-w-[64px] py-3 px-2 rounded-lg border transition-colors ${
                    selectedDate === d.iso
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-accent"
                  }`}
                >
                  <span className="text-xs uppercase tracking-wide opacity-80">{d.weekday}</span>
                  <span className="text-sm font-medium mt-0.5">{d.label}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Step 2: Time */}
        {selectedDate && (
          <section>
            <h2 className="text-sm font-medium text-foreground mb-3">Select time</h2>
            {timeSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground">No slots for this day.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2.5 rounded-lg border text-sm transition-colors ${
                      selectedTime === slot.time
                        ? "bg-primary text-primary-foreground border-primary"
                        : slot.available
                        ? "bg-card text-foreground border-border hover:bg-accent"
                        : "bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Step 3: Details */}
        {selectedDate && selectedTime && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-sm font-medium text-foreground mb-4">Your details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={30}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Book"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
