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

/**
 * Possible selection options
 */
// const authorizableProperties = [
//   ['location', 'Location'],
//   ['temperature', 'Temperature'],
//   ['tilt', 'Tilt'],
//   ['shock', 'Shock']
// ]

const authorizableProperties = [
  ['quantity', 'Quantity'],
  ['deliveryDate', 'Delivery Date']
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
    // return m('.demand_form',
    //          m('form', {
    //            onsubmit: (e) => {
    //              e.preventDefault()
    //              _handleSubmit(vnode.attrs.signingKey, vnode.state)
    //            }
    //          },
    //          m('legend', 'Create Demand'),
    //          _formGroup('Material Number', m('input.form-control', {
    //            type: 'text',
    //            oninput: m.withAttr('value', (value) => {
    //              vnode.state.materialNumber = value
    //            }),
    //            value: vnode.state.materialNumber
    //          })),
    //         //  _formGroup('Species (ASFIS 3-letter code)', m('input.form-control', {
    //         //    type: 'text',
    //         //    oninput: m.withAttr('value', (value) => {
    //         //      vnode.state.species = value
    //         //    }),
    //         //    value: vnode.state.species
    //         //  })),

    //          layout.row([
    //            _formGroup('Quantity (units)', m('input.form-control', {
    //              type: 'number',
    //              min: 0,
    //              step: 'any',
    //              oninput: m.withAttr('value', (value) => {
    //                vnode.state.quantity = value
    //              }),
    //              value: vnode.state.quantity
    //            })),
    //            _formGroup('Delivery Date (dd/MM/yyyy/)', m('input.form-control', {
    //              type: 'text',
    //              oninput: m.withAttr('value', (value) => {
    //                vnode.state.deliveryDate = value
    //              }),
    //              value: vnode.state.deliveryDate
    //            }))
    //          ]),
    //          m('.reporters.form-group',
    //            m('label', 'Authorize Supplier'),

    //            vnode.state.reporters.map((reporter, i) =>
    //              m('.row.mb-2',
    //                m('.col-sm-8',
    //                  m('input.form-control', {
    //                    type: 'text',
    //                    placeholder: 'Add Supplier by name or public key...',
    //                    oninput: m.withAttr('value', (value) => {
    //                      // clear any previously matched values
    //                      vnode.state.reporters[i].reporterKey = null
    //                      const reporter = vnode.state.agents.find(agent => {
    //                        return agent.name === value || agent.key === value
    //                      })
    //                      if (reporter) {
    //                        vnode.state.reporters[i].reporterKey = reporter.key
    //                      }
    //                    }),
    //                    onblur: () => _updateReporters(vnode, i)
    //                  })),

    //                m('.col-sm-4',
    //                  m(MultiSelect, {
    //                    label: 'Select Fields',
    //                    options: authorizableProperties,
    //                    selected: reporter.properties,
    //                    onchange: (selection) => {
    //                      vnode.state.reporters[i].properties = selection
    //                    }
    //                  }))))),

    //                  m('.row.justify-content-end.align-items-end',
    //                  m('col-2',
    //                    m('button.btn.btn-primary',
    //                      'Create Record')))))
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
  var finalPayload = []
  for(var i=0; i< fileData.length; i++){
    var tempRecPayLoad = payloads.createRecord({
      recordId: fileData[i].Material,
      recordType: 'demand',
      properties: [
        {
          name: 'quantity',
          intValue: fileData[i].Quantity,
          dataType: payloads.createRecord.enum.INT
        },
        {
          name: 'deliveryDate',
          stringValue: fileData[i].DeliveryDate,
          dataType: payloads.createRecord.enum.STRING
        },
      ]
    })
    recordPayload.push(tempRecPayLoad);

    var reporter = vnode.state.agents.find(agent => {
      return agent.name === fileData[i].Reporter
    })
    if (reporter) {
      var tempReporterPayload = payloads.createProposal({
        recordId: fileData[i].Material,
        receivingAgent: reporter.reporterKey,
        role: payloads.createProposal.enum.REPORTER,
        properties: reporter.properties
      })
      reporterPayLoads.push(tempReporterPayload);
    }    
  }
  finalPayload = recordPayload.concat(reporterPayLoads);
  
  transactions.submit(finalPayload, true)
    .then(() => m.route.set(`/demandDetail/${fileData[i].Material}`))
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
    //   {
    //     name: 'species',
    //     stringValue: state.species,
    //     dataType: payloads.createRecord.enum.STRING
    //   },
     
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
    //   {
    //     name: 'location',
    //     locationValue: {
    //       latitude: parsing.toInt(state.latitude),
    //       longitude: parsing.toInt(state.longitude)
    //     },
    //     dataType: payloads.createRecord.enum.LOCATION
    //   }
    ]
  })

  const reporterPayloads = state.reporters
    .filter((reporter) => !!reporter.reporterKey)
    .map((reporter) => payloads.createProposal({
      recordId: state.materialNumber,
      receivingAgent: reporter.reporterKey,
      role: payloads.createProposal.enum.REPORTER,
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
