//////////////////////////////////////////////////////////////////////////
// Title:  The Javascript Grid Editor
// Version: 1.0.11  (see README for version information)
//
// Copyright 2010 David Berry
// Licensed under the Apache License, Version 2.0 (the "License"); 
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0 
//
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and 
// limitations under the License. 
//////////////////////////////////////////////////////////////////////////

// [START] --- DO NOT MODIFY ---
// Grid Editor Object Constants
var GEO_CONSTANT_RECORDSTATE_OPEN = 1;
var GEO_CONSTANT_RECORDSTATE_CLOSED = 2;
var GEO_CONSTANT_MODE_VIEW = 1;
var GEO_CONSTANT_MODE_EDIT = 2;
var GEO_CONSTANT_MODE_ADD = 3;
var GEO_CONSTANT_ACTION_EDIT = 1;
var GEO_CONSTANT_ACTION_ADD = 2;
var GEO_CONSTANT_ACTION_SAVE = 3;
var GEO_CONSTANT_ACTION_CANCEL = 4;

// Setup the container for registered button labels, as defined in the ISV.config file.  Defaulted with configuration for the English language ID (1033).
var GEO_REGISTEREDBUTTONLABELS = new Object();

// Setup the container for labels associated with the Edit/Save button
GEO_REGISTEREDBUTTONLABELS.EditSaveButton = new Array();

// Setup the container for labels associated with the New/Cancel button
GEO_REGISTEREDBUTTONLABELS.NewCancelButton = new Array();
// [END]

// [START]    --- MODIFY GEO_REGISTEREDBUTTONLABELS ---
// Define languages and labels used to identify the buttons; Default configuration for 1033 provided.
// [CL]:  Internal
GEO_REGISTEREDBUTTONLABELS.EditSaveButton[1033] = new Array();
GEO_REGISTEREDBUTTONLABELS.EditSaveButton[1033][GEO_CONSTANT_MODE_VIEW] = "Edit Mode";
GEO_REGISTEREDBUTTONLABELS.EditSaveButton[1033][GEO_CONSTANT_MODE_EDIT] = "Save All";
GEO_REGISTEREDBUTTONLABELS.EditSaveButton[1033][GEO_CONSTANT_MODE_ADD] = "Save New";

GEO_REGISTEREDBUTTONLABELS.NewCancelButton[1033] = new Array();
GEO_REGISTEREDBUTTONLABELS.NewCancelButton[1033][GEO_CONSTANT_MODE_VIEW] = "Insert Mode";
GEO_REGISTEREDBUTTONLABELS.NewCancelButton[1033][GEO_CONSTANT_MODE_EDIT] = "Cancel All";
GEO_REGISTEREDBUTTONLABELS.NewCancelButton[1033][GEO_CONSTANT_MODE_ADD] = "Cancel New";
// [END]

// [START]    --- MODIFY GEO_ENTITYNAME ---
// Define the entity for which the Grid Editor Object will be activated
// [CL]:  Internal
var GEO_ENTITYNAME = "";
// [END]

// [START]    --- MODIFY GEO_STATEATTRIBUTE ---
// Define the attribute from which the state of the record is defined
// [CL]:  Internal
var GEO_STATEATTRIBUTE = "statecode";
// [END]

// [START]    --- MODIFY GEO_ENABLEADD ---
// [CL]:  Internal
var GEO_ENABLEADD = true;
// [END]

// [START]    --- MODIFY GEO_ENABLEEDIT ---
// [CL]:  Internal
var GEO_ENABLEEDIT = true;
// [END]

// [START]    --- MODIFY GEO_RESTRICTEDATTRIBUTES ---
// Declare any attributes restricted from acquiring controls for create and update in an Array
// [CL]:  Internal
var GEO_RESTRICTEDATTRIBUTES = new Array();
// [END]

// [START]    --- MODIFY GEO_DISABLEATTRIBUTES ---
// Declare any attributes that should have disabled controls in an Array
// Note:  this differs from restricted attributes in that a value may be specified via script, but restricted from UI access
if (typeof(GEO_DISABLEATTRIBUTES) == "undefined" || GEO_DISABLEATTRIBUTES == null) {
  // [CL]:  Internal Conditional
  var GEO_DISABLEATTRIBUTES = new Array();
}
// [CL]: Internal

// [END]

// [START]    --- MODIFY GEO_EDIT_VALIDSTATEVALUES ---
// Declare the acceptable integer values allowed for opening records for editing in an array
// [CL]:  Internal
var GEO_EDIT_VALIDSTATEVALUES = [0];
// [END]

// [START]    --- MODIFY GEO_ADD_DEFAULTSTATEVALUE ---
// Declare the acceptable, default value for the configured state attribute of newly created records
// [CL]:  Internal
var GEO_ADD_DEFAULTSTATEVALUE = 0;
// [END]

// [START]    --- MODIFY GEO_ADD_DEFAULTVALUES ---
// Setup the container for default values used for new records
if (typeof(GEO_ADD_DEFAULTVALUES) == "undefined" || GEO_ADD_DEFAULTVALUES == null) {
  var GEO_ADD_DEFAULTVALUES = new Object();
  GEO_ADD_DEFAULTVALUES.Properties = new Object();
  GEO_ADD_DEFAULTVALUES.Collections = new Object();
  
  // [CL]:  Internal Conditional
}
// [CL]: Internal
// [END]

// [START]    --- DO NOT MODIFY ---
// Default state assignment for new records
if (!GEO_STATEATTRIBUTE in GEO_ADD_DEFAULTVALUES.Properties) {
  
}
// [END]

function IncludeScript(targetDoc, script) {
  var htmlDoc = targetDoc.getElementsByTagName("head").item(0);
  var js = targetDoc.createElement("script");
  js.setAttribute("type", "text/javascript");
  js.text = script;
  htmlDoc.appendChild(js);
  
  return js;
}

function IncludeExternalScript(targetDoc, filename) {
  var httpObj = new ActiveXObject("Msxml2.XMLHTTP");
  httpObj.open("GET", filename, false);
  httpObj.send(null);

  if (httpObj.status == 200 || httpObj.status == 304) {
    IncludeScript(targetDoc, httpObj.responseText);
  } else {
    alert("Failure loading external script: " + filename); 
  }
}

function IncludeStylesheet(targetDoc, script) {
  var htmlDoc = targetDoc.getElementsByTagName("head").item(0);
  var css = targetDoc.createElement("style");
  //css.setAttribute("rel", "stylesheet");
  css.setAttribute("type", "text/css");
  css.styleSheet.cssText = script;
  htmlDoc.appendChild(css);
  
  return css;
}

function IncludeExternalStylesheet(targetDoc, filename) {
  var httpObj = new ActiveXObject("Msxml2.XMLHTTP");
  httpObj.open("GET", filename, false)
  httpObj.send(null);
  
  if (httpObj.status == 200 || httpObj.status == 304) {
    IncludeStylesheet(targetDoc, httpObj.responseText);
  } else {
    alert ("Failure loading external script: " + filename);
  }
}

function MischiefMayhemSOAP(serviceUrl, xmlSoapBody, soapActionHeader, suppressError) {
  var xmlReq = "<?xml version='1.0' encoding='utf-8'?>"
    + "<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'"
    + "  xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'"
    + "  xmlns:xsd='http://www.w3.org/2001/XMLSchema'>"
    + GenerateAuthenticationHeader()
    + "  <soap:Body>"
    + xmlSoapBody
    + "  </soap:Body>"
    + "</soap:Envelope>";

  var httpObj = new ActiveXObject("Msxml2.XMLHTTP");

  httpObj.open("POST", serviceUrl, false);

  httpObj.setRequestHeader("SOAPAction", soapActionHeader);
  httpObj.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
  httpObj.setRequestHeader("Content-Length", xmlReq.length);

  httpObj.send(xmlReq);

  var resultXml = httpObj.responseXML;

  var errorCount = resultXml.selectNodes("//error").length;
  if (errorCount != 0) {
    var msg = resultXml.selectSingleNode("//description").nodeTypedValue;
    
    if (typeof(suppressError) == "undefined" || suppressError == null) {
      alert("The following error was encountered: " + msg);
    }
    
    return null;
  } else {
    return resultXml;
  }
}

