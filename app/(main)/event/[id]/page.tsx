import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from 'date-fns'

async function getEvent(id: string) {
    const event = await prisma.event.findUnique({
        where: { id },
    })

    if (!event) {
        notFound()
    }

    return event
}

export default async function EventProfilePage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return <div>Please sign in to view this page.</div>
    }

    const event = await getEvent(params.id)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Event Details</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="font-medium">Date:</span>
                        <span>{format(event.date, 'MMMM d, yyyy')}</span>
                    </div>
                    <div>
                        <span className="font-medium">Time:</span>
                        <span>{format(event.date, 'h:mm a')}</span>
                    </div>
                    <div>
                        <span className="font-medium">Description:</span>
                        <p className="mt-2">{event.description}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
