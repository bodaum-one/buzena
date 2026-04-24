import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOrders } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowRight, Bike, Car, CheckCircle, Clock, MapPin, Package, Star, User } from "lucide-react";
import { Header } from "@/components/header";
import type { Order } from "@/lib/types";

const statusMap = {
  nova: { label: "Nova", icon: Package, color: "bg-blue-500" },
  em_rota: { label: "Em Rota", icon: Bike, color: "bg-yellow-500" },
  entregue: { label: "Entregue", icon: CheckCircle, color: "bg-green-500" },
  pendente: { label: "Pendente", icon: Clock, color: "bg-gray-500" },
};


function OrderCard({ order }: { order: Order }) {
  const statusInfo = statusMap[order.status as keyof typeof statusMap] || statusMap.pendente;

  return (
    <Card className="hover:border-primary transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-lg">Pedido #{order.id.split('-')[1]}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                   <User className="h-4 w-4" /> {order.customerName}
                </CardDescription>
            </div>
             <Badge variant="outline" className={cn("capitalize", `border-${statusInfo.color.replace('bg-', '')}-500 text-${statusInfo.color.replace('bg-', '')}-500`)}>
                {statusInfo.label}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{order.addressSnapshot.street}, {order.addressSnapshot.number}</span>
        </div>
         <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center pt-2">
          {order.deliverer && (
             <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" fill="currentColor" />
                <span className="font-semibold">{order.deliverer.rating}</span>
                <span className="text-xs text-muted-foreground">({order.deliverer.vehicle === 'moto' ? 'Moto' : 'Carro'})</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/orders/${order.id}`}>
            Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function DashboardPage() {
  const newOrders = mockOrders.filter((o) => o.status === 'nova');
  const inProgressOrders = mockOrders.filter((o) => o.status === 'em_rota');
  const completedOrders = mockOrders.filter((o) => o.status === 'entregue');

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard do Entregador" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="new">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="new">Novas ({newOrders.length})</TabsTrigger>
            <TabsTrigger value="in-progress">Em Rota ({inProgressOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Concluídas ({completedOrders.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {newOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {newOrders.length === 0 && <p className="text-center text-muted-foreground mt-8">Nenhuma nova entrega no momento.</p>}
          </TabsContent>
          <TabsContent value="in-progress">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {inProgressOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
             {inProgressOrders.length === 0 && <p className="text-center text-muted-foreground mt-8">Nenhuma entrega em rota.</p>}
          </TabsContent>
          <TabsContent value="completed">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
             {completedOrders.length === 0 && <p className="text-center text-muted-foreground mt-8">Nenhuma entrega concluída ainda.</p>}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
