"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, X } from 'lucide-react'
import { ImageUpload } from "@/components/image-upload"

const studentFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  DOB: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please enter a valid date in the format YYYY-MM-DD.",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string().min(2, { message: "Address must be at least 2 characters." }),
  town: z.string().min(2, { message: "Town must be at least 2 characters." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  tribe: z.string().min(2, { message: "Tribe must be at least 2 characters." }),
  prevalentDisability: z.string().optional(),
  medicalInfo: z.string().optional(),
  healthStatus: z.enum(["GOOD", "FAIR", "POOR"]),
  languagesSpoken: z.array(z.string()).min(1, { message: "At least one language is required" }),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),

  mothersName: z.string().min(2, { message: "Mother's name must be at least 2 characters." }),
  mothersEmail: z.string({ message: "Please enter a valid email for mother." }),
  mothersPhone: z.string().min(10, { message: "Mother's phone number must be at least 10 characters." }),
  mothersOccupation: z.string().min(2, { message: "Mother's occupation must be at least 2 characters." }),
  mothersMaritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),

  fathersName: z.string().min(2, { message: "Father's name must be at least 2 characters." }),
  fathersEmail: z.string({ message: "Please enter a valid email for father." }),
  fathersPhone: z.string().min(10, { message: "Father's phone number must be at least 10 characters." }),
  fathersOccupation: z.string().min(2, { message: "Father's occupation must be at least 2 characters." }),
  fathersMaritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),

  guardiansName: z.string().min(2, { message: "Guardian's name must be at least 2 characters." }),
  guardiansEmail: z.string({ message: "Please enter a valid email for guardian." }),
  guardiansPhone: z.string().min(10, { message: "Guardian's phone number must be at least 10 characters." }),
  guardiansOccupation: z.string().min(2, { message: "Guardian's occupation must be at least 2 characters." }),
  guardiansMaritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
})

type StudentFormValues = z.infer<typeof studentFormSchema>


export default function AddStudentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newLanguage, setNewLanguage] = useState("")
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    // when image is uploaded,
    // convert it to base64 text and save it to a state
    // where the form can access it and send it to the server

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Success",
      description: "Image uploaded successfully.",
    })

  }

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      DOB: "",
      gender: undefined,
      address: "",
      town: "",
      phoneNumber: "",
      tribe: "",
      prevalentDisability: "",
      medicalInfo: "",
      healthStatus: undefined,
      languagesSpoken: [],
      maritalStatus: undefined,
      mothersName: "",
      mothersEmail: "",
      mothersPhone: "",
      mothersOccupation: "",
      mothersMaritalStatus: undefined,
      fathersName: "",
      fathersEmail: "",
      fathersPhone: "",
      fathersOccupation: "",
      fathersMaritalStatus: undefined,
      guardiansName: "",
      guardiansEmail: "",
      guardiansPhone: "",
      guardiansOccupation: "",
      guardiansMaritalStatus: undefined,
    },
  })

  async function onSubmit(data: StudentFormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          DOB: new Date(data.DOB), // Convert string date to Date object
          languagesSpoken: data.languagesSpoken || [], // Ensure languagesSpoken is an array
          image: image,
        }),

      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create student');
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: result.message || "Student has been added successfully.",
      })
      router.push("/admin/students")
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem adding the student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addLanguage = () => {
    if (newLanguage.trim() !== "") {
      const currentLanguages = form.getValues("languagesSpoken")
      form.setValue("languagesSpoken", [...currentLanguages, newLanguage.trim()])
      setNewLanguage("")
    }
  }

  const removeLanguage = (language: string) => {
    const currentLanguages = form.getValues("languagesSpoken")
    form.setValue("languagesSpoken", currentLanguages.filter(lang => lang !== language))
  }

  return (
    <div className="container mx-auto pb-10">
      <h1 className="text-3xl font-bold mb-6">Add New Student</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
              <CardDescription>Enter the basic information of the student.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center pb-4">
                <ImageUpload onImageCapture={handleImageUpload} />
                <FormLabel>+ Add Photo</FormLabel>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="DOB"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="town"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Town</FormLabel>
                      <FormControl>
                        <Input placeholder="Nairobi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+254 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tribe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tribe</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tribe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prevalentDisability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prevalent Disability (if any)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter disability" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="healthStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select health status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GOOD">Good</SelectItem>
                          <SelectItem value="FAIR">Fair</SelectItem>
                          <SelectItem value="POOR">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single</SelectItem>
                          <SelectItem value="MARRIED">Married</SelectItem>
                          <SelectItem value="DIVORCED">Divorced</SelectItem>
                          <SelectItem value="WIDOWED">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medicalInfo"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Medical Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any relevant medical information"
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Please provide any important medical information or allergies the school should be aware of.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="languagesSpoken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages Spoken</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter a language"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)
                          }
                        />
                        <Button type="button" onClick={addLanguage}>
                          Add
                        </Button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.value.map((language, index) => (
                          <div
                            key={index}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-2"
                          >
                            {language}
                            <button
                              type="button"
                              onClick={() => removeLanguage(language)}
                              className="text-secondary-foreground/50 hover:text-secondary-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mother's Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="mothersName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mothersEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jane@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mothersPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+254 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mothersOccupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Teacher" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mothersMaritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single</SelectItem>
                          <SelectItem value="MARRIED">Married</SelectItem>
                          <SelectItem value="DIVORCED">Divorced</SelectItem>
                          <SelectItem value="WIDOWED">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Father's Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="fathersName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fathersEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fathersPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+254 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fathersOccupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fathersMaritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single</SelectItem>
                          <SelectItem value="MARRIED">Married</SelectItem>
                          <SelectItem value="DIVORCED">Divorced</SelectItem>
                          <SelectItem value="WIDOWED">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guardian's Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="guardiansName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Guardian Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardiansEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian's Email</FormLabel>
                      <FormControl>
                        <Input placeholder="guardian@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardiansPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian's Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+254 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardiansOccupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian's Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardiansMaritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian's Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single</SelectItem>
                          <SelectItem value="MARRIED">Married</SelectItem>
                          <SelectItem value="DIVORCED">Divorced</SelectItem>
                          <SelectItem value="WIDOWED">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />  }
            {isSubmitting ? "Adding Student..." : "Add Student"}
          </Button>
        </form>
      </Form>
    </div>
  )
}


// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { toast } from "@/hooks/use-toast"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ImageUpload } from "@/components/image-upload"

// const studentFormSchema = z.object({
//   firstName: z.string().min(2, {
//     message: "First name must be at least 2 characters.",
//   }),
//   lastName: z.string().min(2, {
//     message: "Last name must be at least 2 characters.",
//   }),
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
//     message: "Please enter a valid date in the format YYYY-MM-DD.",
//   }),
//   gender: z.enum(["male", "female", "other"], {
//     required_error: "Please select a gender.",
//   }),
//   address: z.string().min(5, {
//     message: "Address must be at least 5 characters.",
//   }),
//   phoneNumber: z.string().min(10, {
//     message: "Phone number must be at least 10 characters.",
//   }),
//   gradeLevel: z.string({
//     required_error: "Please select a grade level.",
//   }),
//   guardianName: z.string().min(2, {
//     message: "Guardian name must be at least 2 characters.",
//   }),
//   guardianEmail: z.string().email({
//     message: "Please enter a valid email address for the guardian.",
//   }),
//   guardianPhone: z.string().min(10, {
//     message: "Guardian phone number must be at least 10 characters.",
//   }),
//   medicalInformation: z.string().optional(),
// })

// type StudentFormValues = z.infer<typeof studentFormSchema>

// export default function AddStudentPage() {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const form = useForm<StudentFormValues>({
//     resolver: zodResolver(studentFormSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       dateOfBirth: "",
//       gender: undefined,
//       address: "",
//       phoneNumber: "",
//       gradeLevel: undefined,
//       guardianName: "",
//       guardianEmail: "",
//       guardianPhone: "",
//       medicalInformation: "",
//     },
//   })

//   async function onSubmit(data: StudentFormValues) {
//     setIsSubmitting(true)
//     try {
//       // Here you would typically send the data to your backend API
//       // For this example, we'll just simulate an API call with a timeout
//       await new Promise(resolve => setTimeout(resolve, 2000))

//       console.log(data)
//       toast({
//         title: "Success",
//         description: "Student has been added successfully.",
//       })
//       router.push("/admin/students")
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "There was a problem adding the student. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="container mx-auto pb-10">
//       <div>
//         <div className="space-y-2 mb-4">
//           <h1 className="text-3xl font-bold">Add Student</h1>
//           <p className="text-sm text-muted-foreground">
//             Enter the details of the new student below.
//           </p>
//         </div>
//         <div>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <div className="flex flex-col gap-3 items-center justify-center">
//                 <ImageUpload onImageCapture={async (file) => {
//                 console.log(file);
//               }} />
//                 <p className="text-sm font-medium leading-none text-muted-foreground">
//                   Upload a photo
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>First Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="John" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Last Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Doe" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input placeholder="johndoe@example.com" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="dateOfBirth"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Date of Birth</FormLabel>
//                       <FormControl>
//                         <Input type="date" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="gender"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Gender</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select gender" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="male">Male</SelectItem>
//                           <SelectItem value="female">Female</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="address"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Address</FormLabel>
//                       <FormControl>
//                         <Textarea placeholder="123 Main St, City, Country" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="phoneNumber"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone Number</FormLabel>
//                       <FormControl>
//                         <Input placeholder="+1 234 567 8900" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="gradeLevel"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Grade Level</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select grade level" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
//                             <SelectItem key={grade} value={grade.toString()}>
//                               Grade {grade}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="guardianName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Guardian Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Jane Doe" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="guardianEmail"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Guardian Email</FormLabel>
//                       <FormControl>
//                         <Input placeholder="janedoe@example.com" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="guardianPhone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Guardian Phone</FormLabel>
//                       <FormControl>
//                         <Input placeholder="+1 234 567 8900" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <FormField
//                 control={form.control}
//                 name="medicalInformation"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Medical Information (Optional)</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Enter any relevant medical information or allergies"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       Please provide any important medical information or allergies the school should be aware of.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? "Adding Student..." : "Add Student"}
//               </Button>
//             </form>
//           </Form>
//         </div>
//       </div>
//     </div>
//   )
// }
