import React from 'react'
import './card.scss'

interface CardProps {
  content: string
  percentageWiped: number
  flash: boolean
}

export const Card = (props: CardProps) => {
  const {content, percentageWiped, flash} = props
  return (
    <div className="card">
      <div className={`content ${flash ? 'flashing' : ''}`}>{content}</div>
      {!!percentageWiped && (
        <div
          className="wipe"
          style={{
            transform: `scaleX(${percentageWiped})`
          }}
        >
        </div>
      )}
      {!!flash && (
        <div className="flash"></div>
      )}
    </div>
  )
}
