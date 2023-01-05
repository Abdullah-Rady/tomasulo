import { useState } from "react";
import CodeArea from "./CodeArea";
import Tables from "./Tables";

function App() {
  const [show, setShow] = useState(false);
  const [table, setTable] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [instructions, setInstructions] = useState(
    "L.D F6,33\nL.D F2,44\nMUL.D F0,F2,F4\nSUB.D F8,F6,F2\nDIV.D F10,F0,F6\nADD.D F6,F8,F2"
  );
  const [memory, setMemory] = useState([]);

  const [FPR, setFPR] = useState([]);
  const [size, setSize] = useState({
    loadBuffer: 2,
    storeBuffer: 2,
    addSubBuffer: 3,
    mulDivBuffer: 2,
    memory: 1024,
  });

  const [latency, setLatency] = useState({
    load: 1,
    store: 1,
    add: 3,
    sub: 3,
    mul: 5,
    div: 10,
  });

  const handelClick = (n) => {
    setTable(n);
  };

  const handleChange = (direction, max) => {
    if (direction === 1) {
      if (cycle + 1 < max - 1) 
        setCycle((prev) => prev + 1);
    } else if (direction === 0) {
      if (cycle - 1 >= 0) setCycle((prev) => prev - 1);
    } else {
      if (cycle + 10 < max - 1) setCycle((prev) => prev + 10);
      else setCycle(() => max - 2);
    }
  };

  const setCycle1 = (c) => {
    setCycle(c)
  }


  const setCycleZero = () => {
    setCycle(0);
  };

  return (
    <div className="App bg-black w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-8/12 ">
          {show ? (
            <Tables
              cycle={cycle}
              table={table}
              handelClick={handelClick}
              handleChange={handleChange}
              setCycleZero={setCycleZero}
              memory={memory}
              instructions={instructions}
              latency={latency}
              size={size}
              FPR={FPR}
              setCycle1={setCycle1}
            />
          ) : (
            <CodeArea
              instructions={instructions}
              setInstructions={setInstructions}
              setMemory={setMemory}
              setShow={setShow}
              latency={latency}
              setLatency={setLatency}
              size={size}
              setSize={setSize}
              setFPR={setFPR}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
