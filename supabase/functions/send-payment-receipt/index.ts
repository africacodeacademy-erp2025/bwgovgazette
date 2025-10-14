import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, planType, amount } = await req.json();

    if (!email || !name) {
      return new Response(JSON.stringify({ error: 'Email and name are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const planName = planType === 'subscriber' ? 'Monthly Subscription' : 'Pay-Per-Download';
    const amountDisplay = planType === 'subscriber' ? 'BWP 80/month' : 'BWP 20/download';

    const { data, error } = await resend.emails.send({
      from: 'GovGazette <onboarding@resend.dev>',
      to: [email],
      subject: 'Payment Confirmation - GovGazette',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .header h1 {
                color: white;
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: #ffffff;
                padding: 40px 30px;
                border-left: 1px solid #e0e0e0;
                border-right: 1px solid #e0e0e0;
              }
              .receipt-box {
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 24px;
                margin: 24px 0;
              }
              .receipt-row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .receipt-row:last-child {
                border-bottom: none;
                font-weight: bold;
                font-size: 18px;
                color: #667eea;
              }
              .label {
                color: #6b7280;
              }
              .value {
                font-weight: 600;
                color: #111827;
              }
              .features {
                background: #f0f4ff;
                border-left: 4px solid #667eea;
                padding: 16px 20px;
                margin: 24px 0;
                border-radius: 4px;
              }
              .features h3 {
                margin-top: 0;
                color: #667eea;
              }
              .features ul {
                margin: 8px 0;
                padding-left: 20px;
              }
              .features li {
                margin: 8px 0;
              }
              .footer {
                background: #f9fafb;
                padding: 30px;
                text-align: center;
                border-radius: 0 0 8px 8px;
                border-top: 1px solid #e0e0e0;
                color: #6b7280;
                font-size: 14px;
              }
              .button {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: 600;
              }
              .success-icon {
                width: 60px;
                height: 60px;
                background: #10b981;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 30px;
                color: white;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="success-icon">✓</div>
              <h1>Payment Successful!</h1>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; margin-top: 0;">Dear ${name},</p>
              
              <p>Thank you for your purchase! Your payment has been processed successfully.</p>
              
              <div class="receipt-box">
                <h2 style="margin-top: 0; color: #111827;">Payment Receipt</h2>
                
                <div class="receipt-row">
                  <span class="label">Plan</span>
                  <span class="value">${planName}</span>
                </div>
                
                <div class="receipt-row">
                  <span class="label">Amount</span>
                  <span class="value">${amountDisplay}</span>
                </div>
                
                <div class="receipt-row">
                  <span class="label">Status</span>
                  <span class="value" style="color: #10b981;">Paid</span>
                </div>
                
                <div class="receipt-row">
                  <span class="label">Total</span>
                  <span class="value">${amountDisplay}</span>
                </div>
              </div>
              
              ${planType === 'subscriber' ? `
              <div class="features">
                <h3>Your Subscription Benefits:</h3>
                <ul>
                  <li>✓ Unlimited gazette access</li>
                  <li>✓ Advanced search filters</li>
                  <li>✓ Priority customer support</li>
                  <li>✓ Email alerts for new gazettes</li>
                </ul>
              </div>
              ` : `
              <div class="features">
                <h3>Your Download:</h3>
                <ul>
                  <li>✓ Instant gazette access</li>
                  <li>✓ Single gazette download</li>
                  <li>✓ Lifetime access to your download</li>
                </ul>
              </div>
              `}
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('APP_URL')}/dashboard" class="button">Go to Dashboard</a>
              </div>
              
              <p style="margin-top: 30px;">You can now access all features of your plan from your dashboard.</p>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 10px 0;"><strong>GovGazette</strong></p>
              <p style="margin: 5px 0;">Your trusted source for government gazettes</p>
              <p style="margin: 5px 0; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error({ error });
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
