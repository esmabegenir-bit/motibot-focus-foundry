import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OrderItem = { productId: string; name: string; price: number; quantity: number; digital: boolean };

export const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const ordersQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const orderQueryOptions = (orderId: string) =>
  queryOptions({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
