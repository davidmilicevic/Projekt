const links = Array.from(document.getElementsByClassName('sort-button'));
let temp=0;
links.forEach(element => {
  element.addEventListener('click', () => {
    element.style.backgroundColor = 'wheat';
    links.forEach(otherElement => {
      if (otherElement !== element) {
        otherElement.style.backgroundColor = '#6dc5ff';
      }
    });

    const columnIndex = Array.from(element.parentNode.children).indexOf(element) + 1;
    sortTableByColumn(columnIndex);
  });
});

function sortTableByColumn(columnIndex) {
  const table = document.getElementById('dogadaji-table');
  const tbody = table.getElementsByTagName('tbody')[0];
  const rows = Array.from(tbody.getElementsByTagName('tr'));

  rows.sort((rowA, rowB) => {
    const cellA = rowA.getElementsByTagName('td')[columnIndex - 1].textContent;
    const cellB = rowB.getElementsByTagName('td')[columnIndex - 1].textContent;
    return cellA.localeCompare(cellB);
  });

  rows.forEach(row => tbody.appendChild(row));
}



const closeBtn = document.getElementsByClassName('closeBtn')[0];
const popupHolder = document.getElementsByClassName('popupHolder')[0];
const closeBtn2 = document.getElementsByClassName('closeBtn')[1];
const popupHolder2 = document.getElementsByClassName('popupHolder')[1];

closeBtn.addEventListener('click',()=>{
  resetText()
  popupHolder.style.display = "none"
  popupHolder2.style.display = "none"
})
closeBtn2.addEventListener('click',()=>{
  resetText()
  popupHolder.style.display = "none"
  popupHolder2.style.display = "none"
})

const links0 = document.getElementsByClassName('links')[0];
links0.addEventListener('click',()=>{
  popupHolder.style.display = "block"
})


/* Fetch data */

async function Dogadaji() {
  const url = new URL('http://127.0.0.1:8080/dogadaji');
  const res = await fetch(url, {
    method: 'GET',
  });
  
  if (res.ok) {
    let result = await res.json();
    const table = document.getElementById('dogadaji-table');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    result.forEach(dogadaj => {
      const row = document.createElement('tr');
      
      const idCell = document.createElement('td');
      idCell.textContent = dogadaj.Id;
      row.appendChild(idCell);
      
      const nazivCell = document.createElement('td');
      nazivCell.textContent = dogadaj.Naziv;
      row.appendChild(nazivCell);
      
      const datumCell = document.createElement('td');
      datumCell.textContent = dogadaj.Datum;
      row.appendChild(datumCell);
      
      const vrijemeCell = document.createElement('td');
      vrijemeCell.textContent = dogadaj.Vrijeme;
      row.appendChild(vrijemeCell);
      
      const mjestoCell = document.createElement('td');
      mjestoCell.textContent = dogadaj.Mjesto;
      row.appendChild(mjestoCell);
      
      const dostupneKarteCell = document.createElement('td');
      dostupneKarteCell.textContent = dogadaj.Dostupne_karte;
      row.appendChild(dostupneKarteCell);

      const editBtn = document.createElement('td');
      editBtn.textContent = "Edit";
      editBtn.classList.add("holderclass2");
      editBtn.addEventListener('click',()=>{
        temp = dogadaj.Id;
        OneDogadaj(dogadaj.Id)
      })
      row.appendChild(editBtn);

      const deleteBtn = document.createElement('td');
      deleteBtn.textContent = "X";
      deleteBtn.classList.add("holderclass");
      deleteBtn.addEventListener('click',()=>{
        DeleteDogadaj(dogadaj.Id);
        
      })
      row.appendChild(deleteBtn);

     
      
      tbody.appendChild(row);
    });
  } else {
    console.log("Could not fetch dogadaji.");
  }
}

Dogadaji();

  
async function DodajDogadaj(e){
  e.preventDefault()
  const res = await fetch('http://127.0.0.1:8080/dogadaji',{
      method: 'POST',
      headers:{
          "Content-Type": 'application/json'
      },
      body:JSON.stringify({
        naziv : document.getElementById('naziv-input').value,
        datum : document.getElementById('datum-input').value,
        vrijeme : document.getElementById('vrijeme-input').value,
        mjesto : document.getElementById('mjesto-input').value,
        dostupne_karte : document.getElementById('dostupne-karte-input').value
      }
          
      )
  })
  if (res.ok) {
    console.log("uspih");
      alert("Dogadaj dodan!")
      window.location.href = "/"
      }
  else{
      alert("Pokidano!");
  }
}


const btnDodaj = document.getElementsByClassName('btnDodaj')[0];
btnDodaj.addEventListener('click',DodajDogadaj)


async function OneDogadaj(id){
  const res = await fetch('http://127.0.0.1:8080/dogadaji/'+id,{
      method: 'GET',
      headers:{
          "Content-Type": 'application/json'
      }
  })
  if (res.ok) {
      let result = await res.json();
      console.log(result);
      document.getElementById('naziv-input2').value = result.Naziv
      document.getElementById('datum-input2').value = result.Datum
      document.getElementById('vrijeme-input2').value = result.Vrijeme
      document.getElementById('mjesto-input2').value = result.Mjesto
      document.getElementById('dostupne-karte-input2').value = result.Dostupne_karte
      popupHolder2.style.display = "block"
      //window.location.href = "http://127.0.0.1:8000/"
      }
  else{
      alert("Nes ne radi!");
  }
}

async function DeleteDogadaj(id){
  const res = await fetch('http://127.0.0.1:8080/dogadaji/'+id ,{
      method: 'DELETE'
  })
  if (res.ok) {
      alert("Podatak obrisan")
      window.location.href = "/"
      }
  else{
      alert("Nes ne radi!");
  }
}

async function IzmjeniDogadaj(e){
  e.preventDefault()
  const res = await fetch('http://127.0.0.1:8080/dogadaji/'+temp,{
      method: 'PUT',
      headers:{
          "Content-Type": 'application/json'
      },
      body:JSON.stringify({
        naziv : document.getElementById('naziv-input2').value,
        datum : document.getElementById('datum-input2').value,
        vrijeme : document.getElementById('vrijeme-input2').value,
        mjesto : document.getElementById('mjesto-input2').value,
        dostupne_karte : document.getElementById('dostupne-karte-input2').value
      }
      )
  })
  if (res.ok) {
      alert("azuriranje")
      resetText();
      window.location.href = "/"
      }
  else{
      alert("Nes ne radi!");
  }
}


function resetText(){
  document.getElementById('naziv-input').value = ""
  document.getElementById('datum-input').value = ""
  document.getElementById('vrijeme-input').value = ""
  document.getElementById('mjesto-input').value = ""
  document.getElementById('dostupne-karte-input').value = ""

  document.getElementById('naziv-input').value  = ""
  document.getElementById('datum-input').value = ""
  document.getElementById('vrijeme-input').value =""
  document.getElementById('mjesto-input').value = ""
  document.getElementById('dostupne-karte-input').value = ""
}

const btnDodaj2 = document.getElementsByClassName('btnDodaj2')[0];
btnDodaj2.addEventListener('click',IzmjeniDogadaj)