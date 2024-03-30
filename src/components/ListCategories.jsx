import React from "react";

function ListCategories({ categories, handleCategory, removeCategory }) {
    const selectCategory = (event) => {
        event.stopPropagation();
        handleCategory(event.target.id);
    };
    const remove = (event) => {
        event.stopPropagation();
        removeCategory(event.target.id);
    };
    return (
        <ul>
            {categories.map((el, i) => (
                <div key={i}>
                    <li  id={el} onClick={selectCategory}>
                        {el}
                    </li>
                    <button id={el} onClick={remove}>
                        x
                    </button>
                </div>
            ))}
        </ul>
    );
}
export default ListCategories;
