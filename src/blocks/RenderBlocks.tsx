import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AboutBlockComponent } from '@/blocks/AboutBlock/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactBlockComponent } from '@/blocks/ContactBlock/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { ExperienceBlockComponent } from '@/blocks/ExperienceBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HighlightPointsBlockComponent } from '@/blocks/HighlightPointsBlock/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PortfolioHeroBlock } from '@/blocks/PortfolioHero/Component'
import { ProjectsBlockComponent } from '@/blocks/ProjectsBlock/Component'

const blockComponents = {
  aboutBlock: AboutBlockComponent,
  archive: ArchiveBlock,
  contactBlock: ContactBlockComponent,
  content: ContentBlock,
  cta: CallToActionBlock,
  experienceBlock: ExperienceBlockComponent,
  formBlock: FormBlock,
  highlightPointsBlock: HighlightPointsBlockComponent,
  mediaBlock: MediaBlock,
  portfolioHero: PortfolioHeroBlock,
  projectsBlock: ProjectsBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
