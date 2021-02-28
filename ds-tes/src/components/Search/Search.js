import React from 'react';
import './Search.scss';
import searchIcon from "../../img/search.png"

const Search = (props) => {
    return (
        <div className="Search">
           <div className="Search_icon">
               <img src={searchIcon} alt="" className="Search_icon_img"/>
           </div>
            <input type="text" placeholder="Поиск авторов"
                   name="search"
                   value={props.value}
                   onChange={props.onChange}
            />
        </div>
    )
}

export default Search;
