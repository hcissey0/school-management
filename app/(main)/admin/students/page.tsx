// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Plus } from 'lucide-react'
// import { columns, Student } from "@/components/students/columns"
// import { DataTable } from "@/components/students/data-table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"

// export default function StudentsPage() {
//     const [students, setStudents] = useState<Student[]>([])
//     const [loading, setLoading] = useState(false)
//     const [searchQuery, setSearchQuery] = useState("")
//     const [genderFilter, setGenderFilter] = useState("")
//     const router = useRouter()

//     const loadStudents = async () => {
//         try {
//             setLoading(true)
//             const response = await fetch(`/api/students?search=${searchQuery}&gender=${genderFilter}`)
//             const result = await response.json()
//             setStudents(result.students)
//         } catch (error) {
//             console.error("Failed to load students:", error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         loadStudents()
//     }, [searchQuery, genderFilter])

//     const handleSearch = (value: string) => {
//         setSearchQuery(value)
//     }

//     const handleGenderFilter = (value: string) => {
//         setGenderFilter(value)
//     }

//     return (
//         <div className="container mx-auto py-10">
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-3xl font-bold">Students</h1>
//                 <Button onClick={() => router.push("/admin/students/enrollment")}>
//                     <Plus className="mr-2 h-4 w-4" /> Add New Student
//                 </Button>
//             </div>
//             <div className="flex items-center space-x-2 mb-4">
//                 <Input
//                     placeholder="Search students..."
//                     value={searchQuery}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     className="max-w-sm"
//                 />
//                 <Select value={genderFilter} onValueChange={handleGenderFilter}>
//                     <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Filter by gender" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="a">All</SelectItem>
//                         <SelectItem value="male">Male</SelectItem>
//                         <SelectItem value="female">Female</SelectItem>
//                         <SelectItem value="other">Other</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>
//             <DataTable columns={columns} data={students} />
//         </div>
//     )
// }














'use client';

import { ImageUpload } from "@/components/image-upload";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";
import { Edit, Loader2, Trash, ChevronDown } from 'lucide-react';
import Link from "next/link";
import { DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Student as ST, User } from "@prisma/client";

type Column = {
    id: string;
    label: string;
    sortKey?: keyof Student;
    width?: string;
    render: (student: Student, index: number) => React.ReactNode;
};

interface Student extends ST{
    user?: User;
}


const columns: Column[] = [
    {
        id: 'number',
        label: 'No.',
        width: 'w-[50px]',
        render: (_, index) => index + 1
    },
    {
        id: 'image',
        label: 'Image',
        render: (student) => (

            <Link href={`/admin/students/${student.ID}`}>
            <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage className=" h-10 w-10 rounded-lg" src={student.user?.image || ''} />
                <AvatarFallback className=" h-10 w-10 rounded-lg">
                    {getInitials(student.firstName + ' ' + student.lastName)}
                </AvatarFallback>
            </Avatar>
            </Link>
        )
    },
    {
        id: 'studentId',
        label: 'Student ID',
        sortKey: 'ID',
        render: (student) => student.ID
    },
    {
        id: 'name',
        label: 'Name',
        sortKey: 'firstName',
        render: (student) => `${student.firstName} ${student.lastName}`
    },
    {
        id: 'gender',
        label: 'Gender',
        sortKey: 'gender',
        render: (student) => student.gender
    },
    {
        id: 'phone',
        label: 'Phone',
        sortKey: 'phoneNumber',
        render: (student) => student.phoneNumber
    }
];



