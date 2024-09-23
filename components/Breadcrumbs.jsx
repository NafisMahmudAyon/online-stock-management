import React from 'react'

const Breadcrumbs = ({items}) => {
  return (
    <div className='my-12'>
      <ul className="flex items-center gap-3 text-2xl font-bold ">
        {items.map((item, index) => (
          <li key={index}>
            <span className={` ${items.length === index+1 ? "text-mainColor" : "text-infoColor"}`}>{item}</span>
            {index < items.length - 1 && <span className="ml-3 rotate-90 text-[#9B9B9B]">∨</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Breadcrumbs