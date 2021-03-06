import db, { firebase } from "../../firebase/firebase";
export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

export const submitFeedback = (feedback) => {
	return async (dispatch) => {
		try {
			await db.collection("feedback").add(feedback);
		} catch (error) {
			console.log(error);
			throw new Error();
		}
	};
};

export const signIn = () => {
	return async (dispatch) => {
		const user = firebase.auth().currentUser;
		console.log(user);

		let uid = user.uid;
		let displayPicture = user.photoURL;
		let username = user.displayName;
		let email = user.email;
		const doc = await db.collection("users").doc(uid).get();
		console.log(doc.data());
		if (!doc.exists) {
			await db.collection("users").doc(uid).set({
				username: username,
				email: email,
				displayPicture: displayPicture,
			});
		}
		// console.log(doc.data());

		dispatch({
			type: SIGN_IN,
			payload: {
				uid,
				email,
				displayPicture,
				username: "",
			},
		});
	};
};

export const signInWithEmail = (username) => {
	return async (dispatch) => {
		try {
			const user = firebase.auth().currentUser;
			console.log(user);
			let uid = user.uid;
			let displayPicture = user.photoURL;
			let email = user.email;
			db.collection("users").doc(uid).set({
				username: username,
			});
			dispatch({
				type: SIGN_IN,
				payload: { uid, email, displayPicture, username },
			});
		} catch (err) {
			console.log(err);
		}
	};
};

export const signOut = () => {
	return async (dispatch) => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				dispatch({ type: SIGN_OUT });
			})
			.catch((err) => {
				console.log(err);
			});
	};
};
