import {
  FiDownload,
  FiEye,
  FiFileText,
} from 'react-icons/fi'


import { CardContent, Card, CardHeader } from '@/shared/ui/card/Card'

import Button from '@/shared/ui/button/Button'

import type { FacilityDetailsResponse } from '../types/facilityTypes'

type DocumentsTabProps = {
  facility: FacilityDetailsResponse
}




const DocumentsTab = (
  {
    facility,
  }: DocumentsTabProps
) => {

  const documents = [

    {
      title: 'Title Document',
      description: 'Property ownership document',
      path: facility.savedTitleDocumentPath,
    },

    {
      title: 'Approval Letter',
      description: 'Facility approval document',
      path: facility.savedApprovalFilePath,
    },

    {
      title: 'Indemnity Letter',
      description: 'Customer indemnity document',
      path: facility.savedIndemnityLetterPath,
    },

  ]
  return (
    <Card>
      <CardHeader title="Documents" />
      <CardContent>
        <div className="grid gap-4">
          {documents.map(document => (
            <div
              key={document.title}
              className="border border-border rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">

                <div
                  className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <FiFileText className="h-6 w-6" />
                </div>

                <div>
                  <h4 className="font-semibold">
                    {document.title}
                  </h4>

                  <p className="text-sm text-text-secondary">
                    {document.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">

                <Button
                disabled={!document.path}
                  variant="ghost"
                  size="sm"
                  leftIcon={<FiEye />}>
                  View
                </Button>

                <Button
                disabled={!document.path}
                  variant="secondary"
                  size="sm"
                  leftIcon={
                    <FiDownload />
                  }
                >
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DocumentsTab