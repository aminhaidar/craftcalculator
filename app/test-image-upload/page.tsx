import { ImageUploadTest } from "@/components/image-upload-test"
import { Header } from "@/components/header"

export default function TestImageUploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Image Upload Test</h1>
          <p className="text-muted-foreground mb-8">
            This page tests the image upload functionality. Open the browser console to see detailed logs.
          </p>
          <ImageUploadTest />
        </div>
      </main>
    </div>
  )
} 