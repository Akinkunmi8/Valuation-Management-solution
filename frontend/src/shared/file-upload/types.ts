export type FileUploadProps = {
  label: string

  value: File | null

  onChange: (
    file: File | null,
  ) => void

  error?: string

  accept: readonly string[]

  extensions: readonly string[]

  maxSize?: number

  required?: boolean
}