
import { redirect } from 'next/navigation';

export default function CheckoutRedirect() {
  // Redirect to the correct storefront checkout path to resolve parallel route conflict
  redirect('/checkout');
}
