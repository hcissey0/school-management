'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { capitalize } from '@/lib/utils'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useSession } from 'next-auth/react'

export default function BreadcrumbNav() {
    const pathname = usePathname();


    // Skip the first empty string
    const pathSegments = pathname.split('/').filter(segment => segment)

    // Build the breadcrumb items
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/')
        const isLast = index === pathSegments.length - 1

        return (
            <BreadcrumbItem key={href}>
                {!isLast ? (
                    <>
                        <BreadcrumbLink href={href} className='hidden md:block'>{capitalize(segment)}</BreadcrumbLink>
                        <BreadcrumbSeparator className='hidden md:block' />
                    </>
                ) : (
                    <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                )}
            </BreadcrumbItem>
        )
    })

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className='hidden md:flex'>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                    {pathSegments.length > 0 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
                {breadcrumbItems}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
