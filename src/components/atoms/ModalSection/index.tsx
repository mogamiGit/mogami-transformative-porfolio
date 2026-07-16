import React from 'react'
import RichText from '@/components/organisms/RichText'

type ModalSectionProps = {
  title: string
  data: any
}

export const ModalSection: React.FC<ModalSectionProps> = ({ title, data }) => {
  if (!data) return null

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <RichText
        data={data}
        enableGutter={false}
        enableProse={false}
        className="text-sm text-card-foreground opacity-70 leading-relaxed"
      />
    </div>
  )
}