function RetrieveEntity(entityName, entityItems) {
  var xmlSoapBody = ""
    + "    <Execute xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>"
    + "      <Request xsi:type='RetrieveEntityRequest'>"
    + "        <LogicalName>" + entityName + "</LogicalName>"
    + "        <EntityItems>" + entityItems + "</EntityItems>"
    + "        <RetrieveAsIfPublished>true</RetrieveAsIfPublished>"
    + "      </Request>"
    + "    </Execute>";
    
  var resultXml = MischiefMayhemSOAP("/mscrmservices/2007/MetadataService.asmx", xmlSoapBody, "http://schemas.microsoft.com/crm/2007/WebServices/Execute");

  if (resultXml != null) {
    var metaData = resultXml.selectSingleNode("//EntityMetadata");
    
    if (metaData != null) {
      // Setup a new object to return
      entity = new Object();
      entity.LogicalName = entityName;

      // Extract ObjectTypeCode
      entity.ObjectTypeCode = metaData.selectSingleNode("ObjectTypeCode").nodeTypedValue;
      
      // Extract PrimaryKey
      entity.PrimaryKey = metaData.selectSingleNode("PrimaryKey").nodeTypedValue;

      // Look for Attribute Metadata
      var attributeMetaData = metaData.selectNodes("Attributes/Attribute");

      if (attributeMetaData != null) {
        entity.Attributes = new Object();
        
        // Enumerate each attribute and attach it to the Attributes
        for (attributeIndex = 0; attributeIndex < attributeMetaData.length; attributeIndex++) {
          var attributeNode = attributeMetaData.item(attributeIndex);

          // Setup new attribute to add
          attribute = new Object();
          attribute.EntityLogicalName = entityName;
    
          // Extract AttributeType
          attribute.AttributeType = attributeNode.selectSingleNode("AttributeType").firstChild.nodeTypedValue;
    
          // Extract DisplayMask
          attribute.DisplayMask = attributeNode.selectSingleNode("DisplayMask").firstChild.nodeTypedValue;

          // Extract LogicalName
          attribute.LogicalName = attributeNode.selectSingleNode("LogicalName").nodeTypedValue;

          // Extract RequiredLevel
          attribute.RequiredLevel = attributeNode.selectSingleNode("RequiredLevel").firstChild.nodeTypedValue;
          
          // Extract ValidForCreate
          attribute.ValidForCreate = attributeNode.selectSingleNode("ValidForCreate").nodeTypedValue == "true" ? true : false;
          
          // Extract ValidForRead
          attribute.ValidForRead = attributeNode.selectSingleNode("ValidForRead").nodeTypedValue == "true" ? true : false;
          
          // Extract ValidForUpdate
          attribute.ValidForUpdate = attributeNode.selectSingleNode("ValidForUpdate").nodeTypedValue == "true" ? true : false;
          
          // Extract DefaultValue (if present)
          if (attributeNode.selectSingleNode("DefaultValue") != null) {
            attribute.DefaultValue = attributeNode.selectSingleNode("DefaultValue").nodeTypedValue;
          }

          // Extract DisplayName (if present)
          if (attributeNode.selectSingleNode("DisplayName/UserLocLabel/Label") != null) {
            attribute.DisplayName = attributeNode.selectSingleNode("DisplayName/UserLocLabel/Label").nodeTypedValue;
          }

          // Extract Format (if present)
          if (attributeNode.selectSingleNode("Format") != null) {
            attribute.Format = attributeNode.selectSingleNode("Format").firstChild.nodeTypedValue;
          } else {
            // Make a special exception for Integer-type attributes with a missing Format
            if (attribute.AttributeType == "Integer") {
              attribute.Format = "None";
            }
          }
    
          // Extract MaxLength (if present)
          if (attributeNode.selectSingleNode("MaxLength") != null) {
            attribute.MaxLength = attributeNode.selectSingleNode("MaxLength").firstChild.nodeTypedValue;
          }
    
          // Extract MaxValue (if present)
          if (attributeNode.selectSingleNode("MaxValue") != null) {
            attribute.MaxValue = attributeNode.selectSingleNode("MaxValue").nodeTypedValue;
          }
    
          // Extract MinValue (if present)
          if (attributeNode.selectSingleNode("MinValue") != null) {
            attribute.MinValue = attributeNode.selectSingleNode("MinValue").nodeTypedValue;
          }
    
          // Extract Precision (if present)
          if (attributeNode.selectSingleNode("Precision") != null) {
            attribute.Precision = attributeNode.selectSingleNode("Precision").nodeTypedValue;
          }
    
          // Extract TrueOption and FalseOption (if present)
          if (attributeNode.selectSingleNode("FalseOption") != null && attributeNode.selectSingleNode("TrueOption") != null) {
            attribute.Options = new Array();
    
            // Locate and append the TrueOption into the Options array
            var trueOption = new Object();
            trueOption.Value = attributeNode.selectSingleNode("TrueOption/Value").nodeTypedValue;
            trueOption.Label = attributeNode.selectSingleNode("TrueOption/Label/UserLocLabel/Label").nodeTypedValue;
            
            attribute.Options.push(trueOption);
    
            // Locate and append the FalseOption into the Options array
            var falseOption = new Object();
            falseOption.Value = attributeNode.selectSingleNode("FalseOption/Value").nodeTypedValue;
            falseOption.Label = attributeNode.selectSingleNode("FalseOption/Label/UserLocLabel/Label").nodeTypedValue;
            
            attribute.Options.push(falseOption);
          }
    
          // Extract Options (if present)
          var options = attributeNode.selectNodes("Options/Option");
          var optionNode = null;
    
          if (options.length > 0) {
            // Extract each Option with corresponding Value and Label data
            // Place into Options array on attribute object
            if (typeof(attribute.Options) == "undefined") {
              attribute.Options = new Array();
            }
            
            for (index = 0; index < options.length; index++) {
              optionNode = options.item(index);
    
              option = new Object();
              
              option.Value = optionNode.selectSingleNode("Value").nodeTypedValue;
              option.Label = optionNode.selectSingleNode("Label/UserLocLabel/Label").nodeTypedValue;
              
              attribute.Options.push(option);
            }
          }
          
          // Extract Status Options (if present)
          options = attributeNode.selectNodes("Options/StatusOption");
          
          if (options.length > 0) {
            // Extract each StatusOption with corresponding Value, Label, and State data
            // Place into Options array on attribute object
            if (typeof(attribute.Options) == "undefined") {
              attribute.Options = new Array();
            }
            
            for (index = 0; index < options.length; index++) {
              optionNode = options.item(index);
    
              option = new Object();
              
              option.Value = optionNode.selectSingleNode("Value").nodeTypedValue;
              option.Label = optionNode.selectSingleNode("Label/UserLocLabel/Label").nodeTypedValue;
              option.State = optionNode.selectSingleNode("State").nodeTypedValue;
              
              attribute.Options.push(option);
            }
          }
    
          // Extract State Options (if present)
          options = attributeNode.selectNodes("Options/StateOption");
          
          if (options.length > 0) {
            // Extract each StateOption with corresponding Value, Label, DefaultStatus, and InvariantName data
            // Place into Options array on attribute object
            if (typeof(attribute.Options) == "undefined") {
              attribute.Options = new Array();
            }
            
            for (index = 0; index < options.length; index++) {
              optionNode = options.item(index);
              
              option = new Object();
              
              option.Value = optionNode.selectSingleNode("Value").nodeTypedValue;
              option.Label = optionNode.selectSingleNode("Label/UserLocLabel/Label").nodeTypedValue;
              option.DefaultStatus = optionNode.selectSingleNode("DefaultStatus").nodeTypedValue;
              option.InvariantName = optionNode.selectSingleNode("InvariantName").nodeTypedValue;
              
              attribute.Options.push(option);
            }
          }
    
          // Extract Targets (if present)
          var targets = attributeNode.selectNodes("Targets/Target");
          
          if (targets.length > 0) {
            // Extract each Target and place into Targets array on attribute object
            attribute.Targets = new Array();
    
            for (index = 0; index < targets.length; index++) {
              var targetNode = targets.item(index);
              
              attribute.Targets.push(targetNode.nodeTypedValue);
            }
          } else {
            // Make a special exception to Owner-type attributes with missing Targets
            if (attribute.AttributeType == "Owner") {
              attribute.Targets = new Array("systemuser");
            }
          }

          entity.Attributes[attribute.LogicalName] = attribute;
        }
      }

      return entity;
    } else {
      return null;
    }
  } else {
    return false;
  }
}

function RetrieveRecord(entityName, entityId, attrArray) {
  var xmlSoapBody = ""
    + "    <Retrieve xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>"
    + "      <entityName>" + entityName + "</entityName>"
    + "      <id>" + entityId + "</id>"
    + "      <columnSet xmlns:q1='http://schemas.microsoft.com/crm/2006/Query' xsi:type='q1:ColumnSet'>"
    + "        <q1:Attributes>";

  for (attrIndex in attrArray) {
    xmlSoapBody += "          <q1:Attribute>" + attrArray[attrIndex] + "</q1:Attribute>";
  }

  xmlSoapBody += ""
    + "        </q1:Attributes>"
    + "      </columnSet>"
    + "    </Retrieve>";

  var resultXml = MischiefMayhemSOAP('/mscrmservices/2007/crmservice.asmx', xmlSoapBody, 'http://schemas.microsoft.com/crm/2007/WebServices/Retrieve');

  if (resultXml != null) {
    retrievedRecord = new Object();
    retrievedRecord.Properties = new Object();
    retrievedRecord.Collections = new Object();
    retrievedRecord.Name = entityName;
    retrievedRecord.Id = entityId;

    for (recordAttrIndex in attrArray) {
      var resultNode = resultXml.selectSingleNode("//q1:" + attrArray[recordAttrIndex]);
      if (resultNode != null) {
        // Handle a collection of activityparty results by placing them into a Collection array
        if (resultNode.selectSingleNode("q1:activityparty") != null) {
          retrievedRecord.Collections[attrArray[recordAttrIndex]] = new Array();

          for (activitypartyIndex = 0; activitypartyIndex < resultNode.childNodes.length; activitypartyIndex++) {
            var partyObject = new Object();
            var activitypartyNode = resultNode.childNodes.item(activitypartyIndex);

            for (childIndex = 0; childIndex < activitypartyNode.childNodes.length; childIndex++) {
              var partyNode = activitypartyNode.childNodes.item(childIndex);
              
              partyObject[partyNode.nodeName.slice(3)] = partyNode.nodeTypedValue;
  
              if (partyNode.attributes.length > 0) {
                for (partyNodeAttrIndex = 0; partyNodeAttrIndex < partyNode.attributes.length; partyNodeAttrIndex++) {
                  var partyAttrNode = partyNode.attributes.item(partyNodeAttrIndex);
                  
                  partyObject[partyNode.nodeName.slice(3) + partyAttrNode.name] = partyAttrNode.nodeTypedValue;
                }
              }
            }
            
            retrievedRecord.Collections[attrArray[recordAttrIndex]].push(partyObject);
          }
        } else {
          retrievedRecord.Properties[attrArray[recordAttrIndex]] = resultNode.nodeTypedValue;
          
          // Build extended data into the retrieved record from the attributes of the nodes describing the record's fields
          if (resultNode.attributes.length > 0) {
            for (resultNodeAttrIndex = 0; resultNodeAttrIndex < resultNode.attributes.length; resultNodeAttrIndex++) {
              var attributeNode = resultNode.attributes.item(resultNodeAttrIndex);

              retrievedRecord.Properties[attrArray[recordAttrIndex] + attributeNode.name] = attributeNode.nodeTypedValue;
            }
          }
        }
      } else {
        retrievedRecord.Properties[attrArray[recordAttrIndex]] = null;
      }
    }

    return retrievedRecord;
  } else {
    return null;
  }
}

