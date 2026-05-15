import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock, ArrowLeft } from "lucide-react";

interface Business {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  contact_phone: string | null;
  address: string | null;
}

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  description: string | null;
}

const BusinessPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid business URL");
      setLoading(false);
      return;
    }

    const fetchBusiness = async () => {
      try {
        const { data: businessData, error: businessError } = await supabase
          .from("businesses")
          .select("id, name, description, city, contact_phone, address")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (businessError || !businessData) {
          setError("Business not found");
          setLoading(false);
          return;
        }

        setBusiness(businessData);

        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("id, name, duration_minutes, price, description")
          .eq("business_id", businessData.id)
          .eq("active", true)
          .order("name");

        if (servicesError) {
          console.error("Error fetching services:", servicesError);
        }

        setServices(servicesData || []);
      } catch (err) {
        console.error("Error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <h1 className="text-xl font-semibold text-foreground mb-2">{error}</h1>
        <p className="text-muted-foreground mb-6">The business you're looking for doesn't exist or isn't published.</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 text-muted-foreground"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{business.name}</h1>
          {business.description && (
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{business.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            {business.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {business.city}
                {business.address && `, ${business.address}`}
              </span>
            )}
            {business.contact_phone && (
              <a
                href={`tel:${business.contact_phone}`}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                {business.contact_phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Services</h2>
        {services.length === 0 ? (
          <p className="text-muted-foreground text-sm">No services available at the moment.</p>
        ) : (
          <div className="space-y-3">
            {services.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors border"
                onClick={() => navigate(`/b/${slug}/book/${service.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration_minutes} min
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <span className="font-semibold text-foreground">${service.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessPage;
