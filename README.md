# 키워드 랭킹 기록 크론


# 키워드 랭킹 기록

## 기본 사용법

* keyword-rank-observer 프로그램이 로그를 기록한다.

* 네이버, 다음, 구글 등 각각 사이트마다 데스크롭과 모바일 검색 결과 표시가 틀리므로 각 사이트마다 따로 소스 코드가 작성되어야한다.

* 키워드는 Firebase sonub project 에서 직접 수동으로 입력한다. 이렇게 하면 cralwer 가 Firebase 의 키워드를 다운로드해서, 랭크를 기록한다.

* 결과를 보는 것은 ad-writer 에서 한다.
  ( 어차피 전문적으로 모니터링을 하려면 모니터링 프로그램이 따로 있어야 한다. 웹/앱의 Push message 에 의존 할 수 없다. )


### 크론 실행 - Windows

맥북의 크론으로 실행해도 되지만, 비싼 맥북을 사용하느니, 고물 윈도우즈에서 node-cron 으로 실행한다.

예제) 윈도우즈 실행. 경로에 주의 한다.
````
C:\work\keyword-rank-observer> node dist\cron\naver.js
````
예제) 맥북. 경로 주의.
````
$ node dist/cron/naver.js
````


# 네이버 키워드 검색 결과 DOM 구조



# DB 키워드 랭크 로그 구조

## 모바일

* DB 경로
````
sonub-database/adv/kin/mobile/키워드/날짜
````

* 모바일 검색에서는 파워링크 및에 블로그와 지식인이 섞여 나온다. 따라서 랭크 로그를 할 때, 블로그와 지식인 표시가 되어져 있다.

* 지식인의 경우 데이터 구조

````
{
    href: 주소,
    names: [ 이름, 철수, 영희 ],
    title: 제목,
    type: kin
}
````


* 블로그의 경우 데이터 구조

````
{
    href: 주소,
    name: 블로그 주인장 이름,
    title: 제목,
    type: blog
}
````


