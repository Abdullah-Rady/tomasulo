import { useState } from "react";
import CodeArea from "./CodeArea";
import Tables from "./Tables";


function App() {

  const [input, setInput] = useState("")
  const [show, setShow] = useState(false)
  const [table, setTable] = useState(0);
  const [cycle, setCycle] = useState(0);

  const handelClick = (n) => {
    setTable(n);
  };

  const handleChange = (direction, max) => {

    if (direction === 1){ 

      if(cycle + 1 < max - 1)
        setCycle((prev) => prev + 1)

    }else if(direction === 0){

      if(cycle - 1 >= 0)
        setCycle((prev) => prev - 1)

    }else{

      if(cycle + 10 < max - 1)
        setCycle((prev) => prev + 10)
      else
        setCycle(() => max - 2)
      

    }

  }

  return (
    <div className="App bg-black w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-8/12 ">
         { show ? <Tables cycle={cycle} table={table} handelClick={handelClick} handleChange={handleChange}/> : <CodeArea setShow={setShow} setInput={setInput} />}
        </div>
      </div>
    </div>
  );
}

export default App;
