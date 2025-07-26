"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function ImageUploadTest() {
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Test: Image upload triggered", event.target.files)
    
    const file = event.target.files?.[0]
    if (file) {
      console.log("Test: File selected:", file.name, file.type, file.size)
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error("Test: Invalid file type:", file.type)
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, GIF, etc.).",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        console.error("Test: File too large:", file.size)
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          console.log("Test: File read successfully")
          const result = e.target?.result as string
          if (result) {
            console.log("Test: Setting image preview")
            setImagePreview(result)
            toast({
              title: "Image uploaded successfully",
              description: "Your image has been added.",
            })
          } else {
            console.error("Test: No result from FileReader")
            toast({
              title: "Upload failed",
              description: "No image data received. Please try again.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Test: Error processing image:", error)
          toast({
            title: "Upload failed",
            description: "There was an error processing your image. Please try again.",
            variant: "destructive",
          })
        }
      }

      reader.onerror = (error) => {
        console.error("Test: FileReader error:", error)
        toast({
          title: "Upload failed",
          description: "There was an error reading your image file. Please try again.",
          variant: "destructive",
        })
      }

      reader.onabort = () => {
        console.log("Test: FileReader aborted")
        toast({
          title: "Upload cancelled",
          description: "Image upload was cancelled.",
          variant: "destructive",
        })
      }

      console.log("Test: Starting to read file as DataURL")
      reader.readAsDataURL(file)
    } else {
      console.log("Test: No file selected")
    }
  }

  const removeImage = () => {
    console.log("Test: Removing image")
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast({
      title: "Image removed",
      description: "The image has been removed.",
    })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Image Upload Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {imagePreview ? (
            <div className="space-y-4">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-h-48 object-cover rounded-lg"
              />
              <Button variant="outline" onClick={removeImage} className="w-full">
                <X className="h-4 w-4 mr-2" />
                Remove Image
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Upload an image to test the functionality
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  console.log("Test: Choose Image button clicked")
                  console.log("Test: fileInputRef.current:", fileInputRef.current)
                  if (fileInputRef.current) {
                    fileInputRef.current.click()
                  } else {
                    console.error("Test: File input ref is null")
                  }
                }}
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 