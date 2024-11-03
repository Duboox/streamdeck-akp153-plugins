/*!
	@file       defaultPI.js
	@brief      Contains PI for all actions that don't have a specific PI
	@author     Andrew Story
	@copyright  (c) 2024, Corsair Memory, Inc. All Rights Reserved.
*/

function DefaultPI(inContext, inLanguage, actionId) {
    // Inherit from PI
    PI.call(this, inContext, inLanguage);
    this.actionId = actionId;
}