function CreateRecord(record) {
  var xmlSoapBody = ""
    + "    <Create xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>"
    + "      <entity xsi:type='" + record.Name + "'>"

  // Build standard properties
  if (typeof(record.Properties) != "undefined") {
    for (propertyName in record.Properties) {
      xmlSoapBody += "      <" + propertyName 
      
      if (typeof(record.PropertyType[propertyName]) != "undefined") {
        xmlSoapBody += " type='" + record.PropertyType[propertyName] + "'";
      }
      
      xmlSoapBody += ">" + record.Properties[propertyName] + "</" + propertyName + ">";
    }
  }

  // Build partylist collections
  if (typeof(record.Collections) != "undefined") {
    for (collectionName in record.Collections) {
      var collection = record.Collections[collectionName];

      xmlSoapBody += ""
        + "      <" + collectionName + ">";

      for (activityPartyIndex in collection) {
        xmlSoapBody += ""
          + "        <activityparty>"
          + "          <partyobjecttypecode>" + collection[activityPartyIndex].partyobjecttypecode + "</partyobjecttypecode>"
          + "          <partyid>" + collection[activityPartyIndex].partyid + "</partyid>"
          + "          <participationtypemask>" + collection[activityPartyIndex].participationtypemask + "</participationtypemask>"
          + "        </activityparty>";
      }

      xmlSoapBody += ""
        + "      </" + collectionName + ">";
    }
  }

  xmlSoapBody += ""
    + "      </entity>"
    + "    </Create>";

  var resultXml = MischiefMayhemSOAP('/mscrmservices/2007/crmservice.asmx', xmlSoapBody, 'http://schemas.microsoft.com/crm/2007/WebServices/Create');

  if (resultXml != null) {
    return true;
  } else {
    return false;
  }
}

function UpdateRecord(record) {
  var xmlSoapBody = ""
    + "    <Update xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>"
    + "      <entity xsi:type='" + record.Name + "'>"
    + "      <" + record.PrimaryKey + ">" + record.Id + "</" + record.PrimaryKey + ">";

  // Build standard properties
  if (typeof(record.Properties) != "undefined") {
    for (propertyName in record.Properties) {
      xmlSoapBody += "      <" + propertyName 
      
      if (typeof(record.PropertyType[propertyName]) != "undefined") {
        xmlSoapBody += " type='" + record.PropertyType[propertyName] + "'";
      }
      
      xmlSoapBody += ">" + record.Properties[propertyName] + "</" + propertyName + ">";
    }
  }

  // Build partylist collections
  if (typeof(record.Collections) != "undefined") {
    for (collectionName in record.Collections) {
      var collection = record.Collections[collectionName];

      xmlSoapBody += ""
        + "      <" + collectionName + ">";

      for (activityPartyIndex in collection) {
        xmlSoapBody += ""
          + "        <activityparty>"
          + "          <partyobjecttypecode>" + collection[activityPartyIndex].partyobjecttypecode + "</partyobjecttypecode>"
          + "          <partyid>" + collection[activityPartyIndex].partyid + "</partyid>"
          + "          <participationtypemask>" + collection[activityPartyIndex].participationtypemask + "</participationtypemask>"
          + "        </activityparty>";
      }

      xmlSoapBody += ""
        + "      </" + collectionName + ">";
    }
  }

  xmlSoapBody += ""
    + "      </entity>"
    + "    </Update>";

  var resultXml = MischiefMayhemSOAP('/mscrmservices/2007/crmservice.asmx', xmlSoapBody, 'http://schemas.microsoft.com/crm/2007/WebServices/Update');

  if (resultXml != null) {
    return true;
  } else {
    return false;
  }
}

function AssociateObjWithEvent(object, methodName) {
  return (
    function(event) {
      return object[methodName](event, this);
    }
  );
}

function DisableEventBubbling() {
  window.event.cancelBubble = true;
}

function WaitForElementReady(htmlElement, handler) {
  if (htmlElement.readyState == "complete" || htmlElement.complete) {
    handler();
  } else {
    setTimeout(function() {WaitForElementReady(htmlElement, handler);}, 50);
  }
}

