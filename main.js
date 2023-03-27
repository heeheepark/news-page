let news = [];
let page = 1;
let total_pages = 0;
let menuBtn = document.querySelectorAll("button");
menuBtn.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)))

let goBtn = document.getElementById("goBtn");
let url;

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

const getNews = async() => {
  try {
    let header = new Headers({'x-api-key': 'oAvWmBUz4k9rpoOW12-1i9l3pG1FJPdyZUBlyCJG01M'})
    url.searchParams.set('page', page);
    let response = await fetch(url, {headers:header}); //await을 이용해서 기다리게 명령 await-async는 세트
    let data = await response.json() // json은 객체랑 똑같으나 텍스트타입일 뿐이다. json을 뽑아오면 객체처럼 쓸 수 있음.

    if(response.status == 200) {
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      render();
      pagenation();
      console.log(data)
    } else {
      throw new Error(data.message)
    }
  } catch(error) {
  console.log("잡힌 에러는", error.message);
  errorRender(error.message);
  }
}

const getLatesNews = async() => {
  url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport');
  getNews();
}


const getNewsByTopic = async(event) => {
  let topic = event.target.textContent.toLowerCase()
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}`);
  getNews();
}

const getNewsByKeywords = async() => {
  let keyword = document.getElementById("searchBox").value;
  url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&from=2023/03/14&countries=KR`)
  getNews();
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

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`
document.getElementById("news-board").innerHTML = errorHTML;
}

const pagenation = () => {
  let pagenationHTML = '';
 // total_pages
 // page
 // page group
  let pageGroup = Math.ceil(page/5)
  let lastpageGroup = Math.ceil(total_pages/5)
 // last page
  let last = pageGroup * 5;
    if (last > total_pages) {
      last = total_pages;
    }
  let first = last - 4 <= 0 ? 1 : last - 4;
 // first page
 // first~last page print

  if(pageGroup != 1) {
    pagenationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${1})">
    <span aria-hidden="true">&lt;&lt;</span>
  </a>
</li>
<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page - 1})">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`
  }
  
  for(let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${page == i ? "active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
  }

  if (lastpageGroup != pageGroup) {
    pagenationHTML += `<li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
        <span aria-hidden="true">&gt;</span>
      </a>
    </li>`

  pagenationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToEndPage(${total_pages})">
    <span aria-hidden="true">&gt;&gt;</span>
  </a>
</li>`
  }
  

  document.querySelector(".pagination").innerHTML = pagenationHTML;
}

const moveToPage = (pageNum) => {
  // 이동하고 싶은 페이지를 알아야한다.
  page = pageNum;
  // 이동하고 싶은 페이지를 가지고 api 다시 호출
  getNews();
}

const moveToEndPage = (pageNum) => {
  page = pageNum;
  getNews();
}
getLatesNews();
goBtn.addEventListener("click", getNewsByKeywords)
