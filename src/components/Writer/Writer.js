import React from 'react';
import './Writer.scss';

const Writer = (props) => {
    return (
        <div className="Writer">
            <div className="Writer_index">{props.index}</div>
            <div className="Writer_ava"
                 style={{
                     'background': '#'+Math.floor(props.pageviews*10).toString(16)
                 }}
            >{props.name[0]}</div>
            <div className="Writer_info">
                <b>{props.name}</b>
                <div className="Writer_info_count_pub">{props.count_pub} публ.</div>
            </div>
            {
                !props.medal ? null
                    :
                    <div className={`Writer_medal ${props.medal > 2 ? "bronze" : props.medal === 2 ? "silver" : "gold"}`}>
                        <div className="Writer_medal_img"/>
                    </div>
            }
            <div className="Writer_pageviews">{props.pageviews}</div>
        </div>
    );
}

export default Writer;
