import { useState, createContext, useEffect, useRef } from "react";
import Login from "./components/Login";
import ListCategories from "./components/ListCategories";
import Content from "./components/Content";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./credentials"
import {
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
    onAuthStateChanged,
    setPersistence,
    getAdditionalUserInfo,
    browserLocalPersistence,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getFirestore,
    deleteField,
    onSnapshot,
    getDoc,
    arrayUnion,
    updateDoc,
    Timestamp,
} from "firebase/firestore";
export const userContext = createContext();

function App() {
    const categoryRef = useRef(null);
    const urlRef = useRef(null);
    const notaRef = useRef(null);
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [urls, setUrls] = useState();
    const [category, setCategory] = useState("");
    const [document, setDocument] = useState(null);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user == null) {
                setUser(null);
                return null;
            }
            setUser(user);
        });
    }, []);
    useEffect(() => {
        if (user) {
            getDocument();
        }
    }, [user]);
    useEffect(() => {
        if (document != null) {
            setCategories(Object.getOwnPropertyNames(document));
        }
        if (category != "") {
            setUrls(document[category]);
        }
    }, [document]);
    useEffect(() => {
        if (document != null) {
            setUrls(document[category]);
        }
    }, [category]);

    const getDocument = () => {
        onSnapshot(doc(db, colection, user.uid), (document) => {
            setDocument(document.data());
        });
    };
    const addUrl = () => {
        const url = urlRef.current.value;
        const nota = notaRef.current.value;

        if (category.trim() == "") {
            alert("Debes seleccionar una categoria");
            return;
        }
        if (url.trim() == "") {
            alert("Escribe una url");
            return;
        }
        let exist = document[category].some((el) => el.url === url);
        if (exist) {
            return;
        }
        const fechaActual = new Date();
        const fechaFirestore = Timestamp.fromDate(fechaActual);
        let docRef = doc(db, colection, user.uid);
        const obj = {};
        obj[category] = arrayUnion({
            url: url,
            nota: nota,
            fecha: fechaFirestore,
        });
        updateDoc(docRef, obj, { merge: true });
    };
    const modifyNota = (param) => {
        let docRef = doc(db, colection, user.uid);

        const campo = document[category];

        console.log(campo);
       let index= campo.findIndex((el) => el.url == param.url);
        campo[index].nota = param.nota;
        let obj = {};
        obj[category] = campo;
        console.log(campo);
        updateDoc(docRef, obj, { merge: true });
    };
    const removeUrl = (childData) => {
        if (!confirm("Eliminar?")) {
            return;
        }

        const test = document[category].filter((el) => {
            if (el.url != childData) {
                return { url: el.url };
            }
        });
        let docRef = doc(db, colection, user.uid);
        const obj = {};
        obj[category] = test;
        updateDoc(docRef, obj, { merge: true });
    };

    const addCategory = () => {
        const category = categoryRef.current.value;
        if (category == "") {
            alert("Debes incluir una categoria");
            return;
        }
        if (categories.includes(category)) {
            alert("esta categoria ya existe");
            return;
        }
        let docRef = doc(db, colection, user.uid);
        const obj = {};
        obj[category] = [];
        updateDoc(docRef, obj, { merge: true });
    };
    const removeCategory = (childData) => {
        if (!confirm("Eliminar?")) {
            return;
        }
        if (childData == category) {
            setCategory("");
        }
        let docRef = doc(db, colection, user.uid);
        const obj = {};
        obj[childData] = deleteField();
        updateDoc(docRef, obj).then(() => {});
    };
    const handleCategory = (childData) => {
        setCategory(childData);
    };
    function SignUp() {
        setPersistence(auth, browserLocalPersistence).then(() => {
            signInWithPopup(auth, new GoogleAuthProvider()).then((user) => {
                if (getAdditionalUserInfo(user).isNewUser) {
                    setDoc(doc(db, colection, user.uid), {});
                }
            });
        });
    }
    return (
        <>
            <userContext.Provider value={user}>
                <header></header>
                <nav>
                    <Login signUp={SignUp} />
                    <br></br>
                </nav>
                {user ? (
                    <>
                        <aside>
                            <h1>Categorias</h1>{" "}
                            <input
                                ref={categoryRef}
                                type="text"
                                placeholder="categoria"
                            />
                            <button onClick={addCategory}>añadir</button>
                            <ul>
                                <ListCategories
                                    categories={categories}
                                    handleCategory={handleCategory}
                                    removeCategory={removeCategory}
                                />
                            </ul>
                        </aside>
                        <section>
                            <input ref={urlRef} type="text" placeholder="url" />
                            <input
                                ref={notaRef}
                                type="text"
                                placeholder="nota..."
                            />
                            <button onClick={addUrl}>añadir</button>
                            {urls ? (
                                <Content
                                    category={category}
                                    removeUrl={removeUrl}
                                    modifyNota={modifyNota}
                                    urls={urls}
                                />
                            ) : (
                                <h1>Selecciona una categoria</h1>
                            )}
                        </section>
                    </>
                ) : null}
                <footer></footer>
            </userContext.Provider>
        </>
    );
}


const colection = "Users";
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export default App;
