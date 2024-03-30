import Profile from "./Profile";
import React, {  useContext } from "react";
import { userContext } from "../App";

function Login({signUp}) {
    const user = useContext(userContext);
     return (
         <>
             {user ? (
                 <>
                     <Profile
                         user={{
                             name: user.displayName,
                             email: user.email,
                             photoURL: user.photoURL,
                         }}
                     ></Profile>
                 </>
             ) : (
                 <button onClick={signUp}>Iniciar sesíon con Google</button>
             )}
         </>
     );
}
export default Login;
