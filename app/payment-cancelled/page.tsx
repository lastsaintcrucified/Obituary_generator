/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancelledPage() {
	const router = useRouter();

	return (
		<div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<div className='flex justify-center mb-4'>
						<XCircle className='h-16 w-16 text-red-500' />
					</div>
					<CardTitle className='text-2xl'>Payment Cancelled</CardTitle>
					<CardDescription>
						Your payment was cancelled and you have not been charged.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<p className='text-center text-slate-600'>
						You can still view your obituary drafts, but you'll need to complete
						payment to download them.
					</p>
					<div className='flex flex-col space-y-2'>
						<Button
							onClick={() => router.push("/")}
							className='bg-slate-800 hover:bg-slate-700'
						>
							Return to Obituary Generator
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
