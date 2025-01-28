"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, CameraIcon, Pencil } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getStudentByID } from "@/lib/client/api"
import { useParams } from "next/navigation"
import { Student } from "@prisma/client"
import { studentDefaultValues, studentFormSchema } from "@/lib/zod"
import { getInitials } from "@/lib/utils"


type ProfileFormValues = z.infer<typeof studentFormSchema>


export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [student, setStudent] = useState<Student | null>(null);
    const [image, setImage] = useState<string | null>(null);

    const { ID } = useParams();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(studentFormSchema),
        defaultValues: studentDefaultValues,
        mode: "onChange"
      })

    useEffect(() => {
        async function func() {
            try {

                const res = await fetch(`/api/students/${ID}`);
            const data = await res.json();
            if (!res.ok) {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: data.message || "An Error occured"
                })
            } else {
                setStudent(data.student);
                form.reset({
                    ...data.student,
                    DOB: new Date(data.student.DOB).toISOString().split('T')[0]
                })

            }
        } catch (error) {
            toast({
                title: "Error",
                variant: "destructive",
                description: (error as Error).message || "Falile to load user data. Please try again."
            })
        } finally {
            setIsLoading(false);
        }
    }

        func();
    }, [form])


  async function onSubmit(data: ProfileFormValues) {
    try {
        const res = await fetch(`/api/students/${ID}`, {
            method: "PUT",
            body: JSON.stringify({
                ...data,
                DOB: new Date(data.DOB).toISOString(),
                languagesSpoken: data.languagesSpoken || [],
                image
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "An error occured while updating the student profile"
            })
            return;
        }
        toast({
            title: "Success",
            description: "Student profile updated successfully"
        })
    } catch (error) {
        console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    setIsEditing(false)
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto pb-10">
      <Card className="border-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Student Profile</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-40 h-40 rounded-lg">
                <AvatarImage className="rounded-lg" src={student?.user.image} alt="Profile picture" />
                <AvatarFallback className="rounded-lg">
                {getInitials(student.firstName + ' ' + student.lastName)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm">
                  <CameraIcon className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
              )}
              <div>
            {/* <h3 className="text-lg font-semibold mb-4">Additional Information</h3> */}
            <div className="grid grid-cols-2 sm:flex gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Student ID</p>
                <p>{student?.ID}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Class</p>
                <p>{student.class || "None"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Admission Date</p>
                <p>{new Date(student?.createdAt.toString() as string).toLocaleDateString('en-uk')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Parent/Guardian</p>
                <p>{student?.guardiansName || "none"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{student?.userId.email || "none"}</p>
              </div>
            </div>

              </div>
            </div>
            <div className="flex-grow">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} disabled={!isEditing} />
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
                            <Input placeholder="Last name" {...field} disabled={!isEditing} />
                          </FormControl>
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
                            <Input placeholder="Address" {...field} disabled={!isEditing} />
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
                            <Input placeholder="town" {...field} disabled={!isEditing} />
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
                            <Input placeholder="None" {...field} disabled={!isEditing} />
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
                            <Input placeholder="None" {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="DOB"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of birth</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              disabled={!isEditing}
                            />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}
                      disabled={!isEditing}
                      >
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
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}
                      disabled={!isEditing}
                      >
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
                  name="healthStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}
                      disabled={!isEditing}
                      >
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
                  </div>
                  <FormField
                    control={form.control}
                    name="medicalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Information</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Medical Information"
                            className="resize-none"
                            {...field}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Mother Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <FormField
                            control={form.control}
                            name="mothersName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mother's Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Mother's Name" {...field} disabled={!isEditing} />
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
                                <Input placeholder="Mother's Email" {...field} disabled={!isEditing} />
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
                                <Input placeholder="Mother's Phone" {...field} disabled={!isEditing} />
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
                                <Input placeholder="Mother's Occupation" {...field} disabled={!isEditing} />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}
                                disabled={!isEditing}
                                >
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

                  </div>

                    <Separator className="my-6" />
                    <div>
                    <h3 className="text-lg font-semibold mb-4">Father Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <FormField
                            control={form.control}
                            name="fathersName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Father's Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Father's Name" {...field} disabled={!isEditing} />
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
                                <Input placeholder="Father's Email" {...field} disabled={!isEditing} />
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
                                <Input placeholder="Father's Phone" {...field} disabled={!isEditing} />
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
                                <Input placeholder="Father's Occupation" {...field} disabled={!isEditing} />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}
                                disabled={!isEditing}
                                >
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
                    </div>

                    <Separator className="my-6" />
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Guardian Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            <FormField
                                control={form.control}
                                name="guardiansName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Guardian's Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Guardian's Name" {...field} disabled={!isEditing} />
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
                                            <Input placeholder="Guardian's Email" {...field} disabled={!isEditing} />
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
                                            <Input placeholder="Guardian's Phone" {...field} disabled={!isEditing} />
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
                                            <Input placeholder="Guardian's Occupation" {...field} disabled={!isEditing} />
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
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
                    </div>

                  {isEditing && (
                    <Button type="submit">Save Changes</Button>
                  )}
                </form>
              </Form>
            </div>
          </div>


        </CardContent>
      </Card>
    </div>
  )
}
