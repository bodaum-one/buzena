"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Package, User, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockOrders } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";


const HornIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M10.22 6.34 4.5 12l5.72 5.66"></path>
        <path d="M16.5 12H4.5"></path>
        <path d="M7.5 12h12.5a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4.5"></path>
    </svg>
);


export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [isBuzzing, setIsBuzzing] = useState(false);

  const order = mockOrders.find((o) => o.id === params.id);
  const mapPlaceholder = PlaceHolderImages.find(p => p.id === 'map-placeholder');

  if (!order) {
    notFound();
  }

  const handleBuzz = () => {
    setIsBuzzing(true);
    console.log(`Buzinando para o pedido ${order.id}`);
    
    // Simulate API call and notification
    setTimeout(() => {
        toast({
            title: "Cliente notificado!",
            description: `A notificação para ${order.customerName} foi enviada.`,
        });
        setIsBuzzing(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
       <header className="flex items-center h-14 px-4 border-b shrink-0 bg-card">
         <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Voltar</span>
            </Link>
         </Button>
         <h1 className="font-semibold text-lg ml-4">Detalhes do Pedido</h1>
       </header>
       <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        <div className="grid md:grid-cols-5 gap-8 max-w-7xl mx-auto">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="text-primary"/> Informações do Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="font-semibold">{order.customerName}</p>
                         <div className="flex items-center text-sm text-muted-foreground gap-2">
                           <MapPin className="h-4 w-4" />
                           <p>{order.addressSnapshot.street}, {order.addressSnapshot.number} <br/> {order.addressSnapshot.neighborhood}, {order.addressSnapshot.city}</p>
                         </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Package className="text-primary"/> Itens do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="space-y-2">
                            {order.items.map((item, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>{item.name}</span>
                                    <span className="text-muted-foreground">x{item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 {order.deliverer && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Star className="text-primary"/> Seu Perfil na Entrega</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Image src={order.deliverer.avatarUrl} alt={order.deliverer.name} width={64} height={64} className="rounded-full" data-ai-hint="man portrait"/>
                            <div className="space-y-1">
                                <p className="font-semibold">{order.deliverer.name}</p>
                                <p className="text-sm text-muted-foreground">{order.deliverer.vehicle === 'moto' ? 'Moto' : 'Carro'} - {order.deliverer.plate}</p>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-primary fill-current" />
                                    <span className="font-bold">{order.deliverer.rating}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
             <div className="md:col-span-3 flex flex-col items-center justify-center space-y-8">
                 {mapPlaceholder && (
                    <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg border">
                        <Image
                            src={mapPlaceholder.imageUrl}
                            alt={mapPlaceholder.description}
                            width={800}
                            height={600}
                            className="w-full h-full object-cover"
                            data-ai-hint={mapPlaceholder.imageHint}
                        />
                    </div>
                )}
                 <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-lg text-muted-foreground mb-4">Chegou ao destino?</p>
                     <Button 
                        className={cn(
                            "h-48 w-48 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 transition-transform duration-150 ease-in-out",
                            "flex flex-col gap-2",
                            isBuzzing && "animate-pulse",
                            "active:scale-95"
                        )}
                        onClick={handleBuzz}
                        disabled={isBuzzing}
                     >
                        <HornIcon className="h-16 w-16" />
                        <span className="text-2xl font-bold uppercase tracking-wider">Buzinar</span>
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">O cliente receberá uma notificação.</p>
                 </div>
            </div>
        </div>
       </main>
    </div>
  );
}
