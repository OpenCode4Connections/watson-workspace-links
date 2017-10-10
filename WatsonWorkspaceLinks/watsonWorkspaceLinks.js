/*
 * © Copyright IBM Corp. 2017
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at:
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
 * implied. See the License for the specific language governing 
 * permissions and limitations under the License.
 */
 // @name         watsonWorkspaceLinks
 // @version      0.1
 // @author       Brian Gleeson

if (typeof(dojo) != "undefined") {
    require(["dojo/domReady!"], function() {
        // base64 encoded String of your Watson Worspace Services App ID and secret - appId:appSecret
        var base64Auth = "[base64 appID:appSecret]";
        // The ID of the Watson Workspace space that you want to integrate with
        var watsonSpaceId = "[watson space id]";

        var waitFor = function(callback, elXpath) {
            var maxInter = 50; // number of intervals before expiring
            var waitTime = 100; // 1000=1 second
            if(!elXpath) {
                return;
            }

            var waitInter = 0; // current interval
            var intId = setInterval(
                function() {
                    if (++waitInter < maxInter && !dojo.query(elXpath).length) {
                        return;
                    }
                    clearInterval(intId);
                    callback();
                }, waitTime);
        };

        var bearerToken = null;
        var authHeader = 'Basic ' + base64Auth;
        var getBearerToken = function() {
            if(bearerToken === null) {
                var args = {
                    url: 'https://api.watsonwork.ibm.com/oauth/token',
                    headers: {'Authorization': authHeader},
                    postData: {'grant_type': 'client_credentials'},
                    contentType: 'application/x-www-form-urlencoded',
                    load: function(data){
                        var jsonData = JSON.parse(data);
                        bearerToken = jsonData.access_token;
                    },
                    error: function(error){
                        console.log('bearer token error: ' + error.message);
                    }
                };
                dojo.xhrPost(args);
            }
            return bearerToken;
        };
        getBearerToken();

        var postLinkToWorkspace = function(link, text, type) {
            var auth = 'Bearer ' + getBearerToken();
            var messageText = "[" + text + "](" + link + ")\nFollow the link to see more details.";
            var messageTitle = "New " + type + " topic created:";
            var jsonData = JSON.stringify({version: "1", type: "appMessage", annotations: [{version: "1", type: "generic", text: messageText, title: messageTitle }]});

            var args = {
                url: 'https://api.watsonwork.ibm.com/v1/spaces/' + watsonSpaceId + '/messages',
                headers: {'Authorization': auth},
                postData: jsonData,
                contentType: 'application/json',
                load: function(result){
                    console.log('Link posted to Workspace');
                },
                error: function(error){
                    console.log('POST to workspace failed: ' + error.message);
                }
            };
            dojo.xhrPost(args);
        };

        var replaceLikeButton = function(post, btnId, type) {
            var likeBtn = dojo.query("div.lotusLike", post);
            if(null !== likeBtn && undefined !== likeBtn && likeBtn.length > 0) {
                // Get the update link and text values
                var postLink = dojo.query("td h4.lotusBreakWord a", post)[0].href;
                var postText = dojo.query("td h4.lotusBreakWord", post)[0].innerText;

                // Replace like buttons with Watson buttons
                dojo.place("<div id='"+ btnId +"' style='cursor:pointer;' title='Post link in Watson Workspace'>" +
                           "<img src='https://xpages-fusion-alchemy.mybluemix.net/xpagesFusionAlchemy.nsf/workspace.png' style='width:20px;height:20px;' />" +
                           "</div>", likeBtn[0], "replace");
                dojo.query('#' + btnId).onclick(function(event){
                    postLinkToWorkspace(postLink, postText, type);
                });
            }
        };

        var addForumWorkspaceLinks = function() {
            // Get forums post list
            var forumPosts = dojo.query(".forumPagedList table tbody tr");
            // Replace all like buttons
            forumPosts.forEach(function(forumPost, i) {
                replaceLikeButton(forumPost, 'watsonForum' + i, 'forum');
            });
        };
        var addWikiWorkspaceLinks = function() {
            // Get wiki post list
            var wikiPosts = dojo.query("#iWikiWidgetContent table tbody tr");
            wikiPosts.forEach(function(wikiPost, i) {
                replaceLikeButton(wikiPost, 'watsonWiki' + i, 'wiki');
            });
        };

        waitFor(addForumWorkspaceLinks, '.forumPagedList table tbody tr');
        waitFor(addWikiWorkspaceLinks, '#iWikiWidgetContent table tbody tr');
    });
}
