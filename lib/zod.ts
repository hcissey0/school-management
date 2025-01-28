import { z } from "zod";
import { Role, StaffRole, Gender, HealthStatus, MaritalStatus } from "@prisma/client";

// Base schemas for reuse
export const passwordSchema = z.string().min(3, "Password must be at least 3 characters");
export const emailSchema = z.string().email("Invalid email address");
export const phoneSchema = z.string().min(1, "Phone number must be at least 10 characters");
export const nameSchema = z.string().min(2, "Name must be at least 2 characters");

// Auth schemas
export const loginSchema = z.object({
    emailOrId: z.string().min(1, "Email or ID is required"),
    password: passwordSchema,
});

export const adminSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
});

// User schema
export const userSchema = z.object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    loginId: z.string().min(1, "Login ID is required"),
    password: passwordSchema,
    role: z.nativeEnum(Role).default(Role.STUDENT),
    image: z.string().optional(),
});

// Staff schema
export const staffSchema = z.object({
    role: z.nativeEnum(StaffRole),
    position: z.string().optional(),
    phone: phoneSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    DOB: z.string(),
    gender: z.nativeEnum(Gender),
    address: z.string().min(1, "Address is required"),
    town: z.string().min(1, "Town is required"),
    phoneNumber: phoneSchema,
    prevalentDisability: z.string(),
    medicalInfo: z.string(),
    healthStatus: z.nativeEnum(HealthStatus),
    languagesSpoken: z.array(z.string()),
    maritalStatus: z.nativeEnum(MaritalStatus),
    departmentId: z.string().min(1, "Department ID is required"),
});

// Student schema
export const studentSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    DOB: z.string(),
    gender: z.nativeEnum(Gender),
    address: z.string().min(1, "Address is required"),
    town: z.string().min(1, "Town is required"),
    phoneNumber: phoneSchema,
    tribe: z.string(),
    prevalentDisability: z.string(),
    medicalInfo: z.string(),
    healthStatus: z.nativeEnum(HealthStatus),
    languagesSpoken: z.array(z.string()),
    maritalStatus: z.nativeEnum(MaritalStatus),

    // Parent/Guardian Information
    mothersName: nameSchema,
    mothersEmail: z.string().default('None'),
    mothersPhone: phoneSchema,
    mothersOccupation: z.string(),
    mothersMaritalStatus: z.nativeEnum(MaritalStatus),

    fathersName: nameSchema,
    fathersEmail: z.string().default('None'),
    fathersPhone: phoneSchema,
    fathersOccupation: z.string(),
    fathersMaritalStatus: z.nativeEnum(MaritalStatus),

    guardiansName: nameSchema,
    guardiansEmail: z.string().default('None'),
    guardiansPhone: phoneSchema,
    guardiansOccupation: z.string(),
    guardiansMaritalStatus: z.nativeEnum(MaritalStatus),
});

// Feedback schema
export const feedbackSchema = z.object({
    content: z.string().min(1, "Feedback content is required"),
});


