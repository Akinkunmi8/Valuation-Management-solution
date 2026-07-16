import { useState } from 'react'

import Button from '@/shared/ui/button/Button'
// import Input from '@/shared/ui/input/Input'

type RejectFacilityModalProps = {
    open: boolean
    loading?: boolean
    onClose: () => void
    onSubmit: (comment: string) => Promise<void>
}

const RejectFacilityModal = ({
    open,
    loading,
    onClose,
    onSubmit,
}: RejectFacilityModalProps) => {

    const [comment, setComment] =
        useState('')

    const handleClose = () => {
        setComment('')
        onClose()
    }
    if (!open) {
        return null
    }

    const handleSubmit = async () => {
        await onSubmit(comment)
    }
    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

                <h2 className="text-xl font-semibold">
                    Reject Facility
                </h2>

                <p className="mt-2 text-sm text-text-muted">
                    Please provide a reason for rejecting this facility.
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
                    >
                        Reject Facility
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default RejectFacilityModal