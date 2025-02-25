import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
     <Link href="/teacher/create">
     <Button>
        create
     </Button>
     </Link>
    </div>
  )
}

export default page
