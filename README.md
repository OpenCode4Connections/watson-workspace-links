# watson-workspace-links

## Setup
- Add watsonWorkspaceLinks.json application to your Conenctions organisation
- In the JSON, replace the placeholder `[your-community-id]` with the UUID of the community to which you wish to add the widget
- Or remove the match property completely, so that the extension applies for all communities
- Ensure the include-files property pulls the correct path referencing the watsonWorkspaceLinks.js file
- In the watsonWorkspaceLinks.js file, replace the `base64Auth` placeholder with your own base64 encoded appId:appSecret. This requires the creation of a Watson Work Services application. See here: https://developer.watsonwork.ibm.com/docs
- Also replace the placeholder `watsonSpaceId` with the ID of the space in Watson Workspace that you want to integrate with
- In Watson Workspace, be sure to enable your Work Services application for your chosen space. Consult the Watson Work Services documentation for more details.

## Description
This Customizer application alters the appearance and function of Forum and Wiki updates in the Community Overview page. In the Forum and Wiki widgets on the community overview page, they each list recent updates from the respective applications. By default, each update has a like button on the right hand side. This Customizer application replaces the like button with a Watson button. When the user clicks the Watson button, it will post a link to the forum topic or wiki doc into a Watson Workspace space.
