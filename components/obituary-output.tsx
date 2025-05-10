/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useObituaryStore } from "@/lib/store";
import { PaymentModal } from "@/components/payment-modal";
import { Download, Edit, Lock, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";

export default function ObituaryOutput() {
	const {
		obituaries,
		freePreviewUsed,
		selectedObituaryIndex,
		setSelectedObituaryIndex,
	} = useObituaryStore();
	const [isLoading, setIsLoading] = useState(false);
	const [editedObituaries, setEditedObituaries] = useState<string[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);

	// Initialize edited obituaries when new obituaries are generated
	if (obituaries.length > 0 && editedObituaries.length !== obituaries.length) {
		setEditedObituaries([...obituaries]);
	}

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
	};

	const handleTextChange = (text: string) => {
		const newEditedObituaries = [...editedObituaries];
		newEditedObituaries[selectedObituaryIndex] = text;
		setEditedObituaries(newEditedObituaries);
	};

	const handleDownload = () => {
		if (freePreviewUsed) {
			setShowPaymentModal(true);
			return;
		}

		setIsLoading(true);
		setTimeout(() => {
			generatePDF();
			setIsLoading(false);
		}, 500);
	};

	const generatePDF = () => {
		const doc = new jsPDF();
		const text = editedObituaries[selectedObituaryIndex] || "";

		// Add a title
		doc.setFontSize(18);
		doc.text("Obituary", 105, 20, { align: "center" });

		// Add the obituary text
		doc.setFontSize(12);

		const splitText = doc.splitTextToSize(text, 180);
		doc.text(splitText, 15, 40);

		// Add a footer
		doc.setFontSize(10);
		doc.text("Generated with Obituary Generator", 105, 280, {
			align: "center",
		});

		// Save the PDF
		doc.save("obituary.pdf");
	};

	const handlePaymentSuccess = () => {
		setShowPaymentModal(false);
		generatePDF();
	};

	if (obituaries.length === 0) {
		return (
			<Card className='h-full'>
				<CardContent className='p-6 flex flex-col items-center justify-center min-h-[400px] text-center'>
					<p className='text-slate-500 mb-4'>
						Fill out the form and click "Generate Obituary" to see your drafts
						here.
					</p>
					<div className='w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4'>
						<Edit className='h-8 w-8 text-slate-400' />
					</div>
					<p className='text-sm text-slate-400'>
						You'll receive three unique drafts to choose from.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card className='h-full'>
				<CardContent className='p-6'>
					<Tabs
						defaultValue='draft1'
						className='w-full'
						onValueChange={(value) => {
							const index = Number.parseInt(value.replace("draft", "")) - 1;
							setSelectedObituaryIndex(index);
						}}
					>
						<TabsList className='grid grid-cols-3 mb-4'>
							<TabsTrigger value='draft1'>Draft 1</TabsTrigger>
							<TabsTrigger value='draft2'>Draft 2</TabsTrigger>
							<TabsTrigger value='draft3'>Draft 3</TabsTrigger>
						</TabsList>

						{obituaries.map((obituary, index) => (
							<TabsContent
								key={`draft${index + 1}`}
								value={`draft${index + 1}`}
								className='space-y-4'
							>
								{isEditing ? (
									<Textarea
										className='min-h-[300px] font-serif'
										value={editedObituaries[index] || ""}
										onChange={(e) => handleTextChange(e.target.value)}
									/>
								) : (
									<div className='bg-white p-4 rounded-md border min-h-[300px] font-serif whitespace-pre-wrap'>
										{editedObituaries[index] || obituary}
									</div>
								)}
							</TabsContent>
						))}

						<div className='flex justify-between mt-4'>
							<Button
								variant='outline'
								onClick={handleEditToggle}
								className='text-slate-700'
							>
								{isEditing ? "Save Edits" : "Edit Text"}
								<Edit className='ml-2 h-4 w-4' />
							</Button>

							<Button
								onClick={handleDownload}
								className='bg-slate-800 hover:bg-slate-700'
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Preparing PDF...
									</>
								) : freePreviewUsed ? (
									<>
										Unlock Download
										<Lock className='ml-2 h-4 w-4' />
									</>
								) : (
									<>
										Download as PDF
										<Download className='ml-2 h-4 w-4' />
									</>
								)}
							</Button>
						</div>
					</Tabs>
				</CardContent>
			</Card>

			<PaymentModal
				isOpen={showPaymentModal}
				onClose={() => setShowPaymentModal(false)}
				onPaymentSuccess={handlePaymentSuccess}
			/>
		</>
	);
}
