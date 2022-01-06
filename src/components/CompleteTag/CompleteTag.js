import React, { useEffect } from 'react'

// Styling import
import tw from 'twin.macro'
import styled from 'styled-components'

const CompleteTag = ({ body, setIsComplete, isComplete }) => {
  useEffect(() => {
    if (isComplete) {
      setTimeout(function () {
        setIsComplete(false)
      }, 2000)
    }
  }, [isComplete])

  return (
    <StyleContainer className={`${isComplete && 'active'}`}>
      {body}
    </StyleContainer>
  )
}

const StyleContainer = styled.div`
  width: calc(100% - 4rem);
  ${tw`
    fixed
    top-14
    right-0
    py-3
    pl-4
    max-w-xs
    font-semibold
    bg-green-600
    text-gray-50
    rounded-l-xl
    z-[1]

    translate-x-full
    transition-all
  `}

  &.active {
    animation: slideInFromRight 0.3s ease alternate forwards;

    @keyframes slideInFromRight {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0%);
      }
    }
  }
`

export default CompleteTag
