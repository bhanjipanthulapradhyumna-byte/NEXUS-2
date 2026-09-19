const $ = s => document.querySelector(s);
const splash=$("#splash"), app=$("#app"), loginBtn=$("#loginBtn"), profileBtn=$("#profileBtn"), privacyBtn=$("#privacyBtn");
const menuBtn=$("#menuBtn"), side=$("#sidePanel"), scrim=$("#scrim"), modalRoot=$("#modalRoot");
const heroTitle=$("#heroTitle"), privacyLabel=$("#privacyLabel"), chatInput=$("#chatInput"), composer=$("#composer");
const imageInput=$("#imageInput"), attachment=$("#attachmentPreview");
let user = JSON.parse(localStorage.getItem("nexus_user") || "null");
let privacy = false, current="chat", selectedImage=null;

setTimeout(()=>{splash.style.animation="exit .45s ease forwards";setTimeout(()=>{splash.remove();app.classList.remove("hidden")},430)},1800);
syncAuth();

function syncAuth(){
  const logged=!!user;
  loginBtn.classList.toggle("hidden",logged);
  profileBtn.classList.toggle("hidden",!logged);
  privacyBtn.classList.toggle("hidden",!logged);
}
function openMenu(){side.classList.add("open");scrim.classList.add("show");side.setAttribute("aria-hidden","false")}
function closeMenu(){side.classList.remove("open");scrim.classList.remove("show");side.setAttribute("aria-hidden","true")}
menuBtn.onclick=openMenu;$("#closeMenu").onclick=closeMenu;scrim.onclick=closeMenu;
$("#brand").onclick=()=>showChat("WELCOME TO NEXUS");

function modal(html){modalRoot.innerHTML=`<div class="modal-back" id="modalBack"><div class="modal">${html}</div></div>`;$("#modalBack").onclick=e=>{if(e.target.id==="modalBack")closeModal()}}
function closeModal(){modalRoot.innerHTML=""}
function login(){
 modal(`<h2>Sign in to NEXUS</h2><p>Choose a secure authentication method.</p>
 <button class="field" id="googleChoice">Continue with Google</button>
 <button class="field" id="emailChoice">Continue with Email</button>`);
 $("#googleChoice").onclick=googleAccounts;$("#emailChoice").onclick=emailStep;
}
loginBtn.onclick=login;

function googleAccounts(){
 modal(`<h2>Choose a Google account</h2><div class="account" data-email="user@example.com"><span class="avatar">G</span><span>Google account</span></div>
 <button class="field" id="addAccount">＋ Add another account</button>
 <div class="modal-actions"><button id="cancelLogin">Cancel</button></div>`);
 document.querySelectorAll(".account").forEach(x=>x.onclick=()=>consent(x.dataset.email));
 $("#addAccount").onclick=()=>{closeModal();alert("The real Google account chooser will appear when Google OAuth is configured.");};
 $("#cancelLogin").onclick=closeModal;
}
function consent(email){
 modal(`<h2>Google consent</h2><p>NEXUS requests the basic account information needed to create or access your NEXUS account. Review the application's Terms and Conditions and Privacy Information before continuing.</p>
 <div class="modal-actions"><button id="cancelLogin">Cancel</button><button class="primary" id="continueLogin">Continue</button></div>`);
 $("#cancelLogin").onclick=googleAccounts;$("#continueLogin").onclick=()=>finishLogin("Google",email);
}
function emailStep(){
 modal(`<h2>Enter your email</h2><input id="emailField" class="field" type="email" autocomplete="email" placeholder="you@example.com">
 <div class="modal-actions"><button id="cancelLogin">Cancel</button><button class="primary" id="continueEmail">Continue</button></div>`);
 $("#cancelLogin").onclick=closeModal;$("#continueEmail").onclick=()=>{const e=$("#emailField").value.trim();if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(e))return alert("Enter a valid email.");passwordStep(e)};
}
function passwordStep(email){
 modal(`<h2>Enter your password</h2><input id="passField" class="field" type="password" autocomplete="current-password" placeholder="Password">
 <p>By continuing, you agree to the applicable NEXUS Terms and Conditions and Privacy Information.</p>
 <div class="modal-actions"><button id="cancelLogin">Cancel</button><button class="primary" id="finishEmail">Continue</button></div>`);
 $("#cancelLogin").onclick=emailStep;$("#finishEmail").onclick=()=>{if($("#passField").value.length<1)return alert("Enter your password.");finishLogin("Email",email)};
}
function finishLogin(method,email){user={method,email};localStorage.setItem("nexus_user",JSON.stringify(user));closeModal();syncAuth()}
profileBtn.onclick=()=>modal(`<h2>Profile</h2><div class="profile-card"><div class="line"><small>Login type</small><br>${escapeHtml(user.method)}</div><div class="line"><small>Email</small><br>${escapeHtml(user.email)}</div></div><button class="logout" id="logout">↪ Logout</button>`);
document.addEventListener("click",e=>{if(e.target.id==="logout"){user=null;localStorage.removeItem("nexus_user");privacy=false;syncAuth();closeModal();showChat("WELCOME TO NEXUS")}});
privacyBtn.onclick=()=>{privacy=!privacy;privacyLabel.classList.toggle("hidden",!privacy);heroTitle.textContent=privacy?"PRIVACY MODE":"WELCOME TO NEXUS"};

