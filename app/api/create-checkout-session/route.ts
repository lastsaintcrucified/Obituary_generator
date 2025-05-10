import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
	apiVersion: "2025-04-30.basil", // Use the correct API version
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { plan, successUrl, cancelUrl } = body;

		if (!plan) {
			return NextResponse.json({ error: "Plan is required" }, { status: 400 });
		}

		// Set the price ID based on the selected plan
		const priceId =
			plan === "basic"
				? process.env.STRIPE_PRICE_ID_BASIC
				: process.env.STRIPE_PRICE_ID_PREMIUM;

		if (!priceId) {
			return NextResponse.json(
				{ error: "Price ID not configured for the selected plan" },
				{ status: 500 }
			);
		}

		// Create a checkout session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			mode: "payment",
			success_url:
				successUrl ||
				`${process.env.APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: cancelUrl || `${process.env.APP_URL}/payment-cancelled`,
			metadata: {
				plan,
			},
		});

		return NextResponse.json({ sessionId: session.id, url: session.url });
	} catch (error) {
		console.error("Error creating checkout session:", error);
		return NextResponse.json(
			{ error: "Failed to create checkout session" },
			{ status: 500 }
		);
	}
}
