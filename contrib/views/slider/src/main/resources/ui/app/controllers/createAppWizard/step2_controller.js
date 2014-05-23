/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

App.CreateAppWizardStep2Controller = Ember.ArrayController.extend({

  needs: "createAppWizard",

  appWizardController: Ember.computed.alias("controllers.createAppWizard"),

  content: [],

  /**
   * New App object
   * @type {App.SliderApp}
   */
  newApp: null,

  /**
   * Load all required data for step
   */
  loadStep: function () {
    this.initializeNewApp();
  },

  /**
   * Initialize new App to use it scope of controller
   */
  initializeNewApp: function () {
    var newApp = this.get('appWizardController.newApp');
    this.set('newApp', newApp);
  },

  /**
   * Fill <code>content</code> with objects created from <code>App.SliderAppTypeComponent</code>
   */
  loadTypeComponents: function () {
    var content = [];
    var allTypeComponents = this.get('newApp.appType.components');
    if (allTypeComponents && allTypeComponents.get('length')) {
      allTypeComponents.forEach(function (typeComponent) {
        content.push(Ember.Object.create({
          name: typeComponent.get('displayName'),
          numInstances: typeComponent.get('defaultNumInstances'),
          yarnMemory: typeComponent.get('defaultYARNMemory'),
          yarnCPU: typeComponent.get('defaultYARNCPU')
        }));
      });
      this.set('content', content);
    }
  }.observes('newApp.appType.components.length'),

  /**
   * Validate all input fields are integer
   * @return {Boolean}
   */
  isError: function () {
    var result = false;
    this.get('content').forEach(function (component) {
      if (!result && (this.isNotInteger(component.get('numInstances')) || this.isNotInteger(component.get('yarnMemory')) || this.isNotInteger(component.get('yarnCPU')))) {
        result = true;
      }
    }, this);
    return result;
  }.property('content.@each.numInstances', 'content.@each.yarnMemory', 'content.@each.yarnCPU'),

  /**
   * Check if param is integer
   * @param value value to check
   * @return {Boolean}
   */
  isNotInteger: function (value) {
    return !value || !(value % 1 == 0);
  },

  /**
   * Define if submit button is disabled
   * <code>isError</code> should be true
   */
  isSubmitDisabled: function () {
    return this.get('isError');
  }.property('isError'),

  /**
   * Save all data about components to <code>appWizardController.newApp.components</code>
   */
  saveComponents: function () {
    this.set('appWizardController.newApp.components', this.get('content'));
  },

  actions: {
    /**
     * Save data and proceed to the next step
     */
    submit: function () {
      this.saveComponents();
      this.get('appWizardController').nextStep();
    }
  }
});
