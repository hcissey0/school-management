import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

async function getBook(id: string) {
    const book = await prisma.book.findUnique({
        where: { id },
        include: {
            library: true,
            categories: true
        },
    })

    if (!book) {
        notFound()
    }

    return book
}

export default async function BookProfilePage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return <div>Please sign in to view this page.</div>
    }

    const book = await getBook(params.id)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Book Profile</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Book Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Title:</span>
                            <span>{book.title}</span>
                        </div>
                        <div>
                            <span className="font-medium">Author:</span>
                            <span>{book.author}</span>
                        </div>
                        <div>
                            <span className="font-medium">ISBN:</span>
                            <span>{book.isbn}</span>
                        </div>
                        <div>
                            <span className="font-medium">Library:</span>
                            <Link href={`/library/${book.library.id}`} className="text-blue-600 hover:underline">
                                {book.library.name}
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {book.categories.map((category) => (
                                <Badge key={category.id} variant="secondary">
                                    {category.name}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
