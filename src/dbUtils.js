import firebase from 'firebase/app';
import 'firebase/database';

export const dbGetScores = (callback) => {
    const database = firebase.database()
    if (!database) {
        console.log("connection issue");
        return;
    }

    database.ref('/Scores').once('value').then((snapshot) => {
        const data = Object.values(snapshot.val()).map(
            u => {
                return {
                    y: 100 * u.gdp, x: u.death
                }
            }
        );
        callback(data);
    });
}

export const dbUploadScore = (death, gdp) => {
    const database = firebase.database()
    if (!database) {
        console.log("connection issue");
        return;
    }

    console.log("storing", death, gdp);

    database.ref('/Scores').push({
        death: death,
        gdp: gdp
    }).catch(console.log);
};

/*
export const dbUploadScore = (death, gdp) => {
    const db = firebase.firestore();

    console.log("storing", death, gdp);
    // Write on db a random document
    db.collection('logs')
        .add({
            death: death,
            gdp: gdp,
        })
        .then((docRef) => {
            console.log('Document written with ID: ', docRef.id);
        })
        .catch((err) => console.log(err));
};
*/

/*
export const dbGetScores = (callback) => {
    const db = firebase.firestore();

    db.collection('logs')
        .get()
        .then((querySnapshot) => {
            var dataset = [];
            var tmp = [];
            querySnapshot.forEach((doc) => {
                tmp.push(doc.data());
                const { gdp, death } = doc.data();
                dataset.push({
                    y: 100 * gdp, x: death
                })
            });
            console.log(JSON.stringify(tmp));
            console.log(dataset);
            callback(dataset);
        })
}
*/