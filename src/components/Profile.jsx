import React, { useState } from "react";
function Profile({ user }) {

    

    return (
        <div>
            <img src={user.photoURL} alt="user profile photo" />
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
    );
}

export default Profile;
