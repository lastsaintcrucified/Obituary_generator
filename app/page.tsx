import ObituaryForm from "@/components/obituary-form";
import ObituaryOutput from "@/components/obituary-output";
import { Toaster } from "@/components/ui/toaster";
import HeroSection from "@/components/hero-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function Home() {
	const hasOpenRouterKey = !!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

	return (
		<main className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100'>
			<Toaster />
			<HeroSection />
			<div className='container mx-auto px-4 py-8'>
				{!hasOpenRouterKey && (
					<Alert className='mb-8 border-amber-200 bg-amber-50'>
						<InfoIcon className='h-4 w-4 text-amber-600' />
						<AlertTitle className='text-amber-800'>
							OpenRouter API Key Required
						</AlertTitle>
						<AlertDescription className='text-amber-700'>
							To generate real obituaries, you need to add your OpenRouter API
							key as an environment variable. Get a key at{" "}
							<a
								href='https://openrouter.ai/keys'
								target='_blank'
								rel='noopener noreferrer'
								className='underline font-medium'
							>
								openrouter.ai/keys
							</a>{" "}
							and add it as OPENROUTER_KEY.
						</AlertDescription>
					</Alert>
				)}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<div>
						<h2 className='text-2xl font-semibold mb-4 text-slate-800'>
							Create an Obituary
						</h2>
						<ObituaryForm />
					</div>
					<div>
						<h2 className='text-2xl font-semibold mb-4 text-slate-800'>
							Preview
						</h2>
						<ObituaryOutput />
					</div>
				</div>
			</div>
		</main>
	);
}
