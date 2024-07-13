import { useQuery, useMutation } from "@tanstack/react-query";
import { getMarketplaceItems, purchaseItem } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";

export default function Marketplace() {
  const { toast } = useToast();

  const { data: items, isLoading: isItemsLoading } = useQuery({
    queryKey: ["marketplaceItems"],
    queryFn: getMarketplaceItems,
  });

  const purchaseItemMutation = useMutation({
    mutationFn: purchaseItem,
    onSuccess: () => {
      toast({ title: "Item purchased successfully" });
    },
    onError: () => {
      toast({ title: "Failed to purchase item", variant: "destructive" });
    },
  });

  const handlePurchase = (itemId: string) => {
    purchaseItemMutation.mutate(itemId);
  };

  if (isItemsLoading) return (
    <>
      <Header />
      <div className="space-x-6 space-y-6 px-6 py-4 md:px-12 md:py-8 max-w-screen-xl mx-auto">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <div className="flex flex-col flex-1 items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 mt-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
     <Header />
     <div className="space-x-6 space-y-6 px-6 py-4 md:px-12 md:py-8 max-w-screen-xl mx-auto">
        {/* <h1 className="text-3xl font-bold">Marketplace</h1> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{item.description}</p>
                <p className="font-bold mt-2">Price: {item.price} APT</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handlePurchase(item.id)}>Purchase</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
