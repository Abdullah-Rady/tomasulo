import React from 'react'

const CodeArea = ({setShow, setInput}) => {
  return (
    <div>
        <button onClick={() => setShow(true)}>Click</button>
    </div>
  )
}

export default CodeArea