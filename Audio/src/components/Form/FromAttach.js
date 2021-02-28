import React from 'react'
import request from 'superagent';

class FromAttach extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            files:[]
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    onFormSubmit(e){
        e.preventDefault() // Stop form submit
        request
            .post('http://example.com/file-upload')
            .set('Content-Type', 'multipart/form-data')
            .send('file',this.state.files)
            .then((response) => {
                    console.log("send" + response)
                }
            )
            .catch((err) => {
                    console.log("error")
                }
            )
    }

    onChange(e) {
        this.setState({
            files: this.state.files.concat(Array.from(e.target.files))
        }, function () {
            console.log(this.state.files)
        })
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                {
                    this.state.files.length < 1 ? null
                    :
                        this.state.files.map((file, index) => {
                            return (
                                <div key={index}>{file.name} {file.size/1000}</div>
                            )
                        })


                }

                <input type="file" id={"input-file"} onChange={this.onChange} data-multiple-caption="{count} files selected" multiple/>
                <label htmlFor="input-file">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" />
                        <path d="M24.0101 8.77752C23.3504 8.11043 22.5553 7.76347 21.708 7.77458C20.9153 7.78485 20.1374 8.12171 19.5178 8.72313L19.512 8.72879L11.4691 16.906C10.6643 17.7192 10.6641 18.8998 11.4686 19.7132C11.8587 20.1076 12.3563 20.3248 12.8699 20.3248C12.87 20.3248 12.8701 20.3248 12.8702 20.3248C13.39 20.3248 13.8909 20.1076 14.2831 19.7108L19.8421 14.0316L18.8371 13.048L13.2806 18.7247C13.157 18.8497 13.0112 18.9186 12.87 18.9186C12.731 18.9186 12.5959 18.8533 12.4684 18.7244C12.0983 18.3501 12.3452 18.0197 12.4701 17.8936L20.5027 9.72691C21.2704 8.98638 22.2539 9.00157 23.0103 9.76639C23.9078 10.6739 23.6574 11.7393 23.0109 12.3925L13.8677 21.8355C13.2394 22.4699 12.4445 22.8193 11.629 22.8194C11.6289 22.8194 11.6287 22.8194 11.6286 22.8194C10.8134 22.8194 10.0401 22.4732 9.39221 21.8181C7.87568 20.2848 8.29924 18.4839 9.392 17.3788L16.3212 10.4512L15.3269 9.45677L8.39624 16.3859L8.3936 16.3886C7.5245 17.2668 7.03006 18.3743 7.00138 19.5069C6.97075 20.7147 7.45176 21.8558 8.39244 22.807C9.29729 23.7219 10.4465 24.2257 11.6287 24.2257C11.6289 24.2257 11.6292 24.2257 11.6293 24.2256C12.8244 24.2255 13.9754 23.7268 14.8702 22.8216L24.0134 13.3786C25.33 12.0453 25.3289 10.1109 24.0101 8.77752Z" />
                        <defs>
                            <rect x="7" y="7" width="18" height="18" fill="white"/>
                        </defs>
                    </svg>
                </label>
                <button type="submit">Upload</button>
            </form>
        )
    }
}



export default FromAttach