import React ,{Component} from 'react';
import './MainBlock.scss';
import request from "superagent"

import Writer from "../Writer/Writer";
import Pagination from "../Pagination/Pagination";
import Search from "../Search/Search";
import Sort from "../Sort/Sort";

class MainBlock extends Component {
    state = {
        activeElement: 0,
        dataJson: undefined,
        topWritersPageViews: undefined,
        searchLine: '',
        modernArray: undefined,
        pageNumber: 1,
        pageSize: 10,
        nameSort: false,
        viewsSort: false,
    };
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.changePageNumber = this.changePageNumber.bind(this);
        this.sortArray = this.sortArray.bind(this);
    }
    componentDidMount() {
        request
            .get('/ds-test-react/data.json')
            .then(response => {
                this.setState({
                    dataJson: response.body,
                    topWritersPageViews: response.body.sort((pageviewsA, pageviewsB) => - pageviewsA.pageviews + pageviewsB.pageviews)
                        .slice(0, 3)
                        .map(writet => writet.pageviews)
                }, () => this.modernWritesList() );
            })
            .catch(err => {
                console.log("Error dataJson" + err)
            })
    }
    modernWritesList() {
        this.setState({
            modernArray: this.state.dataJson
                .filter( (word) => word.name.toLowerCase().indexOf(this.state.searchLine) > -1)
        })
    }

    sortArray(type) {
        console.log("sort");
        if (type === "name") {
            this.setState(prevState => ({
                    modernArray: prevState.modernArray.sort((nameA, nameB) => {
                            if (nameA.name.toLowerCase() < nameB.name.toLowerCase()) {
                                if (!this.state.nameSort) {
                                    return -1
                                } else {
                                    return 1
                                }
                            } else if (nameA.name.toLowerCase() > nameB.name.toLowerCase()) {
                                if (!this.state.nameSort) {
                                    return 1
                                } else {
                                    return -1
                                }
                            } else {
                                return 0
                            }

                        }
                    ),
                    nameSort: !prevState.nameSort
                })
            )
        } else if (type === "pageviews") {
            this.setState(prevState => ({
                    modernArray: prevState.modernArray.sort((pageviewsA, pageviewsB) => {
                        if(!this.state.viewsSort) {
                            return (pageviewsA.pageviews - pageviewsB.pageviews)

                        } else {
                            return (-pageviewsA.pageviews + pageviewsB.pageviews)
                        }
                    }

                    ),
                    viewsSort: !prevState.viewsSort
                })
            )
        }

    }
    handleInput(e) {
        this.setState({
                searchLine: e.target.value.toLowerCase()
            }, () => this.modernWritesList()
        )
    }
    changePageNumber(up) {
        this.setState(prevState => ({
                pageNumber: prevState.pageNumber + (up ? +1 : -1)
            }), () => window.scrollTo(0, 0)
        )
    }
    render() {
        return (
            <div className="MainBlock">
                {
                    !this.state.modernArray ? <h1>Чет гурзит</h1>
                        :
                        <>
                            <div className="MainBlock_window fade-in">
                                <Sort
                                    sortArray={this.sortArray}
                                    nameSort={this.state.nameSort}
                                    viewsSort={this.state.viewsSort}
                                />
                                <Search
                                    value={this.state.searchLine}
                                    onChange={this.handleInput}
                                />
                                {
                                    this.state.modernArray
                                        .slice((this.state.pageNumber - 1) * this.state.pageSize, this.state.pageNumber * this.state.pageSize)
                                        .map((writer, index) =>
                                        <Writer
                                            {...writer}
                                            medal={writer.pageviews >= this.state.topWritersPageViews[2] ?
                                                this.state.topWritersPageViews.indexOf(writer.pageviews) + 1
                                                : null}
                                            index={(this.state.pageNumber-1)*this.state.pageSize + index+1}
                                            key={index+""+writer.pageviews}
                                        />
                                    )
                                }
                            </div>
                            <Pagination
                                pageNumber={this.state.pageNumber}
                                pageLength={Math.ceil(this.state.modernArray.length / this.state.pageSize)}
                                changePageNumber={this.changePageNumber}
                            />
                        </>
                }
            </div>

        )
    }
}


export default MainBlock