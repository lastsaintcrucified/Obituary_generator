"use client"

import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <div className="bg-slate-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Honor their memory with dignity</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-slate-300">
          Create thoughtful, personalized obituaries to celebrate the life and legacy of your loved ones.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-slate-100 text-slate-800 hover:bg-white"
            size="lg"
            onClick={() => {
              const formElement = document.getElementById("obituary-form")
              if (formElement) {
                formElement.scrollIntoView({ behavior: "smooth" })
              }
            }}
          >
            Get Started
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-slate-300 bg-transparent text-slate-100 hover:bg-slate-700 hover:text-white"
            onClick={() => {
              window.open("https://openrouter.ai/keys", "_blank")
            }}
          >
            Get OpenRouter API Key
          </Button>
        </div>
      </div>
    </div>
  )
}
