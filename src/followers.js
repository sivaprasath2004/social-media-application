import React,{useEffect,useState} from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import './followers.css'
const Followers=({onUpdate})=>{
    const [followings,setFollowings]=useState([])
    const [followers,setFollowers]=useState([])
    const [checker,setChecker]=useState({Alert:false,user:null,remove:false,letter:null,navigate:true,followers_check:true,following_check:true})
    let Id=onUpdate.id
    let name=onUpdate.name
    async function fetch(){
       let res=await axios.post('http://localhost:5000/followings',{
        id:Id,
        section:"follow"
       })
       let arr=res.data.followings
       setFollowings([res.data.followings])
       let followers_arr=res.data.followers
       setFollowers([res.data.followers])
       setChecker(pre=>({...pre,followers_check:typeof(followers_arr)==='string',following_check:typeof(arr)==='string'}))
    }
    useEffect(()=>{
        fetch()
    },[])
    let socket=io('http://localhost:5000')
    socket.emit('join',{me:Id,name:name})
    socket.on('follower',msg=>{
        if(msg){
        fetch()
        }
      })
    function handle_unfollow(id){
      if(checker.letter==='Unfollow'){
      let fil=followings[0].filter(item=>item._id!==id)
      let arr=[fil,'one']
      setFollowings(arr)
      }else{
     let fil=followers[0].filter(item=>item._id!==id)
      let arr=[fil,'one']
      setFollowers(arr)
      }
      socket.emit('unfollow',{me:Id,you:id,name:name,text:checker.letter},msg=>{
        if(msg){
            console.log(msg)
        }
      })
      setChecker(pre=>({...pre,Alert:false,user:null,remove:false,letter:null}))
    }
    function unfollow(id,condition){
        let fin
        let letter
        if(condition==="following"){
        fin=followings[0].find(item=>item._id===id)
        letter='Unfollow'
        }
        else{
        fin=followers[0].find(item=>item._id===id)
        letter='Remove'
        }
        setChecker(pre=>({...pre,Alert:true,user:fin,letter:letter}))
    }
    console.log(followers)
    function UserSelected(item,index,condition){
        return (
            <div key={`parent_tag${index}`} id='User_Profile'>
                    <div key={`User_Details_${index}`} id='User_Details' >
                      <div key={`logo_${index}`} id='User_Logo'>
                      <h1>{item?.name?.[0]}</h1>
                      </div>
                      <div key={`name${index}`} id='USER_NAME'>
                      <h1>{item?.name?.length>25?item.name.slice(0,25)+'..':item.name}</h1>
                      <p style={{fontSize:'0.9rem',fontWeight:600}}>{item.Des}</p>
                    </div>
                    </div>
                   <button id={condition==="following"?'following_butt':'followed_butt'} onClick={()=>unfollow(item._id,condition)}>
                      {condition==="following"?"Unfollow":"Remove"}
                   </button>
                   </div>   
        )
    }
    return (
        <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',overflow:checker.Alert?'hidden':''}}>
            <div id='navigator'>
            <h1 id='color' className={checker.navigate?'hovered':""} onClick={()=>setChecker(pre=>({...pre,navigate:true}))}>{`${!checker.following_check?followings[0]?.length:0} Followings`}</h1>
            <h1 id='color'  className={!checker.navigate?'hovered':""} onClick={()=>setChecker(pre=>({...pre,navigate:false}))}  >{`${!checker.followers_check?followers[0]?.length:0} Followers`}</h1>
            </div>
            {checker.Alert?
            <div id='Alert' >
                 <div id='parent_tag_remove'>
                    <div id='User_Logo'>
                        <h1>{checker.user.name[0]}</h1>
                    </div>
                    <h2>{checker.user.name}</h2>
                    <h3>Are you sure do you want to unfollow</h3>
                    <button id='remove' onClick={()=>handle_unfollow(checker.user._id)}>{checker.letter}</button>
                    <button id='cancel' onClick={()=>setChecker(pre=>({...pre,Alert:false}))}>cancel</button>
                 </div>
            </div>
            :<></>}
            {   checker.navigate?
                !checker.following_check && followings[0]?.length>0?
                followings[0]?.map((item,index)=>(
                    UserSelected(item,index,'following')
                )):<h1 id='nomore_foll'>No more followings</h1>
                :
                !checker.followers_check && followers[0]?.length>0?
                followers[0]?.map((item,index)=>(
                    UserSelected(item,index,'follower')
                )):
                 <h1 id='nomore_foll'>No more followers</h1>
            }
        </div>
    )
}
export default Followers