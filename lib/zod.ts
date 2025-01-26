import { z } from "zod";
import { Role, StaffRole, Gender, HealthStatus, MaritalStatus } from "@prisma/client";

// Base schemas for reuse
export const passwordSchema = z.string().min(3, "Password must be at least 3 characters");
export const emailSchema = z.string().email("Invalid email address");
export const phoneSchema = z.string().min(10, "Phone number must be at least 10 characters");
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
