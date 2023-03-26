let news = [];
let button = document.querySelectorAll("button");
button.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)))
const getLatesNews = async() => {

  let url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport');
  let header = new Headers({'x-api-key': 'SpsndWTJXdeHQB96yf73sqe1EOHtaTJwGkajEBssqrM'})

  let response = await fetch(url, {headers:header}); //await을 이용해서 기다리게 명령 await-async는 세트
  let data = await response.json() // json은 객체랑 똑같으나 텍스트타입일 뿐이다. json을 뽑아오면 객체처럼 쓸 수 있음.
  news = data.articles;

  render();
}

const getNewsByTopic = async(event) => {
  let topic = event.target.textContent.toLowerCase()
  let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}`)
  let header = new Headers({'x-api-key': 'SpsndWTJXdeHQB96yf73sqe1EOHtaTJwGkajEBssqrM'})

  let response = await fetch(url, {headers:header}); //await을 이용해서 기다리게 명령 await-async는 세트
  let data = await response.json() // json은 객체랑 똑같으나 텍스트타입일 뿐이다. json을 뽑아오면 객체처럼 쓸 수 있음.
  news = data.articles;

  render();
}

const render = () => {
  let newsHTML = "";
  newsHTML = news.map((news) => {
    let summary = news.summary;
    if (summary.length >= 200) {
      summary = summary.substr(0, 199) + "...";
    } else if(summary.length < 5 ) {
      summary = "내용없음";
    }
    let rights = news.rights
    if (rights.length < 5) {
      rights = "no source"
    }
    return `<div class="row news">
    <div class="col-lg-4">
      <img class="news-img-size" src="${news.media}" alt="">
    </div>
    <div class="col-lg-8">
      <h2 class="title">${news.title}</h2>
      <p class="content">${summary}</p>
      <div class="date">${rights} * ${moment(news.published_date).fromNow()}</div>
    </div>
  </div>`
  }).join('');



  document.getElementById("news-board").innerHTML = newsHTML;
};

getLatesNews();



function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function openSearch() {
  let searchBox = document.getElementById("searchBox");
  let goBtn = document.getElementById("goBtn");

  if (searchBox.style.display == "none") {
    searchBox.style.display = "inline";
    goBtn.style.display = "inline";
  } else {
    searchBox.style.display = "none";
    goBtn.style.display = "none";
  }
}