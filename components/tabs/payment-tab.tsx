import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { CreditCard, Edit } from "lucide-react";

export default function PaymentTab() {
  return (
    <TabsContent value="payment" className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <p className="text-sm text-muted-foreground">
            Manage your saved payment methods
          </p>
        </div>
        <Button>Add Payment Method</Button>
      </div>
      <div className="space-y-4">
        {[
          {
            type: "Visa",
            last4: "4242",
            expiry: "12/26",
            isDefault: true,
          },
          {
            type: "Mastercard",
            last4: "8888",
            expiry: "09/25",
            isDefault: false,
          },
        ].map((card, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {card.type} ending in {card.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {card.expiry}
                    </p>
                  </div>
                  {card.isDefault && <Badge>Default</Badge>}
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
}
