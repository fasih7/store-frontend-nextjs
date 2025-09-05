import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Edit } from "lucide-react";

export default function AddressTab() {
  return (
    <TabsContent value="addresses" className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Saved Addresses</h3>
          <p className="text-sm text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button>Add New Address</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            type: "Home",
            name: "John Doe",
            address: "123 Main Street, Apt 4B",
            city: "New York, NY 10001",
            isDefault: true,
          },
          {
            type: "Work",
            name: "John Doe",
            address: "456 Business Ave, Suite 200",
            city: "New York, NY 10002",
            isDefault: false,
          },
        ].map((address, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{address.type}</Badge>
                  {address.isDefault && <Badge>Default</Badge>}
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{address.name}</p>
                <p className="text-muted-foreground">{address.address}</p>
                <p className="text-muted-foreground">{address.city}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
}
