class QElement {
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }
}
 
// PriorityQueue class
export default class PriorityQueue {
 
    // An array is used to implement priority
    constructor()
    {
        this.items = [];
    }
    enqueue(element, priority)
    {
        var qElement = new QElement(element, priority);
        var contain = false;
        //console.log("beforree",this.items)
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority.i <= qElement.priority.i) {
                if (this.items[i].priority.i == qElement.priority.i) {
                   while((i<this.items.length)&&(this.items[i].priority.j < qElement.priority.j) && (this.items[i].priority.i == qElement.priority.i)){
                       i++;
                   }
                     this.items.splice(i, 0, qElement);
                     contain = true;
                     break;
                }
                else{
                    this.items.splice(i, 0, qElement);
                    contain = true;
                    break;
                }
            }
        }
        if (!contain) {
            this.items.push(qElement);
        }
        //console.log("after",this.items)
    }
    dequeue()
{
   
    if (this.isEmpty())
        return "Underflow";
    return this.items.shift();
}
front()
{
    if (this.isEmpty())
        return "No elements in Queue";
    return this.items[0];
}

rear()
{
   
    if (this.isEmpty())
        return "No elements in Queue";
    return this.items[this.items.length - 1];
}
isEmpty()
{
    // return true if the queue is empty.
    return this.items.length == 0;
}
printPQueue()
{
    var str = "";
    for (var i = 0; i < this.items.length; i++) 
        str += this.items[i].element + " ";
    return str;
}
}