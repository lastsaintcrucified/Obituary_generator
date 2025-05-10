import { NextResponse } from "next/server";

interface GenerateRequestBody {
	name: string;
	age: string;
	occupation: string;
	hobbies: string;
	family: string;
	tone: string;
}

export async function POST(request: Request) {
	try {
		const body: GenerateRequestBody = await request.json();
		const { name, age, occupation, hobbies, family, tone } = body;

		// Construct the prompt for the AI model
		const prompt = `Write a 200-word obituary for ${name}, ${age}, who worked as ${occupation}. They loved ${hobbies}. Survived by ${family}. Use a ${tone} tone. Include a meaningful quote.`;

		// Check if we have the OpenRouter API key
		if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
			throw new Error("OpenRouter API key is not configured");
		}

		// Make three separate calls to generate different variations
		const obituaries = await Promise.all([
			generateObituaryWithOpenRouter(prompt, "Variation 1"),
			generateObituaryWithOpenRouter(prompt, "Variation 2"),
			generateObituaryWithOpenRouter(prompt, "Variation 3"),
		]);

		return NextResponse.json({ obituaries });
	} catch (error) {
		console.error("Error generating obituary:", error);
		return NextResponse.json(
			{ error: "Failed to generate obituary" },
			{ status: 500 }
		);
	}
}

async function generateObituaryWithOpenRouter(
	prompt: string,
	variation: string
): Promise<string> {
	try {
		// Add variation instruction to get different results
		const fullPrompt = `${prompt} This is ${variation}, so make it unique from other variations.`;

		const response = await fetch(
			"https://openrouter.ai/api/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
					"HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
					"X-Title": "Obituary Generator",
				},
				body: JSON.stringify({
					model: "qwen/qwen2.5-vl-3b-instruct:free",
					messages: [{ role: "user", content: fullPrompt }],
					temperature: 0.7, // Add some variability
					max_tokens: 500, // Limit response length
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			console.error("OpenRouter API error:", errorData);
			throw new Error(`OpenRouter API error: ${response.status}`);
		}

		const data = await response.json();

		if (
			!data.choices ||
			!data.choices[0] ||
			!data.choices[0].message ||
			!data.choices[0].message.content
		) {
			throw new Error("Invalid response format from OpenRouter API");
		}

		return data.choices[0].message.content.trim();
	} catch (error) {
		console.error(`Error generating ${variation}:`, error);
		// Fallback to mock data if API call fails
		return generateMockObituary(variation);
	}
}

// Fallback function in case the API call fails
function generateMockObituary(variation: string): string {
	const quotes = [
		'"The legacy of a life well-lived echoes in the hearts of those who remain."',
		'"What we have once enjoyed, we can never lose; all that we love deeply becomes part of us."',
		'"Life is not measured by the number of breaths we take, but by the moments that take our breath away."',
	];

	return `[API Error - Fallback Content]

This is a fallback obituary generated because the OpenRouter API call failed. In a real implementation, this would be a properly generated obituary from the Qwen2.5 model.

${quotes[Number.parseInt(variation.slice(-1)) % 3]}

Please check your OpenRouter API key and try again.`;
}
