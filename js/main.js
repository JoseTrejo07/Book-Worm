document.querySelector('#input').addEventListener('click', getFetch)
function getFetch(){
  const choice = document.querySelector('input').value
  console.log(choice)
  const url = `https://openlibrary.org/isbn/${choice}.json`

  fetch(url)
      .then(res => res.json())
      .then(data => {
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}


document.querySelector('#search').addEventListener('click', fetchTitle)

let isbnsAndTitlesArr = [JSON.parse(localStorage.getItem('myBooks'))]
let isbnsAndTitlesFlat = isbnsAndTitlesArr.flat()


function fetchTitle(){
  let choice = document.querySelector('input').value
  localStorage.setItem('isbn',choice)
  console.log(choice)
  const url = `https://openlibrary.org/isbn/${choice}.json`
  const imgUrl = `https://covers.openlibrary.org/b/isbn/${choice}-M.jpg`
  document.querySelector('#cover').src = imgUrl
  
  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
          document.querySelector('#title').innerText = data.title
		  localStorage.setItem('authorId',data.authors[0].key)
		  localStorage.setItem('title',data.title)
      })
        .catch(err => {
          console.log(`error ${err}`)
      });
  function author(){
  let authorId =  String(localStorage.getItem('authorId'))
  console.log(authorId)
  const authorUrl =  `https://openlibrary.org${authorId}.json`
  fetch(authorUrl)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
		document.querySelector('#author').innerText =data.name
      })
  
  console.log(authorId)
  const relatedUrl =  `https://openlibrary.org${authorId}/works.json?offset=4`
  document.querySelector('#related').innerText = 'Related Works'
  fetch(relatedUrl)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
		document.querySelector('#related').innerText = data.entries[0].title+' | '+data.entries[1].title+' | '+data.entries[2].title
      })
        .catch(err => {
          console.log(`error ${err}`)
      });
  }
	setTimeout(author,400)
	localStorage.removeItem('authorId')
}

//Save ISBN & Titles
document.querySelector('#save').addEventListener('click',saveTitle)
function saveTitle(){
  const myTitle = localStorage.getItem('title')
  const myIsbn = localStorage.getItem('isbn')

  function SaveMyBook(myTitle,myIsbn){
    this.title = myTitle
    this.isbn = myIsbn
  }
  let savedBook = new SaveMyBook(myTitle,myIsbn)
  console.log(savedBook)

  if(!localStorage.getItem('myBooks')){
    localStorage.setItem('myBooks',JSON.stringify(savedBook))
  }else{
    if(isbnsAndTitlesFlat.some(e => e.isbn === savedBook.isbn)){
      alert('Existing Book')
    }else{
        var popup = document.getElementById("mySavePopup");
        popup.classList.toggle("show");

      isbnsAndTitlesFlat.push(savedBook)
      let savedIsbnsAndTitles = [...new Set(isbnsAndTitlesFlat)]
      localStorage.setItem('myBooks',JSON.stringify(savedIsbnsAndTitles))
      console.log(savedIsbnsAndTitles)
    }
  }
}



//save into select
try{
  isbnsAndTitlesFlat.forEach((oppInfo,i)=>{
    let bookOptions = document.createElement('option')
    bookOptions.text = oppInfo.title
    bookOptions.value = oppInfo.isbn + '&%' + i
    bookOptions.setAttribute('id',i)
    document.querySelector('.myBooks').appendChild(bookOptions)
})

  //see if theres a way to call back fetchTitle function
  document.querySelector('.myBooks').addEventListener('change',changeBooks)

  function changeBooks(){
    let bookVal = document.querySelector('.myBooks').value
    let bookSplit = bookVal.split("&%")
    if(bookSplit[0] ===''){
      document.querySelector('#title').innerText = 'Title'
      document.querySelector('#author').innerText = 'Author'
      document.querySelector('#related').innerText = 'Related Works'
      document.querySelector('#cover').src='https://cdn.theatlantic.com/thumbor/JAo-a33HuGI4ElimNHBLxzMvo7k=/0x1:4480x5601/648x810/media/img/2022/11/11/PUZZLER_portrait/original.jpg'
    }else{
      localStorage.setItem('isbn',bookSplit[0])
      console.log(bookSplit[0])
      const url = `https://openlibrary.org/isbn/${bookSplit[0]}.json`
      const imgUrl = `https://covers.openlibrary.org/b/isbn/${bookSplit[0]}-M.jpg`
      document.querySelector('#cover').src = imgUrl
      
      fetch(url)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            console.log(data)
              document.querySelector('#title').innerText = data.title
          localStorage.setItem('authorId',data.authors[0].key)
          localStorage.setItem('title',data.title)
          })
            .catch(err => {
              console.log(`error ${err}`)
          });
      function author(){
      let authorId =  String(localStorage.getItem('authorId'))
      console.log(authorId)
      const authorUrl =  `https://openlibrary.org${authorId}.json`
      fetch(authorUrl)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            console.log(data)
        document.querySelector('#author').innerText =data.name
          })
      
      console.log(authorId)
      const relatedUrl =  `https://openlibrary.org${authorId}/works.json?offset=4`
      document.querySelector('#related').innerText = 'Related Works'
      fetch(relatedUrl)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            console.log(data)
        document.querySelector('#related').innerText = data.entries[0].title+' | '+data.entries[1].title+' | '+data.entries[2].title
          })
            .catch(err => {
              console.log(`error ${err}`)
          });
      }
      setTimeout(author,400)
      localStorage.removeItem('authorId')
    }
  }

}catch(err){
  console.log(err)
}

//Delete Book
document.querySelector('.myBooks').addEventListener('change',deleteOnChange)
function deleteOnChange(){
  let bookVal = document.querySelector('.myBooks').value
  let bookSplit = bookVal.split("&%")

  document.querySelector('#delete').addEventListener('click',deleteBook)
  function deleteBook(){
    isbnsAndTitlesFlat.splice(bookSplit[1],1)
    localStorage.setItem('myBooks',JSON.stringify(isbnsAndTitlesFlat))
    console.log(isbnsAndTitlesFlat)
  }
}

document.querySelector('.deletePopUp').addEventListener('click',mydeleteFunction)
function mydeleteFunction() {
  var popup = document.getElementById("myDeletePopup");
  popup.classList.toggle("show");
}

//Pop Ups


