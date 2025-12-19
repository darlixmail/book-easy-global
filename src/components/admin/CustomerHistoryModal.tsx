import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, DollarSign, XCircle, Star, Edit2, Save, UserCheck, UserPlus, Users, Phone, Mail } from 'lucide-react';
import { DemoCustomer } from '@/data/demoData';
import { format } from 'date-fns';

interface CustomerHistoryModalProps {
  customer: DemoCustomer | null;
  onClose: () => void;
}

export default function CustomerHistoryModal({ customer, onClose }: CustomerHistoryModalProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(customer?.notes || '');

  if (!customer) return null;

  const getCustomerTypeInfo = (type: string) => {
    switch (type) {
      case 'new':
        return { icon: <UserPlus className="h-5 w-5" />, label: 'New Customer', color: 'bg-green-100 text-green-800' };
      case 'recurring':
        return { icon: <Users className="h-5 w-5" />, label: 'Recurring Customer', color: 'bg-blue-100 text-blue-800' };
      case 'regular':
        return { icon: <UserCheck className="h-5 w-5" />, label: 'Regular Customer', color: 'bg-purple-100 text-purple-800' };
      default:
        return { icon: <User className="h-5 w-5" />, label: 'Customer', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const typeInfo = getCustomerTypeInfo(customer.type);

  const handleSaveNotes = () => {
    // In real app, this would save to database
    setIsEditingNotes(false);
  };

  return (
    <Dialog open={!!customer} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {customer.name}
                <Badge className={typeInfo.color}>
                  {typeInfo.icon}
                  <span className="ml-1">{typeInfo.label}</span>
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm font-normal text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {customer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {customer.email}
                </span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 my-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{customer.totalVisits}</p>
              <p className="text-xs text-muted-foreground">Total Visits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <p className="text-2xl font-bold">₪{customer.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <XCircle className="h-5 w-5 mx-auto mb-1 text-red-500" />
              <p className="text-2xl font-bold">{customer.cancellations.length}</p>
              <p className="text-xs text-muted-foreground">Cancellations</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="visits" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="visits" className="flex-1">Visit History</TabsTrigger>
            <TabsTrigger value="cancellations" className="flex-1">Cancellations</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="visits" className="max-h-64 overflow-y-auto">
            {customer.visits.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No visit history yet</p>
            ) : (
              <div className="space-y-2">
                {customer.visits.map((visit, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{visit.service}</p>
                      <p className="text-sm text-muted-foreground">with {visit.employee}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₪{visit.amount}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(visit.date), 'MMM d, yyyy')}</p>
                      <Badge variant={visit.status === 'completed' ? 'secondary' : 'destructive'} className="text-xs mt-1">
                        {visit.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancellations" className="max-h-64 overflow-y-auto">
            {customer.cancellations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No cancellations</p>
            ) : (
              <div className="space-y-2">
                {customer.cancellations.map((cancel, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">{cancel.service}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(cancel.date), 'MMM d, yyyy')}</p>
                    </div>
                    {cancel.reason && (
                      <Badge variant="outline" className="text-red-700">
                        {cancel.reason}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="max-h-64 overflow-y-auto">
            {customer.visits.filter(v => v.review).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reviews yet</p>
            ) : (
              <div className="space-y-2">
                {customer.visits.filter(v => v.review).map((visit, idx) => (
                  <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{visit.service}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < (visit.review?.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{visit.review?.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">{format(new Date(visit.date), 'MMM d, yyyy')}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-3">
              {isEditingNotes ? (
                <>
                  <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this customer..."
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveNotes}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingNotes(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-muted/30 rounded-lg min-h-[100px]">
                    {customer.notes || <span className="text-muted-foreground">No notes added yet</span>}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingNotes(true)}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit Notes
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
