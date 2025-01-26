import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

async function getLibrary(id: string) {
    const library = await prisma.library.findUnique({
        where: { id },
        include: {
            books: {
                include: {
                    categories: true
                }
            }
        },
    })

    if (!library) {
        notFound()
    }

    return library
}

export default async function LibraryProfilePage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return <div>Please sign in to view this page.</div>
    }

    const library = await getLibrary(params.id)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Library Profile</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Library Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Library Name:</span>
                            <span>{library.name}</span>
                        </div>
                        <div>
                            <span className="font-medium">Total Books:</span>
                            <span>{library.books.length}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Book Collection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {library.books.map((book) => (
                                <li key={book.id}>
                                    <Link href={`/books/${book.id}`} className="text-blue-600 hover:underline">
                                        {book.title} by {book.author}
                                    </Link>
                                    <span className="text-sm text-gray-500 ml-2">
                                        ({book.categories.map(cat => cat.name).join(', ')})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
