import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';


function Home() {
    const [interedNumber, setInteredNumber] = useState("");
    const [stacknumber, setStacknumber] = useState([]);
    const [Data, setData] = useState([]);

    useEffect(()=>{
         if(Data.length == 0){
            getDatafromserver()
        }
    },[]);

  console.log("data", Data);

  //   this function for get data from backend to show all status of seats -------------
   const getDatafromserver =  async ()=>{      
       await axios.get("http://localhost:5000/seats").then((res)=>{
             console.log("rrrres", res.data);
             setData(res.data);
       }).catch((err)=>{
          console.log("err", err);
       }) 
   }

    //    this function for update the booked seats on server side  -----------
   const updateToserver = async (stack, type)=>{
          const payload = {
              "number" : stack,
              "booked_status" : type
          }   
          await axios.patch("http://localhost:5000/seats", payload ).then((res)=>{
              console.log( "updated",res);
                 
          }).catch((err)=>{
             console.log("err", err);
          })
   }

  //   this function get available seats and  call the function for update the booking seats-------
     const bookTicket = (number_of_booking) =>{

          if( number_of_booking <=0 || number_of_booking > 7){
            alert("Please enter valide number");
            return 
          }
        
         var stack = [];
         var start = 0;
         var end = 7;

         for(var k =0; k<11; k++){
             if(k!= 0){
               start = end;
               end = end + 7;
             }
               
                for(var i= start; i< end; i++){
                    if(Data[i]?.booked_status == false ){
                        stack.push(i+1)
                    }
                }
                if(stack.length >= number_of_booking){
                     let N =  (stack.length - number_of_booking) ;
                     for(var j= 0; j< N; j++){
                         stack.pop();
                     }
                   
                    updateToserver(stack, true).then(()=>getDatafromserver()) 
                    setStacknumber(stack);
                    return    
                }else{
                     while(stack.length != 0){
                         stack.pop();
                     }
                }        
         } 

       
        var unbooked = Data.filter((e)=>e.booked_status == false);

          if(unbooked.length == 0){
            alert("No seat avilable");
            return
          }
          if(unbooked.length < number_of_booking){
             alert("Please enter number equal or less than seat available.");
             return
          }
      
         var diff = unbooked[number_of_booking -1].number - unbooked[0].number ;
         var min =  diff ;
         var start = 0;
         var end = number_of_booking - 1;

         for(var i= number_of_booking ; i< unbooked.length; i++){
            var diff = unbooked[i].number - unbooked[i - number_of_booking +1].number ;
             if(diff < min){
                min = diff;
                start = i - number_of_booking +1 ;
                end = i;
             }
         }

         for(var i= start ; i<= end; i++){
              stack.push(unbooked[i].number)
         }

      updateToserver(stack, true).then(()=>getDatafromserver()) 
      setStacknumber(stack);
       return

     }

      //   this function for reset all booked seats --------------
     const resetbookedseat = ()=>{
         var stack = [];
         for(var i=0; i< 80; i++){
             stack.push(i+1);
         }
    updateToserver(stack, false).then(()=>getDatafromserver()) 
    setStacknumber([]);
     } 

  return (
    <div>
     <h2>Seat Reservation</h2>

     <div style={{display : 'flex', justifyContent : 'space-around'}} >
          {/*-------------- here all seat number vailable -----------  */}
        <div style={{ width : "450px", height : "500px", overflow: "auto", padding : "15px", display : 'flex', justifyContent : "space-evenly" , flexWrap :"wrap" }} >
          {
            Data.length > 0 && Data.map((e)=>
            <div key={e.number} style={{width : "50px", height :"50px", backgroundColor : `${e.booked_status ? "red" : "green"}`, color : "white", lineHeight : "50px", margin :"5px"  }} >{e?.number}</div>
            )
             
          }
        </div>
          
           {/* ------ Here all all button, booked seats and other details vailable ---------  */}
          <div style={{ width : "45%", height:"80vh"  }} >
            
            <div style={{backgroundColor : "whitesmoke" }} >  
              <div style={{display :"flex", justifyContent :"flex-start", marginBottom :"-15px"}} >
              <p style={{ width : "20px", height :"20px", marginRight : "10px", borderRadius : "50px", backgroundColor : "red"}} ></p> 
              <p>Booked Seats</p>
              </div>

              <div style={{display :"flex", justifyContent :"flex-start"}}  >
              <p style={{ width : "20px", height :"20px", marginRight :"10px", borderRadius : "50px", backgroundColor : "green"}} ></p>
              <p>Available Seats</p> 
              </div>

              <div style={{display :"flex", justifyContent :"flex-start" , backgroundColor : "wheat"}}    >
                 <p style={{marginRight :"5px"}} >Current Seats Booked :</p>
                 <p style={{fontWeight :"bold"}} > 
                   {
                     stacknumber.length > 0 ? `${ stacknumber.map((e)=> e ) }` :""
                   }
                  </p>
              </div>
             
              <div style={{display :"flex", justifyContent :"flex-start" }}    >
              <p style={{textAlign : "left", marginRight :"5px"}} >Number of seats available:</p>
              <p style={{textAlign :"left", fontWeight :"bold" }} >{ Data.filter((e)=> e.booked_status == false).length } </p>
              </div>

              <div style={{display :"flex", justifyContent :"flex-start" , flexWrap :"wrap", }} >      
                <input  value={interedNumber}  onChange={(e)=>setInteredNumber(e.target.value)} style={{width : "250px", height:"25px"}} type='number' placeholder='Enter number of seats' /> 
                <button  onClick={()=>{ bookTicket(Number(interedNumber)); setInteredNumber("") }} style={{ width :"250px", height :"30px", marginLeft :"10px", cursor :"pointer", backgroundColor : "green"}} >Reserve Seats</button>
                <button onClick={()=>{ resetbookedseat(); setInteredNumber("")   }} style={{ width :"260px", height :"30px", marginTop :"10px", cursor :"pointer", backgroundColor : "blue"}} >Reset All Seats</button>
              </div>
            </div> 

          </div>

           {/*  ---------- end here ------------- */}

      </div>

    </div>
  )
}

export default Home