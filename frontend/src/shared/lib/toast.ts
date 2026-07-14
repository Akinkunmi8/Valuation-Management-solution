import { toast } from 'sonner'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { NOTIFY_TITLES } from '@/shared/constants/notifyTitles'

function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error
  )
}

export const notify = {
  success: (
    title: string,
    description?: string,
  ) =>
    toast.success(title, {
      description,
    }),

  error: (
    title: string,
    description?: string,
  ) =>
    toast.error(title, {
      description,
    }),

  warning: (
    title: string,
    description?: string,
  ) =>
    toast.warning(title, {
      description,
    }),

  info: (
    title: string,
    description?: string,
  ) =>
    toast.info(title, {
      description,
    }),

  apiError: (
    error: unknown,
    // title = NOTIFY_TITLES.REQUEST_FAILED,
    title:string
  ) => {
    if (isFetchBaseQueryError(error)) {
      /**
       * Backend message takes precedence.
       */
      const data = error.data as
        | {
            message?: string
          }
        | undefined

      if (data?.message) {
        notify.error(
          title,
          data.message,
        )

        return
      }

      /**
       * Network errors.
       */
      if (error.status === 'FETCH_ERROR') {
        notify.error(
          NOTIFY_TITLES.NETWORK_ERROR,
          'Please check your internet connection.',
        )

        return
      }

      if (error.status === 'TIMEOUT_ERROR') {
        notify.error(
          NOTIFY_TITLES.TIMEOUT,
          'The request timed out. Please try again.',
        )

        return
      }

      if (error.status === 'PARSING_ERROR') {
        notify.error(
          'Unexpected Response',
          'The server returned an invalid response.',
        )

        return
      }

      /**
       * HTTP status fallbacks.
       */
      if (typeof error.status === 'number') {
        switch (error.status) {
          case 400:
            notify.error(
              title,
              'Please check your input and try again.',
            )
            return

          case 401:
            notify.error(
              NOTIFY_TITLES.UNAUTHORIZED,
              'Your session has expired. Please log in again.',
            )
            return

          case 403:
            notify.error(
              NOTIFY_TITLES.ACCESS_DENIED,
              'You do not have permission to perform this action.',
            )
            return

          case 404:
            notify.error(
              NOTIFY_TITLES.NOT_FOUND,
              'The requested resource could not be found.',
            )
            return

          case 500:
            notify.error(
              NOTIFY_TITLES.SERVER_ERROR,
              'An internal server error occurred. Please try again later.',
            )
            return

          default:
            notify.error(
              title,
              'Something went wrong. Please try again.',
            )
            return
        }
      }
    }

    /**
     * Unknown errors.
     */
    notify.error(
      NOTIFY_TITLES.ERROR,
      'An unexpected error occurred.',
    )
  },
}