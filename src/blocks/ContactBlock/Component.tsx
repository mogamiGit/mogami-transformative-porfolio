'use client'

import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import type { ContactBlockType } from '@/payload-types'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { TitleSection } from '@/components/atoms/TitleSection'
import { Button } from '@/components/ui/button'
import { getClientSideURL } from '@/utilities/getURL'

export const ContactBlockComponent: React.FC<
  ContactBlockType & { id?: string }
> = (props) => {
  const { sectionTitle, email, linkedinLabel, linkedinUrl, form: formData } = props

  return (
    <section id="contact" className="container py-16">
      <TitleSection text={sectionTitle || 'contact'} />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
        <div className="lg:col-span-2">
          {formData && typeof formData === 'object' && (
            <ContactForm form={formData as unknown as FormType} />
          )}
        </div>
        <div className="flex flex-col gap-4">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-blue-violet hover:underline"
            >
              <img src="/images/check-vector.svg" alt="" className="w-4 h-4" />
              {email}
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-violet hover:underline"
            >
              <img src="/images/check-vector.svg" alt="" className="w-4 h-4" />
              {linkedinLabel || 'LinkedIn'}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

const ContactForm: React.FC<{ form: FormType }> = ({ form }) => {
  const {
    id: formID,
    confirmationMessage,
    confirmationType,
    redirect,
    submitButtonLabel,
    fields: formFields,
  } = form

  const formMethods = useForm({ defaultValues: formFields })
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<{ message: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      const submitForm = async () => {
        setError(undefined)
        setIsLoading(true)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({ form: formID, submissionData: dataToSend }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })

          const res = await req.json()

          if (req.status >= 400) {
            setIsLoading(false)
            setError({ message: res.errors?.[0]?.message || 'Internal Server Error' })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect?.url) {
            router.push(redirect.url)
          }
        } catch {
          setIsLoading(false)
          setError({ message: 'Something went wrong.' })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  if (hasSubmitted) {
    return <p className="text-success">Thank you! Your message has been sent.</p>
  }

  return (
    <FormProvider {...formMethods}>
      {error && <p className="text-error mb-4">{error.message}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {formFields?.map((field, index) => {
          if (field.blockType === 'text' || field.blockType === 'email') {
            return (
              <div key={index}>
                <label className="text-sm text-muted-foreground capitalize">{field.label}</label>
                <input
                  type={field.blockType === 'email' ? 'email' : 'text'}
                  {...register(String(index) as `${number}`)}
                  required={field.required ?? false}
                  className="w-full mt-1 p-2 border-b border-border bg-transparent focus:border-blue-violet focus:outline-none transition-colors"
                />
              </div>
            )
          }
          if (field.blockType === 'textarea') {
            return (
              <div key={index}>
                <label className="text-sm text-muted-foreground capitalize">{field.label}</label>
                <textarea
                  {...register(String(index) as `${number}`)}
                  required={field.required ?? false}
                  rows={4}
                  className="w-full mt-1 p-2 border-b border-border bg-transparent focus:border-blue-violet focus:outline-none transition-colors resize-none"
                />
              </div>
            )
          }
          return null
        })}
        <Button type="submit" disabled={isLoading} className="self-start">
          {isLoading ? 'Sending...' : submitButtonLabel || 'Send'}
        </Button>
      </form>
    </FormProvider>
  )
}
