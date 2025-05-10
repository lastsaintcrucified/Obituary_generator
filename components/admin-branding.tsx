"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Check } from "lucide-react"

export default function AdminBranding() {
  const [businessName, setBusinessName] = useState("Memorial Funeral Home")
  const [logoUrl, setLogoUrl] = useState("/placeholder.svg?height=100&width=200")
  const [primaryColor, setPrimaryColor] = useState("#1e293b")
  const [footerText, setFooterText] = useState("© 2025 Memorial Funeral Home. All rights reserved.")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Branding updated",
        description: "Your branding changes have been saved successfully.",
      })
    }, 1500)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload the file to a storage service
      // and then set the URL to the uploaded file
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="business-name">Business Name</Label>
        <Input id="business-name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <div className="flex items-center space-x-4">
          <div className="h-20 w-40 bg-slate-100 rounded flex items-center justify-center overflow-hidden">
            <img
              src={logoUrl || "/placeholder.svg"}
              alt="Business Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <Input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            <Button variant="outline" onClick={() => document.getElementById("logo")?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="primary-color">Primary Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="primary-color"
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="footer-text">Footer Text</Label>
        <Textarea id="footer-text" value={footerText} onChange={(e) => setFooterText(e.target.value)} rows={2} />
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="bg-slate-800 hover:bg-slate-700">
          {isSaving ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            "Save Branding"
          )}
        </Button>
      </div>
    </div>
  )
}
