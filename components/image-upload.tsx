"use client"

import { useState, useRef, useCallback } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, Plus, Camera, Folder, UserPlus, UserRound } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface ImageUploadButtonProps {
  onImageCapture: (file: File) => void
}

export function ImageUpload({ onImageCapture }: ImageUploadButtonProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleImageChange = (file: File) => {
    if (file.type.split("/")[0] !== "image") {
      toast({
        title: "Invalid file type",
        description: "Please choose an image file",
        variant: "destructive",
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose a file smaller than 5MB",
        variant: "destructive",
      })
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      console.log("reader.result:", reader.result)
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
    onImageCapture(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageChange(file)
    }
  }

  const handleCameraCapture = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Camera not supported",
        description: "Your browser doesn't support camera access. Please try uploading an image instead.",
        variant: "destructive",
      })
      return
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      setStream(newStream)
      setIsDialogOpen(true)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Error accessing camera",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
          handleImageChange(file)
        }
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
        setIsDialogOpen(false)
        setStream(null)
      }, "image/jpeg")
    }
  }, [handleImageChange])

  const closeDialog = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsDialogOpen(false)
    setStream(null)
  }, [])

  const isCameraSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }

  return (
    <div className="relative inline-block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" className="rounded-full p-0 w-24 h-24" variant="outline">
            <Avatar className="w-full h-full">
              <img
                src={image || "/placeholder.svg?height=140&width=140"}
                alt="Uploaded"
                className="w-full h-full object-cover"
                width={140}
                height={140}
              />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isCameraSupported() ? (
            <DropdownMenuItem onSelect={handleCameraCapture}>
              <Camera className="mr-2 h-4 w-4" />
              <span>Take Photo</span>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
            <Folder className="mr-2 h-4 w-4" />
            <span>Choose File</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Choose image file"
      />
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
            <DialogTitle>Take a Photo</DialogTitle>
          <DialogHeader>
            <DialogDescription>
        Use your camera to take a photo or upload an image file.
      </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
          <Button onClick={capturePhoto}>Capture</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}















// 'use client'

// import { useState, useRef } from 'react'
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { User, Plus, Camera, Folder, UserPlus, UserRound } from 'lucide-react'
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { toast } from '@/hooks/use-toast'

// interface ImageUploadButtonProps {
//     onImageCapture: (file: File) => void;
// }

// export function ImageUpload({ onImageCapture }: ImageUploadButtonProps) {
//     const [image, setImage] = useState<string | null>(null)
//     const fileInputRef = useRef<HTMLInputElement>(null)

//     const handleImageChange = (file: File) => {
//         if (file.type.split('/')[0] !== 'image') {
//             toast({
//                 title: "Invalid file type",
//                 description: "Please choose an image file",
//                 variant: "destructive",
//             })
//             return;
//         }
//         if (file.size > 5 * 1024 * 1024) {
//             toast({
//                 title: "File too large",
//                 description: "Please choose a file smaller than 5MB",
//                 variant: "destructive",
//             })
//             return;
//         }
//         const reader = new FileReader()
//         reader.onloadend = () => {
//             console.log('reader.result:', reader.result)
//             setImage(reader.result as string)
//         }
//         reader.readAsDataURL(file)
//         onImageCapture(file)
//     }

//     const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//             handleImageChange(file)
//         }
//     }

//     // using shadcnui's dialog i want the thing to show a dialog
//     // that shows the camera and then the user can take a picture
//     // when the user selects 'Take Photo'.




//     const handleCameraCapture = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true })
//             const videoElement = document.createElement('video')
//             videoElement.srcObject = stream
//             videoElement.play()

//             videoElement.onloadedmetadata = () => {
//                 const canvas = document.createElement('canvas')
//                 canvas.width = videoElement.videoWidth
//                 canvas.height = videoElement.videoHeight
//                 canvas.getContext('2d')?.drawImage(videoElement, 0, 0)

//                 canvas.toBlob((blob) => {
//                     if (blob) {
//                         const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
//                         handleImageChange(file)
//                     }
//                     stream.getTracks().forEach(track => track.stop())
//                 }, 'image/jpeg')
//             }
//         } catch (error) {
//             toast({
//                 title: "Error accessing camera",
//                 description: (error as Error).message,
//                 variant: "destructive",
//             })
//             // console.error('Error accessing camera:', error)
//         }
//     }

//     return (
//         <div className="relative inline-block">
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <Button
//                         type="button"
//                         className="rounded-full p-0 w-24 h-24"
//                         variant="outline"
//                     >
//                         <Avatar className="w-full h-full">
//                             <img src={image || "/placeholder.svg?height=140&width=140"} alt="Uploaded" className="w-full h-full object-cover" />
//                             {
//                             // image ? (
//                             //     <img src={image || "/placeholder.svg?height=160&width=160"} alt="Uploaded" className="w-full h-full object-cover" />
//                             // ) : (
//                             //     <AvatarFallback className="text-lg font-bold">
//                             //         {/* <UserPlus className="w-8 h-8" /> */}
//                             //         <UserRound strokeWidth='5px' size="40px" className="w-full h-full" />
//                             //         <Plus className="w-4 h-4 absolute bottom-1" />
//                             //     </AvatarFallback>
//                             // )
//                             }
//                         </Avatar>
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                     <DropdownMenuItem onSelect={handleCameraCapture}>
//                         <Camera className="mr-2 h-4 w-4" />
//                         <span>Take Photo</span>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
//                         <Folder className="mr-2 h-4 w-4" />
//                         <span>Choose File</span>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//             <input
//                 type="file"
//                 ref={fileInputRef}
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 className="hidden"
//                 aria-label="Choose image file"
//             />
//         </div>
//     )
// }

















// // components/ui/image-upload.tsx

// import { useState, ChangeEvent } from 'react';
// import Image from 'next/image';
// import { compressImage, fileToBase64 } from '@/lib/image-utils';
// import { Input } from './ui/input';
// import { Label } from './ui/label';

// interface ImageUploadProps {
//     label: string;
//     currentImage?: string;
//     onImageUpload: (base64: string) => void;
// }

// export default function ImageUpload({label = "Picture", currentImage, onImageUpload }: ImageUploadProps) {
//     const [preview, setPreview] = useState<string | null>(currentImage || null);

//     const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         try {

//             // ============ with compression ===============
//             // // Compress the image first
//             // const compressedFile = await compressImage(file);
//             // // Then convert to base64
//             // const base64 = await fileToBase64(compressedFile);

//             // ============ without compression ===============
//             // Convert to base64
//             const base64 = await fileToBase64(file);


//             setPreview(base64);
//             onImageUpload(base64);
//         } catch (error) {
//             console.error('Error converting image:', error);
//         }
//     };

//     return (
//         <div className="relative">
//             {preview && (
//                 <div className="mb-4">
//                     <Image
//                         src={preview}
//                         alt="Preview"
//                         className="max-w-[200px] h-auto rounded-lg"
//                     />
//                 </div>
//             )}
//             <div className="grid w-full max-w-sm items-center gap-1.5">
//                 <Label htmlFor="picture">{label}</Label>
//                 <Input id="picture" type="file" onChange={handleFileChange} />
//             </div>
//         </div>
//     );
// }
