const fs = require('fs');
const {PriorityQueue} = require('./PriorityQueue')
const prompt = require("prompt-sync")({ sigint: true });

const addLatency = 2
const subLatency = 2
const mulLatency = 10
const divLatency = 40
const loadLatency = 2
const storeLatency =2
const addRSize = 3
const mulRSize = 2
const storeBufferSize = 5
const loadBufferSize = 3
const memorySize = 1024
const instructionQueue = fs.readFileSync("a.txt" ,'utf8').split('\n').map((i)=> {
    let s = i.trim().split(' ')
    let op = s[0]
    let reg = s[1].split(',').map((s)=>{
        return s.trim()})

    if(op === "L.D" || op === "S.D" || op === "LW" || op === "SW"){
        return{
            op:op,
            R1: reg[0],
            address: reg[1] ,
            issue : null,  
            executionComplete : {i:null,j:null},
            writeResults : null,

        }
    }
    return{
        op:op,
        destination: reg[0],
        source1: reg[1],
        source2: reg[2],
        issue : null,  
        executionComplete : {i:null,j:null},
        writeResults : null,
    }  
})

const storeBuffer = new Array((storeBufferSize)).fill(0)
const loadBuffer = new Array((loadBufferSize)).fill(0)
const addRS = new Array((addRSize)).fill(0)
const mulRS = new Array((mulRSize)).fill(0)
const GPR = new Array(32).fill({qi: 0, val: 0})
const FPR = new Array(32).fill({qi: 0, val: 0})
const memory = new Array(memorySize).fill(0)
var waitingsToWrite = new PriorityQueue();
let pc =0
let clk=1
let finisedItems = 0
let isIssued = false;
let noOfWaiting = new Map();
function RSentry( op, vj, vk, qj, qk,latency,instQueueIdx){
    return {
     op : op,
     vj : vj,
     vk : vk,
     qj : qj,
     qk: qk,
     latency: latency,
     status : "ready",
     instQueueIdx:instQueueIdx
    }
}

function loadEntry(address,latency,instQueueIdx){
    return {
     address : address,
     latency : latency,
     instQueueIdx:instQueueIdx
    }
}

function storeEntry(v, q, address,latency,instQueueIdx){
    return {
        v : v,
        q : q,
        address : address,
        latency : latency,
        instQueueIdx:instQueueIdx
    }
}

function registerEntry(qi, val){
    return {
        qi : qi,
       val : val,
    }
}

function isEmpty(array){
    
    for (let i =0; i< array.length; i++) {
       if(array[i] === 0)
            return i
    }

    return -1;
}

function checkRF(array, index){
   
    if(array[index].qi === 0)
        return {flag: true ,val : array[index].val}
    else{
        return {flag: false ,qi : array[index].qi}
    }
     
}

