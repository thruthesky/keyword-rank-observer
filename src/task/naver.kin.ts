import { MyNightmare as Nightmare } from './../nightmare';

import * as admin from 'firebase-admin';
import serviceAccount from "../service-key";
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://" + serviceAccount.project_id + ".firebaseio.com"
  });
const db = app.database().ref();

class Naver extends Nightmare {
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main() {
        await this.get('http://www.naver.com');
        await this.typeEnterWait('input[name="query"]', '화상영어', '._kinBase');
        let $html = await this.getHtml();
        let $lis = $html.find('._kinBase > ul > li');
        let count = $lis.length;
        console.log("lis: ", count);
        let key = this.date_ymdhis();
        let ref = db.child('kin').child(key)
        ref.set({count: count});

        let rank = [];
        for( let i = 0; i < count; i ++ ) {
            let $li = $lis.eq(i);
            let title = $li.find('.question').find('a').text();
            let href = $li.find('.question').find('a').prop('href');
            rank.push({title: title, href: href});
        }
        // ref.update({rank: rank});

        for( let i = 0; i < rank.length; i ++ ) {
            $html = await this.get( rank[i].href );
            let $answers = $html.find("h3 > em");
            let names = [];
            for( let j = 0; j < $answers.length; j ++ ) {
                let $name = $answers.eq(j);
                names.push( $name.text() );
            }
            rank[i]['names'] = names;
        }

        ref.update({rank: rank});
        
    }



    date_ymdhis() {
        let d = new Date();
        return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes();
    }
}

let defaultOptions = {
    show: true, x: 1024, y: 0, width: 640, height: 700,
    openDevTools: { mode: '' },
};
(new Naver(defaultOptions)).main();
