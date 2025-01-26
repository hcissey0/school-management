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
import { ImageUpload } from "@/components/image-upload"

const studentFormSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Please enter a valid date in the format YYYY-MM-DD.",
    }),
    gender: z.enum(["male", "female", "other"], {
        required_error: "Please select a gender.",
    }),
    address: z.string().min(5, {
        message: "Address must be at least 5 characters.",
    }),
    phoneNumber: z.string().min(10, {
        message: "Phone number must be at least 10 characters.",
    }),
    gradeLevel: z.string({
        required_error: "Please select a grade level.",
    }),
    guardianName: z.string().min(2, {
        message: "Guardian name must be at least 2 characters.",
    }),
    guardianEmail: z.string().email({
        message: "Please enter a valid email address for the guardian.",
    }),
    guardianPhone: z.string().min(10, {
        message: "Guardian phone number must be at least 10 characters.",
    }),
    medicalInformation: z.string().optional(),
})

type StudentFormValues = z.infer<typeof studentFormSchema>

export default function AddStudentPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            dateOfBirth: "",
            gender: undefined,
            address: "",
            phoneNumber: "",
            gradeLevel: undefined,
            guardianName: "",
            guardianEmail: "",
            guardianPhone: "",
            medicalInformation: "",
        },
    })

    async function onSubmit(data: StudentFormValues) {
        setIsSubmitting(true)
        try {
            
            // Here you would typically send the data to your backend API
            // For this example, we'll just simulate an API call with a timeout
            await new Promise(resolve => setTimeout(resolve, 2000))

            console.log(data)
            toast({
                title: "Success",
                description: "Student has been added successfully.",
            })
            router.push("/admin/students")
        } catch (error) {
            toast({
                title: "Error",
                description: "There was a problem adding the student. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Student</CardTitle>
                    <CardDescription>Enter the details of the new student below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <ImageUpload onImageCapture={async (file) => {
                                
                                console.log(file);
                            }} />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="johndoe@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dateOfBirth"
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
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
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
                                                <Textarea placeholder="123 Main St, City, Country" {...field} />
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
                                                <Input placeholder="+1 234 567 8900" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gradeLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grade Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select grade level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                                                        <SelectItem key={grade} value={grade.toString()}>
                                                            Grade {grade}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guardianName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Guardian Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jane Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guardianEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Guardian Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="janedoe@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guardianPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Guardian Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1 234 567 8900" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="medicalInformation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medical Information (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter any relevant medical information or allergies"
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
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding Student..." : "Add Student"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
