# 키워드 랭킹 기록 크론


# 크론 등록 - MacOS

## 네이버 데스크톱 검색어 랭킹 로그 크론

* 매 5 분 마다 화상영어 키워드와 어린이영어 키워드에 대한 랭킹을 기록한다.

````
*/5 * * * * cd ~/node/rank; /usr/local/bin/node dist/task/naver.kin.desktop.js --keyword=화상영어
*/5 * * * * cd ~/node/rank; /usr/local/bin/node dist/task/naver.kin.desktop.js --keyword=어린이영어
````

## 네이버 모바일 검색어 랭킹 로그 크론

````
*/5 * * * * cd ~/node/rank; /usr/local/bin/node dist/task/naver.kin.mobile.js --keyword=화상영어
*/5 * * * * cd ~/node/rank; /usr/local/bin/node dist/task/naver.kin.mobile.js --keyword=어린이영어
````

# 크론 등록 - Windows

node-cron 으로 실행한다.


````
> node dist\cron\naver.js
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


