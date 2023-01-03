import React from "react";
import { run } from "./tomasuloAlgorithm";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import "@inovua/reactdatagrid-community/theme/default-dark.css";
import { useEffect } from "react";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { useState } from "react";
import { useRef } from "react";

const instructionQueueR = [];
const FPRR = [];
const storeBufferR = [];
const loadBufferR = [];
const addRSR = [];
const mulRSR = [];
const memoryR = []

let max;

const call = (memory, instructions) => {
  max = run(
    instructionQueueR,
    FPRR,
    storeBufferR,
    loadBufferR,
    addRSR,
    mulRSR,
    memory,
    instructions,
    memoryR
  );
};

const gridStyle = { height: 400 };

function InstructionQueueTable({ cycle }) {
  const ren = (value, rowIndex, name) => (
    <span
      style={{
        color:
          cycle == 0 ||
          instructionQueueR[cycle - 1][rowIndex][name] !=
            instructionQueueR[cycle][rowIndex][name]
            ? "lightgreen"
            : "inherit",
      }}
    >
      {value}
    </span>
  );

  const columns = [
    { name: "op", header: "op", defaultFlex: 1 },
    { name: "d", header: "Destination", defaultFlex: 1 },
    { name: "source1", header: "Source 1", defaultFlex: 1 },
    { name: "source2", header: "Source 2", defaultFlex: 1 },
    { name: "address", header: "Address", defaultFlex: 1 },
    {
      name: "issue",
      header: "Issue",
      defaultFlex: 1,
      render: ({ value, rowIndex }) => ren(value, rowIndex, "issue"),
    },
    {
      name: "i",
      header: "Start Ex",
      defaultFlex: 1,
      render: ({ value, rowIndex }) => ren(value, rowIndex, "i"),
    },
    {
      name: "j",
      header: "End Ex",
      defaultFlex: 1,
      render: ({ value, rowIndex }) => ren(value, rowIndex, "j"),
    },
    {
      name: "writeResults",
      header: "Write on CDB",
      defaultFlex: 1,
      render: ({ value, rowIndex }) => ren(value, rowIndex, "writeResults"),
    },
  ];

  return (
    <ReactDataGrid
      theme="default-dark"
      idProperty="id"
      columns={columns}
      dataSource={instructionQueueR[cycle]}
      style={gridStyle}
    />
  );
}

function StoreBufferTable({ cycle }) {
  const ren1 = (value, rowIndex, name) =>{ 
    if (storeBufferR && storeBufferR[cycle]) 
      console.log(storeBufferR[cycle][rowIndex]);
    
    return (<span>{`S${rowIndex + 1}`}</span>)}

  const columns = [
    {
      name: "status",
      header: "Tag",
      defaultFlex: 1,
      render: ({ value, rowIndex }) => ren1(value, rowIndex, "status"),
    },
    
    { name: "address", header: "Address", defaultFlex: 1 },
    {name: "v", header: "v", defaultFlex: 1 },
    {name: "q", header: "q", defaultFlex: 1 }
  ];

  return (
    <ReactDataGrid
      theme="default-dark"
      idProperty="id"
      columns={columns}
      dataSource={storeBufferR[cycle]}
      style={gridStyle}
    />
  );
}

function LoadBufferTable({ cycle }) {
  const ren1 = (value, rowIndex, name) => <span>{`L${rowIndex + 1}`}</span>;

  const columns = [
    {
      name: "status",
      header: "Tag",
      defaultFlex: 1,
      render: ({ value, rowIndex }) => ren1(value, rowIndex, "status"),
    },
    { name: "address", header: "Address", defaultFlex: 1 },
  ];

  return (
    <ReactDataGrid
      theme="default-dark"
      idProperty="id"
      columns={columns}
      dataSource={loadBufferR[cycle]}
      style={gridStyle}
    />
  );
}

