import React from 'react';
import './Sort.scss';


const Sort = (props) => {
    return (
        <div className="Sort">
            <div className="Sort_button"
                 onClick={() => props.sortArray("name")}
            >Срт имя <b>({props.nameSort ? "взр" : "убыв"})</b></div>
            <div className="Sort_button"
                 onClick={() => props.sortArray("pageviews")}
            >Срт кол.прос. <b>({props.viewsSort ? "взр" : "убыв"})</b></div>
        </div>
    )
}

export default Sort;