export default function StudentPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [genderFilter, setGenderFilter] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof Student>('ID');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [total, setTotal] = useState(0);
    const [showing, setShowing] = useState(0);
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
        Object.fromEntries(columns.map(column => {
            console.log(window.innerWidth)
            if (window.innerWidth < 1050) {
                if (column.id === "phone") return [column.id, false]
            }
            if (window.innerWidth < 900) {
                if (column.id === "studentId") return [column.id, false]
            }
            if (window.innerWidth < 500) {
                if (column.id === "gender") return [column.id, false]
            }
            return [column.id, true]
        }))
    );

    const loadStudents = async (pageNum: number, search?: string) => {
        try {
            setLoading(true);
            const searchParam = search !== undefined ? search : searchQuery;
            const response = await fetch(`/api/students?page=${pageNum}&limit=50${searchParam ? `&search=${searchParam}` : ''}${genderFilter ? `&gender=${genderFilter}` : ''}`);
            const result = await response.json();

            if (pageNum === 1) {
                setStudents(result.students);
            } else {
                setStudents(prev => [...prev, ...result.students]);
            }
            if (pageNum * 50 >= result.total) {
                setShowing(result.total)
            } else setShowing(pageNum * 50);

            setTotal(result.total)
            setHasMore(result.hasMore);
        } catch (error) {
            console.error('Failed to load students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents(1);
    }, [genderFilter]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const timeout = setTimeout(() => {
            setPage(1);
            loadStudents(1, value);
        }, 500);
        setSearchTimeout(timeout);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadStudents(nextPage);
        }
    };

    const handleDeleteClick = (student: Student) => {
        setStudentToDelete(student);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!studentToDelete) return;

        try {
            setIsDeleting(true);
            const response = await fetch(`/api/students?id=${studentToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete student');
            }

            const result = await response.json();
            toast({
                title: "Success",
                description: result.message || "Student deleted successfully",

            });

            setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
            setDeleteDialogOpen(false);
            setShowing(showing - 1)
            setTotal(total - 1);
        } catch (error) {
            console.error('Error deleting student:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete student",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setStudentToDelete(null);
        }
    };

    const handleSort = (column: keyof Student) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedStudents = [...students].sort((a, b) => {
        const valueA = a[sortColumn] ?? '';
        const valueB = b[sortColumn] ?? '';

        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-co sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Students</h1>
                <Button asChild>
                    <Link href="/admin/students/enrollment">
                        Add New Student
                    </Link>
                </Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
                <Input
                    type="search"
                    placeholder="Search students..."
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="mr-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {columns.map(column => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={visibleColumns[column.id]}
                                onCheckedChange={(checked) =>
                                    setVisibleColumns(prev => ({ ...prev, [column.id]: checked }))
                                }
                            >
                                {column.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                        {/* {Object.entries(visibleColumns).map(([key, value]) => (
                            <DropdownMenuCheckboxItem
                                key={key}
                                className="capitalize"
                                checked={value}
                                onCheckedChange={(checked) =>
                                    setVisibleColumns((prev) => ({ ...prev, [key]: checked }))
                                }
                            >
                                {key}
                            </DropdownMenuCheckboxItem>
                        ))} */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {loading && <Loader2 className="h-6 w-6 animate-spin mx-auto" />}
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map(column =>
                                visibleColumns[column.id] && (
                                    <TableHead key={column.id} className={column.width + " text-center"}>
                                        {column.sortKey ? (
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort(column.sortKey!)}
                                            >
                                                {column.label} {sortColumn === column.sortKey &&
                                                    (sortDirection === 'asc' ? '↑' : '↓')}
                                            </Button>
                                        ) : column.label}
                                    </TableHead>
                                )
                            )}
                            {/* <TableHead className="w-[50px]">No.</TableHead>
                            {visibleColumns.image && <TableHead>Image</TableHead>}
                            {visibleColumns.ID && (
                                <TableHead>
                                    <Button variant="ghost" onClick={() => handleSort('ID')}>
                                        Student ID {sortColumn === 'ID' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Button>
                                </TableHead>
                            )}
                            {visibleColumns.name && (
                                <TableHead>
                                    <Button variant="ghost" onClick={() => handleSort('firstName')}>
                                        Name {sortColumn === 'firstName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Button>
                                </TableHead>
                            )}
                            {visibleColumns.gender && (
                                <TableHead>
                                    <Button variant="ghost" onClick={() => handleSort('gender')}>
                                        Gender {sortColumn === 'gender' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Button>
                                </TableHead>
                            )}
                            {visibleColumns.phone && (
                                <TableHead>
                                    <Button variant="ghost" onClick={() => handleSort('phoneNumber')}>
                                        Phone {sortColumn === 'phoneNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </Button>
                                </TableHead>
                            )} */}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedStudents.map((student, index) => (

                            <TableRow key={student.id}>
                                {columns.map(column =>
                                    visibleColumns[column.id] && (
                                        <TableCell key={column.id} className="text-center items-center justify-center content-center">
                                            {column.render(student, index)}
                                        </TableCell>
                                    )
                                )}
                                {/* <TableCell>{index + 1}</TableCell>
                                {visibleColumns.image && (
                                    <TableCell>
                                        <Avatar className="h-10 w-10 rounded-lg">
                                        <AvatarImage className="rounded-lg" src={student.user?.image || ''} />
                                        <AvatarFallback className="rounded-lg">{getInitials(student.firstName + ' ' + student.lastName)}</AvatarFallback>
                                        </Avatar>
                                        </TableCell>
                                        )}
                                        {visibleColumns.ID && <TableCell>{student.ID}</TableCell>}
                                        {visibleColumns.name && <TableCell>{student.firstName} {student.lastName}</TableCell>}
                                        {visibleColumns.gender && <TableCell>{student.gender}</TableCell>}
                                        {visibleColumns.phone && <TableCell>{student.phoneNumber}</TableCell>} */}
                                <TableCell className="text-right">
                                    <Link href={`/admin/students/${student.ID}`}>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteClick(student)}
                                        disabled={isDeleting && studentToDelete?.id === student.id}
                                        >
                                        {isDeleting && studentToDelete?.id === student.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash className="h-4 w-4" />
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {!loading &&
            <div>
                Showing {showing} of {total}
            </div>
            }
            {hasMore && (
                <div className="flex justify-center mt-4">
                    <Button
                        onClick={handleLoadMore}
                        disabled={loading}
                        variant="outline"
                    >
                        {loading ? 'Loading...' : 'Show More'}
                    </Button>
                </div>
            )}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>

                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {studentToDelete?.firstName} {studentToDelete?.lastName}'s record and all associated data. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}























// 'use client';

// import { ImageUpload } from "@/components/image-upload";
// import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { toast } from "@/hooks/use-toast";
// import { getInitials } from "@/lib/utils";
// import { Avatar } from "@radix-ui/react-avatar";
// import { Edit, Loader2, Trash } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function StudentPage() {
//     const [students, setStudents] = useState<any[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [studentToDelete, setStudentToDelete] = useState<any>(null);
//     const [isDeleting, setIsDeleting] = useState(false);

//     const loadStudents = async (pageNum: number, search?: string) => {
//         try {
//             setLoading(true);
//             const searchParam = search !== undefined ? search : searchQuery;
//             const response = await fetch(`/api/students?page=${pageNum}&limit=50${searchParam ? `&search=${searchParam}` : ''}`);
//             const result = await response.json();

//             if (pageNum === 1) {
//                 setStudents(result.students);
//             } else {
//                 setStudents(prev => [...prev, ...result.students]);
//             }
//             setHasMore(result.hasMore);
//         } catch (error) {
//             console.error('Failed to load students:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadStudents(1);
//     }, []);

//     const handleSearch = (value: string) => {
//         setSearchQuery(value);
//         // Clear existing timeout
//         if (searchTimeout) {
//             clearTimeout(searchTimeout);
//         }
//         // Set new timeout to debounce search
//         const timeout = setTimeout(() => {
//             setPage(1);
//             loadStudents(1, value);
//         }, 500);
//         setSearchTimeout(timeout);
//     };

//     const handleLoadMore = () => {
//         if (!loading && hasMore) {
//             const nextPage = page + 1;
//             setPage(nextPage);
//             loadStudents(nextPage);
//         }
//     };

//     const handleDeleteClick = (student: any) => {
//         setStudentToDelete(student);
//         setDeleteDialogOpen(true);
//     };

//     const handleDeleteConfirm = async () => {
//         if (!studentToDelete) return;

//         try {
//             setIsDeleting(true);
//             const response = await fetch(`/api/students?id=${studentToDelete.id}`, {
//                 method: 'DELETE',
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete student');
//             }

//             const result = await response.json();
//             toast({
//                 title: "Success",
//                 description: result.message || "Student deleted successfully",
//             });

//             // Remove the deleted student from the state
//             setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
//             setDeleteDialogOpen(false);
//         } catch (error) {
//             console.error('Error deleting student:', error);
//             toast({
//                 title: "Error",
//                 description: error instanceof Error ? error.message : "Failed to delete student",
//                 variant: "destructive",
//             });
//         } finally {
//             setIsDeleting(false);
//             setStudentToDelete(null);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-3xl font-bold">Students</h1>
//                 <Button asChild>
//                     <Link href="/admin/students/enrollment">
//                         Add New Student
//                     </Link>
//                 </Button>
//             </div>
//             <div className="flex items-center space-x-2">
//                 <Input
//                     type="search"
//                     placeholder="Search students..."
//                     className=""
//                     value={searchQuery}
//                     onChange={(e) => handleSearch(e.target.value)}
//                 />
//                 {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//             </div>

//             <div className="rounded-md border">
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Image</TableHead>
//                             <TableHead>Student ID</TableHead>
//                             <TableHead>Name</TableHead>
//                             <TableHead>Gender</TableHead>
//                             <TableHead>Phone</TableHead>
//                             <TableHead className="">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {students.map((student) => (
//                             <TableRow key={student.id}>
//                                 <TableCell>
//                                     <Avatar className="h-12 w-12 rounded-lg">
//                                         <AvatarImage className="h-12 w-12 rounded-lg" src={student.user?.image || ''} />
//                                         <AvatarFallback className="h-12 w-12 rounded-lg">{getInitials(student.firstName + ' ' + student.lastName)}</AvatarFallback>
//                                     </Avatar>
//                                 </TableCell>
//                                 <TableCell>{student.ID}</TableCell>
//                                 <TableCell>{student.firstName} {student.lastName}</TableCell>
//                                 <TableCell>{student.gender}</TableCell>
//                                 <TableCell>{student.phoneNumber}</TableCell>
//                                 <TableCell className="flex items-center gap-2">
//                                     <Button variant="ghost" size="icon"
//                                     >
//                                         <Edit className="h-4 w-4" />
//                                     </Button>
//                                     <Button variant="ghost" size="icon"
//                                         onClick={() => handleDeleteClick(student)}
//                                         disabled={isDeleting && studentToDelete?.id === student.id}

//                                     >
//                                         {isDeleting && studentToDelete?.id === student.id ? (
//                                             <Loader2 className="h-4 w-4 animate-spin" />
//                                         ) : (
//                                             <Trash className="h-4 w-4" />
//                                         )}
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </div>

//             {hasMore && (
//                 <div className="flex justify-center">
//                     <Button
//                         onClick={handleLoadMore}
//                         disabled={loading}
//                         variant="outline"
//                     >
//                         {loading ? 'Loading...' : 'Show More'}
//                     </Button>
//                 </div>
//             )}

//             <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             This will permanently delete {studentToDelete?.firstName} {studentToDelete?.lastName}'s record and all associated data. This action cannot be undone.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//                         <AlertDialogAction
//                             onClick={handleDeleteConfirm}
//                             disabled={isDeleting}
//                             className="bg-red-600 hover:bg-red-700"
//                         >
//                             {isDeleting ? (
//                                 <>
//                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                     Deleting...
//                                 </>
//                             ) : (
//                                 'Delete'
//                             )}
//                         </AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//         </div>
//     );
// }





















// import { ImageUpload } from "@/components/image-upload";
// import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { getInitials } from "@/lib/utils";
// import { Avatar } from "@radix-ui/react-avatar";
// import { Edit, Trash } from "lucide-react";
// import Link from "next/link";

// export default function StudentPage() {

//     return (
//         <div className="space-y-6">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-3xl font-bold">Students</h1>
//                 <Button asChild>
//                     <Link href="/admin/students/add">
//                         Add New Student
//                     </Link>
//                 </Button>
//             </div>

//             <div className="rounded-md border">
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Image</TableHead>
//                             <TableHead>Student ID</TableHead>
//                             <TableHead>Name</TableHead>
//                             <TableHead>Class</TableHead>
//                             <TableHead>Enrollment Date</TableHead>
//                             <TableHead className="">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         <TableRow>
//                             <TableCell>
//                                 <Avatar className="h-12 w-12 rounded-lg">
//                                     <AvatarImage className="h-12 w-12 rounded-lg" src="https://github.com/shadcn.png" alt="@shadcn" />
//                                     <AvatarFallback className="h-12 w-12 rounded-lg">
//                                         {getInitials("John Smith")}
//                                     </AvatarFallback>
//                                 </Avatar>
//                             </TableCell>
//                             <TableCell>001</TableCell>
//                             <TableCell>John Smith</TableCell>
//                             <TableCell>9th</TableCell>
//                             <TableCell>2023-09-01</TableCell>
//                             <TableCell className="flex space-x-2">
//                                 <Button asChild variant="outline" size="sm">
//                                     <Link href={`/admin/students/edit/001`}>
//                                     <Edit />
//                                     </Link>
//                                 </Button>
//                                 <Button asChild variant="destructive" size="sm">
//                                     <Link href={`/admin/students/delete/001`}>
//                                     <Trash />
//                                     </Link>
//                                 </Button>
//                             </TableCell>
//                         </TableRow>
//                         {/* Add more rows as needed */}
//                     </TableBody>
//                 </Table>
//             </div>
//             <div className="flex items-center space-x-2">
//                 <Input
//                     type="search"
//                     placeholder="Search students..."
//                     className="max-w-sm"
//                 />
//                 <Button variant="outline">Search</Button>
//             </div>
//         </div>
//     );
// }
