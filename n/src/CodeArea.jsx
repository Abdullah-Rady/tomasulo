import React from 'react'

const CodeArea = ({setShow, setInput}) => {
  return (
    <div>
        <button className='px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-500 text-t hover:text-white' onClick={() => setShow(true)}>Click Me</button>
    </div>
  )
}

export default CodeArea