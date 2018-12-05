/**
 * Copyright 2017 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------------
 */

const m = require('mithril')
const XLSX = require('xlsx')

const api = require('../services/api')
const payloads = require('../services/payloads')
const transactions = require('../services/transactions')
const parsing = require('../services/parsing')
const {MultiSelect} = require('../components/forms')
const layout = require('../components/layout')


const reporterProperties = [
  "WW01",
  "WW02",
  "WW03",
  "WW04",
  "WW05",
  "Status"
]
/**
 * The Form for tracking a new fish.
 */
const CreateDemand = {
  oninit (vnode) {
    // Initialize the empty reporters fields
    vnode.state.reporters = [
      {
        reporterKey: '',
        properties: []
      }
    ]
    api.get('agents')
      .then(agents => {
        const publicKey = api.getPublicKey()
        vnode.state.agents = agents.filter(agent => agent.key !== publicKey)
      })
  },

  view (vnode) {
    return m('.demand_form',
            m('input',{
              type: 'file',
              // style: 'display:none',
              placeholder: 'Upload Demand',
              onchange: (e) => {
                console.log(e)
                _fileUpload(vnode,e)
              }
            })
          )
  }
}

/**
 * Update the reporter's values after a change occurs in the name of the
 * reporter at the given reporterIndex. If it is empty, and not the only
 * reporter in the list, remove it.  If it is not empty and the last item
 * in the list, add a new, empty reporter to the end of the list.
 */
const _updateReporters = (vnode, reporterIndex) => {
  let reporterInfo = vnode.state.reporters[reporterIndex]
  let lastIdx = vnode.state.reporters.length - 1
  if (!reporterInfo.reporterKey && reporterIndex !== lastIdx) {
    vnode.state.reporters.splice(reporterIndex, 1)
  } else if (reporterInfo.reporterKey && reporterIndex === lastIdx) {
    vnode.state.reporters.push({
      reporterKey: '',
      properties: []
    })
  }
}

const _fileUpload = (vnode,e) => {
  var file = e.target.files[0];
  console.log(file.name);
  var reader = new FileReader();
  reader.onload = (e) => {
    var data = e.target.result;
    var bytes = new Uint8Array(data);
    var len = bytes.length;
    var binary = ''
    for(var i=0; i < len; i++){
      binary += String.fromCharCode(bytes[i]);
    }

    var workBook = XLSX.read(binary, {type: 'binary', cellDates: true});
    var fileData = XLSX.utils.sheet_to_json(workBook.Sheets['Demand']);
    console.log(fileData);

    _prepAndSubmit(vnode,fileData);

  }
  reader.readAsArrayBuffer(file)
}

const _prepAndSubmit = (vnode,fileData) => {
  var recordPayload = [];
  var reporterPayLoads = [];
  var finalPayload = [];
  var newPayload = [];
  for(var i=0; i< fileData.length; i++){
    var tempJson = {
      recordId: (fileData[i].Material).toString(),
      recordType: 'PRFRTF',
      properties: [
        {
          name: "WW01",
          stringValue: fileData[i].WW01_quantity + ";" + (fileData[i].WW01_deliveryDate).toLocaleDateString(),
          dataType: payloads.createRecord.enum.STRING
        }
      ]
    }
    for(var n = 2; n <= 5; n++){
      if(fileData[i]['WW0' + n + '_quantity'] && fileData[i]['WW0'+ n + '_deliveryDate']){
        tempJson.properties = tempJson.properties.concat([
          {
            name: 'WW0' + n,
            stringValue: fileData[i]['WW0' + n + '_quantity'] + ";" + (fileData[i]['WW0'+ n + '_deliveryDate']).toLocaleDateString(),
            dataType: payloads.createRecord.enum.STRING
          }
        ])
      }
    }

    tempJson.properties.push({
      name: "Status",
      stringValue: "PRF submitted by Intel",
      dataType: payloads.createRecord.enum.STRING
    })

    var tempRecPayLoad = payloads.createRecord(tempJson)
    recordPayload.push(tempRecPayLoad);
    newPayload.push(tempRecPayLoad);  
  }
  
  for(var i=0; i< fileData.length; i++){
    var supplier = fileData[i].Supplier
    var reporter = vnode.state.agents.find(agent => {
      return agent.name === supplier
    })

    if(reporter){
      newPayload.push(payloads.createProposal({
        recordId: (fileData[i].Material).toString(),
        receivingAgent: reporter.key,
        role: payloads.createProposal.enum.REPORTER,
        properties: reporterProperties
      }))
    }
  }
  finalPayload = recordPayload.concat(reporterPayLoads);
  
  transactions.submit(newPayload, true)
    .then(() => { () => m.route.set(`/demandDetail`) })
}

/**
 * Handle the form submission.
 *
 * Extract the appropriate values to pass to the create record transaction.
 */
const _handleSubmit = (signingKey, state) => {
  const recordPayload = payloads.createRecord({
    recordId: state.materialNumber,
    recordType: 'demand',
    properties: [
     
      {
        name: 'quantity',
        intValue: state.quantity,
        dataType: payloads.createRecord.enum.INT
      },
      {
        name: 'deliveryDate',
        stringValue: state.deliveryDate,
        dataType: payloads.createRecord.enum.STRING
      },
    ]
  })

  const reporterPayloads = state.reporters
    .filter((reporter) => !!reporter.reporterKey)
    .map((reporter) => payloads.createProposal({
      recordId: state.materialNumber,
      receivingAgent: reporter.reporterKey,
      role: payloads.createProposal.enum.CUSTODIAN,
      properties: reporter.properties
    }))

  transactions.submit([recordPayload].concat(reporterPayloads), true)
    .then(() => m.route.set(`/demandDetail/${state.materialNumber}`))
}

/**
 * Create a form group (this is a styled form-group with a label).
 */
const _formGroup = (label, formEl) =>
  m('.form-group',
    m('label', label),
    formEl)

module.exports = CreateDemand
