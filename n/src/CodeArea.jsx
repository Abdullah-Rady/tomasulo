import React from "react";
import { useState } from "react";

const CodeArea = ({ setShow, instructions, setInstructions, setMemory }) => {
  const [memoryAddress, setMemoryAddress] = useState(0);
  const [memoryValue, setMemoryValue] = useState(0);
  const [size, setSize] = useState({
    loadBuffer: 2,
    storeBuffer: 2,
    addSubBuffer: 3,
    mulDivBuffer: 2,
    memory: 2048,
  });

  const [latency, setLatency] = useState({
    load: 1,
    store: 1,
    add: 3,
    sub: 3,
    mul: 5,
    div: 10,
  });

  const [FPR, setFPR] = useState({
    number: 0,
    value: 0,
  });

  const handleSubmitMemory = () => {
    if (memoryAddress && memoryValue) {
      setMemory((prev) => [
        ...prev,
        { address: memoryAddress, value: memoryValue },
      ]);
    }

    setMemoryAddress(0);
    setMemoryValue(0);
  };

  const handleSubmitChange = () => {
    flag = true;
    size.map((item) => {
      if ((item < 1 || item > 5) && item !== "memory") flag = false;
    });
    if (size.memory < 1 || memoryAddress >= size.memory) flag = false;
    if (flag) {
      // set size
    }
  };

  const handleSubmitFPR = () => {
    //set FPR
  };
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-4">
        <div className="basis-1/2 flex flex-col gap-y-4">
          <div className="flex gap-x-4">
            <div className="basis-1/2 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="memoryAddress">
                Memory Address:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="memoryAddress"
                onChange={(e) => setMemoryAddress(() => e.target.value)}
                placeholder="Enter memory address"
                type="number"
                value={memoryAddress}
                min="0"
                max={size.memory - 1}
              />
            </div>
            <div className="basis-1/2 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="memoryValue">
                Memory Value:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="memoryValue"
                onChange={(e) => setMemoryValue(() => e.target.value)}
                placeholder="Enter memory value"
                type="number"
                value={memoryValue}
              />
            </div>
          </div>
          <button
            className="text-white px-4 py-2 bg-a rounded-md hover:bg-b hover:shadow-lg w-50 mx-auto"
            onClick={handleSubmitMemory}
          >
            Save Memory Change
          </button>
        </div>
        <div className="basis-1/2 flex flex-col gap-y-4">
          <div className="flex gap-x-4">
            <div className="basis-1/2 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="fprAddressNumber">
                FPR Number:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="fprAddressNumber"
                onChange={(e) =>
                  setFPR((prev) => ({ ...prev, number: e.target.value }))
                }
                placeholder="Enter FPR number"
                type="number"
                value={FPR.number}
                min="0"
                max={31}
              />
            </div>
            <div className="basis-1/2 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="fprValue">
                Value:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="fprValue"
                onChange={(e) =>
                  setFPR((prev) => ({ ...prev, value: e.target.value }))
                }
                placeholder="Enter FPR value"
                type="number"
                value={FPR.value}
              />
            </div>
          </div>
          <button
            className="text-white px-4 py-2 bg-a rounded-md hover:bg-b hover:shadow-lg w-50 mx-auto"
            onClick={handleSubmitFPR}
          >
            Save FPR Change
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-x-4">
        <div className="basis-1/2 flex flex-col gap-y-4">
          <label className="text-t text-xl" htmlFor="instructions">
            Instructions:{" "}
          </label>
          <textarea
            className="w-full h-full bg-c text-white rounded-md p-4 text-l mt-2 bg-a focus:outline-none"
            id="instructions"
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter your instructions here"
            value={instructions}
          ></textarea>
        </div>
        <div className="basis-1/2 flex flex-col gap-y-4">
          <div className="flex flex-row gap-x-4">
            <div className="basis-1/3 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="loadLatency">
                Load Latency:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="loadLatency"
                onChange={(e) =>
                  setLatency((prev) => ({ ...prev, load: e.target.value }))
                }
                placeholder="Load latency"
                type="number"
                value={latency.load}
                min="1"
              />
            </div>
            <div className="basis-1/3 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="storeLatency">
                Store Latency:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="storeLatency"
                onChange={(e) =>
                  setLatency((prev) => ({ ...prev, store: e.target.value }))
                }
                placeholder="Store latency"
                type="number"
                value={latency.store}
                min="1"
              />
            </div>
            <div className="basis-1/3 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="addLatency">
                Add Latency:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="addLatency"
                onChange={(e) =>
                  setLatency((prev) => ({ ...prev, add: e.target.value }))
                }
                placeholder="Add latency"
                type="number"
                value={latency.add}
                min="1"
              />
            </div>
          </div>

          <div className="flex flex-row gap-x-4">
            <div className="basis-1/3 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="subLatency">
                Sub Latency:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="subLatency"
                onChange={(e) =>
                  setLatency((prev) => ({ ...prev, sub: e.target.value }))
                }
                placeholder="Sub latency"
                type="number"
                value={latency.sub}
                min="1"
              />
            </div>
            <div className="basis-1/3 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="mulLatency">
                Multiply Latency:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="mulLatency"
                onChange={(e) =>
                  setLatency((prev) => ({ ...prev, mul: e.target.value }))
                }
                placeholder="Mul latency"
                type="number"
                value={latency.mul}
                min="1"
              />
            </div>
            <div className="basis-1/3 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="divLatency">
                Divide Latency:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="divLatency"
                onChange={(e) =>
                  setLatency((prev) => ({ ...prev, div: e.target.value }))
                }
                placeholder="Div latency"
                type="number"
                value={latency.div}
                min="1"
              />
            </div>
          </div>
          <div className="flex gap-x-4 w-full">
            <div className="basis-1/3 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="loadBuffer">
                Load Buffer:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="loadBuffer"
                onChange={(e) =>
                  setSize((prev) => ({ ...prev, loadBuffer: e.target.value }))
                }
                placeholder="Buffer size"
                type="number"
                value={size.loadBuffer}
                min="1"
                max="5"
              />
            </div>
            <div className="basis-1/3 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="storeBuffer">
                Store Buffer:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="storeBuffer"
                onChange={(e) =>
                  setSize((prev) => ({
                    ...prev,
                    storeBuffer: e.target.value,
                  }))
                }
                placeholder="Buffer size"
                type="number"
                value={size.storeBuffer}
                min="1"
                max="5"
              />
            </div>
            <div className="basis-1/3 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="memorySize">
                Memory size:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="memorySize"
                onChange={(e) =>
                  setSize((prev) => ({ ...prev, memory: e.target.value }))
                }
                placeholder="Buffer size"
                type="number"
                value={size.memory}
              />
            </div>
          </div>
          <div className="flex gap-x-4">
            <div className="basis-1/2 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="addSubBuffer">
                Add/Sub RS:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="addSubBuffer"
                onChange={(e) =>
                  setSize((prev) => ({
                    ...prev,
                    addSubBuffer: e.target.value,
                  }))
                }
                placeholder="Buffer size"
                type="number"
                value={size.addSubBuffer}
                min="1"
                max="5"
                required
              />
            </div>
            <div className="basis-1/2 flex flex-col gap-y-4">
              <label className="text-t text-lg" htmlFor="mulDivBuffer">
                Mul/Div RS:{" "}
              </label>
              <input
                className="text-white w-full mt-2 p-2 rounded-md bg-a focus:outline-none"
                id="mulDivBuffer"
                onChange={(e) =>
                  setSize((prev) => ({
                    ...prev,
                    mulDivBuffer: e.target.value,
                  }))
                }
                placeholder="Buffer size"
                type="number"
                value={size.mulDivBuffer}
                min="1"
                max="5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="text-white px-4 py-2 bg-a rounded-md hover:bg-b hover:shadow-lg w-50 mx-auto"
          onClick={() => setShow(true)}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CodeArea;
