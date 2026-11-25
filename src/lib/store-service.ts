import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { CartItem, OrderDetails } from "@/context/CartContext";

function requireSupabase() {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.");
  }
  return client;
}

export async function createOrder(order: OrderDetails): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("orders").insert({
    order_number: order.orderId,
    items: order.items as CartItem[],
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    customer_name: order.customerName,
    phone: order.phone,
    address: order.address,
    city: order.city,
    pincode: order.pincode,
    delivery_date: order.deliveryDate || null,
    delivery_slot: order.deliverySlot,
    gift_note: order.giftNote || null,
    payment_method: order.paymentMethod,
    payment_status: "pending",
    order_status: "new",
  });
  if (error) throw new Error(`Order could not be saved: ${error.message}`);
}

export async function subscribeNewsletter(email: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("newsletter_subscribers").upsert(
    { email: email.trim().toLowerCase() },
    { onConflict: "email", ignoreDuplicates: true },
  );
  if (error) throw new Error(`Subscription failed: ${error.message}`);
}

export async function createContactEnquiry(input: {
  name: string; phone: string; email?: string; occasion: string; service: string; message: string;
}): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("contact_enquiries").insert({
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    occasion: input.occasion,
    service: input.service,
    message: input.message.trim(),
  });
  if (error) throw new Error(`Enquiry could not be saved: ${error.message}`);
}
