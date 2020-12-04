import firebase from 'firebase/app';


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

export const dbGetScores = (callback) => {
    const db = firebase.firestore();

    db.collection('logs')
        .get()
        .then((querySnapshot) => {
            var dataset = [];
            querySnapshot.forEach((doc) => {
                const { gdp, death } = doc.data();
                dataset.push({
                    y: 100 * gdp, x: death
                })
            });
            console.log(dataset);
            callback(dataset);
        })
}