import { MyNightmare as Nightmare } from './../nightmare/nightmare';

import * as admin from 'firebase-admin';
import serviceAccount from "../service-key";
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://" + serviceAccount.project_id + ".firebaseio.com"
});
const db = app.database().ref();

class NaverMobile extends Nightmare {
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main() {

        let keyword = this.argv.keyword;
        if ( ! keyword ) this._exit("Please input keyword");
        let ms = (new Date).getTime();
        let key = this.date('Y-m-d-H-i', Math.round(ms / 1000) );
        let ref = db.child('adv').child('kin').child('mobile').child(keyword).child(key);
        await ref.set({ time: ms });

        await this.get('https://m.naver.com/');

        await this.typeEnterWait('input[name="query"]', keyword, '.sc.sp_ntotal');
        let $html = await this.getHtml();
        // console.log(" count: ", $html.find('.sc.sp_ntotal').length);
        let $lis = $html.find('.sc.sp_ntotal ul > li');

        let count = $lis.length;
        // console.log("lis: ", count);
        
        await ref.update({ count: count });

        let rank = [];
        for (let i = 0; i < count; i++) {

            let data = {};
            let $li = $lis.eq(i);
            data['title'] = $li.find('a').find('.total_tit').text();
            data['href'] = $li.find('a').prop('href');
            data['type'] = 'blog';
            if ( $li.hasClass('type_kin') ) data['type'] = 'kin';
            if ( data['type'] == 'blog' ) {
                data['name'] = $li.find('.sub_name').text();
            }
            else {
                data['title'] = data['title'].replace('질문', '');
            }
            rank.push(data);
        }

        

        for (let i = 0; i < rank.length; i++) {
            if ( rank[i]['type'] == 'blog' ) continue;
            $html = await this.get(rank[i].href);
            let $answers = $html.find("a.button_friend");
            let names = [];
            for (let j = 0; j < $answers.length; j++) {
                let $name = $answers.eq(j);
                names.push($name.attr('data-friend-view-name'));
            }
            rank[i]['names'] = names;
        }

        await ref.update({ rank: rank });

        // console.log("done");

        await this.end().then( () => {} );
        this._exit();

    }

}

let defaultOptions = {
    show: false,
    x: 1024, y: 0, width: 640, height: 700,
    openDevTools: { mode: '' },
};
(new NaverMobile(defaultOptions)).main();
