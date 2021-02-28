import {useEffect, useState} from "react";
import superagent from "superagent";

export default (url) => {
    const baseUrl = "https://conduit.productionready.io/api";
    const [isLoading, setIsloading] = useState(false);
    const [response, setResponse] = useState(false);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState({})

    const doResponse = (options = {}) => {
        setOptions(options);
        setIsloading(true)
    }
    useEffect( () => {
        if (!isLoading) { return
        } else {
            console.log("triggeeeeerrrerrrerrrred");
            superagent
                .post(baseUrl+url)
                .send(options) // sends a JSON post body
                .then(res => {
                    console.log(res);

                    setIsloading(false)
                    setResponse(res.data)
                })
                .catch((e) => {
                    console.log(e);
                    setIsloading(false);
                    setError(e.response.data)
                })
        }

    }, [isLoading])
    
    return [{isLoading, response, error}, doResponse]
}