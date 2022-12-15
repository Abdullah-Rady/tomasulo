const fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });

// const add = prompt("add latency: ")
// const sub = prompt("sub latency: ")
// const mul = prompt("mul latency: ")
// const div = prompt("div latency: ")
// const load = prompt("load latency: ")
// const store = prompt("store latency: ")
const addRSize = parseInt(prompt("add RS: "))
const mulRSize = parseInt(prompt("mul RS: "))
const storeBufferSize = parseInt(prompt("storeBufferSize: "))
const loadBufferSize = parseInt(prompt("loadBufferSize: "))
const instructionQueue = fs.readFileSync("a.txt" ,'utf8').split('\n').map((i)=> {
    let s = i.trim().split(' ')
    let op = s[0]
    let reg = s[1].split(',').map((s)=>{
        return s.trim()})

    if(op === "L.D" || op === "S.D" || op === "LD" || op === "SW"){
        return{
            op:op,
            R1: reg[0],
            address: reg[1]   
        }
    }
    return{
        op:op,
        destination: reg[0],
        source1: reg[1],
        source2: reg[2],
    }  
})

const storeBuffer = new Array((storeBufferSize)).fill(0)
const loadBuffer = new Array((loadBufferSize)).fill(0)
const addRS = new Array((addRSize)).fill(0)
const mulRS = new Array((mulRSize)).fill(0)
const GPR = new Array(32).fill({qi: 0, val: 0})
const FPR = new Array(32).fill({qi: 0, val: 0})
let bus = {}

function RSentry( op, vj, vk, qj, qk){
    return {
     op : op,
     vj : vj,
     vk : vk,
     qj : qj,
     qk: qk
    }
}

function loadEntry(address){
    return {
     address : address
    }
}

function storeEntry(v, q, address){
    return {
        v : v,
        q : q,
        address : address
    }
}

function registerEntry(qi, val){
    return {
        qi : qi,
       val : val
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
    else
        return {flag: false ,qi : array[index].qi}
     
}

function issue(index){

    let inst = instructionQueue[index]
    console.log(inst);
    let pos

    switch(inst.op){
        case "ADD.D":
        case "SUB.D":
            pos = isEmpty(addRS)
            if(pos === -1){
                return
            }
            
            let first = checkRF(FPR, inst.source1.slice(1))
            let sec = checkRF(FPR, inst.source2.slice(1))

            
            addRS[pos] = RSentry(inst.op, first.flag ? first.val : null, sec.flag ? sec.val : null, !first.flag ? first.qi : null, !sec.flag ? sec.qi : null)
            FPR[parseInt(inst.destination.slice(1))] = {qi :"A" + (pos+1), val: FPR[parseInt(inst.destination.slice(1))].val } 

            break    
        case "MUL.D":
        case "DIV.D":
            pos = isEmpty(mulRS)
            if(pos === -1){
                return
            }
            
            let first1 = checkRF(FPR, inst.source1.slice(1))
            let sec1 = checkRF(FPR, inst.source2.slice(1))
            mulRS[pos] = RSentry(inst.op, first1.flag ? first1.val : null, sec1.flag ? sec1.val : null, !first1.flag ? first1.qi : null, !sec1.flag ? sec1.qi : null)
            FPR[parseInt(inst.destination.slice(1))] =  {qi :"M" + (pos+1), val: FPR[parseInt(inst.destination.slice(1))].val } 
 
            
            break    

        case "L.D":
            pos = isEmpty(loadBuffer)
            if(pos === -1){
                return
            }
            loadBuffer[pos] = loadEntry(inst.address)
            FPR[parseInt(inst.R1.slice(1))] =  {qi :"L" + (pos+1), val: FPR[parseInt(inst.destination.slice(1))].val } 
            break

        case "S.D":
            pos = isEmpty(storeBuffer)
            if(pos === -1){
                return
            }

            let store = checkRF(FPR, inst.R1.slice(1))
            
            storeBuffer[pos] = storeEntry(store.flag ? store.val : null, !store.flag ? store.qi : null ,inst.address)
            FPR[parseInt(inst.R1.slice(1))] =  {qi :"S" + (pos+1), val: FPR[parseInt(inst.destination.slice(1))].val } 

            break;
    }
}

issue(0)
console.log(FPR);
console.log(addRS);
