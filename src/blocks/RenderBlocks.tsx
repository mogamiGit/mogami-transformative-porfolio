import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AboutBlockComponent } from '@/blocks/AboutBlock/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactBlockComponent } from '@/blocks/ContactBlock/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { ExperienceBlockComponent } from '@/blocks/ExperienceBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { GitHubStatsBlockComponent } from '@/blocks/GitHubStatsBlock/Component'
import { HighlightPointsBlockComponent } from '@/blocks/HighlightPointsBlock/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PortfolioHeroBlockComponent } from '@/blocks/PortfolioHero/Component'
import { ProjectsBlockComponent } from '@/blocks/ProjectsBlock/Component'
import { SkillsBlockComponent } from '@/blocks/SkillsBlock/Component'
import { ScrollFocus } from '@/components/atoms/ScrollFocus/ScrollFocus.client'

const blockComponents = {
  aboutBlock: AboutBlockComponent,
  archive: ArchiveBlock,
  contactBlock: ContactBlockComponent,
  content: ContentBlock,
  cta: CallToActionBlock,
  experienceBlock: ExperienceBlockComponent,
  formBlock: FormBlock,
  githubStatsBlock: GitHubStatsBlockComponent,
  highlightPointsBlock: HighlightPointsBlockComponent,
  mediaBlock: MediaBlock,
  portfolioHero: PortfolioHeroBlockComponent,
  projectsBlock: ProjectsBlockComponent,
  skillsBlock: SkillsBlockComponent,
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
                // The first block is above the fold and animates itself in.
                <ScrollFocus className="my-16" enter={index !== 0} key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </ScrollFocus>
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
