import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

serve(async (req) => {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return new Response(JSON.stringify({ error: 'Email and name are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'GovGazette <noreply@yourdomain.com>', // Replace with your verified domain in Resend
      to: [email],
      subject: 'Payment Confirmation - GovGazette Subscription',
      html: `
        <h1>Thank you for your subscription, ${name}!</h1>
        <p>Your payment was successful and your subscription is now active.</p>
        <p>You can now enjoy unlimited access to all our features.</p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <br>
        <p>Best regards,</p>
        <p>The GovGazette Team</p>
      `,
    });

    if (error) {
      console.error({ error });
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
})
