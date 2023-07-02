const sendBtn = document.querySelector('#send-btn')
const chatInput = document.querySelector('textarea')
const chatBox = document.querySelector('.chatbox')
const chatBotToggler = document.querySelector('.chatbot-toggler')
const chatbotCloseBtn = document.querySelector(".close-btn")
const inputInitHeight = chatInput.scrollHeight;
const OPENAI_API_KEY = "YOUR_API_KEY"
let userMessage;

const createChat = (message,className)=>{
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat',className);
    let chatContent = className==='outgoing'?
    `<p></p>`:
    `
    <span class="material-symbols-outlined">smart_toy</span>
    <p></p>
    `
    chatLi.innerHTML = chatContent
    chatLi.querySelector('p').textContent = message;
    return chatLi
}

const generateResponse = async (incomingChatLI)=>{
    const API_URL = "https://api.openai.com/v1/chat/completions"
    const messageEle = incomingChatLI.querySelector("p")

    fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${OPENAI_API_KEY}`
        },
        body:JSON.stringify({
            model:"gpt-3.5-turbo",
            // messages:[
            //       {"role": "system", "content": "You are a helpful assistant."},
            //       {"role": "user", "content": "Who won the world series in 2020?"},
            //       {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
            //       {"role": "user", "content": "Where was it played?"}
            //   ]
            // "messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "Hello!"}]
            "messages": [{"role": "user", "content": userMessage}]  
        })
    }).then(res=>res.json()).then(data=>{
        console.log(data)
        messageEle.textContent = data.choices[0].message.content
    }).catch((error)=>{
        messageEle.classList.add("error");
        messageEle.textContent = "Oops!😓 Something went wrong please try again later."
    }).finally(()=>chatBox.scrollTo(0,chatBox.scrollHeight));
    
}

const handleChat = ()=>{
    userMessage = chatInput.value.trim()
    if(!userMessage) return;
    chatInput.value=''
    chatInput.style.height = `${inputInitHeight}px`
    chatBox.appendChild(createChat(userMessage,"outgoing"));
    chatBox.scrollTo(0,chatBox.scrollHeight)
    setTimeout(()=>{
        const incomingChatLI = createChat("Thinking🤔...","incoming")
        chatBox.appendChild(incomingChatLI);
        chatBox.scrollTo(0,chatBox.scrollHeight)
        generateResponse(incomingChatLI);
    },600)
    
}

chatInput.addEventListener("input",()=>{    
    chatInput.style.height = `${inputInitHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})
chatInput.addEventListener("keydown",(e)=>{
    if(e.key==='Enter' && !e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        handleChat();
    }
})

chatBotToggler.addEventListener('click',()=>document.body.classList.toggle('show-chatbot'))
chatbotCloseBtn.addEventListener('click',()=>document.body.classList.remove('show-chatbot'))
sendBtn.addEventListener('click',handleChat);