function issue(index){

    let inst = instructionQueue[index]
    let pos

    switch(inst.op){
        case "ADD.D":
        case "SUB.D":
            pos = isEmpty(addRS)
            if(pos === -1){
                return
            }
            inst.issue = clk
            let first = checkRF(FPR, inst.source1.slice(1))
            let sec = checkRF(FPR, inst.source2.slice(1))
            isIssued = true;
            addRS[pos] = RSentry(inst.op, first.flag ? first.val : null, sec.flag ? sec.val : null, !first.flag ? first.qi : null, !sec.flag ? sec.qi : null,addLatency,index)
            FPR[parseInt(inst.destination.slice(1))] = {qi :"A" + (pos+1), val: FPR[parseInt(inst.destination.slice(1))].val }
            if (!first.flag){
                  key = first.qi    
                  noOfWaiting.set(key, noOfWaiting.has(key) ? noOfWaiting.get(key) + 1 : 1)
            }
            if (!sec.flag){
                key = sec.qi
                noOfWaiting.set(key, noOfWaiting.has(key) ? noOfWaiting.get(key) + 1 : 1)
            }
   
            break    
        case "MUL.D":
        case "DIV.D":
            pos = isEmpty(mulRS)
            if(pos === -1){
                return
            }
            isIssued = true;
            let first1 = checkRF(FPR, inst.source1.slice(1))
            let sec1 = checkRF(FPR, inst.source2.slice(1))
            mulRS[pos] = RSentry(inst.op, first1.flag ? first1.val : null, sec1.flag ? sec1.val : null, !first1.flag ? first1.qi : null, !sec1.flag ? sec1.qi : null,mulLatency,index)
            FPR[parseInt(inst.destination.slice(1))] =  {qi :"M" + (pos+1), val: FPR[parseInt(inst.destination.slice(1))].val }      
            if (!first.flag){
                key = first.qi    
                noOfWaiting.set(key, noOfWaiting.has(key) ? noOfWaiting.get(key) + 1 : 1)
          }
          if (!sec.flag){
              key = sec.qi
              noOfWaiting.set(key, noOfWaiting.has(key) ? noOfWaiting.get(key) + 1 : 1)
          }      
            break    

        case "L.D":
            pos = isEmpty(loadBuffer)
            if(pos === -1){
                return
            }
            isIssued = true;
            loadBuffer[pos] = loadEntry(inst.address,loadLatency,index)
            FPR[parseInt(inst.R1.slice(1))] =  {qi :"L" + (pos+1), val: FPR[parseInt(inst.destination.slice(1))].val } 
            break

        case "S.D":
            pos = isEmpty(storeBuffer)
            if(pos === -1){
                return
            }
            isIssued = true;
            let store = checkRF(FPR, inst.R1.slice(1))  
            storeBuffer[pos] = storeEntry(store.flag ? store.val : null, !store.flag ? store.qi : null ,inst.address,storeLatency,index)
            FPR[parseInt(inst.R1.slice(1))] =  {qi :"S" + (pos+1), val: FPR[parseInt(inst.destination.slice(1))].val } 
            if (!store.flag){
                key = store.qi
                noOfWaiting.set(key, noOfWaiting.has(key) ? noOfWaiting.get(key) + 1 : 1)
            }
            break;
    }
}
function execute(){
    for(let i =0; i< addRS.length; i++){
        if (addRS[i].status === "ready"){
            addRS[i].status = "executing"
        }
        else if(addRS[i].status === "executing" && addRS[i].qj === null && addRS[i].qk === null){
            if (addRS[i].latency==addLatency)instructionQueue[addRS[i].instQueueIdx].executionComplete.i=clk
            addRS[i].latency--;
            if(addRS[i].latency === 0){
                instructionQueue[addRS[i].instQueueIdx].executionComplete.j=clk
                addRS[i].status = "executed"
            }
        }
        else if (addRS[i].status === "executed"){
            let priority = noOfWaiting.has("A" + (i+1)) ? noOfWaiting.get("A" + (i+1)) : 0
            waitingsToWrite.enqueue({instQueueIdx: addRS[i].instQueueIdx, val:addRS[i].vj+addRS[i].vk,qi: "A" + (i+1)},priority)
            addRS[i].status = "writing"
        }
    }
    for(let i =0; i< mulRS.length; i++){
        if (mulRS[i].status === "ready"){
            mulRS[i].status = "executing"
        }
        else if(mulRS[i].status === "executing" && mulRS[i].qj === null && mulRS[i].qk === null){
            if (mulRS[i].latency==mulLatency)instructionQueue[mulRS[i].instQueueIdx].executionComplete.i=clk
            mulRS[i].latency--;
            if(mulRS[i].latency === 0){
                 //finished executing
                instructionQueue[mulRS[i].instQueueIdx].executionComplete.j=clk
                mulRS[i].status = "executed"
            }
        }
        else if (mulRS[i].status === "executed"){
            let priority = noOfWaiting.has("M" + (i+1)) ? noOfWaiting.get("M" + (i+1)) : 0
            waitingsToWrite.enqueue({instQueueIdx: mulRS[i].instQueueIdx, val:mulRS[i].vj*mulRS[i].vk,qi: "M" + (i+1)},priority)
            mulRS[i] .status = "writing"
        }
    }
    for(let i =0; i< loadBuffer.length; i++){
        if (loadBuffer[i].status === "ready"){
            loadBuffer[i].status = "executing"
        }
        else if(loadBuffer[i].status === "executing"){
            if (loadBuffer[i].latency==loadLatency)instructionQueue[loadBuffer[i].instQueueIdx].executionComplete.i=clk
            loadBuffer[i].latency--;
            if(loadBuffer[i].latency === 0){
               //finished executing
                instructionQueue[loadBuffer[i].instQueueIdx].executionComplete.j=clk
                loadBuffer[i].status = "executed"
            } 
        }
        else if (loadBuffer[i].status === "executed"){
            let priority = noOfWaiting.has("L" + (i+1)) ? noOfWaiting.get("L" + (i+1)) : 0
            waitingsToWrite.enqueue({instQueueIdx: loadBuffer[i].instQueueIdx, val: memory[loadBuffer[i].address],qi: "L" + (i+1)},priority)
            loadBuffer[i].status = "writing"
        }
    }
    for(let i =0; i< storeBuffer.length; i++){
        if (storeBuffer[i].status === "ready"){
            storeBuffer[i].status = "executing"
        }
        else if(storeBuffer[i].status === "executing" && storeBuffer[i].q === null){
            if(storeBuffer[i].latency==storeLatency)instructionQueue[storeBuffer[i].instQueueIdx].executionComplete.i=clk
            storeBuffer[i].latency--;
            if(storeBuffer[i].latency === 0){
                memory[storeBuffer[i].address] = storeBuffer[i].v
                instructionQueue[storeBuffer[i].instQueueIdx].executionComplete.j=clk
                storeBuffer[i].status = "executed"
            }
        }
    }
}
function WriteBack(){
  if (waitingsToWrite.isEmpty()){
      return
  }
    finisedItems++
    let inst = waitingsToWrite.dequeue().element
    instructionQueue[inst.instQueueIdx].writeResults=clk
    noOfWaiting.set(inst.qi,0)
   
    for(let i =0; i< addRS.length; i++){
        if (addRS[i].qj === inst.qi){
            addRS[i].vj = inst.val
            addRS[i].qj = null
        }
        if (addRS[i].qk === inst.qi){
            addRS[i].vk = inst.val
            addRS[i].qk = null
        }
    }
    for(let i =0; i< mulRS.length; i++){
        if (mulRS[i].qj === inst.qi){
            mulRS[i].vj = inst.val
            mulRS[i].qj = null
        }
        if (mulRS[i].qk === inst.qi){
            mulRS[i].vk = inst.val
            mulRS[i].qk = null
        }
    }
    for(let i =0; i< storeBuffer.length; i++){
        if (storeBuffer[i].q === inst.qi){
            storeBuffer[i].v = inst.val
            storeBuffer[i].q = null
        }
    }
    let letter = inst.qi[0]
    switch(letter){
        case "A": addRS[parseInt(inst.qi.slice(1))-1]=0;break;
        case "M": mulRS[parseInt(inst.qi.slice(1))-1]=0;break;
        case "L": loadBuffer[parseInt(inst.qi.slice(1))-1]=0;break;
        default: break;
      
    }
}
while (finisedItems < instructionQueue.length) {
    if (pc < instructionQueue.length){
        issue(pc)
        if (isIssued){
        pc++
        isIssued = false;
        }
    }
    execute()
    WriteBack()
    console.log(`----------------------------------------------------------clockCycle${clk}----------------------------------------------------------`)
    console.log(instructionQueue)
    clk++;
}