import { MyNightmare as Nightmare } from './../nightmare/nightmare';

import * as admin from 'firebase-admin';
import serviceAccount from "../service-key";
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://" + serviceAccount.project_id + ".firebaseio.com"
});
const db = app.database().ref();

class NaverDesktop extends Nightmare {
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main() {

        let keyword = this.argv.keyword;
        if ( ! keyword ) this._exit("Please input keyword");
        let ms = (new Date).getTime();
        let key = this.date('Y-m-d-H-i', Math.round(ms / 1000) );
        let ref = db.child('adv').child('kin').child('desktop').child(keyword).child(key);
        await ref.set({ time: ms });

        await this.get('http://www.naver.com');
        await this.typeEnterWait('input[name="query"]', keyword, '._kinBase');
        let $html = await this.getHtml();
        let $lis = $html.find('._kinBase > ul > li');
        let count = $lis.length;
        // console.log("lis: ", count);
        
        await ref.update({ count: count });

        let rank = [];
        for (let i = 0; i < count; i++) {
            let $li = $lis.eq(i);
            let title = $li.find('.question').find('a').text();
            let href = $li.find('.question').find('a').prop('href');
            rank.push({ title: title, href: href });
        }

        for (let i = 0; i < rank.length; i++) {
            $html = await this.get(rank[i].href);
            let $answers = $html.find("h3 > em");
            let names = [];
            for (let j = 0; j < $answers.length; j++) {
                let $name = $answers.eq(j);
                names.push($name.text());
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
(new NaverDesktop(defaultOptions)).main();