// studentFormSchema
export const ostudentFormSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    DOB: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Please enter a valid date in the format YYYY-MM-DD.",
    }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    address: z.string().min(2, { message: "Address must be at least 2 characters." }).optional(),
    town: z.string().min(2, { message: "Town must be at least 2 characters." }).optional(),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters." }).optional(),
    tribe: z.string().min(2, { message: "Tribe must be at least 2 characters." }).optional(),
    prevalentDisability: z.string().optional(),
    medicalInfo: z.string().optional(),
    healthStatus: z.enum(["GOOD", "FAIR", "POOR"]).optional(),
    languagesSpoken: z.array(z.string()).min(1, { message: "At least one language is required" }).optional(),
    maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),

    motherIsAlive: z.boolean().optional(),
    mothersName: z.string().min(2, { message: "Mother's name must be at least 2 characters." }).optional(),
    mothersEmail: z.string({ message: "Please enter a valid email for mother." }).optional(),
    mothersPhone: z.string().min(10, { message: "Mother's phone number must be at least 10 characters." }).optional(),
    mothersOccupation: z.string().min(2, { message: "Mother's occupation must be at least 2 characters." }).optional(),
    mothersMaritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),

    fatherIsAlive: z.boolean().optional(),
    fathersName: z.string().min(2, { message: "Father's name must be at least 2 characters." }).optional(),
    fathersEmail: z.string({ message: "Please enter a valid email for father." }).optional(),
    fathersPhone: z.string().min(10, { message: "Father's phone number must be at least 10 characters." }).default('None').optional(),
    fathersOccupation: z.string().min(2, { message: "Father's occupation must be at least 2 characters." }).optional(),
    fathersMaritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),

    guardianIsAlive: z.boolean().optional(),
    guardiansName: z.string().min(2, { message: "Guardian's name must be at least 2 characters." }).optional(),
    guardiansEmail: z.string({ message: "Please enter a valid email for guardian." }).optional(),
    guardiansPhone: z.string().min(10, { message: "Guardian's phone number must be at least 10 characters." }).optional(),
    guardiansOccupation: z.string().min(2, { message: "Guardian's occupation must be at least 2 characters." }).optional(),
    guardiansMaritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
  })
// another studentFormSchema that makes things optional
// according to the database structure for testing purposes
export const studentFormSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    DOB: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Please enter a valid date in the format YYYY-MM-DD.",
    }).optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    address: z.string().optional(),
    town: z.string().optional(),
    phoneNumber: z.string().optional(),
    tribe: z.string().optional(),
    prevalentDisability: z.string().optional(),
    medicalInfo: z.string().optional(),
    healthStatus: z.enum(["GOOD", "FAIR", "POOR"]).optional(),
    languagesSpoken: z.array(z.string()).optional(),
    maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),

    motherIsAlive: z.boolean().optional(),
    mothersName: z.string().optional(),
    mothersEmail: z.string({ message: "Please enter a valid email for mother." }).optional(),
    mothersPhone: z.string().optional(),
    mothersOccupation: z.string().optional(),
    mothersMaritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),

    fatherIsAlive: z.boolean().optional(),
    fathersName: z.string().optional(),
    fathersEmail: z.string({ message: "Please enter a valid email for father." }).optional(),
    fathersPhone: z.string().optional(),
    fathersOccupation: z.string().optional(),
    fathersMaritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),

    guardianIsAlive: z.boolean().optional(),
    guardiansName: z.string().optional(),
    guardiansEmail: z.string({ message: "Please enter a valid email for guardian." }).optional(),
    guardiansPhone: z.string().optional(),
    guardiansOccupation: z.string().optional(),
    guardiansMaritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
});
export const studentDefaultValues = {
    firstName: "",
    lastName: "",
    DOB: "",
    gender: "MALE" as Gender,
    address: "None",
    town: "None",
    phoneNumber: "None",
    tribe: "None",
    prevalentDisability: "None",
    medicalInfo: "None",
    healthStatus: "GOOD" as HealthStatus,
    languagesSpoken: [],
    maritalStatus: "SINGLE" as MaritalStatus,

    motherIsAlive: false,
    mothersName: "None",
    mothersEmail: "None",
    mothersPhone: "None",
    mothersOccupation: "None",
    mothersMaritalStatus: "MARRIED" as MaritalStatus,

    fatherIsAlive: false,
    fathersName: "None",
    fathersEmail: "None",
    fathersPhone: "None",
    fathersOccupation: "None",
    fathersMaritalStatus: "MARRIED" as MaritalStatus,

    guardianIsAlive: false,
    guardiansName: "None",
    guardiansEmail: "None",
    guardiansPhone: "None",
    guardiansOccupation: "None",
    guardiansMaritalStatus: "MARRIED" as MaritalStatus,
  }

export const ostudentDefaultValues = {
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
    guardiansMaritalStatus: "",
}
