import React from 'react'
import { useState } from 'react'

const CodeArea = ({ setShow, instructions, setInstructions, setMemory }) => {

  const [memoryAddress, setMemoryAddress] = useState("")
  const [memoryValue, setMemoryValue] = useState("")

  const handleSubmitMemory = () => {
    if (memoryAddress && memoryValue){
      setMemory((prev) => [...prev, {address: memoryAddress, value: memoryValue}])
    }

    setMemoryAddress("")
    setMemoryValue("")
      
  }

  return (
    <div>
            <div className="flex flex-row gap-x-4">
      <div className="basis-1/2 flex flex-col gap-y-4">
          <label className="text-t text-xl" htmlFor="instructions">
            {" "}
            Instructions:{" "}
          </label>
          <textarea
            className="w-full h-72 bg-c text-white rounded-md p-4 text-l mt-2 bg-a focus:outline-none"
            id="instructions"
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter your instructions here"
            value={instructions}
          ></textarea>

        <button
          className="text-t px-4 py-2 bg-a rounded-md hover:bg-b hover:shadow-lg mx-auto"
          onClick={() => setShow(true)}
        >
          Proceed
        </button>
      </div>
      <div className="basis-1/2 flex flex-col gap-y-4">
          <label className="text-t text-lg" htmlFor="memoryAddress">
            Memory Address:{" "}
          </label>
          <input
            className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
            id="memoryAddress"
            onChange={(e) => setMemoryAddress(() => e.target.value) }
            placeholder="Enter memory address"
            type="text"
            value={memoryAddress}
          />
        
          <label className="text-t text-lg" htmlFor="memoryValue">
            Memory Value:{" "}
          </label>
          <input
            className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
            id="memoryValue"
            onChange={(e) =>
              setMemoryValue(() => e.target.value)
            }
            placeholder="Enter memory value"
            type="text"
            value={memoryValue}
          />
        <button
          className="text-white px-4 py-2 bg-a rounded-md hover:bg-b hover:shadow-lg w-50 mx-auto"
          onClick={handleSubmitMemory}
        >
          Save Memory Change
        </button>
      </div>
    </div>
    </div>
  )
}

export default CodeArea