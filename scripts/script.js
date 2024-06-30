let list = [];
document.getElementById("edit_name").addEventListener("click", ChangeName);
document.getElementById("cancel_description").addEventListener("click", Cancel);
document.getElementById("add_tag").addEventListener("click", OpenTagPop);
document.getElementById("add_color_tag").addEventListener("click", CreateTag);
const tag_list = document.getElementById("tag_list");
const edit_description = document.getElementById("edit_description");
const description = document.getElementById("description");
let opened = false;
function AddTask(id, taskn, element) {
   if(taskn.value != "") {
   let task = {
   task_name: taskn.value,
   done: false,
   id: id,
   description: "",
   tags: [],
  };
  list.push(task);
  console.log(list);
  element.innerHTML = `<input type="checkbox" onclick="Done(this.parentNode.parentNode.id)"><b id="${task.id}">${task.task_name}<b>
  `;
  const edit = document.createElement("button");
  edit.innerHTML  = "edit";
  edit.setAttribute("class", "edit");
  edit.setAttribute("onclick", "OpenPop(this.parentNode.id)")
  const li = document.getElementById(id);
  li.appendChild(edit);

   }
 
}
 function RenderList(id) {
   const scr = document.getElementsByClassName("screen")[0];
  const it = document.createElement("li");
  it.setAttribute("id", id);
   it.innerHTML = `
   <div class="stuff">
       <input type="text" id="${id + 'n'}" class="input" minlength="3"><button onclick="AddTask(this.parentNode.parentNode.id, document.getElementById(this.parentNode.parentNode.id + 'n'), this.parentNode)" type="submit" class="add">Add</button>
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
    document.getElementById("Title").innerHTML = `<button style="background: none; border: none; cursor: pointer;" onclick=""><img src="/icons/edit-3-svgrepo-com.svg" width="32px" height="32px" style="vertical-align: bottom;"></button>${task.task_name}`;
    
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
function ChangeName(event) {
this.parentNode.innerHTML = ``;
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