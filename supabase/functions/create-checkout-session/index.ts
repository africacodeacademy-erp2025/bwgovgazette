import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    // Set the auth token for this request
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const { planType, gazetteId } = await req.json()

    console.log('Creating checkout session for:', { planType, gazetteId, userId: user.id })

    let priceData
    let mode = 'subscription'

    if (planType === 'subscriber') {
      priceData = {
        currency: 'zar',
        unit_amount: 12000, // P120 in cents
        recurring: {
          interval: 'month',
        },
        product_data: {
          name: 'Subscriber Plan',
          description: '30 downloads per month, full access to all standard issues, email notifications',
        },
      }
    } else if (planType === 'enterprise') {
      priceData = {
        currency: 'zar',
        unit_amount: 150000, // P1,500 in cents
        recurring: {
          interval: 'month',
        },
        product_data: {
          name: 'Enterprise Plan',
          description: 'Unlimited downloads, multiple team accounts, priority support & API access',
        },
      }
    } else if (planType === 'pay-per-download') {
      mode = 'payment'
      priceData = {
        currency: 'zar',
        unit_amount: 5000, // P50 in cents
        product_data: {
          name: 'Single Gazette Download',
          description: 'Single issue download with 3 download attempts',
        },
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid plan type' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      billing_address_collection: 'required',
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: mode as 'subscription' | 'payment',
      success_url: `${Deno.env.get('APP_URL')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('APP_URL')}/subscription`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
        gazette_id: gazetteId || '',
      },
    })

    console.log('Checkout session created:', session.id)

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})