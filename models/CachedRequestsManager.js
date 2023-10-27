import * as utilities from "../utilities.js";
import * as serverVariables from "../serverVariables.js";
import {log} from "../log.js";
let repositoryCachesExpirationTime = serverVariables.get("main.repository.CacheExpirationTime");

globalThis.CachedRequestUrls = [];

export default class CachedRequestsManager{
    static add(url,content,Etag="") {
        if (url != "") {
            CachedRequestUrls.push({
                url,
                content,
                Etag,
                Expire_Time: utilities.nowInSeconds() + repositoryCachesExpirationTime
            });
            console.log("URL:" + model + " added in RequestedURL cache");
        }
    }
    static find(url) {
        try {
            if (url != "") {
                for (let cache of CachedRequestUrls) {
                    if (cache.url == url) {
                        cache.Expire_Time = utilities.nowInSeconds() + repositoryCachesExpirationTime;
                        console.log("File data of " + url + " retreived from RequestedURL cache");
                        return cache;
                    }
                }
            }
        } catch (error) {
            console.log("repository cache error!", error);
        }
        return null;
    }
    static clear(url) {
        if (url != "") {
            let indexToDelete = [];
            let index = 0;
            for (let cache of CachedRequestUrls) {
                if (cache.url == url) indexToDelete.push(index);
                index++;
            }
            utilities.deleteByIndex(CachedRequestUrls, indexToDelete);
        }
    }
    static flushExpired() {
        let indexToDelete = [];
        let index = 0;
        let now = utilities.nowInSeconds();
        for (let cache of CachedRequestUrls) {
            if (cache.Expire_Time < now) {
                console.log("Cached file data of " + cache.model + ".json expired");
                indexToDelete.push(index);
            }
            index++;
        }
        utilities.deleteByIndex(CachedRequestUrls, indexToDelete);
    }
    static get(httpcontext)
    {
        if(httpcontext != null)
        {
            query = httpcontext.path.queryString!=""
            if(query!="")
            {
                for(let cache of CachedRequestUrls)
                {
                    if(cache.url = query)
                    {
                        HttpContext.response.JSON( cache.content, cache.ETag, true)
                    }
                }
                HttpContext.response.JSON("Url does not exist")
            }
        }
        return null;
    }

}