/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useObituaryStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	age: z.string().refine((val) => !isNaN(Number.parseInt(val)), {
		message: "Age must be a valid number.",
	}),
	occupation: z.string().min(2, {
		message: "Occupation must be at least 2 characters.",
	}),
	hobbies: z.string().min(5, {
		message: "Please provide some hobbies or interests.",
	}),
	family: z.string().min(5, {
		message: "Please provide information about surviving family.",
	}),
	tone: z.string({
		required_error: "Please select a tone.",
	}),
});

export default function ObituaryForm() {
	const [isGenerating, setIsGenerating] = useState(false);
	const { toast } = useToast();
	const { setObituaries, setFreePreviewUsed } = useObituaryStore();
	const [error, setError] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			age: "",
			occupation: "",
			hobbies: "",
			family: "",
			tone: "neutral",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsGenerating(true);

		try {
			setError(null);
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to generate obituary");
			}

			const data = await response.json();

			if (
				!data.obituaries ||
				!Array.isArray(data.obituaries) ||
				data.obituaries.length !== 3
			) {
				throw new Error("Invalid response format from API");
			}

			setObituaries(data.obituaries);
			setFreePreviewUsed(true);

			toast({
				title: "Obituary Generated",
				description: "Your obituary drafts are ready to view.",
			});
		} catch (error) {
			console.error("Error generating obituary:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to generate obituary";
			setError(errorMessage);
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsGenerating(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6'
				id='obituary-form'
			>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input
									placeholder='John Smith'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='age'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Age</FormLabel>
							<FormControl>
								<Input
									placeholder='85'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='occupation'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Occupation</FormLabel>
							<FormControl>
								<Input
									placeholder='Teacher'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='hobbies'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Hobbies & Interests</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Gardening, reading, traveling, spending time with family'
									className='min-h-[80px]'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='family'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Surviving Family Members</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Wife Jane, son Robert, daughter Mary, and 5 grandchildren'
									className='min-h-[80px]'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='tone'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tone</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a tone' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='religious'>Religious</SelectItem>
									<SelectItem value='neutral'>Neutral</SelectItem>
									<SelectItem value='personalized'>Personalized</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription>
								Choose the tone that best reflects the deceased's values.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{error && (
					<div className='bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm'>
						<p className='font-medium'>Error generating obituary:</p>
						<p>{error}</p>
						<p className='mt-2 text-xs'>
							Please check that your OpenRouter API key is properly configured.
						</p>
					</div>
				)}
				<Button
					type='submit'
					className='w-full bg-slate-800 hover:bg-slate-700'
					disabled={isGenerating}
				>
					{isGenerating ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							Generating Obituary...
						</>
					) : (
						"Generate Obituary"
					)}
				</Button>
			</form>
		</Form>
	);
}