function AddRSTable({ cycle }) {
  const ren1 = (value, rowIndex, name) => <span>{`A${rowIndex + 1}`}</span>;

  const columns = [
    { name: "status", header: "Tag", defaultFlex: 1, render:({ value, rowIndex }) => ren1(value, rowIndex, "status")  },
    { name: "op", header: "op", defaultFlex: 1 },
    { name: "vj", header: "vj", defaultFlex: 1 },
    { name: "vk", header: "vk", defaultFlex: 1 },
    { name: "qj", header: "qj", defaultFlex: 1 },
    { name: "qk", header: "qk", defaultFlex: 1 },
   // { name: "writeResults", header: "Write on CDB", defaultFlex: 1 },
  ];

  return (
    <ReactDataGrid
      theme="default-dark"
      idProperty="id"
      columns={columns}
      dataSource={addRSR[cycle]}
      style={gridStyle}
    />
  );
}

function MulRSTable({ cycle }) {

  const ren1 = (value, rowIndex, name) => <span>{`M${rowIndex + 1}`}</span>;

  const columns = [
    { name: "status", header: "Tag", defaultFlex: 1, render:({ value, rowIndex }) => ren1(value, rowIndex, "status") },
    { name: "op", header: "op", defaultFlex: 1 },
    { name: "vj", header: "vj", defaultFlex: 1 },
    { name: "vk", header: "vk", defaultFlex: 1 },
    { name: "qj", header: "qj", defaultFlex: 1 },
    { name: "qk", header: "qk", defaultFlex: 1 },
    //{ name: "writeResults", header: "Write on CDB", defaultFlex: 1 },
  ];

  return (
    <ReactDataGrid
      theme="default-dark"
      idProperty="id"
      columns={columns}
      dataSource={mulRSR[cycle]}
      style={gridStyle}
    />
  );
}

function FPRTable({ cycle }) {
  const ren1 = (value, rowIndex, name) => <span>{`F${rowIndex}`}</span>;

  const columns = [
    { name: "qi", header: "", defaultFlex: 1, render:({ value, rowIndex }) => ren1(value, rowIndex, "qi") },
    { name: "qi", header: "qi", defaultFlex: 1 },
    { name: "val", header: "val", defaultFlex: 1 },
  ];

  return (
    <ReactDataGrid
      theme="default-dark"
      idProperty="id"
      columns={columns}
      dataSource={FPRR[cycle]}
      style={gridStyle}
    />
  );
}

function MemoryTable({ cycle }) {

  const columns = [
    {
      name: "address",
      header: "Address",
      defaultFlex: 1,
    },
    { name: "value", header: "Value", defaultFlex: 1 },
  ];

  return (
    <ReactDataGrid
      theme="default-dark"
      idProperty="id"
      columns={columns}
      dataSource={memoryR[cycle]}
      style={gridStyle}
    />
  );
}

