import { Attachment } from '@prisma/client'
import { Download, FileText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


interface CourseAttachmentProps {
    attachment:Attachment
}

function CourseAttachment({attachment}:CourseAttachmentProps) {
  return (
    <div 
    className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
  >
    <div className="h-12 w-12 rounded-lg bg-sky-100 flex items-center justify-center mr-4">
      <FileText className="h-6 w-6 text-sky-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900">{attachment.name}</p>
      <p className="text-sm text-gray-500 truncate mt-1">
        Added on {new Date(attachment.createAt).toLocaleDateString()}
      </p>
    </div>
    <Link  href={attachment.url} className="bg-sky-50 hover:bg-sky-100 text-sky-700 px-4 py-2 items-center rounded-md flex gap-x-1" target='_blank' >
      <Download className="h-4 w-4 mr-2" />
      Download
    </Link>
  </div>
  )
}

export default CourseAttachment
