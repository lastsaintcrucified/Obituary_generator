/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface PaymentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onPaymentSuccess: () => void;
}

export function PaymentModal({
	isOpen,
	onClose,
	onPaymentSuccess,
}: PaymentModalProps) {
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const { toast } = useToast();

	const handlePayment = async () => {
		if (!selectedPlan) {
			toast({
				title: "Please select a plan",
				description: "You need to select a plan before proceeding.",
				variant: "destructive",
			});
			return;
		}

		setIsProcessing(true);

		try {
			// Create a checkout session on the server
			const response = await fetch("/api/create-checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					plan: selectedPlan,
					// You can customize success and cancel URLs if needed
					successUrl: `${window.location.origin}/payment-success`,
					cancelUrl: `${window.location.origin}/payment-cancelled`,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create checkout session");
			}

			const { url } = await response.json();

			// If we have a URL, redirect to Stripe Checkout
			if (url) {
				window.location.href = url;
			} else {
				throw new Error("No checkout URL returned");
			}
		} catch (error) {
			console.error("Payment error:", error);
			toast({
				title: "Payment Error",
				description:
					"There was a problem processing your payment. Please try again.",
				variant: "destructive",
			});
			setIsProcessing(false);
		}

		// For demo purposes only - remove this in production
		if (
			process.env.NODE_ENV === "development" &&
			!process.env.STRIPE_SECRET_KEY
		) {
			// Simulate payment processing for demo
			setTimeout(() => {
				setIsProcessing(false);
				toast({
					title: "Demo Mode",
					description:
						"In a real app, you would be redirected to Stripe. Payment simulated for demo.",
				});
				onClose();
				onPaymentSuccess();
			}, 2000);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}
		>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>Choose a Plan</DialogTitle>
					<DialogDescription>
						Select a plan to download your obituary and access additional
						features.
					</DialogDescription>
				</DialogHeader>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
					<Card
						className={`cursor-pointer border-2 ${
							selectedPlan === "basic" ? "border-slate-800" : "border-slate-200"
						}`}
						onClick={() => setSelectedPlan("basic")}
					>
						<CardHeader>
							<CardTitle>Basic</CardTitle>
							<CardDescription>Single obituary download</CardDescription>
						</CardHeader>
						<CardContent>
							<p className='text-2xl font-bold'>$9.99</p>
							<ul className='mt-4 space-y-2'>
								<li className='flex items-center'>
									<Check className='h-4 w-4 mr-2 text-green-500' />
									<span>PDF Download</span>
								</li>
								<li className='flex items-center'>
									<Check className='h-4 w-4 mr-2 text-green-500' />
									<span>Unlimited Edits</span>
								</li>
								<li className='flex items-center'>
									<Check className='h-4 w-4 mr-2 text-green-500' />
									<span>Print-Ready Format</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					<Card
						className={`cursor-pointer border-2 ${
							selectedPlan === "premium"
								? "border-slate-800"
								: "border-slate-200"
						}`}
						onClick={() => setSelectedPlan("premium")}
					>
						<CardHeader>
							<CardTitle>Premium</CardTitle>
							<CardDescription>Obituary + Eulogy</CardDescription>
						</CardHeader>
						<CardContent>
							<p className='text-2xl font-bold'>$19.99</p>
							<ul className='mt-4 space-y-2'>
								<li className='flex items-center'>
									<Check className='h-4 w-4 mr-2 text-green-500' />
									<span>Everything in Basic</span>
								</li>
								<li className='flex items-center'>
									<Check className='h-4 w-4 mr-2 text-green-500' />
									<span>Matching Eulogy</span>
								</li>
								<li className='flex items-center'>
									<Check className='h-4 w-4 mr-2 text-green-500' />
									<span>Premium Templates</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>

				<div className='flex justify-end'>
					<Button
						variant='outline'
						onClick={onClose}
						className='mr-2'
					>
						Cancel
					</Button>
					<Button
						onClick={handlePayment}
						disabled={!selectedPlan || isProcessing}
						className='bg-slate-800 hover:bg-slate-700'
					>
						{isProcessing ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Processing...
							</>
						) : (
							"Proceed to Payment"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
