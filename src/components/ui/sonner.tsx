import type { ComponentProps } from 'react'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = ComponentProps<typeof Sonner>

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      closeButton
      duration={2800}
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            'font-hand text-[0.9rem] !border !border-paper-edge !bg-[color-mix(in_srgb,var(--color-paper)_96%,white)] !text-ink !shadow-[0_10px_28px_rgb(61_74_60/14%)]',
          title: 'font-normal',
          closeButton:
            '!border-paper-edge !bg-[color-mix(in_srgb,white_70%,var(--color-paper))] !text-ink-soft',
        },
      }}
      {...props}
    />
  )
}
