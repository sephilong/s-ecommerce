
import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook handler for Facebook Live comments.
 * Integrates with Social Commerce Live Shopping logic.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  // 1. Verify webhook signature (Omitted for brevity in this mock)

  // 2. Process entries
  if (body.object === 'page') {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field === 'live_videos') {
          const comment = change.value;
          const videoId = comment.video_id;
          const message = comment.message;
          const senderName = comment.from.name;
          const senderId = comment.from.id;

          console.log(`Live Order received: ${senderName} says "${message}" on video ${videoId}`);

          // Logic to parse order code: e.g., "MUA 1" -> product code 1
          const orderCodeMatch = message.match(/(?:MUA|ĐẶT)\s*(\d+)/i);
          if (orderCodeMatch) {
            const orderCode = orderCodeMatch[1];
            // Here you would trigger Order Creation in your Store:
            // 1. Find product by orderCode
            // 2. Check stock
            // 3. Create Draft Order
            // 4. Send Zalo/SMS link to customer
          }
        }
      }
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  // Verification for Facebook Webhook Setup
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === 'SCOMHUB_VERIFY_TOKEN') {
    return new Response(challenge);
  }
  
  return new Response('Verification failed', { status: 403 });
}
