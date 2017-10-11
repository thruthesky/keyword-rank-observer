import { MyNightmare as Nightmare } from './../nightmare/nightmare';
var rpn = require('request-promise-native');
const http_build_query = require('locutus/php/url/http_build_query');


import * as admin from 'firebase-admin';
import serviceAccount from "../service-key";
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://" + serviceAccount.project_id + ".firebaseio.com"
});
const db = app.database().ref().child('adv');

var Xvfb = require('xvfb');
var xvfb = new Xvfb({
  silent: true
});
xvfb.startSync();

class NaverMobile extends Nightmare {
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main() {

        let date = this.date('Y-m-d H:i:s');
        console.log("naver.kin.mobile.js begins at: " + date);


        let re = await db.child('keyword').child('naver-kin-mobile').once('value');
        let keywords = re.val();
        if (!keywords) {
            console.log("No keyword on firebase.");
            return;
        }
        for (let k of Object.keys(keywords)) {
            console.log("Searching for Mobile keyword: ", k);
            await this.crawl(k);
        }

        await this.end().then(() => { });

    }

    async crawl(keyword) {

        if (!keyword) this._exit("Please input keyword");
        let ms = (new Date).getTime();
        let date = this.date('Y-m-d-H-i', Math.round(ms / 1000));

        let data = { time: ms };


        await this.get('https://m.naver.com/');

        await this.typeEnterWait('input[name="query"]', keyword, '.sc.sp_ntotal');
        let $html = await this.getHtml();
        // console.log(" count: ", $html.find('.sc.sp_ntotal').length);
        let $lis = $html.find('.sc.sp_ntotal > .api_subject_bx > ul.lst_total > li.bx');

        let count = $lis.length;
        console.log(`No. of results: ${count}, keyword : ${keyword}`);


        data['platform'] = 'mobile';
        data['keyword'] = keyword;
        data['count'] = count;


        let rank = [];
        for (let i = 0; i < count; i++) {

            let data = {};
            let $li = $lis.eq(i);
            data['title'] = $li.find('a').find('.total_tit').text();
            data['href'] = $li.find('a').prop('href');
            data['type'] = 'blog';
            if ($li.hasClass('type_kin')) data['type'] = 'kin';
            if (data['type'] == 'blog') {
                data['name'] = $li.find('.sub_name').text();
            }
            else {
                data['title'] = data['title'].replace('질문', '');
            }
            rank.push(data);
        }

        // console.log("rank: ", rank);

        for (let i = 0; i < rank.length; i++) {
            if (rank[i]['type'] != 'kin') continue;
            console.log(`i: ${i}, type: ${rank[i].type}`)
            $html = await this.get(rank[i].href);
            let $answers = $html.find("a.button_friend");
            let names = [];
            for (let j = 0; j < $answers.length; j++) {
                let $name = $answers.eq(j);
                names.push($name.attr('data-friend-view-name'));
            }
            rank[i]['names'] = names;
        }

        data['rank'] = rank;


        var options = {
            method: 'POST',
            uri: 'http://keyword-rank-observer-server.sonub.com/',
            qs: data,
            json: true // Automatically stringifies the body to JSON
        };

        // console.log( 'qs: ', http_build_query(data));

        await rpn(options)
            .then(function (body) {
                // POST succeeded...
                console.log('body: ', body);
            })
            .catch(function (err) {
                // POST failed...
            });

        console.log(`Mobile Keyword Rank Log Done for ${keyword}`);
    }

}

let defaultOptions = {
    show: false,
    x: 1024, y: 0, width: 640, height: 700,
    openDevTools: { mode: '' },
};
(new NaverMobile(defaultOptions)).main().then(re => {

    xvfb.stopSync();
    console.log("process completed!");

    var heapUsed = process.memoryUsage().heapUsed;
    console.log("Program is using " + heapUsed + " bytes of Heap.")

    global.gc();
    console.log("Program is using " + heapUsed + " bytes of Heap.")

});
