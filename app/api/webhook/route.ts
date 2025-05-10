import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2025-04-30.basil",
});

// This is your Stripe webhook secret for verifying signatures
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
	const payload = await request.text();
	const signature = request.headers.get("stripe-signature") || "";

	let event;

	try {
		// Verify the event came from Stripe
		if (endpointSecret) {
			event = stripe.webhooks.constructEvent(
				payload,
				signature,
				endpointSecret
			);
		} else {
			// For development without a webhook secret
			event = JSON.parse(payload);
		}
	} catch (err) {
		console.error(`⚠️ Webhook signature verification failed:`, err);
		return NextResponse.json(
			{ error: "Webhook signature verification failed" },
			{ status: 400 }
		);
	}

	// Handle the event
	switch (event.type) {
		case "checkout.session.completed":
			const session = event.data.object as Stripe.Checkout.Session;

			// Here you would update your database to mark the user as paid
			// For example:
			// await db.user.update({
			//   where: { id: session.metadata.userId },
			//   data: { hasPaid: true, plan: session.metadata.plan }
			// })

			console.log(`💰 Payment successful for session ${session.id}`);
			break;

		case "payment_intent.succeeded":
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			console.log(`💰 PaymentIntent successful: ${paymentIntent.id}`);
			break;

		default:
			console.log(`Unhandled event type: ${event.type}`);
	}

	return NextResponse.json({ received: true });
}