document.querySelectorAll("[data-route]").forEach(b=>b.onclick=()=>route(b.dataset.route));
function route(r){closeMenu();if(r==="settings"){current="settings";$("#chatView").classList.add("hidden");$("#settingsView").classList.remove("hidden");$("#helpView").classList.add("hidden");return}if(r==="help"){current="help";$("#chatView").classList.add("hidden");$("#settingsView").classList.add("hidden");$("#helpView").classList.remove("hidden");return}
 const titles={new:"Start a research",research:"Start a research",finance:"Start a trade",problem:"Start a chat to clarify your doubt",coding:"Start a code",analysis:"Start to analyse"};showChat(titles[r]||"WELCOME TO NEXUS")}
function showChat(title){current="chat";$("#settingsView").classList.add("hidden");$("#helpView").classList.add("hidden");$("#chatView").classList.remove("hidden");heroTitle.textContent=title}
document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>showChat("WELCOME TO NEXUS"));

$("#galleryBtn").onclick=()=>imageInput.click();
imageInput.onchange=()=>{const f=imageInput.files[0];if(!f)return;if(!f.type.startsWith("image/")){alert("Only image files are allowed.");imageInput.value="";return}selectedImage=f;attachment.textContent=`Image attached: ${f.name}`;attachment.classList.remove("hidden")};
$("#micBtn").onclick=()=>{
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR)return alert("Voice input is not supported by this browser.");
 const r=new SR();r.lang=navigator.language||"en-US";r.interimResults=false;r.onresult=e=>{chatInput.value+=(chatInput.value?" ":"")+e.results[0][0].transcript;chatInput.dispatchEvent(new Event("input"))};r.onerror=()=>alert("Microphone input could not be started.");r.start()
};
chatInput.addEventListener("input",()=>{chatInput.style.height="auto";chatInput.style.height=Math.min(chatInput.scrollHeight,150)+"px"});
composer.onsubmit=async e=>{e.preventDefault();const message=chatInput.value.trim();if(!message&&!selectedImage)return;
 addBubble(message||"Image attached","user");chatInput.value="";chatInput.style.height="auto";
 const typing=addBubble("NEXUS is thinking…","bot");
 try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message,hasImage:!!selectedImage})});const data=await res.json();typing.textContent=data.reply||data.error||"No response.";if(data.error)typing.classList.add("error")}catch{typing.textContent="The NEXUS backend is not connected to an AI provider yet."}
 selectedImage=null;imageInput.value="";attachment.classList.add("hidden");
};
function addBubble(text,type){const el=document.createElement("div");el.className=`bubble ${type}`;el.textContent=text;$("#chatMessages").appendChild(el);$("#chatMessages").scrollTop=99999;return el}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

document.querySelectorAll("[data-setting]").forEach(b=>b.onclick=()=>settingModal(b.dataset.setting));
function settingModal(kind){
 const content={
 personalize:`<h2>Personalize</h2><label>Accent color</label><input id="accent" class="field" type="color" value="#7b2cff"><label>Font family</label><select id="font" class="field"><option>Inter</option><option>Arial</option><option>Georgia</option><option>monospace</option></select><label>Font size</label><input id="size" class="field" type="range" min="14" max="20" value="16"><div class="modal-actions"><button id="cancelSet">Cancel</button><button class="primary" id="saveSet">Save</button></div>`,
 appearance:`<h2>Appearance</h2><select id="appearance" class="field"><option>Dark</option><option>Light</option><option>System</option></select><div class="modal-actions"><button id="cancelSet">Cancel</button><button class="primary" id="saveSet">Save</button></div>`,
 general:`<h2>General</h2><p>Chat preferences, notifications, language and privacy-related preferences are ready for connection to your account settings.</p><div class="modal-actions"><button id="cancelSet">Close</button></div>`,
 about:`<h2>About</h2><p>NEXUS version 1.0.0<br><br>Terms and Privacy Information are application-level documents that should be published before production launch.</p><div class="modal-actions"><button id="cancelSet">Close</button></div>`
 }[kind];modal(content);$("#cancelSet").onclick=closeModal;
 if($("#saveSet"))$("#saveSet").onclick=()=>{if(kind==="personalize"){document.documentElement.style.setProperty("--purple",$("#accent").value);document.documentElement.style.setProperty("--font",$("#font").value+",ui-sans-serif,system-ui,sans-serif");document.documentElement.style.fontSize=$("#size").value+"px"}else{document.documentElement.dataset.appearance=$("#appearance").value}closeModal()}
}
