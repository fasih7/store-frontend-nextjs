"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { SavedAddress, User } from "@/lib/types";
import AddressModal from "@/components/dialogs/address-modal";
import { useAlert } from "@/components/shared/alerts";
import { userGateway } from "@/domain/gateways/user.gateway";

interface AddressTabProps {
  savedAddresses: SavedAddress[];
  user: User;
  onAddressAdded?: (address: SavedAddress) => void;
  onAddressDeleted?: (addressId: string) => void;
}

export default function AddressTab({
  savedAddresses,
  user,
  onAddressAdded,
  onAddressDeleted,
}: AddressTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(
    null
  );
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null
  );
  const { showSuccess } = useAlert();

  const handleAddNewAddress = () => {
    setIsAddModalOpen(true);
  };

  const handleEditAddress = (address: SavedAddress) => {
    setEditingAddress(address);
  };

  const handleAddressSaved = (address: SavedAddress) => {
    if (onAddressAdded) {
      onAddressAdded(address);
    }
    setEditingAddress(null);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await userGateway.deleteAddressForCurrentUser(addressId);
      showSuccess("Address deleted successfully");
      if (onAddressDeleted) {
        onAddressDeleted(addressId);
      }
      setDeletingAddressId(null);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <TabsContent value="addresses" className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">
            Saved Addresses (Upto 5 addresses)
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button
          onClick={handleAddNewAddress}
          disabled={savedAddresses.length >= 5}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedAddresses.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            <p>No addresses saved yet.</p>
            <p className="text-sm">Click "Add New Address" to get started.</p>
          </div>
        ) : (
          savedAddresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{address.label}</Badge>
                    {address.isDefault && <Badge>Default</Badge>}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingAddressId(address.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Address</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this address? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setDeletingAddressId(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAddress(address.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                  <p className="text-muted-foreground">{address.addressLine}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.province} {address.postalCode}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add New Address Modal */}
      <AddressModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddressSaved={handleAddressSaved}
        flow="add"
        title="Add New Address"
        description="Enter the details for your new address"
      />

      {/* Edit Address Modal */}
      {editingAddress && (
        <AddressModal
          open={!!editingAddress}
          onOpenChange={handleCloseModal}
          onAddressSaved={handleAddressSaved}
          flow="edit"
          initialData={editingAddress || undefined}
          title="Edit Address"
          description="Update your address details"
        />
      )}
    </TabsContent>
  );
}
