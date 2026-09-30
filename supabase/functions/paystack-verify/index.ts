// supabase/functions/paystack-verify/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { reference } = await req.json();
    if (!reference) throw new Error("Missing reference");

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
        },
      }
    );

    const paystackData = await paystackRes.json();
    if (!paystackData.status || paystackData.data.status !== "success") {
      throw new Error("Payment not successful");
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userId = paystackData.data.metadata.user_id;
    const amount = paystackData.data.amount / 100;

    await adminClient
      .from("payments")
      .update({ status: "success", paid_at: new Date().toISOString() })
      .eq("reference", reference);

    if (paystackData.data.metadata.purpose === "dues") {
      await adminClient
        .from("profiles")
        .update({ dues_paid: true })
        .eq("id", userId);
    }

    return new Response(JSON.stringify({ success: true, amount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});