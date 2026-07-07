import { Controller, useFormContext } from 'react-hook-form'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../shared/ui/card/Card'

import { DOCUMENT_TYPES, FileUpload } from '../../../shared/file-upload'

import type { CreateFacilityFormValues } from '../schemas/facilitySchemas'

const DocumentsCard = () => {
  const {
    control,
    formState: { errors },
  } =
    useFormContext<CreateFacilityFormValues>()

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Documents
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="space-y-6">

          <Controller
            name="titleDocument"
            control={control}
            render={({ field }) => (
              <FileUpload
                label="Title Document"
                value={field.value}
                onChange={field.onChange}
                error={
                  errors.titleDocument?.message
                }
                {...DOCUMENT_TYPES.titleDocument}
              />
            )}
          />

          <Controller
            name="approvalFile"
            control={control}
            render={({ field }) => (
              <FileUpload
                label="Approval Letter"
                value={field.value}
                onChange={field.onChange}
                error={
                  errors.approvalFile?.message
                }
                {...DOCUMENT_TYPES.approvalLetter}
              />
            )}
          />

          <Controller
            name="indemnityLetter"
            control={control}
            render={({ field }) => (
              <FileUpload
                label="Indemnity Letter"
                value={field.value}
                onChange={field.onChange}
                error={
                  errors.indemnityLetter?.message
                }
                {...DOCUMENT_TYPES.indemnityLetter}
              />
            )}
          />

        </div>

      </CardContent>

    </Card>
  )
}

export default DocumentsCard