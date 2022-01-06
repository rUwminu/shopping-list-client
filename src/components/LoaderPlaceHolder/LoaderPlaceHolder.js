import React from 'react'

// Styling import
import tw from 'twin.macro'
import styled from 'styled-components'

const LoaderPlaceHolder = () => {
  return (
    <BackboneContainer>
      <div className="main-title bg-animation">&nbsp;</div>
      <div className="cate-card">
        <div className="cate-title bg-animation">&nbsp;</div>
        <div className="items-container">
          <div className="item-card">
            <span className="span-1 bg-animation">&nbsp;</span>
            <span className="span-2 bg-animation">&nbsp;</span>
          </div>
          <div className="item-card">
            <span className="span-1 bg-animation">&nbsp;</span>
            <span className="span-2 bg-animation">&nbsp;</span>
          </div>
          <div className="item-card">
            <span className="span-1 bg-animation">&nbsp;</span>
            <span className="span-2 bg-animation">&nbsp;</span>
          </div>
        </div>
      </div>
      <div className="cate-card">
        <div className="cate-title bg-animation">&nbsp;</div>
        <div className="items-container">
          <div className="item-card">
            <span className="span-1 bg-animation">&nbsp;</span>
            <span className="span-2 bg-animation">&nbsp;</span>
          </div>
          <div className="item-card">
            <span className="span-1 bg-animation">&nbsp;</span>
            <span className="span-2 bg-animation">&nbsp;</span>
          </div>
          <div className="item-card">
            <span className="span-1 bg-animation">&nbsp;</span>
            <span className="span-2 bg-animation">&nbsp;</span>
          </div>
          <div className="item-card">
            <span className="span-1 bg-animation">&nbsp;</span>
            <span className="span-2 bg-animation">&nbsp;</span>
          </div>
        </div>
      </div>

      <div className="cate-card">
        <div className="cate-title bg-animation">&nbsp;</div>
        <div className="items-container">
          <div className="item-card">
            <span className="span-1 bg-animation">&nbsp;</span>
            <span className="span-2 bg-animation">&nbsp;</span>
          </div>
          <div className="item-card">
            <span className="span-1 bg-animation">&nbsp;</span>
            <span className="span-2 bg-animation">&nbsp;</span>
          </div>
        </div>
      </div>
    </BackboneContainer>
  )
}

const BackboneContainer = styled.div`
  ${tw`
    flex-grow 
    py-16
    px-6
    md:px-20
    h-full
    w-full
    max-w-6xl
  `}

  .main-title {
    ${tw`
        h-10
        w-full
        max-w-md
        mb-12
    `}
  }

  .cate-card {
    ${tw`
        flex
        flex-col
        items-start
        justify-start
        w-full
        mb-10
    `}

    .cate-title {
      ${tw`
        h-6
        w-full
        max-w-sm
      `}
    }

    .items-container {
      ${tw`
        grid
        grid-cols-2
        md:grid-cols-3
        xl:grid-cols-4
        gap-4
        w-full
        mt-3
      `}

      .item-card {
        ${tw`
            flex
            flex-col
            px-2
            py-2
            md:py-3
            bg-gray-300
            shadow-lg
            rounded-md
        `}

        .span-1 {
          ${tw`
            h-3
            w-full
            mb-1
          `}
        }

        .span-2 {
          ${tw`
            h-3
            w-[50%]
          `}
        }
      }
    }
  }

  .bg-animation {
    ${tw`
        rounded-3xl
    `}
    background-image: linear-gradient(
      to right,
      rgba(55, 65, 81, 0.4) 10%,
      rgba(107, 114, 128, 0.4) 20%,
      rgba(55, 65, 81, 0.4) 30%,
      rgba(55, 65, 81, 0.4) 100%
    );
    background-size: 200% 100%;
    animation: animate1 1s linear infinite;
  }

  @keyframes animate1 {
    0% {
      background-position: 50% 0;
    }
    100% {
      background-position: -150% 0;
    }
  }
`

export default LoaderPlaceHolder
