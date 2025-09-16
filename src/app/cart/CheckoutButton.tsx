'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type Props = {
  items: Array<{ productId: string; quantity: number; unitPrice?: number; modifierOptionIds?: string[] }>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function CheckoutButton({ items, ...rest }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error('Order failed');
      // redirect to orders page
      router.push('/orders');
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('No se pudo crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={onCheckout} disabled={loading} {...rest}>
      {loading ? 'Creando pedido…' : 'Proceder al Pago'}
    </Button>
  );
}

