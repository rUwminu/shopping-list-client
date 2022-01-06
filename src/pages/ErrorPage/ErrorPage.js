import React from 'react'

// Styling import
import tw from 'twin.macro'
import styled from 'styled-components'

// Mui Icons
import { LiveHelpOutlined } from '@mui/icons-material'

const ErrorPage = () => {
  return (
    <ErrorSection>
      <div className="icon-box">
        <LiveHelpOutlined className="error-icon" />
      </div>

      <h1 className="error-msg">
        Not Sure Where You Going, Hope you'r fine Out Here.
      </h1>
    </ErrorSection>
  )
}

const ErrorSection = styled.div`
  ${tw`
    flex
    flex-col
    flex-grow
    items-center
    justify-center
    mx-auto
    py-16
    px-6
    md:px-20
    h-full
    w-full
    max-w-6xl
  `}

  .icon-box {
    ${tw`
        w-full
        max-w-xs
    `}

    .error-icon {
      ${tw`
        w-full
        h-full
        text-gray-400
      `}
    }
  }

  .error-msg {
    ${tw`
        mt-4
        text-lg
        md:text-xl
        lg:text-2xl
        font-semibold
        text-center
    `}
  }
`

export default ErrorPage
