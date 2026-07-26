import { useState } from 'react'

import Button from '@/shared/ui/button/Button'
// import Input from '@/shared/ui/input/Input'

type CommentModalProps = {
    open: boolean
    loading?: boolean
    title?: string
    description?: string
    confirmText?: string
    onClose: () => void
    onSubmit: (comment: string) => Promise<void>
}


const CommentModal = ({
    open,
    loading,
    title,
    description,
    confirmText,
    onClose,
    onSubmit,
}: CommentModalProps) => {

    const modalTitle = title ?? "Reject Facility";
    const modalDescription = description ??
        "Please provide a reason for rejecting this facility.";
    const modalButton = confirmText ?? "Reject Facility";


    const [comment, setComment] = useState('')

    const canSubmit = comment.trim().length > 0;

    const handleClose = () => {
        setComment('')
        onClose()
    }
    if (!open) {
        return null
    }

    const handleSubmit = async () => {
        await onSubmit(comment)

        setComment("")
    }
    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

                <h2 className="text-xl font-semibold">
                    {modalTitle}
                </h2>

                <p className="mt-2 text-sm text-text-muted">
                    {modalDescription}
                </p>

                <div className="mt-6">

                    <label className="mb-1.5 block text-sm font-semibold">
                        Comment
                    </label>

                    <textarea
                        rows={5}
                        className="w-full rounded-md border border-border-strong bg-surface p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        value={comment}
                        onChange={e =>
                            setComment(e.target.value)
                        }
                    />
                </div>

                <div className="mt-8 flex justify-end gap-3">

                    <Button
                        // variant="outline"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        isLoading={loading}
                        disabled={!canSubmit}
                    >
                        {modalButton}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CommentModal;