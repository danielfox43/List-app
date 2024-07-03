let list = [];

document.getElementById("cancel_description").addEventListener("click", Cancel);
document.getElementById("add_tag").addEventListener("click", OpenTagPop);
document.getElementById("add_color_tag").addEventListener("click", CreateTag);
document.getElementById("side").addEventListener("click", function(){

quest = document.createElement('li');
quest.setAttribute("class", 'quest');
quest.innerHTML = `<div>
       <input type="text" class="input" minlength="8" maxlenght="53"><button onclick="AddQuest(this)" type="submit" class="add">Add</button>
   </div>
  <button onclick="RemoveQuest(this, this.parentNode.id.substring(9))" class="delete">Delete</button>`;
document.getElementById("check_list").appendChild(quest);
quest.scrollIntoView();
});
const tag_list = document.getElementById("tag_list");
const edit_description = document.getElementById("edit_description");
const description = document.getElementById("description");
let opened = false;
function RemoveQuest(me, quest_id) {
  const task = list.find(task => task.id === me.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id);
  console.log(quest_id)
  task.quests.splice(task.quests.findIndex(side_quest => side_quest.nr == quest_id), 1);
  me.parentNode.remove();
  console.log(task)
}
function AddQuest(me) {
const task = list.find(task => task.id === me.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id);

let side_quest = {
  nr: Date.now(),
  name: me.parentNode.children[0].value,
  done: false,
  
}
side_quest.ui =  `<li class="quest" id="quest_nr.${side_quest.nr}"><div>${side_quest.name}</div>
  <button onclick="this.parentNode.remove()" class="delete">Delete</button></li>`;
me.parentNode.parentNode.setAttribute('id', 'quest_nr.' + side_quest.nr);
task.quests.push(side_quest);
console.log(task)
me.parentNode.innerHTML = side_quest.name;
}
function AddTask(id, taskn, element) {
   if(taskn.value != "") {
   let task = {
   task_name: taskn.value,
   done: false,
   id: id,
   description: "",
   tags: [],
   quests: [],
  };
  list.push(task);
  console.log(list);
  element.innerHTML = `<input type="checkbox" onclick="Done(this.parentNode.parentNode.id)"><b id="${task.id}_name">${task.task_name}<b>`;
  const edit = document.createElement("button");
  edit.innerHTML  = "edit";
  edit.setAttribute("class", "edit");
  edit.setAttribute("onclick", "OpenPop(this.parentNode.id.substring(1))")
  const li = document.getElementById('l' + id);
  li.appendChild(edit);

   }
 
}
 function RenderList(id) {
   const scr = document.getElementsByClassName("screen")[0];
  const it = document.createElement("li");
  it.setAttribute("id", 'l' + id);
   it.innerHTML = `
   <div class="stuff">
       <input type="text" id="${id + 'n'}" class="input" minlength="3"><button onclick="AddTask(this.parentNode.parentNode.id.substring(1), document.getElementById((this.parentNode.parentNode.id.substring(1)) + 'n'), this.parentNode)" type="submit" class="add">Add</button>
   </div>
  <button onclick="RemoveTask(this.parentNode.id)" class="delete">Delete</button>
  
  `;
  scr.appendChild(it);
  it.scrollIntoView();
  console.log("bogos binted");
 }
 function RemoveTask(id) {
   document.getElementById(id).remove();
  for (let i = 0; i < list.length; i++) {
   if(list[i].id == id){ 
       list.splice(i, 1);
   }
  }
 }
 function Done(id) {
   const task = list.find(task => task.id === id);
   if (task.done == false) {
       task.done = true;
   }
   else {
       task.done = false;
   }
   console.log(task.done)
 }
 function ClosePop() {
 document.getElementById("popup").style.display = "none";
  console.log("executed");
 }
 function OpenPop(task_id) {
    const task = list.find(task => task.id === task_id);
    const pop = document.getElementById("popup");
    pop.children[0].id = task_id;
    pop.style.display = "flex";
    description.innerHTML = `${task.description}`;
    document.getElementById("Title").innerHTML = `<button style="background: none; border: none; cursor: pointer;" onclick="ChangeName(this)"><img src="/icons/edit-3-svgrepo-com.svg" width="32px" height="32px" style="vertical-align: bottom;"></button>${task.task_name}`;
    document.getElementById("check_list").innerHTML = '';
    for (let i = 0; i < task.quests.length; i++) {
      document.getElementById("check_list").innerHTML = document.getElementById("check_list").innerHTML + task.quests[i].ui;
      
    }
 }
 function EditDescription(id) {
  const task = list.find(task => task.id === id);
  description.innerHTML = `<textarea id="description_area" style='resize: none; width: 100%; height: 200px; display: flex;'>${task.description}</textarea>`;
  edit_description.style.display = "none";
  document.getElementsByClassName("add_cancel")[1].style.display = "inline-block";
  document.getElementsByClassName("add_cancel")[0].style.display = "inline-block";
 }
function AddDescription(id) {
  const task = list.find(task => task.id === id);
  task.description = document.getElementById("description_area").value;
  description.innerHTML = task.description;
  edit_description.style.display = "inline-block";
  document.getElementsByClassName("add_cancel")[1].style.display = "none";
  document.getElementsByClassName("add_cancel")[0].style.display = "none";
}
function ChangeName(name) {

name.parentNode.innerHTML = `<input id="new_name" type="text" style="font-size: medium; margin-bottom: 10px; padding: 8px; border-radius: 10px; border: 1px gray solid; background-color: #f5f5f5;"><button onclick="addName(this.parentNode)">Done</button>`;
}
function addName(new_name) {
const task = list.find(task => task.id === new_name.parentNode.parentNode.id);
task.task_name = document.getElementById("new_name").value;
new_name.innerHTML = `<button style="background: none; border: none; cursor: pointer;" onclick="ChangeName(this)"><img src="/icons/edit-3-svgrepo-com.svg" width="32px" height="32px" style="vertical-align: bottom;"></button>${task.task_name}`;
document.getElementById('l' + task.id).children[0].children[1].innerHTML = task.task_name;
}

function Cancel() {
  const task = list.find(task => task.id === this.parentNode.parentNode.parentNode.id);
  console.log(this.parentNode.parentNode.parentNode.id);
  description.innerHTML = task.description;
  edit_description.style.display = "inline-block";
  document.getElementsByClassName("add_cancel")[1].style.display = "none";
  document.getElementsByClassName("add_cancel")[0].style.display = "none";
}
function OpenTagPop() {
  if(opened) {
    document.getElementById("tag_pop").style.display = "none";
    opened = false;
  }
  else {
    document.getElementById("tag_pop").style.display = "block";
    console.log(opened);
    opened = true;
  }
}
function CreateTag(){
  const task = list.find(task => task.id === this.parentNode.parentNode.parentNode.parentNode.parentNode.id);
  console.log(this.parentNode.parentNode.parentNode.parentNode.parentNode.id);
  let tag = {
    name: document.getElementById("tag_name").value,
    color: document.getElementById("tag_color").value,
  }
  let tag_element = document.createElement("li");
  tag_element.setAttribute("class", "")
  task.tags.push(tag);
  document.getElementById("tag_name").value = "";
  this.parentNode.style.display = "none";
}