import type { ComponentProps } from 'react'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = ComponentProps<typeof Sonner>

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="isle-toaster"
      closeButton
      duration={2800}
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: 'isle-toast',
          title: 'isle-toast-title',
          closeButton: 'isle-toast-close',
        },
      }}
      {...props}
    />
  )
}