const Tables = ({
  cycle,
  table,
  handelClick,
  handleChange,
  setCycleZero,
  memory,
  instructions,
  setShow,
}) => {
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);
  const interval = useRef();

  useEffect(() => {
    call(memory, instructions);
    setLoading(false);
    return () => {
      console.log("");
    };
  }, []);

  const handleKeyDown = ({ key }) => {
    if (key === "ArrowRight") {
      console.log("r");
      handleChange(1, max);
    } else if (key === "ArrowLeft") {
      console.log("l");
      handleChange(0, max);
    }
  };

  const animate1 = () => {
    setAnimate(true);
    interval.current = setInterval(() => {
      handleChange(1, max);
    }, 1000);
  };

  const stopAnimation = () => {
    clearInterval(interval.current);
    setAnimate(false);
  };

  const reset = () => {
    setCycleZero();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return !loading ? (
    <div className="w-full">
      {/* NAV */}
      <div className="mt-8">
        <ul className="hidden text-sm font-medium text-center text-t rounded-lg divide-x divide-gray-200 shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
          <li className="w-full">
            <button
              className={`inline-block p-4 w-full rounded-tl-md bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-b dark:hover:bg-a ${
                table == 0 ? "dark:bg-a text-white" : "dark:bg-b"
              }`}
              onClick={() => handelClick(0)}
            >
              Instruction Queue
            </button>
          </li>
          <li className="w-full">
            <button
              className={`inline-block p-4 w-full  bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-b dark:hover:bg-a ${
                table == 1 ? "dark:bg-a text-white" : "dark:bg-b"
              }`}
              onClick={() => handelClick(1)}
            >
              FPR
            </button>
          </li>
          <li className="w-full">
            <button
              className={`inline-block p-4 w-full  bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-b dark:hover:bg-a ${
                table == 2 ? "dark:bg-a text-white" : "dark:bg-b"
              }`}
              onClick={() => handelClick(2)}
            >
              Store Buffer
            </button>
          </li>
          <li className="w-full">
            <button
              className={`inline-block p-4 w-full  bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-b dark:hover:bg-a ${
                table == 3 ? "dark:bg-a text-white" : "dark:bg-b"
              }`}
              onClick={() => handelClick(3)}
            >
              Load Buffer
            </button>
          </li>
          <li className="w-full">
            <button
              className={`inline-block p-4 w-full  bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-b dark:hover:bg-a ${
                table == 4 ? "dark:bg-a text-white" : "dark:bg-b"
              }`}
              onClick={() => handelClick(4)}
            >
              Add RS
            </button>
          </li>
          <li className="w-full">
            <button
              className={`inline-block p-4 w-full  bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-b dark:hover:bg-a ${
                table == 5 ? "dark:bg-a text-white" : "dark:bg-b"
              }`}
              onClick={() => handelClick(5)}
            >
              Mul RS
            </button>
          </li>
          <li className="w-full">
            <button
              className={`inline-block p-4 w-full rounded-tr-md bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-b dark:hover:bg-a ${
                table == 5 ? "dark:bg-a text-white" : "dark:bg-b"
              }`}
              onClick={() => handelClick(6)}
            >
              Memory
            </button>
          </li>
        </ul>
      </div>

      <div>
        {table == 0 ? <InstructionQueueTable cycle={cycle} /> : <></>}
        {table == 1 ? <FPRTable cycle={cycle} /> : <></>}
        {table == 2 ? <StoreBufferTable cycle={cycle} /> : <></>}
        {table == 3 ? <LoadBufferTable cycle={cycle} /> : <></>}
        {table == 4 ? <AddRSTable cycle={cycle} /> : <></>}
        {table == 5 ? <MulRSTable cycle={cycle} /> : <></>}
        {table == 6 ? <MemoryTable cycle={cycle} /> : <></>}

      </div>
      <div className="flex justify-end mt-4">

        <div className="mr-auto text-gray-300 text-xl">{cycle + 1}</div>

        {cycle != 0 ? (
          <button
            onClick={reset}
            className={` flex flex-row items-center px-4 py-2 bg-a rounded-md text-t mr-2 ${
              animate
                ? "cursor-no-drop bg-gray-300 hover:bg-gray-300 hover:text-t"
                : "hover:bg-b hover:text-white "
            }`}
          >
            Reset
          </button>
        ) : (
          <></>
        )}

        {!animate ? (
          <button
            onClick={animate1}
            className={` flex flex-row items-center px-4 py-2 bg-a rounded-md text-t mr-2 hover:bg-b hover:text-white`}
          >
            <BsFillPlayFill className="mr-1" />
            Play
          </button>
        ) : (
          <button
            onClick={stopAnimation}
            className={` flex flex-row items-center px-4 py-2 bg-a rounded-md text-t mr-2 hover:bg-b hover:text-white`}
          >
            <BsFillPauseFill className="mr-1" />
            Stop
          </button>
        )}

        <button
          onClick={() => handleChange(0, max)}
          className={`px-4 py-2 bg-a rounded-md text-t mr-2 ${
            cycle == 0 || animate
              ? "cursor-no-drop bg-gray-300 hover:bg-gray-300 hover:text-t"
              : "hover:bg-b hover:text-white "
          }`}
        >
          Previous cycle
        </button>
        <button
          onClick={() => handleChange(1, max)}
          className={`px-4 py-2 bg-a rounded-md text-t mr-2 ${
            cycle == max - 2 || animate
              ? "cursor-no-drop bg-gray-300 hover:bg-gray-300 hover:text-t"
              : "hover:bg-b hover:text-white "
          }`}
        >
          Next cycle
        </button>
        <button
          onClick={() => handleChange(2, max)}
          className={`px-4 py-2 bg-a rounded-md text-t mr-2 ${
            cycle == max - 2 || animate
              ? "cursor-no-drop bg-gray-300 hover:bg-gray-300 hover:text-t"
              : "hover:bg-b hover:text-white "
          }`}
        >
          Step
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Tables;
