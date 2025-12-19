import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { demoEmployees } from '@/data/demoData';

interface StaffManagementProps {
  businessId?: string;
}

export default function StaffManagement({ businessId }: StaffManagementProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';

  const { data: employees } = useQuery({
    queryKey: ['admin-employees', businessId],
    enabled: !!businessId || isDemoMode,
    queryFn: async () => {
      if (isDemoMode) return demoEmployees;
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('business_id', businessId)
        .eq('active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isDemoMode) {
        toast.info('Demo mode: Changes are not saved');
        return;
      }
      const { error } = await supabase.from('employees').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
      toast.success('Staff member added successfully');
      setOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add staff member');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      if (isDemoMode) {
        toast.info('Demo mode: Changes are not saved');
        return;
      }
      const { error } = await supabase.from('employees').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
      toast.success('Staff member updated successfully');
      setOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update staff member');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isDemoMode) {
        toast.info('Demo mode: Changes are not saved');
        return;
      }
      const { error } = await supabase.from('employees').update({ active: false }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
      toast.success('Staff member removed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove staff member');
    },
  });

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPhotoUrl(null);
    setEditingEmployee(null);
  };

  const openEditDialog = (employee: any) => {
    setEditingEmployee(employee);
    setName(employee.name);
    setEmail(employee.email || '');
    setPhone(employee.phone || '');
    setPhotoUrl(employee.photo_url || null);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    const data = {
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      photo_url: photoUrl,
    };

    if (editingEmployee) {
      updateMutation.mutate({ id: editingEmployee.id, ...data });
    } else {
      createMutation.mutate({ ...data, business_id: businessId });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Members
          </span>
          <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingEmployee ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Photo (Optional)</Label>
                  <ImageUpload
                    currentImageUrl={photoUrl}
                    onImageUploaded={setPhotoUrl}
                    folder="staff"
                    aspectRatio="square"
                    placeholder="Add Photo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-name">Name *</Label>
                  <Input
                    id="staff-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-email">Email</Label>
                  <Input
                    id="staff-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-phone">Phone</Label>
                  <Input
                    id="staff-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : 'Save'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees?.map((employee: any) => (
            <div key={employee.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee.photo_url || ''} alt={employee.name} />
                <AvatarFallback className="bg-primary/20">
                  {employee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{employee.name}</p>
                {employee.email && <p className="text-xs text-muted-foreground truncate">{employee.email}</p>}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(employee)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteMutation.mutate(employee.id)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {(!employees || employees.length === 0) && (
            <p className="text-sm text-muted-foreground col-span-full text-center py-4">No staff members yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
