import { useRef } from 'react'

import {
  FiFile,
  FiTrash2,
  FiUploadCloud,
} from 'react-icons/fi'

import type { FileUploadProps } from './types'

const DEFAULT_MAX_SIZE = 10

const FileUpload = ({
  label,
  value,
  onChange,
  error,
  accept,
  extensions,
  maxSize = DEFAULT_MAX_SIZE,
}: FileUploadProps) => {
  const inputRef =
    useRef<HTMLInputElement>(null)

  const handleBrowse = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    if (
      !accept.includes(file.type)
    ) {
      alert(
        'Unsupported file type.',
      )

      return
    }

    if (
      file.size >
      maxSize * 1024 * 1024
    ) {
      alert(
        `Maximum file size is ${maxSize} MB.`,
      )

      return
    }

    onChange(file)
  }

  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-text-primary">
        {label}
      </label>

      <input
        hidden
        ref={inputRef}
        type="file"
        accept={accept.join(',')}
        onChange={handleFileChange}
      />

      {!value ? (
        <button
          type="button"
          onClick={handleBrowse}
          className="
            flex
            w-full
            flex-col
            items-center
            justify-center
            rounded-xl
            border-2
            border-dashed
            border-border
            bg-surface
            p-8
            transition
            hover:border-primary
            hover:bg-primary-soft
          "
        >
          <FiUploadCloud
            size={36}
            className="mb-3 text-primary"
          />

          <p className="font-medium">
            Click to upload
          </p>

          <p className="mt-2 text-sm text-text-secondary">
            {extensions.join(
              ', ',
            )}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Maximum {maxSize} MB
          </p>

        </button>
      ) : (
        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-border
            bg-surface
            p-4
          "
        >
          <div className="flex items-center gap-3">

            <FiFile
              className="text-primary"
              size={24}
            />

            <div>

              <p className="font-medium">
                {value.name}
              </p>

              <p className="text-xs text-text-secondary">
                {(
                  value.size /
                  1024 /
                  1024
                ).toFixed(2)}
                {' '}MB
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              onChange(null)
            }
            className="
              rounded-lg
              p-2
              text-danger
              transition
              hover:bg-danger-soft
            "
          >
            <FiTrash2 />
          </button>

        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}

    </div>
  )
}

export default FileUpload