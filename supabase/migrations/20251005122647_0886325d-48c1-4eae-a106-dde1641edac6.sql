-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- RLS policies for employees
CREATE POLICY "Anyone can view active employees"
ON public.employees
FOR SELECT
USING (active = true);

CREATE POLICY "Business owners can manage their employees"
ON public.employees
FOR ALL
USING (business_id IN (
  SELECT id FROM businesses WHERE user_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create service_employees junction table
CREATE TABLE public.service_employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(service_id, employee_id)
);

-- Enable RLS
ALTER TABLE public.service_employees ENABLE ROW LEVEL SECURITY;

-- RLS policies for service_employees
CREATE POLICY "Anyone can view service employees"
ON public.service_employees
FOR SELECT
USING (true);

CREATE POLICY "Business owners can manage service employees"
ON public.service_employees
FOR ALL
USING (
  service_id IN (
    SELECT id FROM services WHERE business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  )
);

-- Add employee_id to schedules
ALTER TABLE public.schedules ADD COLUMN employee_id UUID;

-- Add employee_id to bookings
ALTER TABLE public.bookings ADD COLUMN employee_id UUID;

-- Update schedules RLS policy for employee-specific schedules
DROP POLICY IF EXISTS "Business owners can manage their schedules" ON public.schedules;

CREATE POLICY "Business owners can manage their schedules"
ON public.schedules
FOR ALL
USING (
  business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  )
  OR
  employee_id IN (
    SELECT id FROM employees WHERE business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  )
);