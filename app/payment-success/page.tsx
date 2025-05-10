"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"
import { useObituaryStore } from "@/lib/store"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { toast } = useToast()
  const { setFreePreviewUsed } = useObituaryStore()

  useEffect(() => {
    // Mark the user as paid so they can download without restrictions
    setFreePreviewUsed(false)

    // Show success toast
    toast({
      title: "Payment Successful",
      description: "Thank you for your purchase. You can now download your obituary.",
    })

    // In a real implementation, you would verify the payment with Stripe
    // async function verifyPayment() {
    //   if (sessionId) {
    //     const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
    //     const data = await response.json()
    //     if (data.success) {
    //       setFreePreviewUsed(false)
    //     }
    //   }
    // }
    // verifyPayment()
  }, [sessionId, toast, setFreePreviewUsed])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful</CardTitle>
          <CardDescription>Thank you for your purchase. Your obituary is now ready for download.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-slate-600">
            You now have full access to download your obituary and all premium features.
          </p>
          <div className="flex flex-col space-y-2">
            <Button onClick={() => router.push("/")} className="bg-slate-800 hover:bg-slate-700">
              Return to Obituary Generator
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