function GridEditorObject() {
  // function to identify information about the entity being edited
  this.IdentifyEntity = function(entityName) {
    var entityInformation = RetrieveEntity(entityName, "IncludeAttributes");
    
    if (entityInformation != false && entityInformation != null) {
      this.TargetEntity = entityInformation;
    } else {
      alert("Unable to identify information for the entity on this grid.  Cancelling.");
      this.Cancel = true;
    }
  }

  // function to identify the available states for the entity
  this.IdentifyValidEntityState = function(entityName) {
    var stateAttribute = this.TargetEntity.Attributes["statecode"];

    if (stateAttribute != null && stateAttribute != false) {
      for (stateOptionIndex in stateAttribute.Options) {
        var stateOption = stateAttribute.Options[stateOptionIndex];

        // The state with a value of "0" is the default state which is valid for a new record, and editing existing records
        if (stateOption.Value == "0") {
          return stateOption;
        }
      }
    }

    alert("Unable to identify a valid state for the entity on this grid.  Cancelling.");
    this.Cancel = true;
  }

  // function to retrieve valid attributes about the entity
  this.IdentifyAttributes = function(entityName) {
    var validatedAttrs = new Object();
    var restrictedAttrs = new Object();
    var validatedAttrsNum = 0;
	var stateAttributeIncluded = false;

    // Gather the column definitions from the gridBar element
    this.GridColumns = document.getElementById("gridBar").rows[0].getElementsByTagName("TH");

    // Register the current "viewid" of the grid
    this.GridLastViewId = document.all.crmGrid.all.divGridParams.all.viewid.value;

    if (typeof(GEO_RESTRICTEDATTRIBUTES) != "undefined") {
      for (restrictionIndex in GEO_RESTRICTEDATTRIBUTES) {
        restrictedAttrs[GEO_RESTRICTEDATTRIBUTES[restrictionIndex]] = true;
      }
    }

    // Validate data table columns against the entity and attributes marked as restricted, then associate validated attributes to retrieved metadata
    for (var colIndex = 0; colIndex < this.GridColumns.length; colIndex++) {
      if (this.GridColumns[colIndex].entityname == this.TargetEntity.LogicalName) {
        var attribute = this.TargetEntity.Attributes[this.GridColumns[colIndex].field];
        
        if (attribute != null && attribute != false && typeof(restrictedAttrs[attribute.LogicalName]) == "undefined") {
          attribute.GridPosition = colIndex + 2; // Account for the offset of the first two cells in each row in the data grid
          validatedAttrs[attribute.LogicalName] = attribute;
          validatedAttrsNum++;
        }
      }
    }

    // Make sure there are Attributes to set, otherwise GridEditor will be unable to function
    if (validatedAttrsNum > 0) {
      this.Attributes = validatedAttrs;
    } else {
      alert("Unable to retrieve attributes for this grid.  Cancelling.");
      this.Cancel = true;
    }
  }

  // function to examine the last recorded "viewid" for the grid, and to update the Identified attributes if changed
  this.CheckForViewUpdate = function() {
    if (this.GridLastViewId != document.all.crmGrid.all.divGridParams.all.viewid.value) {
      this.IdentifyAttributes(this.TargetEntity.LogicalName);
    }
  }

  // function to validate the presence of all System and Business required attributes in the grid
  this.ValidateRequiredAttributes = function() {
    var allRequiredPresent = true;

    // cycle through all the attribute definitions retrieved from the Metadata
    for (attrLogicalName in this.TargetEntity.Attributes) {
      var attribute = this.TargetEntity.Attributes[attrLogicalName];

      // if the attribute is required, but not present, fail out of the cycle and return false
      if ((attribute.DisplayMask != "None" && attribute.DisplayMask != "ObjectTypeCode") &&
          (attribute.AttributeType != "PrimaryKey" && attribute.ValidForCreate == true) &&
          (attribute.RequiredLevel == "SystemRequired" || attribute.RequiredLevel == "Required") && 
          typeof(this.Attributes[attribute.LogicalName]) == "undefined") {
        allRequiredPresent = false;
        break;
      }
    }

    return allRequiredPresent;
  }

  // function to retrieve global variables from the Advanced Find page, for use with controls
  // note: of all the ways to set and/or retrieve the globals used by controls, in order to make them available
  //       to all grid locations, this is the only one that works every time, and will likely adhere properly to
  //       changes that Microsoft makes to the controls and/or global variables in the future
  this.RetrieveGlobals = function() {
    var httpObj = new ActiveXObject("Msxml2.XMLHTTP");
    httpObj.open("GET", SERVER_URL + "/AdvancedFind/AdvFind.aspx", false);
    httpObj.send(null);

    var responseText = httpObj.responseText;
    var searchString = "<script type=\"text/javascript\">";
    var responseScript = responseText.slice(responseText.indexOf(searchString) + searchString.length, responseText.indexOf("</script>"));

    return responseScript;
  }

  this.IdentifyButtons = function() {
    var editSaveButtonFound = false;
    var newCancelButtonFound = false;
    var liElements = document.getElementsByTagName("li");

    for (var elementIndex = 0; elementIndex < liElements.length; elementIndex++) {
      if (liElements[elementIndex].innerText == this.ActionButtons.EditSave.RegisteredText[this.Locale][this.Mode]) {
        this.ActionButtons.EditSave.LiElement = liElements[elementIndex];
    editSaveButtonFound = true;
      } else if (liElements[elementIndex].innerText == this.ActionButtons.NewCancel.RegisteredText[this.Locale][this.Mode]) {
        this.ActionButtons.NewCancel.LiElement = liElements[elementIndex];
    newCancelButtonFound = true;
      }

      if (this.ActionButtons.EditSave.LiElement != null && this.ActionButtons.NewCancel.LiElement != null) {
        break;
      }
    }
    
    return (editSaveButtonFound && newCancelButtonFound);
  }

  // action handler for button click
  this.OnButtonClick = function(buttonElement) {
    // The functionality of the GridEditorObject hinges on whether or not it's initialized
    if (this.Initialized) {
      // Determine which button this action came from
      switch(buttonElement.innerText) {
        // The Edit/Save button
        case this.ActionButtons.EditSave.RegisteredText[this.Locale][this.Mode]: 
          // Perform a specific action for this button, depending on the Mode
          switch(this.Mode) {
            // Currently in View mode; button is to enter Edit mode
            case GEO_CONSTANT_MODE_VIEW:
              if (GEO_ENABLEEDIT) {
                this.TakeAction(GEO_CONSTANT_ACTION_EDIT);
              }
              break;
            // Currently in Edit mode; button is to Save All
            case GEO_CONSTANT_MODE_EDIT:
              this.TakeAction(GEO_CONSTANT_ACTION_SAVE);
              break;
            // Currently in Add mode; button is to Save
            case GEO_CONSTANT_MODE_ADD:
              this.TakeAction(GEO_CONSTANT_ACTION_SAVE);
              break;
          }
          break;

        // The New/Cancel button
        case this.ActionButtons.NewCancel.RegisteredText[this.Locale][this.Mode]:
          // Perform a specific action for this button, depending on the Mode
          switch(this.Mode) {
            // Currently in View mode; button is to enter Add mode
            case GEO_CONSTANT_MODE_VIEW:
              if (GEO_ENABLEADD) {
                this.TakeAction(GEO_CONSTANT_ACTION_ADD);
              }
              break;
            // Currently in Edit mode; button is to Cancel All
            case GEO_CONSTANT_MODE_EDIT:
              this.TakeAction(GEO_CONSTANT_ACTION_CANCEL);
              break;
            // Currently in Add mode; button is to Cancel
            case GEO_CONSTANT_MODE_ADD:
              this.TakeAction(GEO_CONSTANT_ACTION_CANCEL);
              break;
          }
          break;
      }
    }
  }

  // function to perform the proper adjustment to the button HTML structure
  this.ChangeButtonName = function(liElement, name) {
    var contents = liElement.firstChild.firstChild.childNodes;

    for (var contentIndex = 0; contentIndex < contents.length; contentIndex++) {
      if (contents[contentIndex].nodeName == "SPAN" && contents[contentIndex].getAttribute("tabIndex") == 0) {
        contents[contentIndex].innerHTML = name;
        break;
      }
    }
  }

  // function to change the names of all buttons, contextual to the mode
  this.ChangeButtonNames = function() {
    this.ChangeButtonName(this.ActionButtons.EditSave.LiElement, 
                          this.ActionButtons.EditSave.RegisteredText[this.Locale][this.Mode]);
    this.ChangeButtonName(this.ActionButtons.NewCancel.LiElement,
                          this.ActionButtons.NewCancel.RegisteredText[this.Locale][this.Mode]);
  }

  // function to change the current Mode
  this.ChangeMode = function(newMode) {
    // If we're reverting to View mode, clear the GridEditorObject's collection of grid records
    if (newMode == GEO_CONSTANT_MODE_VIEW) {
      this.GridRecords = new Array();
    }

    this.Mode = newMode;

    // Call an update to the button names
    this.ChangeButtonNames();
  }

  // function to access selected records from the grid and cast them into a custom object
  this.TranslateAvailableRecords = function() {
    var allRecordsArray = document.all.crmGrid.InnerGrid.AllRecords;
    var allRecords = new Array();

    // spool through the grid's allRecords and case their data into a typed object
    for (recordIndex in allRecordsArray) {
      record = new Object();
      record.Guid = allRecordsArray[recordIndex][0];
      record.Type = GEO_ENTITYNAME;
      record.OTC = allRecordsArray[recordIndex][1];
      record.RowIndex = allRecordsArray[recordIndex][2];
      record.RowElement = allRecordsArray[recordIndex][3];
      record.Selected = allRecordsArray[recordIndex][3].selected ? true : false;

      record.OriginalContent = new Array();

      // load the record construct into the returned array
      allRecords[record.RowIndex] = record;
    }

    return allRecords;
  }

  // function to change the Mode of the GridEditor and perform the appropriate actions
  this.TakeAction = function(actionType) {
    // Establish a pointer to the current gridBodyTable element
    this.GridTable = document.getElementById('gridBodyTable');

    // Perform a check on the currently established "View" (mostly necessary for default grids)
    this.CheckForViewUpdate();

    // Identify the proper set of actions to take, determined by the action type
    switch(actionType) {
      // The action to enter Edit mode has been triggered
      case GEO_CONSTANT_ACTION_EDIT:
        // Change the current mode
        this.ChangeMode(GEO_CONSTANT_MODE_EDIT);
        // Handle the currently selected records
        this.RecordSelectionHandler();
        break;

      // The action to enter Add mode has been triggered
      case GEO_CONSTANT_ACTION_ADD:
        // Validate the presence of each required attribute
        if (this.ValidateRequiredAttributes()) {
          // Change the current mode
          this.ChangeMode(GEO_CONSTANT_MODE_ADD);
          // Validate the grid's readiness
          this.GridReadiness();
          // Open a new set of fields for input on a new record
          this.QuickRecordCreate(true);
        } else {
          alert("Missing required attributes.  Cannot create new records directly in this grid.  Use the 'New' button instead.");
        }
        break;

      // The action to Save all edited/new records has been triggered
      case GEO_CONSTANT_ACTION_SAVE:
        // Take an appropriate action depending on which Mode the GridEditorObject is in
        switch(this.Mode) {
          case GEO_CONSTANT_MODE_EDIT:
            // Write all modified data back to the platform
            this.UpdateModifiedRecords();
            break;
          case GEO_CONSTANT_MODE_ADD:
            // Write all new data back to the platform
            this.CreateNewRecords();
            break;
        }

        // Call a grid refresh; automatically setting the mode back to View
        document.all.crmGrid.Refresh();
        break;

      // The action to Cancel all edited/new records has been triggered
      case GEO_CONSTANT_ACTION_CANCEL:
        // Call a grid refresh; automatically setting the mode back to View
        document.all.crmGrid.Refresh();
        break;

      default:
        alert("Invalid GridEditorObject Action specified.");
        break;
    }
  }

  // function to handle record selection changes
  this.OnSelectionChange = function() {
    // Only take an interest in selection changes during Edit mode
    if (this.Mode == GEO_CONSTANT_MODE_EDIT) {
      // Handle the currently selected records
      this.RecordSelectionHandler();
    }
  }

  this.OnGridRefresh = function() {
    // Clear active records
    this.GridRecords = new Array();
    // Switch the mode back to View
    this.ChangeMode(GEO_CONSTANT_MODE_VIEW);
    // Reload the grid selection change handler
    this.LoadOnSelectionChangeHandler();
  }

  // function to change Record state, and update UI elements in the process
  this.ChangeRecordState = function(record, newState) {
    // Initialize our validity flag as false
    var changeIsValid = false;
  
    // Perform the appropriate action for the new state
    switch(newState) {
      case GEO_CONSTANT_RECORDSTATE_OPEN:
        changeIsValid = this.OpenRecord(record);
        break;
      case GEO_CONSTANT_RECORDSTATE_CLOSED:
        changeIsValid = this.CloseRecord(record);
        break;
    }

    // Update the State of the record
    if (changeIsValid) {
      record.State = newState;
    }
  }

  // function to fire record state change handlers based on known selection changes
  this.RecordSelectionHandler = function() {
    // Translate visible records into easy to use objects
    var availableRecords = this.TranslateAvailableRecords();

    for (recordIndex in availableRecords) {
      var recordStateChange = false;

      // If the record is not already referenced in the GridRecords array, establish the reference
      if (typeof(this.GridRecords[recordIndex]) == "undefined" || this.GridRecords[recordIndex] == null) {
        this.GridRecords[recordIndex] = availableRecords[recordIndex];
        recordStateChange = true;
      } else {
        // Otherwise, simply transfer the Selected property if there is a change
        if (this.GridRecords[recordIndex].Selected != availableRecords[recordIndex].Selected) {
          this.GridRecords[recordIndex].Selected = availableRecords[recordIndex].Selected;
          recordStateChange = true;
        }
      }

      // If the selection state has changed, call an appropriate state change
      if (recordStateChange) {
        if (availableRecords[recordIndex].Selected == true) {
          this.ChangeRecordState(this.GridRecords[recordIndex], GEO_CONSTANT_RECORDSTATE_OPEN);
        } else {
          this.ChangeRecordState(this.GridRecords[recordIndex], GEO_CONSTANT_RECORDSTATE_CLOSED);
        }
      }
    }
  }

  // function to create gridBodyTable elements, as needed, for emtpy grids
  this.GridReadiness = function () {
    // Examine the number of records present, if none continue
    if (document.all.crmGrid.InnerGrid.AllRecords.length == 0) {
      // Since the grid is empty of records, the only existing row is a "no records" notice; remove it
      this.GridTable.deleteRow(0);
      this.GridTable.className = "ms-crm-List-Data";
      this.GridTable.cellSpacing = "0";
      this.GridTable.cellPadding = "1";
      
      // Construct missing column information on the table
      var columnGroup = document.createElement("COLGROUP");

      // Establish the first two columns
      var firstColumn = document.createElement("COL");
      firstColumn.setAttribute("class", "ms-crm-List-PreviewGlyphColumn");
      firstColumn.setAttribute("width", 20);
      
      var secondColumn = document.createElement("COL");
      secondColumn.setAttribute("class", "ms-crm-List-RowIconColumn");
      secondColumn.setAttribute("width", 22);
      
      columnGroup.appendChild(firstColumn);
      columnGroup.appendChild(secondColumn);
        
      for (var columnIndex = 0; columnIndex < this.GridColumns.length; columnIndex++) {
        var currentColumn = this.GridColumns[columnIndex];

        var nColumn = document.createElement("COL");
        nColumn.setAttribute("class", "ms-crm-List-DataColumn");
        nColumn.setAttribute("width", currentColumn.clientWidth + (columnIndex > 0 ? 2 : 0));
        nColumn.setAttribute("name", currentColumn.fieldname);
        
        columnGroup.appendChild(nColumn);
      }
      
      var lastColumn = document.createElement("COL");
      
      columnGroup.appendChild(lastColumn);
      
      // Insert the colgroup element into the gridtable
      this.GridTable.insertBefore(columnGroup, this.GridTable.firstChild);
    }
  }

  // function to create a new row for quickly creating new records
  this.QuickRecordCreate = function(firstRow) {
    // Establish a new record construct
    var newRecord = new Object();

    // Insert a new row into the grid table, at the top
    var newRow = this.GridTable.insertRow(0);
    newRow.className = "ms-crm-List-Row";

    // Disable the bubbling of events from the row which might impede functionality
    newRow.attachEvent("onclick", DisableEventBubbling);
    newRow.attachEvent("ondblclick", DisableEventBubbling);
    newRow.attachEvent("onkeypress", DisableEventBubbling);
    newRow.attachEvent("onkeydown", DisableEventBubbling);
    newRow.attachEvent("onkeyup", DisableEventBubbling);

    // Create a custom control for the first two cells to create/remove additional new records
    buttonCell = newRow.insertCell(0);
    buttonCell.align = "center";
    buttonCell.className = "ms-crm-List-DataCell";
    
    if (firstRow !== true) {
      cancelImage = document.createElement("IMG");
      cancelImage.src = "/_imgs/ico/16_L_remove.gif";
      cancelImage.style["cursor"] = "hand";
      
      buttonCell.appendChild(cancelImage);
  
      var changeStatePointer = function (geoObject, record, state) {
        return function () {
          geoObject["ChangeRecordState"](record, state);
        };
      }
  
      newRecord.SelfClose = changeStatePointer(this, newRecord, GEO_CONSTANT_RECORDSTATE_CLOSED);
      
      cancelImage.attachEvent("onclick", AssociateObjWithEvent(newRecord, "SelfClose"));
    } else {
      buttonCell.innerHTML = "<NOBR />";
    }

    buttonCell = newRow.insertCell(1);
    buttonCell.align = "center";
    buttonCell.className = "ms-crm-List-DataCell";
    
    createImage = document.createElement("IMG");
    createImage.src = "/_imgs/ico/16_export.gif";
    createImage.style["cursor"] = "hand";

    buttonCell.appendChild(createImage);
    
    createImage.attachEvent("onclick", AssociateObjWithEvent(this, "QuickRecordCreate"));

    // Create empty cells for the remaining columns of the row
    for (cellIndex = 0; cellIndex < this.GridColumns.length; cellIndex++) {
      var newCell = newRow.insertCell(cellIndex + 2);  // Account for the offset of the first two cells
      newCell.className = "ms-crm-List-DataCell";
      newCell.innerHTML = "<NOBR />";
    }

    newRecord.Guid = "new-" + this.GridRecords.length;
    newRecord.Type = GEO_ENTITYNAME;
    newRecord.RowElement = newRow;

    this.GridRecords.push(newRecord);
    
    // Apply controls to the new row
    this.ChangeRecordState(newRecord, GEO_CONSTANT_RECORDSTATE_OPEN);
  }

  // function to construct the initialValue used by the OpenRecord function
  this.ConstructInitialValue = function(attribute, source) {
    var recordType = null;
    var targetEntity = null;
    var iconURL = null;
    var initialValue = "";
    var controlName = attribute.LogicalName;

    // Configure the values to be loaded by the InputControl when ready, as determined by its type
    switch (attribute.AttributeType) {
      case "Boolean":
      case "Picklist":
      case "Status":
        if (source.Properties[controlName] != null) {
          initialValue = source.Properties[controlName];
        } else {
          initialValue = attribute.DefaultValue;
        }

        break;

      case "Customer":
      case "Lookup":
      case "Owner":
        if (source.Properties[controlName] != null) {
          // Sometimes, single target attributes don't return an additional "type" value; instead, examine the Target
          if (attribute.Targets.length == 1) {
            recordType = attribute.Targets[0];
          } else {
            recordType = source.Properties[controlName + "type"];
          }

          // Gather target entity metadata
          if (!this.RetrievedEntities[recordType]) {
            targetEntity = this.RetrievedEntities[recordType] = RetrieveEntity(recordType, "EntityOnly");
          } else {
            targetEntity = this.RetrievedEntities[recordType];
          }

          // Gather the image URL
          if (IsUserDefinedEntityObjectTypeCode(targetEntity.ObjectTypeCode)) {
            iconURL = SERVER_URL + "/_Common/icon.aspx?objectTypeCode=" + targetEntity.ObjectTypeCode + "&iconType=GridIcon&inProduction=1&cache=1";
          } else {
            iconURL = "/_imgs/ico_16_" + targetEntity.ObjectTypeCode + ".gif";
          }

          // Construct our singular SPAN for this Lookup
          initialValue = ""
            + "<SPAN class='ms-crm-Lookup-Item' contentEditable='false' onclick='openlui()' otypename='" + recordType + "' otype='" + targetEntity.ObjectTypeCode + "' oid='" + source.Properties[controlName] + "'>"
            + "<IMG class='ms-crm-Lookup-Item' alt='' src='" + iconURL + "'>" + source.Properties[controlName + "name"] + "</SPAN>";
        }

        break;

      case "DateTime":
      case "String":
        if (source.Properties[controlName] != null) {
          initialValue = source.Properties[controlName];
        }

        break;

      case "Decimal":
      case "Float":
        if (source.Properties[controlName] != null) {
          initialValue = parseFloat(source.Properties[controlName]);
        }

        break;

      case "Integer":
        if (source.Properties[controlName] != null) {
          initialValue = parseInt(source.Properties[controlName]);
        }

        break;

      case "PartyList":
        if (typeof(source.Collections[controlName]) != "undefined") {
          for (partyMemberIndex in source.Collections[controlName]) {
            partyMember = source.Collections[controlName][partyMemberIndex];

            recordType = partyMember["partyidtype"];

            // Gather target entity metadata
            if (!this.RetrievedEntities[recordType]) {
              targetEntity = this.RetrievedEntities[recordType] = RetrieveEntity(recordType, "EntityOnly");
            } else {
              targetEntity = this.RetrievedEntities[recordType];
            }

            // Gather the image URL
            if (IsUserDefinedEntityObjectTypeCode(targetEntity.ObjectTypeCode)) {
              iconURL = SERVER_URL + "/_Common/icon.aspx?objectTypeCode=" + targetEntity.ObjectTypeCode + "&iconType=GridIcon&inProduction=1&cache=1";
            } else {
              iconURL = "/_imgs/ico_16_" + targetEntity.ObjectTypeCode + ".gif";
            }

            // Construct our singular SPAN for this Lookup
            initialValue += ""
              + "<SPAN class='ms-crm-Lookup-Item' contentEditable='false' onclick='openlui()' otypename='" + recordType + "' otype='" + targetEntity.ObjectTypeCode + "' oid='" + partyMember["partyid"] + "' activitypartyid='" + partyMember["activitypartyid"] + "'>"
              + "<SPAN contentEditable=false unselectable='on' wrapper='true'>"
              + "<IMG class='ms-crm-Lookup-Item' alt='' src='" + iconURL + "'>" + partyMember["partyidname"] 
              + "<A id='at" + partyMember["partyid"] + "' class='atLink' title='" + partyMember["partyidname"] + "' tabIndex='-1' contentEditable='false' onclick='return false;' href='javascript:onclick();' target='_self'></A><B class='IMG_lu_htc_b'></B>"
              + "</SPAN></SPAN>";
          }
        }

        break;
    }
    
    return initialValue;
  }

  // function for the standard method of populating a control
  this.DeployStandardControl = function(inputControl, inputControlHTML) {
    // Overwrite the contents of the cell
    inputControl.Container.innerHTML = inputControlHTML;

    // Obtain a reference to the wholy created control
    inputControl.DOMElement = document.getElementById(inputControl.Id);
    
    // Set the disabled state
    inputControl.DOMElement.Disabled = inputControl.Disabled;
  }

  // function to change a record's state to Open  
  this.OpenRecord = function(record) {
    // Initialize the InputControl array for record
    record.InputControl = new Array();

    // Perform Mode-specific tasks for the record
    if (this.Mode == GEO_CONSTANT_MODE_EDIT) {
      // Initialize variable to identify the presence of the statecode attribute
      // var stateCodeIncluded = false;
  
      // Assemble an array of attributes to retrieve for the record from the registered Attributes array
      var retrieveAttrs = new Array();
  
      // Collect all the attributes together for retrieval
      for (var attrLogicalName in this.Attributes) {
        retrieveAttrs.push(attrLogicalName);
        stateCodeIncluded = attrLogicalName == GEO_STATEATTRIBUTE ? true : stateCodeIncluded;
      }
  
      // Add the statecode attribute if it's not already included
      if (!stateCodeIncluded) {
        retrieveAttrs.push(GEO_STATEATTRIBUTE);
      }
  
      // Retrieve the record's current values
      record.RetrievedRecord = RetrieveRecord(record.Type, record.Guid, retrieveAttrs);
  
      // Make sure the record is in a valid state for editing
      if (record.RetrievedRecord == null || record.RetrievedRecord.Properties.statecode != this.ValidEntityState.InvariantName) {
        // This record's state is invalid for editing, close it off
        this.ChangeRecordState(record, GEO_CONSTANT_RECORDSTATE_CLOSED);
      
        return false;
      }
    }
	
    // Enable the record (in appearance)
    record.RowElement.style["height"] = "23px";

    // Check each attribute for the appropriate control to deploy
    for (var attrLogicalName in this.Attributes) {
      var attribute = this.Attributes[attrLogicalName];

      // Is this attribute valid for the current Mode?
      if ((attribute.ValidForUpdate && this.Mode == GEO_CONSTANT_MODE_EDIT) || (attribute.ValidForCreate && this.Mode == GEO_CONSTANT_MODE_ADD)) {
        // Initialize important control variables
        var targetEntity = null;
        var iconURL = null;
        var inputControl = null;
        var cancelControl = false;
        var controlId = record.Guid + "-" + attribute.LogicalName;
        var controlLabel = attribute.DisplayName;

        var attributeCell = record.RowElement.cells[attribute.GridPosition];

        // Disable the bubbling of events from the control which might impede functionality
        attributeCell.attachEvent("onclick", DisableEventBubbling);
        attributeCell.attachEvent("ondblclick", DisableEventBubbling);
        attributeCell.attachEvent("onkeypress", DisableEventBubbling);
        attributeCell.attachEvent("onkeydown", DisableEventBubbling);
        attributeCell.attachEvent("onkeyup", DisableEventBubbling);

        // Create a new Object instance to encapsulate values and methods for initializing the control
        inputControl = new Object();

        // Initialize inputControl members
        inputControl.Id = controlId;
        inputControl.Attribute = attribute;
        inputControl.InitialValue = "";
        inputControl.Container = attributeCell;
        inputControl.Disabled = false;

        // Indentify whether this control should be disabled; this could be moved into the attribute validation
        for (disableIndex in GEO_DISABLEATTRIBUTES) {
          if (GEO_DISABLEATTRIBUTES[disableIndex] == attribute.LogicalName) {
            inputControl.Disabled = true;
            break;
          }
        }

        // Construct initial values for the control, with dynamic sources
        if (this.Mode == GEO_CONSTANT_MODE_EDIT) {
          // Capture the original contents of the cell
          record.OriginalContent[attribute.GridPosition] = attributeCell.innerHTML;

          // Load data into the InitialValue property
          inputControl.InitialValue = this.ConstructInitialValue(attribute, record.RetrievedRecord);
        } else if (typeof(GEO_ADD_DEFAULTVALUES) != "undefined") {
          inputControl.InitialValue = this.ConstructInitialValue(attribute, GEO_ADD_DEFAULTVALUES);
        } else {
          var emptySource = new Object();
          emptySource.Properties = new Object();
          emptySource.Collections = new Object();

          inputControl.InitialValue = this.ConstructInitialValue(attribute, emptySource);
        }

        // Look to replace the contents of the cells with input controls
        switch(attribute.AttributeType) {
          // Abstract for assembling Picklist-based controls
          case "Boolean":
          case "Picklist":
          case "Status":
            inputControlHTML = ""
              + "<SELECT style='IME-MODE: auto' id='" + controlId + "' class='ms-crm-SelectBox' value='" + inputControl.InitialValue + "' name='" + controlId + "'>"; //defaultSelected='" + attribute.DefaultValue + "'>";

            // If the picklist has no valid default, include the blank option
            if (attribute.DefaultValue == "-1") {
              inputControlHTML += "<OPTION title='' value=''></OPTION>";
            }

            // Assemble all of the Options from the attribute into the Picklist
            for (picklistOptionIndex in attribute.Options) {
              picklistOption = attribute.Options[picklistOptionIndex];

              // As necessary for Status picklists, validate their associated state with the previously identified valid state for editing
              if (typeof(picklistOption.State) == "undefined" || (picklistOption.State == this.ValidEntityState.Value)) {
                inputControlHTML += "<OPTION title='" + picklistOption.Label + "' ";

                if (picklistOption.Value == inputControl.InitialValue) {
                  inputControlHTML += "selected='selected' ";
                }

                inputControlHTML += "value='" + picklistOption.Value + "'>" + picklistOption.Label + "</OPTION>";
              }
            }

            inputControlHTML += "</SELECT>";

            // Deploy this control with the standard method
            this.DeployStandardControl(inputControl, inputControlHTML);

            break;

          // Abstract for assembling Lookup-based controls
          case "Customer":
          case "Lookup":
          case "Owner":
          case "PartyList":
            // Initialize variables for use in the control
            var classname = "";
            var lookupclass = "";
            var lookupstyle = "";
            var extraproperties = "";
            var lookupbrowse = "0";
            var resolveemailaddress = "0";
            var showproperty = "1";
            var autoresolve = "1";
            var defaulttype = "0";

            // Initialize string-array control attributes
            var lookuptypes = "";
            var lookuptypenames = "";
            var lookuptypeicons = "";

            // AttibuteType-specific settings
            switch (attribute.AttributeType) {
              case "Customer":
                // Customer type settings
                classname = "ms-crm-Lookup";
                lookupclass = "BasicCustomer";
                lookupstyle = "single";

                break;

              case "Lookup":
                // Lookup type settings
                classname = "ms-crm-Lookup";
                lookupstyle = "single";

                break;

              case "Owner":
                // Owner type settings
                classname = "ms-crm-Lookup";
                lookupclass = "BasicOwner";
                lookupstyle = "single";

                break;

              case "PartyList":
                // PartyList type settings
                classname = "ms-crm-Lookup-Party";
                lookupclass = "ActivityRecipient";
                lookupstyle = "multi";

                break;
            }

            // Target-specific settings
            switch (attribute.Targets[0]) {
              case "service":   // Untested
                lookupclass = "ServicesEnabled";
                break;

              case "contractdetail":  // Untested
                if (record.Type == "incident") {
                  lookupclass = "ContractItemWithAllotments";
                }

                break;

              case "lead":  // Untested
                lookupclass = "Lead";

                break;

              case "pricelevel":  // Untested
                if (record.Type == "opportunity") {
                  lookupclass = "PriceLevelByCurrency";
                }

                break;

              case "product":   // Untested
                if (record.Type == "salesorderdetail") {
                  lookupclass = "ProductWithPriceLevel";
                }

                break;

              case "subject":   // Untested
                lookupclass = "BasicSubject";
                lookupstyle = "subject";

                break;

              case "transactioncurrency":   // Untested
                classname = "ms-crm-Lookup-TransactionCurrency";
                extraproperties = "cursymclm='currencysymbol'";

                break;
            }

            // "Regarding"-specific settings
            if (attribute.LogicalName == "regardingobjectid") {
              lookupclass = "ActivityRegarding";
            }

            // Assemble the targets for this attribute
            for (attrTargetIndex in attribute.Targets) {
              var recordType = attribute.Targets[attrTargetIndex];

              // Gather target entity metadata
              if (!this.RetrievedEntities[recordType]) {
                targetEntity = this.RetrievedEntities[recordType] = RetrieveEntity(recordType, "EntityOnly");
              } else {
                targetEntity = this.RetrievedEntities[recordType];
              }

              // Gather the image URL
              if (IsUserDefinedEntityObjectTypeCode(targetEntity.ObjectTypeCode)) {
                iconURL = SERVER_URL + "/_Common/icon.aspx?objectTypeCode=" + targetEntity.ObjectTypeCode + "&iconType=GridIcon&inProduction=1&cache=1";
              } else {
                iconURL = "/_imgs/ico_16_" + targetEntity.ObjectTypeCode + ".gif";
              }

              // Assemble input attributes for target entity types
              lookuptypes += targetEntity.ObjectTypeCode;
              lookuptypenames += targetEntity.LogicalName + ":" + targetEntity.ObjectTypeCode;
              lookuptypeicons += iconURL;

              if (attribute.Targets.length > 1 && 
                attrTargetIndex < attribute.Targets.length - 1) {
                lookuptypes += ",";
                lookuptypenames += ",";
                lookuptypeicons += ":";
              }
            }

            inputControlHTML = ""
              + "<SPAN class='ms-crm-Hidden-NoBehavior'>" + controlLabel + "</SPAN>"
              + "<DIV>"
              + "<TABLE style='TABLE-LAYOUT: fixed' class='ms-crm-Lookup' cellSpacing='0' cellPadding='0' width='100%'>"
              + "<TBODY>"
              + "<TR>"
              + "<TD>"
              + "<DIV class='ms-crm-Lookup' ime-mode='auto'>" + inputControl.InitialValue + "</DIV>"
              + "<LABEL class='ms-crm-Hidden-NoBehavior' for='" + controlId + "_ledit'></LABEL>"
              + "<INPUT id='" + controlId + "_ledit' class='ms-crm-Hidden-NoBehavior' maxLength='1000' ime-mode='auto' value='' />"
              + "</TD>"
              + "<TD class='Lookup_RenderButton_td' width='25'>"
              + "<IMG style='IME-MODE: auto' id='" + controlId 
                + "' class='" + classname 
                + "' src='/_imgs/btn_off_lookup.gif' resolveemailaddress='" + resolveemailaddress 
                + "' showproperty='" + showproperty 
                + "' autoresolve='" + autoresolve 
                + "' defaulttype='" + defaulttype 
                + "' lookupstyle='" + lookupstyle 
                + "' lookupbrowse='" + lookupbrowse 
                + "' lookupclass='" + lookupclass 
                + "' lookuptypeIcons='" + lookuptypeicons 
                + "' lookuptypenames='" + lookuptypenames 
                + "' lookuptypes='" + lookuptypes 
                + "' " + extraproperties + " />"
              + "<A onclick='previousSibling.click();' href='#'></A>"
              + "</TD>"
              + "</TR>"
              + "</TBODY>"
              + "</TABLE>"
              + "</DIV>";

            // Deploy this control with the standard method
            this.DeployStandardControl(inputControl, inputControlHTML);

            break;

          // Abstract for assembling DateTime-based controls
          case "DateTime":
            // Initialize variables for use in the control
            var format = "";
            var initialShowTime = "";
            var timeControlHTML = "";

            // Format-specific settings
            switch (attribute.Format) {
              // DateOnly settings
              case "DateOnly":
                format = "date";
                initialShowTime = "false";

                break;

              // DateAndTime settings
              case "DateAndTime":
                format = "datetime";
                initialShowTime = "true";

                // the time control HTML construct; I believe this is dynamically generated by the CRM platform for localized formats
                // I will have to revisit this code to make it compatible to different locales; don't have time for this now.
                timeControlHTML = ""
                  + "<TD class='DateTimeUI_RenderTimeControl_td2'>"
                  + "<DIV><LABEL class='ms-crm-Hidden' for='time'>Select a time</LABEL>"
                  + "<SPAN id='time' class='ms-crm-SelectBox' allowValueEdit='true' tabbingIndex='1100' defaultimemode='auto' dropdownfontsize='11' defaultbgcolor='' ButtonTitle='Select a time' name='timeInput' setdisabled='1' value=' ' >" 
                  + "<TABLE style='DISPLAY: none' cellSpacing='0' cellPadding='2'>"
                  + "<TBODY>"
                  + "<TR>"
                  + "<TD val='12:00 AM'>12:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='12:30 AM'>12:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='1:00 AM'>1:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='1:30 AM'>1:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='2:00 AM'>2:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='2:30 AM'>2:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='3:00 AM'>3:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='3:30 AM'>3:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='4:00 AM'>4:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='4:30 AM'>4:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='5:00 AM'>5:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='5:30 AM'>5:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='6:00 AM'>6:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='6:30 AM'>6:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='7:00 AM'>7:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='7:30 AM'>7:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='8:00 AM'>8:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='8:30 AM'>8:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='9:00 AM'>9:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='9:30 AM'>9:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='10:00 AM'>10:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='10:30 AM'>10:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='11:00 AM'>11:00 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='11:30 AM'>11:30 AM</TD></TR>"
                  + "<TR>"
                  + "<TD val='12:00 PM'>12:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='12:30 PM'>12:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='1:00 PM'>1:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='1:30 PM'>1:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='2:00 PM'>2:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='2:30 PM'>2:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='3:00 PM'>3:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='3:30 PM'>3:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='4:00 PM'>4:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='4:30 PM'>4:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='5:00 PM'>5:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='5:30 PM'>5:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='6:00 PM'>6:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='6:30 PM'>6:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='7:00 PM'>7:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='7:30 PM'>7:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='8:00 PM'>8:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='8:30 PM'>8:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='9:00 PM'>9:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='9:30 PM'>9:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='10:00 PM'>10:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='10:30 PM'>10:30 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='11:00 PM'>11:00 PM</TD></TR>"
                  + "<TR>"
                  + "<TD val='11:30 PM'>11:30 PM</TD></TR></TBODY></TABLE>"
                  + "</SPAN></DIV></TD>";

                break;
            }

            inputControlHTML = ""
              + "<TABLE style='IME-MODE: inactive; TABLE-LAYOUT: fixed' id='" + controlId +"' cellSpacing='0' cellPadding='0' width='100%' initialAllowTimeEdit='true' initialAllDayDisplayMode='false' initialDisableInit='false' initialAllowBlankDate='true' initialShowTime='" + initialShowTime + "' format='" + format + "' initialValue='" + inputControl.InitialValue + "'>"
              + "<COLGROUP>"
              + "<COL width='80'>"
              + "<COL width='40'>"
              + "<COL>"
              + "<TBODY>"
              + "<TR>"
              + "<TD><INPUT style='IME-MODE: inactive' type='text' id='DateInput' maxLength='10' /></TD>"
              + "<TD class='DateTimeUI_RenderDateControl_td'><IMG id='" + controlId + "img' class='ms-crm-DateTime' alt='Select date' src='/_imgs/btn_off_cal.gif'></TD>"
              + timeControlHTML
              + "</TR></TBODY></TABLE>";

            // Setup a custom deployment method
            // Overwrite the contents of the cell
            inputControl.Container.innerHTML = inputControlHTML;

            // Obtain a reference to the wholy created control
            inputControl.DOMElement = document.getElementById(controlId);

            // Initialize the ActivateParentScripts function
            inputControl.ActivateParentScripts = function() {
              this.DOMElement.className = "ms-crm-DateTime";
              
              // If the control for this attribute is to be disabled, configure a disabling function that waits until the control is ready
              if (this.Disabled) {              
                this.DOMElement["OnInitCompletePreAttach"] = "this.Disabled = true;";
              }
            }

            // Initialize the timer control to make sure all supporting scripts are loaded before populating data
            // In the case of the DateAndTime format, wait for the "time" element's scripting
            if (attribute.Format == "DateAndTime") {
              WaitForElementReady(inputControl.DOMElement.all["time"], AssociateObjWithEvent(inputControl, "ActivateParentScripts"));
            } else {
              inputControl.ActivateParentScripts();
            }

            break;

          // Abstract for assembling Decimal-based controls
          case "Decimal":
            inputControlHTML = ""
            + "<INPUT style='IME-MODE: auto' id='" + controlId + "' class='ms-crm-Number' max='" + attribute.MaxValue + "' dt='decimal' min='" + attribute.MinValue +"' acc='" + attribute.Precision + "' value='" + inputControl.InitialValue + "' _onchangeInitialized='false' />";

            // Deploy this control with the standard method
            this.DeployStandardControl(inputControl, inputControlHTML);

            break;

          // Abstract for assembling Float-based controls
          case "Float":
            inputControlHTML = ""
            + "<INPUT style='IME-MODE: auto' id='" + controlId + "' class='ms-crm-Number' max='" + attribute.MaxValue + "' dt='float' min='" + attribute.MinValue + "' acc='" + attribute.Precision + "' value='" + inputControl.InitialValue + "' _onchangeInitialized='false' />";

            // Deploy this control with the standard method
            this.DeployStandardControl(inputControl, inputControlHTML);

            break;

          // Abstract for assembling Integer-based controls
          case "Integer":
            // Format-specific settings
            switch (attribute.Format) {
              case "Duration":
                // the duration control HTML construct; I believe this is dynamically generated by the CRM platform for localized formats
                // I will have to revisit this code to make it compatible to different locales; don't have time for this now.
                inputControlHTML = ""
                  + "<SPAN id='" + controlId + "Select' class='ms-crm-SelectBox' allowValueEdit='true' value='' defaultimemode='auto' dropdownfontsize='11' defaultbgcolor='' ButtonTitle='Select a duration' name='" + controlId + "SelectInput'>"
                  + "<TABLE style='DISPLAY: none' cellSpacing='0' cellPadding='2'>"
                  + "<TBODY>"
                  + "<TR>"
                  + "<TD val=''></TD></TR>"
                  + "<TR>"
                  + "<TD val='1 minute'>1 minute</TD></TR>"
                  + "<TR>"
                  + "<TD val='5 minutes'>5 minutes</TD></TR>"
                  + "<TR>"
                  + "<TD val='15 minutes'>15 minutes</TD></TR>"
                  + "<TR>"
                  + "<TD val='30 minutes'>30 minutes</TD></TR>"
                  + "<TR>"
                  + "<TD val='45 minutes'>45 minutes</TD></TR>"
                  + "<TR>"
                  + "<TD val='1 hour'>1 hour</TD></TR>"
                  + "<TR>"
                  + "<TD val='1.5 hours'>1.5 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='2 hours'>2 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='2.5 hours'>2.5 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='3 hours'>3 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='3.5 hours'>3.5 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='4 hours'>4 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='4.5 hours'>4.5 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='5 hours'>5 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='5.5 hours'>5.5 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='6 hours'>6 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='6.5 hours'>6.5 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='7 hours'>7 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='7.5 hours'>7.5 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='8 hours'>8 hours</TD></TR>"
                  + "<TR>"
                  + "<TD val='1 day'>1 day</TD></TR>"
                  + "<TR>"
                  + "<TD val='2 days'>2 days</TD></TR>"
                  + "<TR>"
                  + "<TD val='3 days'>3 days</TD></TR></TBODY></TABLE></SPAN>";

                // Setup a custom deployment method
                // Overwrite the contents of the cell
                inputControl.Container.innerHTML = inputControlHTML;

                // Obtain a reference to the SPAN element, whose scripting must finish loading before the remaining elements can be placed
                inputControl.spanElement = document.getElementById(controlId + "Select");

                // Generate a function to attach to the spanElement-ready timer to finish populating the control
                // This is to isolate a race-condition where the INPUT element's HTC depends on the SPAN element's HTC to be loaded first
                inputControl.ProvideInputElement = function () {
                  var inputElement = document.createElement("INPUT");
                  inputElement.className = "ms-crm-Duration";
                  inputElement.style["IME-MODE"] = "auto";
                  inputElement.setAttribute("type", "hidden");
                  inputElement.setAttribute("id", this.Id);
                  inputElement.setAttribute("MinMinutes", this.Attribute.MinValue);
                  inputElement.setAttribute("MaxMinutes", this.Attribute.MaxValue);
                  inputElement.setAttribute("InitialValue", this.InitialValue);

                  this.Container.insertBefore(inputElement, this.spanElement);

                  this.DOMElement = inputElement;

                  WaitForElementReady(inputElement, AssociateObjWithEvent(this, "PopulateData"));
                }

                // Initialize the PopulateData function
                inputControl.PopulateData = function() {
                  if (this.InitialValue != null && this.InitialValue != "") {
                    this.spanElement.setValue(this.DOMElement.FormatDuration(this.InitialValue));
                  }
                  
                  this.DOMElement.Disabled = this.Disabled;
                }

                // Initialize the timer control to make sure all supporting scripts are loaded before building additional control elements
                WaitForElementReady(inputControl.spanElement, AssociateObjWithEvent(inputControl, "ProvideInputElement"));

                break;

              case "None":
                inputControlHTML = ""
                  + "<INPUT style='IME-MODE: disabled' id='" + controlId +"' class='ms-crm-Number' max='" + attribute.MaxValue + "' dt='int' min='" + attribute.MinValue + "' acc='0' _onchangeInitialized='false' value='" + inputControl.InitialValue + "' />";

                // Deploy this control with the standard method
                this.DeployStandardControl(inputControl, inputControlHTML);

                break;

              default:
                cancelControl = true;

                break;
            }

            break;

          // Abstract for assembling String-based controls
          case "String":
            // Format-specific settings
            switch (attribute.Format) {
              case "Text":
                inputControlHTML = ""
                  + "<INPUT style='IME-MODE: auto' id='" + controlId + "' class='ms-crm-Text' maxLength='" + attribute.MaxLength + "' defaultValue='" + inputControl.InitialValue + "' value='" + inputControl.InitialValue + "' />";

                // Deploy this control with the standard method
                this.DeployStandardControl(inputControl, inputControlHTML);

                break;

              default:
                cancelControl = true;

                break;
            }

            break;

          default:
            cancelControl = true;

            break;
        }

        if (cancelControl) {
          if (this.Mode == GEO_CONSTANT_MODE_EDIT) {
            // Restore the original contents of the cell
            attributeCell.innerHTML = record.OriginalContent[attribute.GridPosition];
          }

          // Blank the inputControl object
          inputControl = null;

          // Move to the next control
          continue;
        } else {
          record.InputControl[attribute.GridPosition] = inputControl;
        }
      }
    }

    return true;
  }

  // function to change a record's state to Closed
  this.CloseRecord = function(record) {
    // Conditionally replace, as the current state of the record determines
    if (record.State == GEO_CONSTANT_RECORDSTATE_OPEN) {
      // Mode-specific tasks
      switch (this.Mode) {
        case GEO_CONSTANT_MODE_EDIT:
          // Restore the contents of each cell, if they are needed
          for (var attrLogicalName in this.Attributes) {
            var attribute = this.Attributes[attrLogicalName];
    
            if (typeof(record.OriginalContent[attribute.GridPosition]) != "undefined") {
            
              record.RowElement.cells[attribute.GridPosition].innerHTML = 
                record.OriginalContent[attribute.GridPosition];
                
              // Disable the bubbling of events from the control which might impede functionality
              record.RowElement.cells[attribute.GridPosition].detachEvent("onclick", DisableEventBubbling);
              record.RowElement.cells[attribute.GridPosition].detachEvent("ondblclick", DisableEventBubbling);
              record.RowElement.cells[attribute.GridPosition].detachEvent("onkeypress", DisableEventBubbling);
              record.RowElement.cells[attribute.GridPosition].detachEvent("onkeydown", DisableEventBubbling);
              record.RowElement.cells[attribute.GridPosition].detachEvent("onkeyup", DisableEventBubbling);
            }
          }
          
          // Disable the record (in appearance)
          record.RowElement.style["height"] = "21px";
          break;

        case GEO_CONSTANT_MODE_ADD:
          // Delete the row from the table         
          this.GridTable.deleteRow(record.RowElement.rowIndex);
          break;
      }
    }

    return true;
  }

  // function to write modified data back to CRM
  this.UpdateModifiedRecords = function() {
    // Examine all the Open records in the GridRecords array
    for (var recordIndex in this.GridRecords) {
      var targetRecord = this.GridRecords[recordIndex];
      var recordIsDirty = false;
      
      if (targetRecord.State != GEO_CONSTANT_RECORDSTATE_OPEN) {
        continue;
      }

      // Establish a new record construct for writing modified data back to CRM, if necessary
      var updateRecord = new Object;
      updateRecord.Name = this.TargetEntity.LogicalName;
      updateRecord.Id = targetRecord.Guid;
      updateRecord.PrimaryKey = this.TargetEntity.PrimaryKey;
      updateRecord.Properties = new Object();
      updateRecord.PropertyType = new Object();
      updateRecord.Collections = new Object();

      // Examine the record's InputControls array for modified values
      for (var inputIndex in targetRecord.InputControl) {
        var inputControl = targetRecord.InputControl[inputIndex];
        var inputIsDirty = inputControl.DOMElement.IsDirty;
        
        if (!inputIsDirty) {
          continue;
        } else {
          recordIsDirty = true;
        }

        // Perform Attribute-specific translations of the DataValue member
        switch (inputControl.Attribute.AttributeType) {
          case "Boolean":
          case "Decimal":
          case "Float":
          case "Integer":
          case "Picklist":
          case "Status":
          case "String":
            if (inputControl.DOMElement.DataValue != null) {
              updateRecord.Properties[inputControl.Attribute.LogicalName] = inputControl.DOMElement.DataValue;
            } else {
              updateRecord.Properties[inputControl.Attribute.LogicalName] = "";
            }

            break;

          case "Customer":
          case "Lookup":
          case "Owner":
            if (inputControl.DOMElement.DataValue != null) {
              updateRecord.Properties[inputControl.Attribute.LogicalName] = inputControl.DOMElement.DataValue[0].id;
              updateRecord.PropertyType[inputControl.Attribute.LogicalName] = inputControl.DOMElement.DataValue[0].typename;
            } else {
              updateRecord.Properties[inputControl.Attribute.LogicalName] = "";
            }

            break;
            
          case "DateTime":
            if (inputControl.DOMElement.DataValue != null) {
              updateRecord.Properties[inputControl.Attribute.LogicalName] = FormatDateTime(inputControl.DOMElement.DataValue);
            } else {
              updateRecord.Properties[inputControl.Attribute.LogicalName] = "";
            }

            break;

          case "PartyList":
            updateRecord.Collections[inputControl.Attribute.LogicalName] = new Array();

            if (inputControl.DOMElement.DataValue != null) {
              for (var partyMemberIndex in inputControl.DOMElement.DataValue) {
                var partyMember = inputControl.DOMElement.DataValue[partyMemberIndex];
                var collectionMember = new Object();
                
                collectionMember.partyobjecttypecode = partyMember.typename;
                collectionMember.partyid = partyMember.id;
                
                switch(inputControl.Attribute.LogicalName) {
                  case "customers":
                    collectionMember.participationtypemask = "11";
                    break;
                    
                  case "resources":
                    collectionMember.participationtypemask = "10";
                    break;
                
                }
                
                updateRecord.Collections[inputControl.Attribute.LogicalName].push(collectionMember);
              }
            }

            break;
        }
      }

      if (recordIsDirty) {
        UpdateRecord(updateRecord);
      }
    }
  }

  // function to write new data back to CRM
  this.CreateNewRecords = function() {
    // Examine all the Open records in the GridRecords array
    for (var recordIndex in this.GridRecords) {
      var targetRecord = this.GridRecords[recordIndex];
      
      if (targetRecord.State != GEO_CONSTANT_RECORDSTATE_OPEN) {
        continue;
      }

      // Establish a new record construct for writing modified data back to CRM, if necessary
      var createRecord = new Object;
      createRecord.Name = this.TargetEntity.LogicalName;
      createRecord.PrimaryKey = this.TargetEntity.PrimaryKey;
      createRecord.Properties = new Object();
      createRecord.PropertyType = new Object();
      createRecord.Collections = new Object();

      // Examine the record's InputControls array for modified values
      for (var inputIndex in targetRecord.InputControl) {
        var inputControl = targetRecord.InputControl[inputIndex];

        // Perform Attribute-specific translations of the DataValue member
        switch (inputControl.Attribute.AttributeType) {
          case "Boolean":
          case "Decimal":
          case "Float":
          case "Integer":
          case "Picklist":
          case "Status":
          case "String":
            if (inputControl.DOMElement.DataValue != null) {
              createRecord.Properties[inputControl.Attribute.LogicalName] = inputControl.DOMElement.DataValue;
            }

            break;

          case "Customer":
          case "Lookup":
          case "Owner":
            if (inputControl.DOMElement.DataValue != null) {
              createRecord.Properties[inputControl.Attribute.LogicalName] = inputControl.DOMElement.DataValue[0].id;
              createRecord.PropertyType[inputControl.Attribute.LogicalName] = inputControl.DOMElement.DataValue[0].typename;
            }

            break;
            
          case "DateTime":
            if (inputControl.DOMElement.DataValue != null) {
              createRecord.Properties[inputControl.Attribute.LogicalName] = FormatDateTime(inputControl.DOMElement.DataValue);
            }

            break;

          case "PartyList":
            createRecord.Collections[inputControl.Attribute.LogicalName] = new Array();

            if (inputControl.DOMElement.DataValue != null) {
              for (var partyMemberIndex in inputControl.DOMElement.DataValue) {
                var partyMember = inputControl.DOMElement.DataValue[partyMemberIndex];
                var collectionMember = new Object();
                
                collectionMember.partyobjecttypecode = partyMember.typename;
                collectionMember.partyid = partyMember.id;
                
                switch(inputControl.Attribute.LogicalName) {
                  case "customers":
                    collectionMember.participationtypemask = "11";
                    break;
                    
                  case "resources":
                    collectionMember.participationtypemask = "10";
                    break;
                
                }
                
                createRecord.Collections[inputControl.Attribute.LogicalName].push(collectionMember);
              }
            }

            break;
        }
      }

      CreateRecord(createRecord);
    }
  }

  this.LoadOnSelectionChangeHandler = function() {
    // attach the OnSelectionChange handler
    document.all.crmGrid.InnerGrid.attachEvent("onselectionchange", AssociateObjWithEvent(this, "OnSelectionChange"));
  }

  this.LoadOnGridRefreshHandler = function() {
    // attach the OnGridRefresh handler
    document.all.crmGrid.attachEvent("onrefresh", AssociateObjWithEvent(this, "OnGridRefresh"));
  }

  // initialize the Initialized flag
  this.Initialized = false;

  // initialize the Cancel flag
  this.Cancel = false;

  this.TriggerElement = window.event.srcElement;

  // initialize the container for records being worked on
  this.GridRecords = new Array();

  // initialize the container for retrieved entity data
  this.RetrievedEntities = new Object();

  // active references to the ISV.config specified buttons
  this.ActionButtons = new Object();
  this.ActionButtons.EditSave = new Object();
  this.ActionButtons.NewCancel = new Object();

  // initilize the LiElement references
  this.ActionButtons.EditSave.LiElement = null;
  this.ActionButtons.NewCancel.LiElement = null;

  // initialize the RegisteredText structure
  this.ActionButtons.EditSave.RegisteredText = new Array();
  this.ActionButtons.NewCancel.RegisteredText = new Array();

  // initialize the known ToolTips for the buttons, stored in relation to the localization code
  this.ActionButtons.EditSave.RegisteredText = GEO_REGISTEREDBUTTONLABELS.EditSaveButton;
  this.ActionButtons.NewCancel.RegisteredText = GEO_REGISTEREDBUTTONLABELS.NewCancelButton;

  // initializes the GridEditorObject.TargetEntity member
  this.IdentifyEntity(GEO_ENTITYNAME);

  // initializes the GridEditorObject.ValidEntityState member
  this.ValidEntityState = this.IdentifyValidEntityState(GEO_ENTITYNAME);

  // initializes the GridEditorObject.Attributes member
  this.IdentifyAttributes(GEO_ENTITYNAME);

  // processes the remaining initializations, if no cancellation has occurred
  if (!this.Cancel) {
    // load pertinent globals, using our specialized function
    IncludeScript(document, this.RetrieveGlobals());

    // load global.js from CRM code-base to support controls and other internal calls
    IncludeExternalScript(document, "/_static/_common/scripts/global.js");
  
    // initializes the GridEditor in View mode
    this.Mode = GEO_CONSTANT_MODE_VIEW;
  
    // initializes the GridEditorObject.Locale member
    this.Locale = USER_LANGUAGE_CODE;
  
    // initializes the LiElement members of the action buttons
    if (this.IdentifyButtons()) {
      // load scripts and stylesheets from CRM code-base to support controls
      IncludeExternalStylesheet(document, "/_forms/controls/controls.css.aspx");
      IncludeExternalStylesheet(document, "/_common/styles/select.css.aspx");
      IncludeExternalScript(document, "/_static/_common/scripts/presence.js");
      IncludeExternalScript(document, "/_static/_common/scripts/select.js");
      IncludeExternalScript(document, "/_static/_controls/util/util.js");
      IncludeExternalScript(document, "/_static/_controls/lookup/lookup.js");
      IncludeExternalScript(document, "/_static/_controls/popupmenu/popupmenu.js");
      IncludeExternalScript(document, "/_static/_controls/datetime/date.js");
      IncludeExternalScript(document, "/_static/_controls/datetime/time.js");
      IncludeExternalScript(document, "/_static/_controls/number/number.js");
    
      // load grid selection change handler
      this.LoadOnSelectionChangeHandler();
    
      // load grid refresh handler
      this.LoadOnGridRefreshHandler();
      
      // change the Initialized flag
      this.Initialized = true;
    } else {
      alert("Unable to identify one or both action buttons using language-code specified.  Please configure the Javascript Grid Editor accordingly.");
    }
  }
}

// GridEditor object initialization
if (typeof(GridEditor) == "undefined" || GridEditor == null) {
  GridEditor = new GridEditorObject();
}

// GridEditor button action handler
if (typeof(GridEditor) != "undefined" && GridEditor != null) {
  GridEditor.OnButtonClick(window.event.srcElement);
}
