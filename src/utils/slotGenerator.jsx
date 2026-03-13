export const generateSlots = (startTime,endTime,duration)=>{

let slots=[]
let current = new Date(`1970-01-01T${startTime}`)

let end = new Date(`1970-01-01T${endTime}`)

while(current < end){

slots.push(current.toTimeString().slice(0,5))

current.setMinutes(current.getMinutes()+duration)

}

return slots

}